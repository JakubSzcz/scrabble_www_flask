from sqlite3 import connect
import time
from turtle import pu
from unicodedata import name
from website import create_app
from flask_socketio import SocketIO, send, emit, join_room, leave_room
from flask import redirect, url_for, render_template
import logging
from website.models import User, Game
from website import db
from datetime import datetime

app = create_app()
log = logging.getLogger('werkzeug')
log.disabled = True
socketio = SocketIO(app, cors_allowed_origins='*')
users = {} #lista z graczami
listaGier = {}
graczZaczynajacy={}
#punktyGraczy = {}

@socketio.on("dolacz_do_gry")
def dolaczDoGry(numer, haslo):
    if numer not in listaGier:
        emit("nie_ma_takiego_pokoju")
    else: # dołączam do już istniejącego pokoju
        if listaGier[numer] == haslo:
            print("dolaczono do pokoju: " + numer)
            join_room(numer)
            emit("redirect_to_game1")
        else:
            print("złe haslo do pokoju: " + numer)
            emit("zle_haslo_do_gry")
            return

@socketio.on("stworz_gre")
def stworzGre(numer, haslo):
    if numer not in listaGier:
        print("dodano pokoj: " + numer)
        listaGier[numer] = haslo #tworze pokoj
        join_room(numer)
        emit("redirect_to_game")
    else: 
        emit("pokoj_juz_istnieje")

@socketio.on("odbierz_plansze")
def odbierzPlansze(plansza, czyjaTura, numer, liczbaPunktow, gracz, doWygranej):
    data = {"plansza":plansza, "czyjaTura" : czyjaTura, "liczbaPunktow": liczbaPunktow, "gracz": gracz, "doWygranej": doWygranej}
    emit("message", data, to=numer)

@socketio.on("odbierz_plansze_pierwsze")
def odbierzPlansze(plansza, czyjaTura, numer):
    if numer not in graczZaczynajacy:
        graczZaczynajacy[numer] = czyjaTura
    data = {"plansza":plansza, "czyjaTura" : graczZaczynajacy[numer]}
    emit("message", data, to=numer)

@socketio.on("lista_graczy")
def lista_graczy(userName, numer):
    if numer not in users:
        users[numer] = []
        users[numer].append(userName)
    else:
        if userName not in users[numer]:
            users[numer].append(userName)
    emit("odbierz_liste_graczy", users[numer], to=numer)
    print("wysłano liste graczy do pokoju: " + numer)

@socketio.on("koniec_gry")
def koniecGry(liczbaPunktow, ktoWygral, numer):
    for user in users[numer]:
        user_form_db = User.query.filter_by(first_name=user).first()
        gra = Game(winner = ktoWygral, time = datetime.now().strftime("%d/%m/%Y %H:%M:%S"), score = liczbaPunktow[user], user = user_form_db )
        db.session.add(gra)
        db.session.commit()
    del users[numer]
    del listaGier[numer]
    del graczZaczynajacy[numer]

@socketio.on("poinformuj_o_wygranej")
def poinformujOWygranej(ktoWygral,numer):
    emit("informuje_o_wygrnej",ktoWygral, to=numer)



if __name__ == '__main__':
    #app.run(debug=True)
    socketio.run(app,debug=True)

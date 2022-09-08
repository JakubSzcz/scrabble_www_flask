from sqlite3 import connect
import time
from unicodedata import name
from website import create_app
from flask_socketio import SocketIO, send, emit, join_room, leave_room
from flask import redirect, url_for, render_template
import logging

app = create_app()
log = logging.getLogger('werkzeug')
log.disabled = True
socketio = SocketIO(app, cors_allowed_origins='*')
users = {} #lista z graczami
listaGier = {}
graczZaczynajacy={}

@socketio.on("dolacz_do_gry")
def dolaczDoGry(numer, haslo):
    if numer not in listaGier:
        print("dodano pokoj:" + numer)
        listaGier[numer] = haslo #tworze pokoj
        join_room(numer)
        data = {"numer":numer,"haslo":haslo}
        emit("redirect_to_game")
    else: # dołączam do już istniejącego pokoju
        if listaGier[numer] == haslo:
            print("dolaczono do pokoju:" + numer)
            join_room(numer)
            emit("redirect_to_game")
        else:
            print("złe haslo do pokoju:" + numer)
            #złe hasło
            return

@socketio.on("odbierz_plansze")
def odbierzPlansze(plansza, czyjaTura, numer):
    data = {"plansza":plansza, "czyjaTura" : czyjaTura}
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
    print("wysłano liste graczy do pokoju" + numer)



if __name__ == '__main__':
    #app.run(debug=True)
    socketio.run(app,debug=True)

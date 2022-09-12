from website import create_app
from flask_socketio import SocketIO, emit, join_room
import logging
from website.models import User, Game
from website import db
from datetime import datetime

app = create_app()
log = logging.getLogger('werkzeug')
log.disabled = True
socketio = SocketIO(app, cors_allowed_origins='*')
users = {} #slownik z graczami
listaGier = {} #slownik z grami
graczZaczynajacy={} #slwonik z graczami ktorzy rozpoczynaj rozgrywke

@socketio.on("dolacz_do_gry") # dolaczam do isniejacej gry
def dolaczDoGry(numer, haslo):
    if numer not in listaGier: #nieistniejacy pokoj
        emit("nie_ma_takiego_pokoju")
    else: # dołączam do już istniejącego pokoju
        if listaGier[numer] == haslo:
            print("dolaczono do pokoju: " + numer)
            join_room(numer)
            emit("redirect_to_game1")
        else: #zle haslo do isniejacego pokoju
            print("złe haslo do pokoju: " + numer)
            emit("zle_haslo_do_gry")
            return

@socketio.on("stworz_gre") #tworze nowa gre
def stworzGre(numer, haslo):
    if numer not in listaGier: #tworze nowy pokoj
        print("dodano pokoj: " + numer)
        listaGier[numer] = haslo #tworze pokoj
        join_room(numer)
        emit("redirect_to_game")
    else: #pokoj juz isnieje
        emit("pokoj_juz_istnieje")

@socketio.on("odbierz_plansze") #odbieram plansze wraz z danymi
def odbierzPlansze(plansza, czyjaTura, numer, liczbaPunktow, gracz, doWygranej):
    data = {"plansza":plansza, "czyjaTura" : czyjaTura, "liczbaPunktow": liczbaPunktow, "gracz": gracz, "doWygranej": doWygranej}
    emit("message", data, to=numer)

@socketio.on("odbierz_plansze_pierwsze") #pierwsze wyslanie planszy z dodaniem gracza zaczynajacego
def odbierzPlansze(plansza, czyjaTura, numer):
    if numer not in graczZaczynajacy:
        graczZaczynajacy[numer] = czyjaTura
    data = {"plansza":plansza, "czyjaTura" : graczZaczynajacy[numer]}
    emit("message", data, to=numer)

@socketio.on("lista_graczy") #przesylam liste graczy
def lista_graczy(userName, numer):
    if numer not in users:
        users[numer] = []
        users[numer].append(userName)
    else:
        if userName not in users[numer]:
            users[numer].append(userName)
    emit("odbierz_liste_graczy", users[numer], to=numer)
    print("wysłano liste graczy do pokoju: " + numer)

@socketio.on("koniec_gry") #koniec gry, zwyciezca tylko
def koniecGry(liczbaPunktow, ktoWygral, numer):
    for user in users[numer]:
        user_form_db = User.query.filter_by(first_name=user).first()
        gra = Game(winner = ktoWygral, time = datetime.now().strftime("%d/%m/%Y %H:%M:%S"), score = liczbaPunktow[user], user = user_form_db )
        db.session.add(gra)
        db.session.commit()
    del users[numer]
    del listaGier[numer]
    del graczZaczynajacy[numer]

@socketio.on("poinformuj_o_wygranej") #informuje reszte o wygranej
def poinformujOWygranej(ktoWygral,numer):
    emit("informuje_o_wygrnej",ktoWygral, to=numer)


if __name__ == '__main__':
    socketio.run(app,debug=True)

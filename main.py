from unicodedata import name
from website import create_app
from flask_socketio import SocketIO, send, emit, join_room, leave_room


app = create_app()
socketio = SocketIO(app, cors_allowed_origins='*')
users = [] #lista z graczami
listaGier = {}


@socketio.on("dolacz_do_gry")
def dolaczDoGry(numer, haslo):
    if numer not in listaGier:
        listaGier[numer] = haslo #tworze pokoj
        join_room(numer)
    else: # dołączam do już istniejącego pokoju
        if listaGier[numer] == haslo:
            join_room(numer)
        else:
            #złe hasło
            return

@socketio.on("odbierz_plansze")
def odbierzPlansze(plansza, czyjaTura, numer):
    data = {"plansza":plansza, "czyjaTura" : czyjaTura}
    send("message", data, to=numer)

@socketio.on("lista_graczy")
def lista_graczy(userName, numer):
    if len(users) == 0: #pierwszy gracz
        users.append(userName)
    else:
        flaga = True
        if userName in users:
            flaga = False

        if flaga:
            users.append(userName)

    send("odbierz_liste_graczy", users, to=numer)



if __name__ == '__main__':
    #app.run(debug=True)
    socketio.run(app,debug=True)

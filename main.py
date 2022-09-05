from unicodedata import name
from website import create_app
from flask_socketio import SocketIO, send, emit


app = create_app()
socketio = SocketIO(app, cors_allowed_origins='*')
users = []



@socketio.on("odbierz_plansze")
def odbierzPlansze(plansza, czyjaTura):
    data = {"plansza":plansza, "czyjaTura" : czyjaTura}
    emit("message", data, broadcast=True)

@socketio.on("lista_graczy")
def lista_graczy(userName):
    if len(users) == 0: #pierwszy gracz
        users.append(userName)
    else:
        flaga = True
        if userName in users:
            flaga = False

        if flaga:
            users.append(userName)

    emit("odbierz_liste_graczy", users, broadcast=True)



if __name__ == '__main__':
    #app.run(debug=True)
    socketio.run(app,debug=True)

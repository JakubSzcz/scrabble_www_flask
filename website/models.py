from . import db
from flask_login import UserMixin


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable="False")
    password = db.Column(db.String(150))
    first_name = db.Column(db.String(150))
    games = db.relationship('Game', backref='user') 
    #user.games[0] -> lista gier
    

class Game(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    winner = db.Column(db.String(150))
    time = db.Column(db.String(150))
    score = db.Column(db.String(20))
    plansza = db.Column(db.String())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    #game.user.first_name-nazwa

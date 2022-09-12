from urllib import request
from flask_login import login_required, current_user
from flask import Blueprint, render_template, request

game = Blueprint('game', __name__)

@game.route('/game', methods=['POST', 'GET'])
@login_required
def game_func():
    return render_template("game.html", user=current_user)
    
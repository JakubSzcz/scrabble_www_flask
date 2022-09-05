from flask_login import login_required, current_user
from flask import Blueprint, render_template

game = Blueprint('game', __name__)

@game.route('/game')
@login_required
def game_func():
    return render_template("game.html", user=current_user)
    
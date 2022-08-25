from flask import Blueprint, render_template
from flask_login import login_required

views = Blueprint('views', __name__)

@views.route('/main')
@login_required
def main():
    return render_template("main.html")
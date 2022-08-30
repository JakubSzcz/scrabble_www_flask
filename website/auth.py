from email import message
from flask import Blueprint, render_template, request, redirect, url_for
from .models import User
from . import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user, current_user
auth = Blueprint('auth', __name__)

@auth.route('/', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        email = request.form.get('userName')
        password = request.form.get('userPassword')

        user = User.query.filter_by(email=email).first()
        if user:
            if check_password_hash(user.password, password):
                login_user(user, remember=True)
                return redirect(url_for("views.main", user=current_user ))
            else:
                #niepoprawne haslo
                return render_template("login.html", message="Niepoprawne hasło")
        else:
            #nie ma takiego maila
            return render_template("login.html", message="Niepoprawny adres email")


    return render_template("login.html", user=current_user)


@auth.route('/new_account', methods = ['GET', 'POST'])
def new_account():
    if request.method == 'POST':
        email = request.form.get('userEmail')
        first_name = request.form.get('userName')
        password = request.form.get('userPassword')

        user = User.query.filter_by(email=email).first()
        if user:
            # email zajety
            return render_template("new_account.html", message="Email zajety")
        else:
            new_user = User(email=email, first_name=first_name, password=generate_password_hash(password, method='sha256'))
            db.session.add(new_user)
            db.session.commit()
            login_user(new_user, remember=True)
            return redirect('/main')

    return render_template("new_account.html")

@auth.route('/logout',  methods = ['POST', 'GET'])
@login_required
def logout():
    print("siema")
    logout_user()
    return redirect('/')
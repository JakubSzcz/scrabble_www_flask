from flask import Blueprint, render_template

bp = Blueprint('bp_create_account', __name__)


@bp.route('/create_account')
def create_account():
    return render_template('create_account.html')

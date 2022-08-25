from flask import Blueprint, render_template

bp = Blueprint('bp_main_page', __name__)


@bp.route('/')
@bp.route('/main_page')
@bp.route('/home')
def home():
    return render_template('main_page.html')

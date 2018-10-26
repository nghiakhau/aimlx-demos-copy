from flask import Blueprint

recommendations = Blueprint('recommendations', __name__, template_folder='templates', static_folder='static')

from . import recommendation_controller

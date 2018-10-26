from flask import jsonify, request, render_template
import requests
from . import recommendations
from . import serve
import pandas as pd
model_api = serve.get_model_api()
nbMovieNeeded = 3


@recommendations.route('')
def initialiseBot():
    "This function gives `index.html`"

    return render_template('recommendations.html')



@recommendations.route('',  methods=['POST'])
def receiveFromBot():
    """
        This function receives reponses from ChatBot,
        then pass to TensorFlow model for prediction.
        Return predictions
    """
    parameters = request.get_json(force=True)
    nbMovies, movies  = parameters['nbMovies'], parameters['input']

    if(nbMovies == nbMovieNeeded):
    	print(movies)
    	results = model_api(movies)
    	data = {"pred": 1, "results": results}
    else:
    	data = {"pred": 0}
    return jsonify(data)

@recommendations.route('/movielens', methods=['GET'])
def getMovieDatabase():
    """
        This function send movies database to JS
    """
    db = pd.read_csv('recommendations/recsys_data/movies.csv')
    data = {'id': db['movieId'].values.tolist(), 'title': db['title'].values.tolist()}
    return jsonify(data)

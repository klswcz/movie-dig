import sys
from pymongo import MongoClient

# print('test')

client = MongoClient('localhost:27017')

db = client.movieRecommendationDB
users = db.users
movies = db.movies
all_movies = movies.find().limit(6)
for movie in all_movies:
    print(movie['tmdbId'], end=',')

sys.stdout.flush()
quit()

import sys
import pandas as pd
from pymongo import MongoClient
from math import sqrt

client = MongoClient(sys.argv[3])
db = client.movieRecommendationDB
users = db.users
movies = db.movies
ratings = db.ratings

movies_df = pd.DataFrame(list(movies.find()))
ratings_df = pd.DataFrame(list(ratings.find({
    'user_id': {'$ne': sys.argv[1]}
})))

# Remove unnecessary columns from retrieved dataset
movies_df = movies_df.drop(['imdb_id', '_id', '__v'], 1)
ratings_df = ratings_df.drop(['_id', 'timestamp'], 1)

inputMovies = pd.DataFrame(list(ratings.find({
    'user_id': sys.argv[1]
})))

inputMovies = inputMovies.drop(['_id', 'timestamp'], 1)

# Filtering out the movies by title
inputId = movies_df[movies_df['movie_id'].isin(inputMovies['movie_id'].tolist())]
inputMovies = pd.merge(inputId, inputMovies)

userSubset = ratings_df[ratings_df['movie_id'].isin(inputMovies['movie_id'].tolist())]
userSubsetGroup = userSubset.groupby(['user_id'])
userSubsetGroup = sorted(userSubsetGroup, key=lambda x: len(x[1]), reverse=True)
userSubsetGroup = userSubsetGroup[0:100]

# Store the Pearson Correlation in a dictionary, where the key is the user Id and the value is the coefficient
pearsonCorrelationDict = {}

for name, group in userSubsetGroup:
    group = group.sort_values(by='movie_id')
    inputMovies = inputMovies.sort_values(by='movie_id')
    # Get the N for the formula
    nRatings = len(group)
    # Get the review scores for the movies that they both have in common
    temp_df = inputMovies[inputMovies['movie_id'].isin(group['movie_id'].tolist())]
    tempRatingList = temp_df['rating'].tolist()
    tempGroupList = group['rating'].tolist()

    tempGroupList = list(map(float, tempGroupList))
    tempRatingList = list(map(float, tempRatingList))

    # Now let's calculate the pearson correlation between two users, so called, x and y

    Sxx = sum([i ** 2 for i in tempRatingList]) - pow(sum(tempRatingList), 2) / nRatings
    Syy = sum([i ** 2 for i in tempGroupList]) - pow(sum(tempGroupList), 2) / nRatings
    Sxy = sum(i * j for i, j in zip(tempRatingList, tempGroupList)) - sum(tempRatingList) * sum(
        tempGroupList) / nRatings

    # If the denominator is different than zero, then divide, else, 0 correlation.
    if Sxx != 0 and Syy != 0:
        pearsonCorrelationDict[name] = Sxy / sqrt(Sxx * Syy)
    else:
        pearsonCorrelationDict[name] = 0

pearsonDF = pd.DataFrame.from_dict(pearsonCorrelationDict, orient='index')
pearsonDF.columns = ['similarityIndex']
pearsonDF['user_id'] = pearsonDF.index
pearsonDF.index = range(len(pearsonDF))

topUsers = pearsonDF.sort_values(by='similarityIndex', ascending=False)[0:50]

topUsersRating = topUsers.merge(ratings_df, left_on='user_id', right_on='user_id', how='inner')
topUsersRating = topUsersRating.astype({'rating': 'float'})

# Multiplies the similarity by the user’s ratings
topUsersRating['weightedRating'] = topUsersRating['similarityIndex'].mul(topUsersRating['rating'])

# Applies a sum to the topUsers after grouping it up by userId
tempTopUsersRating = topUsersRating.groupby('movie_id').sum()[['similarityIndex', 'weightedRating']]
tempTopUsersRating.columns = ['sum_similarityIndex', 'sum_weightedRating']

recommendation_df = pd.DataFrame()
recommendation_df['weighted_avg_recommend_score'] = tempTopUsersRating['sum_weightedRating'] / tempTopUsersRating[
    'sum_similarityIndex']
recommendation_df['movie_id'] = tempTopUsersRating.index
recommendation_df = recommendation_df.sort_values(by='weighted_avg_recommend_score', ascending=False)

recommendation_df.index.name = None
recommendation_df = recommendation_df.merge(movies_df, left_on='movie_id', right_on='movie_id', how='outer')

print(recommendation_df.head(int(sys.argv[2])).to_json())
sys.stdout.flush()
quit()

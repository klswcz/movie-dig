import {recommendation as recommendationService, trending as trendingService} from "../../services/MovieServices";
import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import MovieCard from "../UI/MovieCard";

function Dashboard() {
    const [trendingMovies, setTrendingMovies] = useState([])
    const [recommendedMovies, setRecommendedMovies] = useState([])
    const [loadingFinished, setLoadingFinished] = useState(false)
    const history = useHistory();

    useEffect(() => {
        if (localStorage.getItem('token') === 'null') {
            history.push({pathname: "/login",});
        } else {
            getTrendingMovies()
            getRecommendations()
        }
    }, [history]);

    const getTrendingMovies = () => {
        trendingService().then(res => {
            setTrendingMovies(res.data.movies)
            setLoadingFinished(true)
        })
    };

    const getRecommendations = () => {
        recommendationService().then(res => {
            setRecommendedMovies(res.data.movies)
        })
    };

    return (
        <div className=" pb-14 px-4 mt-16">
            {loadingFinished ?
                (<>
                    <div className="pt-5 mb-3">
                        <h1 className="text-4xl">Trending today</h1>
                        <div className="grid 4xl:grid-cols-12 3xl:grid-cols-10 2xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 grid-cols-2">
                            {trendingMovies.map((movie, index) => {
                                return (
                                    <MovieCard title={movie.title ?? movie.name} voteAverage={movie.vote_average}
                                               posterPath={movie.poster_path} userRating={movie.user_rating} key={index}
                                               movieId={movie.id}/>
                                )
                            })}
                        </div>
                    </div>
                    <div className="my-3">
                        <h1 className="text-4xl">Recommended for you</h1>
                        <div className="grid 4xl:grid-cols-12 3xl:grid-cols-10 2xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 grid-cols-2">
                            {recommendedMovies.map((movie, index) => {
                                return (
                                    <MovieCard title={movie.title ?? movie.name} voteAverage={movie.vote_average}
                                               posterPath={movie.poster_path} userRating={movie.user_rating} key={index}
                                               movieId={movie.id}/>
                                )
                            })}
                        </div>
                    </div>

                </>) :
                <p>Loading</p>}
        </div>
    )
}

export default Dashboard;

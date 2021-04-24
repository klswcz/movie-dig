import {
    recommendation as recommendationService,
    trending as trendingService,
    topRated as topRatedService,
    popular as popularService,
    topThrillers as topThrillersService,
    topComedies as topComediesService,
    topRomances as topRomancesService
} from "../../services/MovieServices";
import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import MovieCard from "../UI/MovieCard";

function Dashboard() {
    const [trendingMovies, setTrendingMovies] = useState([])
    const [topRatedMovies, setTopRatedMovies] = useState([])
    const [popularMovies, setPopularMovies] = useState([])
    const [topThrillers, setTopThrillers] = useState([])
    const [topComedies, setTopComedies] = useState([])
    const [topRomances, setTopRomances] = useState([])
    const [recommendedMovies, setRecommendedMovies] = useState([])
    const [ratedMovies, setRatedMovies] = useState(0)
    const [requiredMovies, setRequiredMovies] = useState(0)
    const history = useHistory();

    useEffect(() => {
        if (localStorage.getItem('token') === 'null') {
            history.push({pathname: "/login",});
        } else {
            getTrendingMovies()
            getRecommendations()
            getTopRatedMovies()
            getPopularMovies()
            getTopThrillers()
            getTopComedies()
            getTopRomances()
        }
    }, [history]);

    const getTrendingMovies = () => {
        trendingService().then(res => {
            setTrendingMovies(res.data.movies)
        })
    };

    const getTopRatedMovies = () => {
        topRatedService().then(res => {
            setTopRatedMovies(res.data.movies)
        })
    };

    const getPopularMovies = () => {
        popularService().then(res => {
            setPopularMovies(res.data.movies)
        })
    };

    const getTopThrillers = () => {
        topThrillersService().then(res => {
            setTopThrillers(res.data.movies)
        })
    };

    const getTopComedies = () => {
        topComediesService().then(res => {
            setTopComedies(res.data.movies)
        })
    };

    const getTopRomances = () => {
        topRomancesService().then(res => {
            setTopRomances(res.data.movies)
        })
    };

    const getRecommendations = () => {
        recommendationService({count: 20}).then(res => {
            setRecommendedMovies(res.data.movies)
            setRatedMovies(res.data.ratings_given)
            setRequiredMovies(res.data.ratings_required)
        })
    };

    return (
        <div className=" pb-14 px-4 mt-16">
            <div className="pt-5 mb-3">
                <h1 className="text-4xl">This may interest you</h1>
                {recommendedMovies !== null ?
                    <div
                        className="grid 4xl:grid-cols-12 3xl:grid-cols-10 2xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 grid-cols-2">
                        {recommendedMovies.map((movie, index) => {
                            return (
                                <MovieCard title={movie.title ?? movie.name} voteAverage={movie.vote_average}
                                           posterPath={movie.poster_path} userRating={movie.user_rating}
                                           key={index}
                                           movieId={movie.id}/>
                            )
                        })}
                    </div>
                    :
                    <div>You have rated {ratedMovies} movies. Please rate {requiredMovies - ratedMovies} more
                        movie(s) to see your personalised recommendations.</div>
                }
            </div>
            <div className="my-3">
                <h1 className="text-4xl">Trending today</h1>
                <div
                    className="grid 4xl:grid-cols-12 3xl:grid-cols-10 2xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 grid-cols-2">
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
                <h1 className="text-4xl">Cinema classics</h1>
                <div
                    className="grid 4xl:grid-cols-12 3xl:grid-cols-10 2xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 grid-cols-2">
                    {topRatedMovies.map((movie, index) => {
                        return (
                            <MovieCard title={movie.title ?? movie.name} voteAverage={movie.vote_average}
                                       posterPath={movie.poster_path} userRating={movie.user_rating} key={index}
                                       movieId={movie.id}/>
                        )
                    })}
                </div>
            </div>
            <div className="my-3">
                <h1 className="text-4xl">Popular</h1>
                <div
                    className="grid 4xl:grid-cols-12 3xl:grid-cols-10 2xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 grid-cols-2">
                    {popularMovies.map((movie, index) => {
                        return (
                            <MovieCard title={movie.title ?? movie.name} voteAverage={movie.vote_average}
                                       posterPath={movie.poster_path} userRating={movie.user_rating} key={index}
                                       movieId={movie.id}/>
                        )
                    })}
                </div>
            </div>


            <div className="my-3">
                <h1 className="text-4xl">Thrillers that will blow your mind</h1>
                <div
                    className="grid 4xl:grid-cols-12 3xl:grid-cols-10 2xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 grid-cols-2">
                    {topThrillers.map((movie, index) => {
                        return (
                            <MovieCard title={movie.title ?? movie.name} voteAverage={movie.vote_average}
                                       posterPath={movie.poster_path} userRating={movie.user_rating} key={index}
                                       movieId={movie.id}/>
                        )
                    })}
                </div>
            </div>
            <div className="my-3">
                <h1 className="text-4xl">Laugh out loud comedies to lift your spirits</h1>
                <div
                    className="grid 4xl:grid-cols-12 3xl:grid-cols-10 2xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 grid-cols-2">
                    {topComedies.map((movie, index) => {
                        return (
                            <MovieCard title={movie.title ?? movie.name} voteAverage={movie.vote_average}
                                       posterPath={movie.poster_path} userRating={movie.user_rating} key={index}
                                       movieId={movie.id}/>
                        )
                    })}
                </div>
            </div>
            <div className="my-3">
                <h1 className="text-4xl">Best date night films</h1>
                <div
                    className="grid 4xl:grid-cols-12 3xl:grid-cols-10 2xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 grid-cols-2">
                    {topRomances.map((movie, index) => {
                        return (
                            <MovieCard title={movie.title ?? movie.name} voteAverage={movie.vote_average}
                                       posterPath={movie.poster_path} userRating={movie.user_rating} key={index}
                                       movieId={movie.id}/>
                        )
                    })}
                </div>
            </div>

        </div>
    )
}

export default Dashboard;

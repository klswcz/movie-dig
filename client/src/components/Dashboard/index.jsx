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
import {Link, useHistory} from "react-router-dom";
import MovieCard from "../UI/MovieCard";
import ScrollMenu from "react-horizontal-scrolling-menu";
import {faChevronLeft, faChevronRight, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import HorizontalScroll from "../UI/HorizontalScroll";
import {BeatLoader} from "react-spinners";

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
    const [loadingRecommendationsFinished, setLoadingRecommendationsFinished] = useState(false)
    const [loadingFinished, setLoadingFinished] = useState(false)
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
            setLoadingFinished(true)
        })
    };

    const getTopRatedMovies = () => {
        topRatedService().then(res => {
            setTopRatedMovies(res.data.movies)
            setLoadingFinished(true)
        })
    };

    const getPopularMovies = () => {
        popularService().then(res => {
            setPopularMovies(res.data.movies)
            setLoadingFinished(true)
        })
    };

    const getTopThrillers = () => {
        topThrillersService().then(res => {
            setTopThrillers(res.data.movies)
            setLoadingFinished(true)
        })
    };

    const getTopComedies = () => {
        topComediesService().then(res => {
            setTopComedies(res.data.movies)
            setLoadingFinished(true)
        })
    };

    const getTopRomances = () => {
        topRomancesService().then(res => {
            setTopRomances(res.data.movies)
            setLoadingFinished(true)
        })
    };

    const getRecommendations = () => {
        recommendationService({count: 20}).then(res => {
            setRecommendedMovies(res.data.movies)
            setRatedMovies(res.data.ratings_given)
            setRequiredMovies(res.data.ratings_required)
            setLoadingRecommendationsFinished(true)
        })
    };

    return (
        <div className=" pb-14 px-4 mt-16">
            {loadingFinished ?
                (<>
                    <div className="pt-5 mb-3">
                        <h1 className="text-3xl font-extrabold text-gray-900">Recommended for
                            you {recommendedMovies !== null &&
                            <Link to={'/recommendations/more'}
                                  className="text-lg font-bold text-indigo-600 ml-2 hover:bg-indigo-200 p-2 rounded-md">See
                                more</Link>}</h1>
                        {loadingRecommendationsFinished ?
                            recommendedMovies !== null ?
                                <HorizontalScroll>
                                    {
                                        recommendedMovies.map((movie, index) => {
                                            return (
                                                <MovieCard title={movie.title ?? movie.name}
                                                           voteAverage={movie.vote_average}
                                                           posterPath={movie.poster_path}
                                                           userRating={movie.user_rating}
                                                           key={index}
                                                           movieId={movie.id}
                                                           customClass={'w-52 mx-2 my-3'}
                                                />
                                            )
                                        })
                                    }
                                </HorizontalScroll>
                                :
                                <div>You have rated {ratedMovies} movies. Please
                                    rate {requiredMovies - ratedMovies} more
                                    movie(s) to see your personalised recommendations.</div>
                            :
                            <div className="w-full text-center py-4">
                                <BeatLoader size={30} color={'#3830a3'}/>
                            </div>
                        }

                    </div>
                    <div className="my-3">
                        <h1 className="text-3xl font-extrabold text-gray-900">Trending today</h1>
                        <HorizontalScroll>
                            {
                                trendingMovies.map((movie, index) => {
                                    return (
                                        <MovieCard title={movie.title ?? movie.name}
                                                   voteAverage={movie.vote_average}
                                                   posterPath={movie.poster_path} userRating={movie.user_rating}
                                                   key={index}
                                                   movieId={movie.id}
                                                   customClass={'w-52 mx-2 my-3'}
                                        />
                                    )
                                })
                            }
                        </HorizontalScroll>
                    </div>
                    <div className="my-3">
                        <h1 className="text-3xl font-extrabold text-gray-900">All-time classics</h1>
                        <HorizontalScroll>
                            {
                                topRatedMovies.map((movie, index) => {
                                    return (
                                        <MovieCard title={movie.title ?? movie.name}
                                                   voteAverage={movie.vote_average}
                                                   posterPath={movie.poster_path} userRating={movie.user_rating}
                                                   key={index}
                                                   movieId={movie.id}
                                                   customClass={'w-52 mx-2 my-3'}
                                        />
                                    )
                                })
                            }
                        </HorizontalScroll>
                    </div>
                    <div className="my-3">
                        <h1 className="text-3xl font-extrabold text-gray-900">Popular</h1>
                        <HorizontalScroll>
                            {
                                popularMovies.map((movie, index) => {
                                    return (
                                        <MovieCard title={movie.title ?? movie.name}
                                                   voteAverage={movie.vote_average}
                                                   posterPath={movie.poster_path} userRating={movie.user_rating}
                                                   key={index}
                                                   movieId={movie.id}
                                                   customClass={'w-52 mx-2 my-3'}
                                        />
                                    )
                                })
                            }
                        </HorizontalScroll>
                    </div>
                    <div className="my-3">
                        <h1 className="text-3xl font-extrabold text-gray-900">Thrillers that will blow your
                            mind</h1>
                        <HorizontalScroll>
                            {
                                topThrillers.map((movie, index) => {
                                    return (
                                        <MovieCard title={movie.title ?? movie.name}
                                                   voteAverage={movie.vote_average}
                                                   posterPath={movie.poster_path} userRating={movie.user_rating}
                                                   key={index}
                                                   movieId={movie.id}
                                                   customClass={'w-52 mx-2 my-3'}
                                        />
                                    )
                                })
                            }
                        </HorizontalScroll>
                    </div>
                    <div className="my-3">
                        <h1 className="text-3xl font-extrabold text-gray-900">Laugh out loud comedies to lift your
                            spirits</h1>
                        <HorizontalScroll>
                            {
                                topComedies.map((movie, index) => {
                                    return (
                                        <MovieCard title={movie.title ?? movie.name}
                                                   voteAverage={movie.vote_average}
                                                   posterPath={movie.poster_path} userRating={movie.user_rating}
                                                   key={index}
                                                   movieId={movie.id}
                                                   customClass={'w-52 mx-2 my-3'}
                                        />
                                    )
                                })
                            }
                        </HorizontalScroll>
                    </div>
                    <div className="my-3">
                        <h1 className="text-3xl font-extrabold text-gray-900">Best date night films</h1>
                        <HorizontalScroll>
                            {
                                topRomances.map((movie, index) => {
                                    return (
                                        <MovieCard title={movie.title ?? movie.name}
                                                   voteAverage={movie.vote_average}
                                                   posterPath={movie.poster_path} userRating={movie.user_rating}
                                                   key={index}
                                                   movieId={movie.id}
                                                   customClass={'w-52 mx-2 my-3'}
                                        />
                                    )
                                })
                            }
                        </HorizontalScroll>
                    </div>
                </>) :
                <div className="w-full text-center pt-16">
                    <BeatLoader size={30} color={'#3830a3'}/>
                </div>}
        </div>
    )
}

export default Dashboard;

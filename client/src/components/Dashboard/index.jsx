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
import ScrollMenu from "react-horizontal-scrolling-menu";
import {faChevronLeft, faChevronRight, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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
                    <ScrollMenu
                        arrowLeft={<FontAwesomeIcon icon={faChevronLeft} className="h-full"/>}
                        arrowRight={<FontAwesomeIcon icon={faChevronRight} className="h-full"/>}
                        arrowClass={'px-5 h-72 flex bg-indigo-100 hover:bg-indigo-600 text-indigo-600 hover:text-indigo-50 duration-500 cursor-pointer'}
                        wheel={false}
                        dragging={false}
                        clickWhenDrag={false}
                        transition={0.3}
                        data={
                            recommendedMovies.map((movie, index) => {
                                return (
                                    <MovieCard title={movie.title ?? movie.name} voteAverage={movie.vote_average}
                                               posterPath={movie.poster_path} userRating={movie.user_rating}
                                               key={index}
                                               movieId={movie.id}
                                               customClass={'w-52 mx-2 my-3'}
                                    />
                                )
                            })
                        }
                    />
                    :
                    <div>You have rated {ratedMovies} movies. Please rate {requiredMovies - ratedMovies} more
                        movie(s) to see your personalised recommendations.</div>
                }
            </div>
            <div className="my-3">
                <h1 className="text-4xl">Trending today</h1>
                <ScrollMenu
                    arrowLeft={<FontAwesomeIcon icon={faChevronLeft} className="h-full"/>}
                    arrowRight={<FontAwesomeIcon icon={faChevronRight} className="h-full"/>}
                    arrowClass={'px-5 h-72 flex bg-indigo-100 hover:bg-indigo-600 text-indigo-600 hover:text-indigo-50 duration-500 cursor-pointer'}
                    wheel={false}
                    dragging={false}
                    clickWhenDrag={false}
                    transition={0.3}
                    data={
                        trendingMovies.map((movie, index) => {
                            return (
                                <MovieCard title={movie.title ?? movie.name} voteAverage={movie.vote_average}
                                           posterPath={movie.poster_path} userRating={movie.user_rating}
                                           key={index}
                                           movieId={movie.id}
                                           customClass={'w-52 mx-2 my-3'}
                                />
                            )
                        })
                    }
                />
            </div>
            <div className="my-3">
                <h1 className="text-4xl">Cinema classics</h1>
                <ScrollMenu
                    arrowLeft={<FontAwesomeIcon icon={faChevronLeft} className="h-full"/>}
                    arrowRight={<FontAwesomeIcon icon={faChevronRight} className="h-full"/>}
                    arrowClass={'px-5 h-72 flex bg-indigo-100 hover:bg-indigo-600 text-indigo-600 hover:text-indigo-50 duration-500 cursor-pointer'}
                    wheel={false}
                    dragging={false}
                    clickWhenDrag={false}
                    transition={0.3}
                    data={
                        topRatedMovies.map((movie, index) => {
                            return (
                                <MovieCard title={movie.title ?? movie.name} voteAverage={movie.vote_average}
                                           posterPath={movie.poster_path} userRating={movie.user_rating}
                                           key={index}
                                           movieId={movie.id}
                                           customClass={'w-52 mx-2 my-3'}
                                />
                            )
                        })
                    }
                />
            </div>
            <div className="my-3">
                <h1 className="text-4xl">Popular</h1>
                <ScrollMenu
                    arrowLeft={<FontAwesomeIcon icon={faChevronLeft} className="h-full"/>}
                    arrowRight={<FontAwesomeIcon icon={faChevronRight} className="h-full"/>}
                    arrowClass={'px-5 h-72 flex bg-indigo-100 hover:bg-indigo-600 text-indigo-600 hover:text-indigo-50 duration-500 cursor-pointer'}
                    wheel={false}
                    dragging={false}
                    clickWhenDrag={false}
                    transition={0.3}
                    data={
                        popularMovies.map((movie, index) => {
                            return (
                                <MovieCard title={movie.title ?? movie.name} voteAverage={movie.vote_average}
                                           posterPath={movie.poster_path} userRating={movie.user_rating}
                                           key={index}
                                           movieId={movie.id}
                                           customClass={'w-52 mx-2 my-3'}
                                />
                            )
                        })
                    }
                />
            </div>
            <div className="my-3">
                <h1 className="text-4xl">Thrillers that will blow your mind</h1>
                <ScrollMenu
                    arrowLeft={<FontAwesomeIcon icon={faChevronLeft} className="h-full"/>}
                    arrowRight={<FontAwesomeIcon icon={faChevronRight} className="h-full"/>}
                    arrowClass={'px-5 h-72 flex bg-indigo-100 hover:bg-indigo-600 text-indigo-600 hover:text-indigo-50 duration-500 cursor-pointer'}
                    wheel={false}
                    dragging={false}
                    clickWhenDrag={false}
                    transition={0.3}
                    data={
                        topThrillers.map((movie, index) => {
                            return (
                                <MovieCard title={movie.title ?? movie.name} voteAverage={movie.vote_average}
                                           posterPath={movie.poster_path} userRating={movie.user_rating}
                                           key={index}
                                           movieId={movie.id}
                                           customClass={'w-52 mx-2 my-3'}
                                />
                            )
                        })
                    }
                />
            </div>
            <div className="my-3">
                <h1 className="text-4xl">Laugh out loud comedies to lift your spirits</h1>
                <ScrollMenu
                    arrowLeft={<FontAwesomeIcon icon={faChevronLeft} className="h-full"/>}
                    arrowRight={<FontAwesomeIcon icon={faChevronRight} className="h-full"/>}
                    arrowClass={'px-5 h-72 flex bg-indigo-100 hover:bg-indigo-600 text-indigo-600 hover:text-indigo-50 duration-500 cursor-pointer'}
                    wheel={false}
                    dragging={false}
                    clickWhenDrag={false}
                    transition={0.3}
                    data={
                        topComedies.map((movie, index) => {
                            return (
                                <MovieCard title={movie.title ?? movie.name} voteAverage={movie.vote_average}
                                           posterPath={movie.poster_path} userRating={movie.user_rating}
                                           key={index}
                                           movieId={movie.id}
                                           customClass={'w-52 mx-2 my-3'}
                                />
                            )
                        })
                    }
                />
            </div>
            <div className="my-3">
                <h1 className="text-4xl">Best date night films</h1>
                <ScrollMenu
                    arrowLeft={<FontAwesomeIcon icon={faChevronLeft} className="h-full"/>}
                    arrowRight={<FontAwesomeIcon icon={faChevronRight} className="h-full"/>}
                    arrowClass={'px-5 h-72 flex bg-indigo-100 hover:bg-indigo-600 text-indigo-600 hover:text-indigo-50 duration-500 cursor-pointer'}
                    wheel={false}
                    dragging={false}
                    clickWhenDrag={false}
                    transition={0.3}
                    data={
                        topRomances.map((movie, index) => {
                            return (
                                <MovieCard title={movie.title ?? movie.name} voteAverage={movie.vote_average}
                                           posterPath={movie.poster_path} userRating={movie.user_rating}
                                           key={index}
                                           movieId={movie.id}
                                           customClass={'w-52 mx-2 my-3'}
                                />
                            )
                        })
                    }
                />
            </div>
        </div>
    )
}

export default Dashboard;

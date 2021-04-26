import {get as getMovieService, getSimilar as getSimilarService} from "../../services/MovieServices";
import {
    create as createWishlistItemService,
    destroy as destroyWishlistItemService
} from "../../services/WishlistItemServices";
import {
    destroy as destroyRatingService,
    get as getRatingService,
    update as updateRatingService,
    create as createRatingService
} from "../../services/RatingServices";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {useEffect, useState} from 'react';
import ReactStars from 'react-stars'
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {useHistory} from "react-router-dom";
import HorizontalScroll from "../UI/HorizontalScroll";
import MovieCard from "../UI/MovieCard";
import {BeatLoader} from "react-spinners";

function Movie(props) {
    let movieId = props.match.params.id
    const [movie, setMovie] = useState([])
    const [similarMovies, setSimilarMovies] = useState([])
    const [isWishlistItem, setIsWishlistItem] = useState(false)
    const [isWishlistRequestProcessed, setIsWishlistRequestProcessed] = useState(false)
    const [userRating, setUserRating] = useState(null)
    const [loadingFinished, setLoadingFinished] = useState(false)
    let history = useHistory();

    useEffect(() => {
        if (localStorage.getItem('token') === 'null') {
            history.push({pathname: "/login",});
        } else {
            setIsWishlistRequestProcessed(true)
            getSimilarService({id: movieId}).then(res => {
                setSimilarMovies(res.data.movies)
            })
            getMovieService({id: movieId}).then(res => {
                setMovie(res.data.movie)
                setIsWishlistItem(res.data.isWishlistItem)
                getRatingService({movie_id: movieId}).then(res => {
                    setUserRating(res.data.rating)
                    setIsWishlistRequestProcessed(false)
                    setLoadingFinished(true)
                })
            })
        }
    }, [history, movieId]);


    const addWishlistItem = () => {
        setIsWishlistRequestProcessed(true)
        createWishlistItemService({movie_id: movieId}).then(res => {
            setIsWishlistItem(true)
            setIsWishlistRequestProcessed(false)
        })
    }

    const deleteWishlistItem = () => {
        setIsWishlistRequestProcessed(true)
        destroyWishlistItemService({movie_id: movieId}).then(res => {
            setIsWishlistItem(false)
            setIsWishlistRequestProcessed(false)
        })
    }

    const createRating = (rating) => {
        createRatingService({movie_id: movieId, rating: rating}).then(res => {
            setUserRating(res.data.rating)
        })
    }

    const updateRating = (rating) => {
        updateRatingService({movie_id: movieId, rating: rating}).then(res => {
            setUserRating(res.data.rating)
        })
    }

    const deleteRating = () => {
        destroyRatingService({movie_id: movieId}).then(res => {
            setUserRating(res.data.rating)
        })
    }

    return (
        <div className="h-screen-minus-navbar pb-14 px-4 mt-16">
            {loadingFinished ?
                (<>
                    <h1 className="text-3xl font-extrabold text-gray-900 pt-5 sm:mb-3">{movie.title}</h1>
                    {movie.tagline ?
                        <p className="mb-5 text-gray-500">{movie.tagline}</p>
                        :
                        <p className="mb-5 text-gray-500">&nbsp;</p>
                    }
                    <div className="block sm:hidden mb-2">
                        <p className=""><span
                            className="font-bold">Director</span>: {movie.credits.crew.find(crewMember => crewMember.job == "Director") ? movie.credits.crew.find(crewMember => crewMember.job == "Director").name : 'N/A'}
                        </p>
                        <p className=""><span
                            className="font-bold">Main writer</span>: {movie.credits.crew.find(crewMember => crewMember.job == "Screenplay") ? movie.credits.crew.find(crewMember => crewMember.job == "Screenplay").name : 'N/A'}
                        </p>
                        <p className=""><span
                            className="font-bold">Producer</span>: {movie.credits.crew.find(crewMember => crewMember.job == "Producer") ? movie.credits.crew.find(crewMember => crewMember.job == "Producer").name : 'N/A'}
                        </p>
                    </div>
                    <div className="inline-block sm:hidden mb-3">
                        {movie.genres &&
                        movie.genres.map((genre, index) => {
                            return (
                                <p className="inline-block mr-3 px-3 py-1 mb-2 text-white rounded-md bg-green-500"
                                   key={index}>{genre.name}</p>
                            )
                        })
                        }
                    </div>
                    <div className="flex flex-wrap">
                        <div className="w-full sm:w-1/4">
                            {movie.poster_path ?
                                <img src={'https://image.tmdb.org/t/p/w300' + movie.poster_path} alt=""
                                     className="rounded-md w-1/3 align-top sm:align-middle sm:w-auto inline-block sm:block"/>
                                :
                                <img src={'https://dummyimage.com/300x450/cccccc/ffffff&text=No+poster'}
                                     alt=""
                                     className="rounded-md align-top sm:align-middle inline-block mr-3"/>
                            }
                            <div className="w-2/3 pl-3 inline-block sm:hidden align-top">
                                <h2 className="text-2xl">Description</h2>
                                <p className="text-justify sm:text-left">{movie.overview}</p>
                            </div>
                            <div className="">
                                <p className="my-2 font-extrabold text-gray-900">
                                    Your rating
                                </p>
                                <div className="inline-flex">
                                    <ReactStars
                                        className={'inline-block'}
                                        count={5}
                                        value={parseFloat(userRating)}
                                        onChange={userRating ? updateRating : createRating}
                                        size={24}
                                        color2={'#ffd700'}/>
                                    {userRating !== null &&
                                    <button onClick={deleteRating} className='inline-block ml-4 focus:outline-none'>
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </button>
                                    }
                                </div>
                            </div>
                            <div className="">
                                <p className="my-2 font-extrabold text-gray-900">Overall rating</p>
                                <div className="inline-flex">
                                    <ReactStars
                                        count={5}
                                        value={movie.vote_average / 2}
                                        size={24}
                                        edit={false}
                                        color2={'#ffd700'}/>
                                </div>
                            </div>

                            <button onClick={isWishlistItem ? deleteWishlistItem : addWishlistItem}
                                    className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium block mt-2"
                                    disabled={isWishlistRequestProcessed}>
                                {isWishlistItem ? 'Remove from wish list' : 'Add to wish list'}
                            </button>
                        </div>
                        <div className="w-full sm:w-3/4 sm:pl-7">
                            <div className="hidden sm:block mb-2">
                                {movie.genres &&
                                movie.genres.map((genre, index) => {
                                    return (
                                        <p className="inline-block mr-3 px-3 py-1 mb-2 text-white rounded-md bg-green-500"
                                           key={index}>{genre.name}</p>
                                    )
                                })
                                }
                            </div>
                            <div className="hidden sm:block mb-2">
                                <p className=""><span
                                    className="font-bold">Director</span>: {movie.credits.crew.find(crewMember => crewMember.job == "Director") ? movie.credits.crew.find(crewMember => crewMember.job == "Director").name : 'N/A'}
                                </p>
                                <p className=""><span
                                    className="font-bold">Main writer</span>: {movie.credits.crew.find(crewMember => crewMember.job == "Screenplay") ? movie.credits.crew.find(crewMember => crewMember.job == "Screenplay").name : 'N/A'}
                                </p>
                                <p className=""><span
                                    className="font-bold">Producer</span>: {movie.credits.crew.find(crewMember => crewMember.job == "Producer") ? movie.credits.crew.find(crewMember => crewMember.job == "Producer").name : 'N/A'}
                                </p>
                            </div>
                            <h2 className="text-2xl font-extrabold text-gray-900 mt-5 mb-1 hidden sm:block">Description</h2>
                            <p className="hidden sm:block">{movie.overview}</p>
                            <h2 className="text-2xl mt-5 font-extrabold text-gray-900 mb-1">Cast</h2>
                            <div
                                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
                                {movie.credits &&
                                movie.credits.cast.slice(0, 8).map((actor, index) => {
                                    return (
                                        <div className="text-center flex items-center flex-col mr-10" key={index}>
                                            {actor.profile_path ?
                                                <img src={'https://image.tmdb.org/t/p/w300' + actor.profile_path} alt=""
                                                     className="rounded-lg w-full"/>
                                                :
                                                <img src={'https://dummyimage.com/300x450/cccccc/ffffff&text=No+image'}
                                                     alt=""
                                                     className="rounded-md align-top sm:align-middle inline-block mr-3"/>
                                            }
                                            <span className="font-bold block">{actor.name}</span>
                                            <span className="block">as</span>
                                            <span className="font-bold block">{actor.character}</span>
                                        </div>
                                    )
                                })}
                            </div>
                            <h2 className="text-2xl mt-5 font-extrabold text-gray-900">People who enjoyed this movie also liked</h2>
                            <div>
                                <HorizontalScroll>
                                    {
                                        similarMovies.map((movie, index) => {
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
                                </HorizontalScroll>
                            </div>
                        </div>
                    </div>
                </>) :
                <div className="w-full text-center pt-16">
                    <BeatLoader size={30} color={'#3830a3'}/>
                </div>}
        </div>
    )
}

export default Movie;

import {movieInfo as movieInfoService} from "../../services/MovieServices";
import {
    create as createWishlistItemService,
    destroy as destroyWishlistItemService
} from "../../services/WishlistItemServices";
import {
    destroy as destroyRatingService,
    get as getRatingService,
    set as setRatingService
} from "../../services/RatingServices";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {useEffect, useState} from 'react';
import ReactStars from 'react-stars'
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {useHistory} from "react-router-dom";

function Dashboard() {
    let movieId = window.location.search.replace("?id=", ''); // get movie id from url parameter
    const [movieInfo, setMovieInfo] = useState([])
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
            getRatingService({movieId: movieId}).then(res => {
                setUserRating(res.data.rating)
                movieInfoService({movieId: movieId}).then(res => {
                    setMovieInfo(res.data.movie)
                    setIsWishlistItem(res.data.isWishlistItem)
                    setIsWishlistRequestProcessed(false)
                    setLoadingFinished(true)
                })
            })
        }
    }, [history, movieId]);


    const addWishlistItem = () => {
        setIsWishlistRequestProcessed(true)
        createWishlistItemService({movieId: movieId}).then(res => {
            setIsWishlistItem(true)
            setIsWishlistRequestProcessed(false)
        })
    }

    const deleteWishlistItem = () => {
        setIsWishlistRequestProcessed(true)
        destroyWishlistItemService({movieId: movieId}).then(res => {
            setIsWishlistItem(false)
            setIsWishlistRequestProcessed(false)
        })
    }

    const setRating = (newRating) => {
        setRatingService({movieId: movieId, rating: newRating}).then(res => {
            setUserRating(res.data.rating)
        })
    }

    const deleteRating = () => {
        destroyRatingService({movieId: movieId}).then(res => {
            setUserRating(res.data.rating)
        })
    }

    return (
        <div className="h-screen-minus-navbar pb-14 px-4 mt-16">
            {loadingFinished ?
                (<>
                    <h1 className="text-4xl pt-5 sm:mb-3">{movieInfo.title}</h1>
                    {movieInfo.tagline &&
                    <p className="mb-5 text-gray-500">{movieInfo.tagline}</p>
                    }
                    <div className="inline-block sm:hidden mb-3">
                        {movieInfo.genres &&
                        movieInfo.genres.map((genre, index) => {
                            return (
                                <p className="inline-block pr-4" key={index}>{genre.name}</p>
                            )
                        })
                        }
                    </div>
                    <div className="flex flex-wrap">
                        <div className="w-full sm:w-1/4">
                            {movieInfo.poster_path &&
                            <img src={'https://image.tmdb.org/t/p/w300' + movieInfo.poster_path} alt=""
                                 className="rounded-md w-1/3 align-top sm:align-middle sm:w-auto inline-block sm:block"/>
                            }
                            <div className="w-2/3 pl-3 inline-block sm:hidden align-top">
                                <h2 className="text-2xl">Description</h2>
                                <p>{movieInfo.overview}</p>
                            </div>
                            <div className="">
                                <p className="my-2">
                                    Your rating
                                </p>
                                <div className="inline-flex">
                                    <ReactStars
                                        className={'inline-block'}
                                        count={5}
                                        value={parseFloat(userRating)}
                                        onChange={setRating}
                                        size={24}
                                        color2={'#ffd700'}/>
                                    {userRating !== null &&
                                    <button onClick={deleteRating} className='inline-block ml-4'>
                                        <FontAwesomeIcon icon={faTrash}/>
                                    </button>
                                    }
                                </div>
                            </div>
                            <div className="">
                                <p className="my-2">Overall rating</p>
                                <div className="inline-flex">
                                    <ReactStars
                                        count={5}
                                        value={movieInfo.vote_average / 2}
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
                            <div className="hidden sm:inline-block">
                                {movieInfo.genres &&
                                movieInfo.genres.map((genre, index) => {
                                    return (
                                        <p className="inline-block pr-4" key={index}>{genre.name}</p>
                                    )
                                })
                                }
                            </div>
                            <h2 className="text-2xl mt-5 hidden sm:block">Description</h2>
                            <p className="hidden sm:block">{movieInfo.overview}</p>
                            <h2 className="text-2xl mt-5">Cast</h2>
                            <div
                                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
                                {movieInfo.credits &&
                                movieInfo.credits.cast.slice(0, 8).map((actor, index) => {
                                    return (
                                        <div className="text-center flex items-center flex-col mr-10" key={index}>
                                            {actor.profile_path &&
                                            <img src={'https://image.tmdb.org/t/p/w300' + actor.profile_path} alt=""
                                                 className="rounded-lg w-full"/>
                                            }
                                            <span className="font-bold block">{actor.name}</span>
                                            <span className="block">as</span>
                                            <span className="font-bold block">{actor.character}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </>) :
                <p>Loading</p>}
        </div>
    )
}

export default Dashboard;

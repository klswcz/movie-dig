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

function Dashboard() {
    let movieId = window.location.search.replace("?id=", ''); // get movie id from url parameter
    const [movieInfo, setMovieInfo] = useState([])
    const [isWishlistItem, setIsWishlistItem] = useState(false)
    const [isWishlistRequestProcessed, setIsWishlistRequestProcessed] = useState(false)
    const [userRating, setUserRating] = useState(null)

    useEffect(() => {
        setIsWishlistRequestProcessed(true)
        movieInfoService({movieId: movieId}).then(res => {
            setMovieInfo(res.data.movie)
            setIsWishlistItem(res.data.isWishlistItem)
            setIsWishlistRequestProcessed(false)

            getRatingService({movieId: movieId}).then(res => {
                setUserRating(res.data.rating)
            })
        })
    }, [movieId]);


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
        <div className="h-screen-minus-navbar pb-14 px-4">
            <h1 className="text-4xl mt-5">{movieInfo.title}</h1>
            <p className="mb-5 text-gray-500">{movieInfo.tagline}</p>
            <div className="flex flex-wrap">
                <div className="w-full md:w-1/4">
                    { movieInfo.poster_path &&
                        <img src={'https://image.tmdb.org/t/p/w300' + movieInfo.poster_path} alt="" className="rounded-md"/>
                    }
                    <p className="my-2">
                        your rating
                    </p>
                    <div className="inline-flex">
                        <ReactStars
                            className={'inline-block'}
                            count={5}
                            value={parseInt(userRating)}
                            onChange={setRating}
                            size={24}
                            color2={'#ffd700'}/>
                        {userRating !== null &&
                        <button onClick={deleteRating} className='inline-block ml-4'>
                            <FontAwesomeIcon icon={faTrash}/>
                        </button>
                        }
                    </div>
                    <p className="my-2">general rating</p>
                    <ReactStars
                        count={5}
                        value={movieInfo.vote_average / 2}
                        size={24}
                        edit={false}
                        color2={'#ffd700'}/>
                    <button onClick={isWishlistItem ? deleteWishlistItem : addWishlistItem}
                            className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                            disabled={isWishlistRequestProcessed}>
                        {isWishlistItem ? 'Remove from wish list' : 'Add to wish list'}
                    </button>
                </div>
                <div className="w-full md:w-3/4">
                    {movieInfo.genres &&
                    movieInfo.genres.map((genre, index) => {
                        return (
                            <p className="inline-block pr-4" key={index}>{genre.name}</p>
                        )
                    })
                    }
                    <h2 className="text-2xl mt-5">Description</h2>
                    <p>{movieInfo.overview}</p>
                    <h2 className="text-2xl mt-5">Cast</h2>
                    <div className="grid grid-cols-8">
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
        </div>
    )
}

export default Dashboard;

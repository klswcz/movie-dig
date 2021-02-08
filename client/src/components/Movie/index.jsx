import {movieInfo as movieInfoService} from "../../services/MovieServices";
import {create as createService, destroy as destroyService} from "../../services/WishlistItemServices";
import React, {useEffect, useState} from 'react';

function Dashboard() {
    let movieId = window.location.search.replace("?id=", ''); // get movie id from url parameter
    const [movieInfo, setMovieInfo] = useState([])
    const [isWishlistItem, setIsWishlistItem] = useState(false)
    const [isWishlistRequestProcessed, setIsWishlistRequestProcessed] = useState(false)
    useEffect(() => {
        getMovieInfo()
    }, []);

    const getMovieInfo = () => {
        setIsWishlistRequestProcessed(true)
        movieInfoService({movieId: movieId}).then(res => {
            setMovieInfo(res.data.movie)
            setIsWishlistItem(res.data.isWishlistItem)
            setIsWishlistRequestProcessed(false)
        })
    };

    const addWishlistItem = () => {
        setIsWishlistRequestProcessed(true)
        createService({movieId: movieId}).then(res => {
            setIsWishlistItem(true)
            setIsWishlistRequestProcessed(false)
        })
    }

    const deleteWishlistItem = () => {
        setIsWishlistRequestProcessed(true)
        destroyService({movieId: movieId}).then(res => {
            setIsWishlistItem(false)
            setIsWishlistRequestProcessed(false)
        })
    }

    return (
        <div className="h-screen-minus-navbar pb-14 px-4">
            <h1 className="text-4xl mt-5">{movieInfo.title}</h1>
            <p className="mb-5 text-gray-500">{movieInfo.tagline}</p>
            <div className="flex flex-wrap">
                <div className="w-full md:w-1/4">
                    <img src={'https://image.tmdb.org/t/p/w300' + movieInfo.poster_path} alt="" className="rounded-md"/>
                    <p className="my-2">your rating: 10/10</p>
                    <p className="my-2">average score: {movieInfo.vote_average}/10</p>
                    <button onClick={isWishlistItem ? deleteWishlistItem : addWishlistItem}
                            className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                            disabled={isWishlistRequestProcessed}>
                        {isWishlistItem ? 'Remove from wish list' : 'Add to wish list'}
                    </button>
                </div>
                <div className="w-full md:w-3/4">
                    {movieInfo.genres &&
                    movieInfo.genres.map(genre => {
                        return (
                            <p className="inline-block pr-4">{genre.name}</p>
                        )
                    })
                    }
                    <h2 className="text-2xl mt-5">Description</h2>
                    <p>{movieInfo.overview}</p>
                    <h2 className="text-2xl mt-5">Cast</h2>
                    <div className="grid grid-cols-8">
                        {movieInfo.credits &&
                        movieInfo.credits.cast.slice(0, 8).map(actor => {
                            return (
                                <div className="text-center flex items-center flex-col mr-10">
                                    <img src={'https://image.tmdb.org/t/p/w300' + actor.profile_path} alt=""
                                         className="rounded-lg w-full"/>
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

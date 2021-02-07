import {movieInfo as movieInfoService} from "../../services/MovieServices";
import {create as createService} from "../../services/WishlistItemServices";
import React, {useEffect, useState} from 'react';

function Dashboard() {
    const [movieInfo, setMovieInfo] = useState([])

    useEffect(() => {
        getMovieInfo()
    }, []);

    const getMovieInfo = () => {
        let movieId = window.location.search.replace("?id=", ''); // get movie id from url parameter
        movieInfoService({movieId: movieId}).then(res => {
            setMovieInfo(res.data.movie)
        }).catch(res => {
        })
    };

    const addWishlistItem = () => {
        let movieId = window.location.search.replace("?id=", ''); // get movie id from url parameter
        createService({movieId: movieId}).then(res => {
            console.log(res.data);
            // setMovieInfo(res.data.movie)
        }).catch(res => {
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
                    <button onClick={addWishlistItem} className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">
                        Add to wish list
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
                                    <img src={'https://image.tmdb.org/t/p/w300' + actor.profile_path} alt="" className="rounded-lg w-full"/>
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

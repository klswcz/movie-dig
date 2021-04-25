import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import {all as allRatingsService} from "../../services/RatingServices";
import MovieCard from "../UI/MovieCard";
import {BeatLoader} from "react-spinners";


function RatedMovies() {
    let history = useHistory();
    const [loadingFinished, setLoadingFinished] = useState(false)
    const [ratedMovies, setRatedMovies] = useState([])
    useEffect(() => {
        if (localStorage.getItem('token') === 'null') {
            history.push({pathname: "/login",});
        } else {
            allRatingsService().then(res => {
                setRatedMovies(res.data.ratedMovies)
                setLoadingFinished(true)
            })
        }
    }, [history]);

    return (
        <div className=" pb-14 px-4 mt-16">
            {loadingFinished ?
                (<>
                    <div className="pt-5 mb-3">
                        <h1 className="text-3xl font-extrabold text-gray-900 pt-5 sm:mb-3">Rated movies</h1>
                        <div className="grid xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 grid-cols-2">
                            {ratedMovies.length > 0 ?
                                ratedMovies.map((movie, index) => {
                                    return (
                                        <MovieCard title={movie.title ?? movie.name} voteAverage={movie.vote_average}
                                                   posterPath={movie.poster_path} userRating={movie.user_rating} key={index}
                                                   movieId={movie.id}/>
                                    )
                                }) : (
                                    <p>You have not rated any films yet.</p>
                                )
                            }
                        </div>
                    </div>
                </>) :
                <div className="w-full text-center pt-16">
                    <BeatLoader size={30} color={'#3830a3'}/>
                </div>}
        </div>
    )
}

export default RatedMovies;

import {trending as trendingService} from "../../services/MovieServices";
import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import MovieCard from "./MovieCard";

function Dashboard() {
    const [trendingMovies, setTrendingMovies] = useState([])
    const [loadingFinished, setLoadingFinished] = useState(false)
    const history = useHistory();

    useEffect(() => {
        if (localStorage.getItem('token') === 'null') {
            history.push({pathname: "/login",});
        } else {
            getTrendingMovies()
        }
    }, []);

    const getTrendingMovies = () => {
        trendingService().then(res => {
            setTrendingMovies(res.data.movies)
            setLoadingFinished(true)
        }).catch(() => {
        })
    };

    return (
        <div className="h-screen-minus-navbar pb-14 px-4">
            {loadingFinished ?
                (<>
                    <h1 className="text-4xl mt-5">Trending today</h1>
                    <div className="grid xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 grid-cols-2">
                        {trendingMovies.map((movie, index) => {
                            return (
                                <MovieCard title={movie.title ?? movie.name} voteAverage={movie.vote_average}
                                           posterPath={movie.poster_path} userRating={movie.user_rating} key={index}
                                           movieId={movie.id}/>
                            )
                        })}
                    </div>
                </>) :
                <p>Loading</p>}
        </div>
    )
}

export default Dashboard;

import {trending as trendingService} from "../../services/MovieServices";
import React, {useEffect, useState} from 'react';
import MovieCard from "./MovieCard";

function Dashboard() {
    const [trendingMovies, setTrendingMovies] = useState([])

    useEffect(() => {
        getTrendingMovies()
    }, []);

    const getTrendingMovies = () => {
        trendingService().then(res => {
            console.log(res.data.movies);
            setTrendingMovies(res.data.movies)
        }).catch(res => {
        })
    };

    return (
        <div className="h-screen-minus-navbar pb-14 px-4">
            <h1 className="text-4xl">Trending today</h1>
            <div className="grid grid-cols-6">
                {trendingMovies.map(movie => {
                    return (
                        <MovieCard title={movie.title ?? movie.name} voteAverage={movie.vote_average} posterPath={movie.poster_path} key={movie.id}/>
                    )
                })}
            </div>
        </div>
    )
}

export default Dashboard;

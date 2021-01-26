import {movieInfo as movieInfoService} from "../../services/MovieServices";
import React, {useEffect, useState} from 'react';

function Dashboard() {
    useEffect(() => {
        getMovieInfo()
    }, []);

    const getMovieInfo = () => {
        let movieId = window.location.search.replace("?id=", ''); // get movie id from url parameter

        movieInfoService({movieId: movieId}).then(res => {
            // setTrendingMovies(res.data.movies)
        }).catch(res => {
        })
    };

    return (
        <div className="h-screen-minus-navbar pb-14 px-4">
            <h1 className="text-4xl">Movie title</h1>
            <div className="grid xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 grid-cols-2">
            </div>
        </div>
    )
}

export default Dashboard;

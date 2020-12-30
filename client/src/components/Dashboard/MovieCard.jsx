import React from 'react';

function MovieCard(props) {

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mx-3 my-6">
            <img src={'https://image.tmdb.org/t/p/original' + props.posterPath} alt=""/>
            <div className="px-2">
                <p className="text-center text-xl">{props.title}</p>
                <p>Rating: {props.voteAverage}/10</p>
                <p>Recommendation: {Math.round(Math.random() * 100) / 10}/10</p>
            </div>
        </div>
    )
}

export default MovieCard;

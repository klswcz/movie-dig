import React from 'react';
import {faStar, faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Link} from "react-router-dom";

function MovieCard(props) {

    return (
        <Link to={`movie?id=${props.movieId}`}>
            <div className="relative bg-white border-2 border-black shadow overflow-hidden sm:rounded-md mx-2 my-3 h-72"
                 style={{
                     backgroundImage: 'url(https://image.tmdb.org/t/p/w300' + props.posterPath + ')',
                     backgroundPosition: "center",
                     backgroundSize: "cover"
                 }}>
                <div className="px-2 bg-white inset-x-0 bottom-0 absolute">
                    <p className="text-center text-md font-medium">{props.title}</p>
                    <div className="grid grid-cols-2 text-center mb-2">
                        <div>
                            <p className="text-xs font-medium">
                                <FontAwesomeIcon icon={faStar}/>
                                <span> {props.voteAverage}/10</span>
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium">
                                <FontAwesomeIcon icon={faUser}/>
                                <span> {Math.round(Math.random() * 100) / 10}/10</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default MovieCard;

import React from 'react';
import {faStar, faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Link} from "react-router-dom";

function MovieCard(props) {
    return (
        <Link to={{ pathname: '/movie', search: `?id=${props.movieId}`}} className="mx-2 my-3">
            <div className="relative bg-white border border-black shadow overflow-hidden sm:rounded-md  h-72"
                 style={{
                     backgroundImage: props.posterPath ? 'url(https://image.tmdb.org/t/p/w300' + props.posterPath + ')' : 'url(https://dummyimage.com/300x450/cccccc/ffffff&text=No+poster)',
                     backgroundPosition: "center",
                     backgroundSize: "cover"
                 }}>
                <div className="px-2 bg-white inset-x-0 bottom-0 absolute">
                    <p className="text-center text-md font-medium">{props.title}</p>
                    <div className="grid grid-cols-2 text-center mb-2">
                        <div>
                            <p className="text-xs font-medium">
                                <FontAwesomeIcon icon={faStar}/>
                                <span> {Math.round(props.voteAverage / 2 * 10) / 10}/5</span>
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium">
                                <FontAwesomeIcon icon={faUser}/>
                                <span> {props.userRating || '-'}/5</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default MovieCard;

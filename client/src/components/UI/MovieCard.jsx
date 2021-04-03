import {useEffect, useState} from 'react';
import {faStar, faTrash, faUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Link, useHistory} from "react-router-dom";
import ReactStars from "react-stars";
import {destroy as destroyRatingService, update as setRatingService} from "../../services/RatingServices";
import store from "../../store/reducer";

function MovieCard(props) {
    const [userRating, setUserRating] = useState(null)
    let history = useHistory();

    useEffect(() => {
        if (localStorage.getItem('token') === 'null') {
            history.push({pathname: "/login",});
        } else {
            setUserRating(props.userRating)
        }
    }, [history, props.userRating]);

    const setRating = (newRating) => {
        setRatingService({movie_id: props.movieId, rating: newRating, rating_count: true}).then(res => {
            store.dispatch({type: 'SET_RATING_COUNT', payload: res.data.rating_count})
            setUserRating(res.data.rating)
        })
    }
    const deleteRating = () => {
        destroyRatingService({movie_id: props.movieId, rating_count: true}).then(res => {
            store.dispatch({type: 'SET_RATING_COUNT', payload: res.data.rating_count})
            setUserRating(res.data.rating)
        })
    }

    const movieCard = (
        <div
            className={`relative bg-white border border-black shadow overflow-hidden sm:rounded-md h-72  ${(props.disableLink ? 'mx-2 my-3' : '')}`}
            style={{
                backgroundImage: props.posterPath ? 'url(https://image.tmdb.org/t/p/w300' + props.posterPath + ')' : 'url(https://dummyimage.com/300x450/cccccc/ffffff&text=No+poster)',
                backgroundPosition: "center",
                backgroundSize: "cover"
            }}>
            <div
                className={"px-2 bg-white inset-x-0 bottom-0 absolute "}>
                <p className="text-center text-md font-medium">{props.title}</p>
                {!props.hideRatings &&
                <div className="grid grid-cols-2 text-center mb-2">
                    <div>
                        <p className="text-xs font-medium">
                            <FontAwesomeIcon icon={faStar}/>
                            <span> {Math.round(props.voteAverage / 2 * 10) / 10}</span>
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium">
                            <FontAwesomeIcon icon={faUser}/>
                            <span> {props.userRating || '-'}</span>
                        </p>
                    </div>
                </div>
                }

                {props.showRatingComponent &&
                <div className="text-center">
                    <ReactStars
                        className={'inline-block align-bottom'}
                        count={5}
                        value={parseFloat(userRating)}
                        size={20}
                        onChange={setRating}
                        color2={'#ffd700'}/>
                    {userRating != null &&
                    <button onClick={deleteRating} className='inline-block ml-4 focus:outline-none align-text-bottom'>
                        <FontAwesomeIcon icon={faTrash}/>
                    </button>
                    }
                </div>
                }
            </div>
        </div>

    )

    return (
        props.disableLink ?
            movieCard
            :
            <Link to={{pathname: '/movie', search: `?id=${props.movieId}`}} className="mx-2 my-3">
                {movieCard}
            </Link>
    )
}

export default MovieCard;

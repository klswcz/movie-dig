import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import {get as getWishlistService,} from "../../services/WishlistItemServices";
import MovieCard from "../UI/MovieCard";
import {recommendation as recommendationService} from "../../services/MovieServices";
import {BeatLoader} from "react-spinners";


function Recommendations() {
    let history = useHistory();
    const [loadingFinished, setLoadingFinished] = useState(false)
    const [recommendedMovies, setRecommendedMovies] = useState([])
    const [ratedMovies, setRatedMovies] = useState(0)
    const [requiredMovies, setRequiredMovies] = useState(0)

    useEffect(() => {
        if (localStorage.getItem('token') === 'null') {
            history.push({pathname: "/login",});
        } else {
            getRecommendations()
        }
    }, [history]);

    const getRecommendations = () => {
        recommendationService({count: 40}).then(res => {
            setRecommendedMovies(res.data.movies)
            setRatedMovies(res.data.ratings_given)
            setRequiredMovies(res.data.ratings_required)
            setLoadingFinished(true)
        })
    };

    return (
        <div className=" pb-14 px-4 mt-16">
            {loadingFinished ?
                (<div className="pt-5 mb-3">
                    <h1 className="text-3xl font-extrabold text-gray-900 pt-5 sm:mb-3">Your film recommendations</h1>
                    {recommendedMovies !== null ?
                        <div className="grid xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 grid-cols-2">
                            {recommendedMovies.map((movie, index) => {
                                return (
                                    <MovieCard title={movie.title ?? movie.name} voteAverage={movie.vote_average}
                                               posterPath={movie.poster_path} userRating={movie.user_rating} key={index}
                                               movieId={movie.id}/>
                                )
                            })}
                        </div>
                        :
                        <div>You have rated {ratedMovies} movies. Please rate {requiredMovies - ratedMovies} more
                        movie(s) to see your personalised recommendations.</div>
                    }
                </div>)
                :
                (<div className="w-full text-center pt-16">
                    <BeatLoader size={30} color={'#3830a3'}/>
                </div>)}
        </div>
    )
}

export default Recommendations;

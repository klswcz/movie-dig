import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import {get as getRatingPropositionService} from "../../services/RatingPropositionService";
import MovieCard from "../UI/MovieCard";
import Button from "../UI/Form/Button";

function BatchMovieRating(props) {
    let history = useHistory();
    const [loadingFinished, setLoadingFinished] = useState(false)
    const [propositions, setPropositions] = useState([])

    useEffect(() => {
        if (localStorage.getItem('token') === 'null') {
            history.push({pathname: "/login",});
        } else {
            getRatingPropositionService().then(res => {
                setPropositions(res.data.propositions)
                setLoadingFinished(true)
            })
        }
    }, [history]);


    return (
        <div className="h-screen-minus-navbar pb-4 px-4 mt-16">
            {loadingFinished ?
                (<>
                    <h1 className="text-4xl pt-5 sm:mb-3">Let's rate some movies!</h1>
                    <div className="flex flex-wrap">
                        {propositions.map((proposition, propositionIndex) => {
                            return (
                                <div
                                    className="grid w-full 4xl:grid-cols-12 3xl:grid-cols-10 2xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 grid-cols-2"
                                    key={propositionIndex}>
                                    <p>{proposition.name}</p>
                                    {proposition.movies.map((movie, index) => {
                                        return (
                                            <MovieCard title={movie.title ?? movie.name}
                                                       voteAverage={movie.vote_average}
                                                       posterPath={movie.poster_path} userRating={movie.user_rating}
                                                       key={index}
                                                       movieId={movie.id}
                                                       showRatingComponent={true}
                                                       hideRatings={true}
                                                       disableLink={true}
                                            />
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>
                    <div className="mt-5">
                        <Button label={'Go to Dashboard'} widthAuto={true} to={'/dashboard'}/>
                    </div>
                </>) :
                <p>Loading</p>}
        </div>
    )
}

export default BatchMovieRating

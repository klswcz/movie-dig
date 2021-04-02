import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import {get as getWishlistService,} from "../../services/WishlistItemServices";
import MovieCard from "../UI/MovieCard";


function Wishlist() {
    let history = useHistory();
    const [loadingFinished, setLoadingFinished] = useState(false)
    const [wishlistItems, setWishlistItems] = useState([])
    useEffect(() => {
        if (localStorage.getItem('token') === 'null') {
            history.push({pathname: "/login",});
        } else {
            getWishlistService().then(res => {
                setWishlistItems(res.data.wishlistItems)
                setLoadingFinished(true)
            })
        }
    }, [history]);

    return (
        <div className=" pb-14 px-4 mt-16">
            {loadingFinished ?
                (<>
                    <div className="pt-5 mb-3">
                        <h1 className="text-4xl pt-5 sm:mb-3">Wish list</h1>
                        <div className="grid xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 grid-cols-2">
                            {wishlistItems.length > 0 ?
                            wishlistItems.map((movie, index) => {
                                return (
                                    <MovieCard title={movie.title ?? movie.name} voteAverage={movie.vote_average}
                                               posterPath={movie.poster_path} userRating={movie.user_rating} key={index}
                                               movieId={movie.id}/>
                                )
                            }) : (
                                <p>there are no items on your wish list</p>
                                )
                            }
                        </div>
                    </div>
                </>) :
                <p>Loading</p>}
        </div>
    )
}

export default Wishlist;

import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { get as getWishlistService } from "../../services/WishlistItemServices"
import MovieCard from "../UI/MovieCard"
import { BeatLoader } from "react-spinners"

function Wishlist() {
    const history = useHistory()
    const [loadingFinished, setLoadingFinished] = useState(false)
    const [wishlistItems, setWishlistItems] = useState([])
    useEffect(() => {
        if (localStorage.getItem("token") === "null") {
            history.push({ pathname: "/" })
        } else {
            getWishlistService().then((res) => {
                setWishlistItems(res.data.wishlistItems)
                setLoadingFinished(true)
            })
        }
    }, [history])

    return (
        <div className=" pb-14 px-4 mt-16">
            {loadingFinished ? (
                <>
                    <div className="pt-5 mb-3">
                        <h1 className="text-3xl font-extrabold text-gray-900 pt-5 sm:mb-3">Wish list</h1>
                        {wishlistItems.length > 0 ? (
                            <div className="grid xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 grid-cols-2">
                                {wishlistItems.map((movie, index) => {
                                    return (
                                        <MovieCard
                                            title={movie.title ?? movie.name}
                                            voteAverage={movie.vote_average}
                                            posterPath={movie.poster_path}
                                            userRating={movie.user_rating}
                                            key={index}
                                            movieId={movie.id}
                                        />
                                    )
                                })}
                            </div>
                        ) : (
                            <p>there are no items on your wish list.</p>
                        )}
                    </div>
                </>
            ) : (
                <div className="w-full text-center pt-16">
                    <BeatLoader size={30} color={"#3830a3"} />
                </div>
            )}
        </div>
    )
}

export default Wishlist

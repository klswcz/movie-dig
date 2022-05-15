import React, { useEffect } from "react"
import { useHistory } from "react-router-dom"
import Button from "../UI/Form/Button"
import account from "../../images/account.png"
import ratingPage from "../../images/rating-page.png"
import searchBar from "../../images/search-bar.png"

function Tutorial() {
    const history = useHistory()

    useEffect(() => {}, [history])

    return (
        <div className="mt-16 grid grid-cols-1 pb-14">
            <div className="w-11/12 md:w-3/4 2xl:w-1/2 place-self-center">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 mb-5">Website tutorial</h2>
                    <div className="mb-10 border shadow-md px-3 py-5 rounded-md">
                        <p className="mb-3 font-bold">
                            1. Head to the Movie Rating page and rate film by giving them 1-5 stars.
                        </p>
                        <img
                            src={ratingPage}
                            alt="Application screenshot"
                            className="rounded-t-md ml-auto mr-auto mb-3 xl:mb-0 w-full"
                        />
                    </div>

                    <div className="mb-10 border shadow-md px-3 py-5 rounded-md">
                        <p className="mb-3 font-bold">
                            2. In order to see personalised recommendations you need to give at least 20 ratings.
                        </p>
                    </div>
                    <div className="mb-10 border shadow-md px-3 py-5 rounded-md">
                        <p className="mb-3 font-bold">3. Search for movies using search box on the navigation bar.</p>
                        <img
                            src={searchBar}
                            alt="Application screenshot"
                            className="rounded-t-md ml-auto mr-auto mb-3 xl:mb-0 w-full"
                        />
                    </div>
                    <div className="mb-10 border shadow-md px-3 py-5 rounded-md">
                        <p className="mb-3 font-bold">
                            4. Access the list of rated movies, check the wishlist or change your account settings by
                            clicking the Account button on the navigation bar.
                        </p>
                        <img
                            src={account}
                            alt="Application screenshot"
                            className="rounded-t-md ml-auto mr-auto mb-3 xl:mb-0 w-full"
                        />
                    </div>
                    <div className="mb-10 border shadow-md px-3 py-5 rounded-md">
                        <p className="font-bold">
                            5. If you are interested in seeing source code of the website, please visit my GitHub page
                            (link in the footer).
                        </p>
                    </div>
                </div>
                <div className="mt-8 space-y-6">
                    {localStorage.getItem("token") !== "null" && (
                        <div className="mt-5">
                            <Button label={"Go to Movie Rating page"} widthAuto={true} to={"/movies/rate"} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Tutorial

import React, {useEffect} from "react"
import {useHistory} from "react-router-dom"
import Button from "../UI/Form/Button"
import Input from "../UI/Form/Input"
import account from '../../images/account.png'
import ratingPage from '../../images/rating-page.png'
import searchBar from '../../images/search-bar.png'

function Tutorial() {
    const history = useHistory();

    useEffect(() => {
    }, [history]);

    return (
        <div className="mt-16 grid grid-cols-1 pb-14">
            <div className="w-11/12 md:w-3/4 2xl:w-1/3 place-self-center">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 mb-5">
                        Website tutorial
                    </h2>
                    <p className="mb-5">1. Head to the Movie Rating page and rate film by giving them 1-5 stars.</p>
                    <img src={ratingPage} className="rounded-t-md ml-auto mr-auto mb-3 xl:mb-0 w-full"/>
                    <p className="mb-5">2. In order to see personalised recommendations you need to give at least 20 ratings.</p>
                    <p className="mb-5">3. Search for movies using search box on the navigation bar.</p>
                    <img src={searchBar} className="rounded-t-md ml-auto mr-auto mb-3 xl:mb-0 w-full"/>
                    <p className="mb-5">5. Access the list of rated movies, check the wishlist or change your account settings by clicking the Account button on the navigation bar.</p>
                    <img src={account} className="rounded-t-md ml-auto mr-auto mb-3 xl:mb-0 w-full"/>
                    <p className="mb-5">6. If you are interested in seeing source code of the website, please visit my GitHub page (link in the footer).</p>
                </div>
                <div className="mt-8 space-y-6">
                    {localStorage.getItem('token') !== 'null' &&
                    <div className="mt-5">
                        <Button label={'Go to Movie Rating page'} widthAuto={true} to={'/movies/rate'}/>
                    </div>
                    }
                </div>
            </div>
        </div>


    )
}

export default Tutorial

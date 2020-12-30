import {Link} from "react-router-dom";
import dashboard from '../../images/dashboard.png';
import movieInfoPage from '../../images/movie-info-page.png';

function Home() {
    return (
        <div className="h-screen-minus-navbar pb-14">
            <div
                className="h-half-screen bg-gradient-to-br from-green-400 to-blue-500 flex flex-row flex-wrap pt-6 px-32 pb-8">
                <div className="w-1/2 flex flex-col self-center">
                    <div className="w-full mb-2">
                        <h1 className="text-white text-6xl font-light">Welcome to MovieDig</h1>
                    </div>
                    <div className="w-full">
                        <p className="text-white text-2xl font-light">Can't find anything interesting to watch today?
                            Let us know which films do you like and we'll
                            hook you up with personalised movie recommendation!</p>
                    </div>
                </div>
                <div className="w-1/2 self-end text-center">
                    <span className="text-white text-lg">
                    <Link to="/login"
                          className="font-bold">Log in</Link>
                    <span> or </span>
                    <Link to="/Register"
                          className="bg-gray-900 px-3 py-2 rounded-md">Register</Link>
                    </span>
                </div>
            </div>
            <div className="flex flex-row flex-wrap pt-12 px-20">
                <div className="w-full grid grid-cols-3">
                    <div className="max-w-lg pr-10 justify-self-end">
                        <img src={dashboard} alt="Screenshot presenting the dashboard"/>
                    </div>
                    <div className="text-xl font-light text-gray-800 text-justify">
                        Winners raffle description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
                    </div>
                </div>
            </div>
            <div className="flex flex-row flex-wrap pt-12 px-20">
                <div className="w-full grid grid-cols-3">
                    <div className="max-w-lg pr-10 justify-self-end">
                        <img src={movieInfoPage} alt="Screenshot presenting the dashboard"/>
                    </div>
                    <div className="text-xl font-light text-gray-800 text-justify">
                        Winners raffle description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
                    </div>
                </div>
            </div>
            <div className="flex flex-row flex-wrap pt-12 px-20">
                <div className="w-full grid grid-cols-3">
                    <div className="max-w-lg pr-10 justify-self-end">
                        <img src={dashboard} alt="Screenshot presenting the dashboard"/>
                    </div>
                    <div className="text-xl font-light text-gray-800 text-justify">
                        Winners raffle description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home

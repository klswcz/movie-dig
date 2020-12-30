import {Link} from "react-router-dom";

function HeroSection() {
    return (
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
                    <Link to="/register"
                          className="bg-gray-900 px-3 py-2 rounded-md">Register</Link>
                    </span>
            </div>
        </div>
    )
}

export default HeroSection;

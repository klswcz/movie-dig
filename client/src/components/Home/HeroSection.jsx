import {Link} from "react-router-dom";

function HeroSection() {
    return (
        <div
            className="md:min-h-1/2-screen bg-gradient-to-br from-green-400 to-blue-500 flex flex-row flex-wrap pt-6 px-16 md:px-32 pb-8">
            <div className="w-full grid xl:grid-cols-5 md:grid-cols-1 my-4 md:my-0">
                <div className="flex flex-col self-center col-span-2 md:col-start-2">
                    <div className="w-full mb-2">
                        <h1 className="text-white text-4xl md:text-6xl font-light mb-5 md:mb-0">Welcome to MovieDig</h1>
                    </div>
                    <div className="w-full">
                        <p className="text-white text-lg md:text-2xl font-light">Can't find anything interesting to
                            watch today?
                            Let us know which films do you like and we'll
                            provide you with personalised movie recommendation!</p>
                    </div>
                </div>
                <div className="self-end lg:text-left xl:text-right mt-5 md:mt-0 col-span-2 xl:col-span-1">
                    <span className="text-white text-lg">
                    <Link to="/login"
                          className="font-bold">Log in</Link>
                    <span> or </span>
                    <Link to="/register"
                          className="bg-gray-900 px-3 py-2 rounded-md">Register</Link>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default HeroSection;

import dashboard from "../../images/dashboard.png"
import movie from "../../images/movie.png"
import rating from "../../images/rating.png"
import recommendations from "../../images/recommendations.png"
import FeatureShowcase from "./FeatureShowcase"
import HeroSection from "./HeroSection"
import { useEffect } from "react"
import { useHistory } from "react-router-dom"

function Home() {
    const history = useHistory()

    useEffect(() => {
        if (localStorage.getItem("token") !== "null") {
            history.push({ pathname: "/dashboard" })
        }
    }, [history])

    return (
        <div className=" pb-14">
            <HeroSection />
            <div className="flex flex-row flex-wrap pt-12 px-10 xl:px-20">
                <div className="w-full grid grid-cols-1 xl:grid-cols-2 mb-12">
                    <div className="sm:mx-16">
                        <h2 className="text-2xl mt-5 font-extrabold text-gray-900 mb-1">
                            How are recommendations generated?
                        </h2>
                        <p className="text-justify">
                            I have built MovieDig with the implementation of the Collaborative Filtering recommendation
                            system. What it means is that the algorithm will use your movie ratings to match your
                            profile with users who have a taste in movies similar to yours. As a result, you will be
                            presented with productions that others have enjoyed, and I believe you will like them too.
                        </p>
                    </div>
                    <div className="sm:mx-16">
                        <h2 className="text-2xl mt-5 font-extrabold text-gray-900 mb-1">Privacy</h2>
                        <p className="text-justify">
                            The only data that MovieDig collects about the user are ratings and movies added to
                            wishlists. There are no ads or tracking tools. You have complete control over your
                            information and can completely delete your profile with all the stored activity immediately
                            at any time.
                        </p>
                    </div>
                </div>
                <div className="w-full grid-cols-1 sm:mx-16">
                    <h2 className="text-2xl mt-5 font-extrabold text-gray-900 mb-1">Features showcase</h2>
                </div>
                <div className="w-full grid xl:grid-cols-4 md:grid-cols-2">
                    <FeatureShowcase
                        image={recommendations}
                        description={
                            "Never trouble with picking the movie again. Let us help you with that and get accurate recommendations, based on your account's history, delivered to you by our custom-built recommender script."
                        }
                    />
                    <FeatureShowcase
                        image={movie}
                        description={
                            "Get information about all of the popular movies thanks to the integration with TMDb movie database. Check the description, cast, look up average user rating and see what other movies people who liked this film enjoyed too."
                        }
                    />
                    <FeatureShowcase
                        image={rating}
                        description={
                            "Rate movies you've seen and add those you are interested in to a wish list for better organisation."
                        }
                    />
                    <FeatureShowcase
                        image={dashboard}
                        description={
                            "Enjoy using our modern and responsive website. Access it on a go with the mobile version of the application."
                        }
                    />
                </div>
            </div>
        </div>
    )
}

export default Home

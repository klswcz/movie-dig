import dashboard from '../../images/dashboard.png';
import movieInfoPage from '../../images/movie-info-page.png';
import FeatureShowcase from "./FeatureShowcase";
import HeroSection from './HeroSection';
import {useEffect} from "react";
import {useHistory} from "react-router-dom";

function Home() {
    const history = useHistory();

    useEffect(() => {
        if (localStorage.getItem('token') !== 'null') {
            history.push({pathname: "/dashboard",});
        }
    }, []);

    return (
        <div className="h-screen-minus-navbar pb-14">
            <HeroSection/>
            <FeatureShowcase image={movieInfoPage}
                             description={"Winners raffle description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}/>
            <FeatureShowcase image={dashboard}
                             description={"Winners raffle description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}/>
            <FeatureShowcase image={movieInfoPage}
                             description={"Winners raffle description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}/>
        </div>
    )
}

export default Home

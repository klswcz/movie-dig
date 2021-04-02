import {useEffect} from 'react'
import Navbar from "../Navbar"
import Footer from "../Footer"
import {Route, Switch, useHistory, useLocation, withRouter} from "react-router-dom"
import Home from "../Home"
import Login from "../Login"
import Register from "../Register"
import Dashboard from "../Dashboard"
import Movie from "../Movie"
import Alert from "../UI/Alert"
import Account from '../Account'
import Wishlist from '../Wishlist'
import BatchMovieRating from '../BatchMovieRating'
import store from '../../store/reducer'
import {useSelector} from "react-redux"
import FlashMessage from "../UI/FlashMessage"

function Layout() {
    const location = useLocation();
    const alert = useSelector(state => state.alert)
    const flashMessage = useSelector(state => state.flashMessage)
    const history = useHistory()

    useEffect(() => {
        return history.listen((location) => {
            store.dispatch({type: 'HIDE_ALERT'});
            store.dispatch({type: 'HIDE_FLASH_MESSAGE'});
        })
    }, [history])

    return (
        <div id="app" className="relative h-screen-minus-navbar">
            <div id="content-wrap" className="pb-14">
                {location.pathname !== '/' &&
                <Navbar/>
                }
                {alert.isVisible &&
                <Alert/>
                }
                {flashMessage.isVisible &&
                <FlashMessage/>
                }
                <Switch>
                    <Route path="/login" exact component={Login}/>
                    <Route path="/register" exact component={Register}/>
                    <Route path="/dashboard" exact component={Dashboard}/>
                    <Route path="/movie" component={Movie}/>
                    <Route path="/account" component={Account}/>
                    <Route path="/wishlist" component={Wishlist}/>
                    <Route path="/movies/rating/batch" component={BatchMovieRating}/>
                    <Route path="/" component={Home}/>
                </Switch>
            </div>
            <Footer/>
        </div>
    )
}


export default withRouter(Layout)

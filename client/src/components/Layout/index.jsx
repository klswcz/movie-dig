import {useEffect} from 'react'
import Navbar from "../Navbar";
import Footer from "../Footer";
import {Route, Switch, useHistory, useLocation, withRouter} from "react-router-dom";
import Home from "../Home";
import Login from "../Login";
import Register from "../Register";
import Dashboard from "../Dashboard";
import Movie from "../Movie";
import Alert from "../UI/Alert";
import store from '../../store/reducer'
import {useSelector} from "react-redux";

function Layout() {
    const location = useLocation();
    const alert = useSelector(state => state.alert)
    const history = useHistory()

    useEffect(() => {
        return history.listen((location) => {
            store.dispatch({type: 'HIDE_ALERT'});
        })
    }, [history])

    return (
        <div id="app">
            {location.pathname !== '/' &&
            <Navbar/>
            }
            {alert.isVisible &&
            <Alert/>
            }
            <Switch>
                <Route path="/login" exact component={Login}/>
                <Route path="/register" exact component={Register}/>
                <Route path="/dashboard" exact component={Dashboard}/>
                <Route path="/movie" component={Movie}/>
                <Route path="/" component={Home}/>
            </Switch>
            <Footer/>
        </div>
    )
}


export default withRouter(Layout)

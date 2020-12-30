import Navbar from "../Navbar";
import Footer from "../Footer";
import {Route, Switch, useLocation, withRouter} from "react-router-dom";
import Home from "../Home";
import Login from "../Login";
import Register from "../Register";
import Dashboard from "../Dashboard";
import Alert from "../UI/Alert";
import {useSelector} from "react-redux";

function Layout() {
    const location = useLocation();
    const alert = useSelector(state => state.alert)

    return (
        <div id="app">
            {location.pathname !== '/' &&
            <Navbar/>
            }
            {alert.isVisible &&
            <Alert />
            }
            <Switch>
                <Route path="/login">
                    <Login/>
                </Route>
                <Route path="/register">
                    <Register/>
                </Route>
                <Route path="/dashboard">
                    <Dashboard/>
                </Route>
                <Route path="/">
                    <Home/>
                </Route>
            </Switch>
            <Footer/>
        </div>
    )
}


export default withRouter(Layout)

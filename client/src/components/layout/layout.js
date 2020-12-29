import Navbar from "../navbar/navbar";
import Footer from "../footer/footer";
import {Route, Switch, useLocation, withRouter} from "react-router-dom";
import Home from "../home/home";
import Login from "../login/login";
import Register from "../register/Register";
import Dashboard from "../dashboard/dashboard";

function Layout() {
    const location = useLocation();

    return (
        <div id="app">
            {location.pathname !== '/' &&
            <Navbar/>
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

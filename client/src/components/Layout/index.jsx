import Navbar from "../Navbar";
import Footer from "../Footer";
import {Redirect, Route, Switch, useLocation, withRouter} from "react-router-dom";
import Home from "../Home";
import Login from "../Login";
import Register from "../Register";
import Dashboard from "../Dashboard";
import Alert from "../UI/Alert";
import {useSelector} from "react-redux";

function Layout() {
    const location = useLocation();
    const alert = useSelector(state => state.alert)

    function PrivateRoute({children, ...rest}) {
        return (
            <Route
                {...rest}
                render={({location}) =>
                    localStorage.getItem('token') !== 'null' ? (
                        children
                    ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                            }}
                        />
                    )
                }
            />
        );
    }

    return (
        <div id="app">
            {location.pathname !== '/' &&
            <Navbar/>
            }
            {alert.isVisible &&
            <Alert/>
            }
            <Switch>
                <Route path="/login">
                    <Login/>
                </Route>
                <Route path="/register">
                    <Register/>
                </Route>
                <PrivateRoute path="/dashboard">
                    <Dashboard/>
                </PrivateRoute>
                <Route path="/">
                    <Home/>
                </Route>
            </Switch>
            <Footer/>
        </div>
    )
}


export default withRouter(Layout)

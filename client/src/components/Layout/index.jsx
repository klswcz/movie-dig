import Navbar from "../Navbar";
import Footer from "../Footer";
import {Redirect, Route, Switch, useLocation, withRouter} from "react-router-dom";
import Home from "../Home";
import Login from "../Login";
import Register from "../Register";
import Dashboard from "../Dashboard";
import Movie from "../Movie";
import Alert from "../UI/Alert";
import {useSelector} from "react-redux";

function Layout() {
    const location = useLocation();
    const alert = useSelector(state => state.alert)

    function PrivateRoute({children, ...rest}) {
        return (
            <Route
                {...rest}
                component={({location}) =>
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

    function PublicRoute({children, ...rest}) {
        return (
            <Route
                {...rest}
                component={({location}) =>
                    localStorage.getItem('token') === 'null' ? (
                        children
                    ) : (
                        <Redirect
                            to={{
                                pathname: "/dashboard",
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
                <PublicRoute path="/login">
                    <Login/>
                </PublicRoute>
                <PublicRoute path="/register">
                    <Register/>
                </PublicRoute>
                <PrivateRoute path="/dashboard">
                    <Dashboard/>
                </PrivateRoute>
                <PrivateRoute path="/movie">
                    <Movie/>
                </PrivateRoute>
                <PublicRoute path="/">
                    <Home/>
                </PublicRoute>
            </Switch>
            <Footer/>
        </div>
    )
}


export default withRouter(Layout)

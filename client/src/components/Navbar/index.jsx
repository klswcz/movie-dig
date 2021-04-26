import {Link, useHistory, useLocation} from "react-router-dom";
import React, {useEffect, useState} from 'react';
import {search as searchMovieService} from "../../services/MovieServices";

function Navbar() {
    let history = useHistory()
    const location = useLocation();
    const [searchResults, setSearchResults] = useState([])
    const [accountDropdownVisible, setAccountDropdownVisible] = useState(false)

    useEffect(() => {
        return history.listen((location) => {
            setSearchResults([])
            setAccountDropdownVisible(false)
            if (document.getElementById('movie_search')) {
                document.getElementById('movie_search').value = '';
            }
        })
    }, [history])

    const logout = () => {
        localStorage.setItem('token', null)
        history.push('/')
    }

    const movieSearch = (query) => {
        if (query.length > 0) {
            searchMovieService({query: query}).then(res => {
                setSearchResults(res.data.results)
            })
        } else {
            setSearchResults([])
        }
    }

    const hideSearchResults = () => {
        setTimeout(() => {
            setSearchResults([])
        }, 100)
    }

    const toggleAccountDropdown = () => {
        setAccountDropdownVisible(!accountDropdownVisible)
    }

    useEffect(() => {
        let menuToggle = document.getElementById('menu-toggle');
        let mobileMenu = document.getElementById('mobile-menu');

        menuToggle.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });

        history.listen((location) => {
            mobileMenu.classList.add('hidden');
        })
    }, [history]);

    return (
        <nav className="bg-gray-800 fixed w-full z-40 top-0">
            <div className="mx-auto md:px-4 sm:pr-6 lg:pr-8">
                <div className="flex items-center h-16">
                    <div className="flex items-start lg:items-center w-full">
                        <Link to={localStorage.getItem('token') === 'null' ? '/' : '/dashboard'}
                              className="hover:bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">MovieDig</Link>
                        {location.pathname !== '/' && (location.pathname !== '/tutorial' || localStorage.getItem('token') !== "null") && location.pathname !== '/login' && location.pathname !== '/register' ?
                            <div className="w-full">
                                <div
                                    className="w-1/2 md:w-2/3 lg:w-1/3 2xl:1/2 absolute left-0 right-0 ml-auto mr-auto">

                                    <input id="movie_search" name="movie_search" type="text"
                                           autoComplete="off"
                                           onChange={event => movieSearch(event.target.value)}
                                           onFocus={event => movieSearch(event.target.value)}
                                           onBlur={() => hideSearchResults()}
                                           className="appearance-none relative block w-full py-2 px-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-sm rounded-md"
                                           placeholder="Search movies by title..."/>
                                    {searchResults.length > 0 &&
                                    <div
                                        className="fixed left-0 w-screen md:w-full md:relative bg-white border border-gray-300 rounded-md shadow-2xl">
                                        {searchResults.map((movie, index) => {
                                            return (
                                                <Link to={{pathname: `/movies/${movie.id}`}}
                                                      className="py-2 px-3 block hover:bg-indigo-500 hover:text-white border-b truncate"
                                                      key={index}>
                                                    {movie.poster_path ?
                                                        <img src={'https://image.tmdb.org/t/p/w45' + movie.poster_path}
                                                             alt=""
                                                             className="rounded-md align-top sm:align-middle inline-block mr-3"/>
                                                        :
                                                        <img
                                                            src={'https://dummyimage.com/45x68/cccccc/ffffff&text=No+poster'}
                                                            alt=""
                                                            className="rounded-md align-top sm:align-middle inline-block mr-3"/>
                                                    }
                                                    {movie.title}
                                                </Link>
                                            )
                                        })}
                                    </div>
                                    }
                                </div>
                                <div className="hidden lg:block">
                                    <div className="ml-10 flex items-baseline">

                                        <Link to="/recommendations/more"
                                              className="hover:bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium ml-auto">Recommendations</Link>
                                        <Link to="/movies/rate"
                                              className="hover:bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">Rate movies</Link>
                                        <button type="button"
                                                className="hover:bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium"
                                                onClick={toggleAccountDropdown}
                                                onBlur={() => setTimeout(() => setAccountDropdownVisible(false), 100)}>
                                            Account
                                        </button>
                                        {accountDropdownVisible &&
                                        <div className="absolute top-full right-3 w-auto bg-gray-800 rounded-b-md">
                                            <ul className="px-2">
                                                <li className="px-3 py-2">
                                                    <Link to="/account/ratings"
                                                          className="hover:bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium ml-auto">Rated movies</Link>
                                                </li>
                                                <li className="px-3 py-2">
                                                    <Link to="/account/settings"
                                                          className="hover:bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium ml-auto">Settings</Link>
                                                </li>
                                                <li className="px-3 py-2">
                                                    <Link to="/account/wishlist"
                                                          className="hover:bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">Wish
                                                        list</Link>
                                                </li>
                                                <li className="px-3 py-2">
                                                    <button onClick={logout}
                                                            className="hover:bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">Log
                                                        out
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="hidden lg:block w-full">
                                <div className="ml-10 flex items-baseline">
                                    <Link to="/login"
                                          className="hover:bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium ml-auto">Log
                                        in</Link>
                                    <Link to="/register"
                                          className="hover:bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">Register</Link>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="mr-2 flex lg:hidden">
                        <button
                            className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 focus:outline-none"
                            aria-controls="mobile-menu" aria-expanded="false" id="menu-toggle">
                            <span className="sr-only">Open main menu</span>
                            <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                            <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="lg:hidden hidden px-2 pt-2 pb-3 space-y-1" id="mobile-menu">
                {location.pathname !== '/' && location.pathname !== '/tutorial' && location.pathname !== '/login' && location.pathname !== '/register' ?
                    <div>
                        <Link to="/dashboard"
                              className="block text-white px-3 py-3 rounded-md text-sm font-medium">Dashboard</Link>
                        <Link to="/recommendations/more"
                              className="block text-white px-3 py-3 rounded-md text-sm font-medium">Recommendations</Link>
                        <Link to="/movies/rate"
                              className="block text-white px-3 py-3 rounded-md text-sm font-medium">Rate movies</Link>
                        <Link to="/account/settings"
                              className="block text-white px-3 py-3 rounded-md text-sm font-medium">Settings</Link>
                        <Link to="/account/ratings"
                              className="block text-white px-3 py-3 rounded-md text-sm font-medium">Rated movies</Link>
                        <Link to="/account/wishlist"
                              className="block text-white px-3 pt-3 pb-4 rounded-md text-sm font-medium">Wish list</Link>
                        <hr/>
                        <button onClick={logout}
                                className="block text-white px-3 pt-4 rounded-md text-sm font-medium">Log out
                        </button>
                    </div>
                    :
                    <div>
                        <Link to="/login"
                              className="block text-white px-3 py-2 rounded-md text-sm font-medium">Log in</Link>
                        <Link to="/register"
                              className="block text-white px-3 py-2 rounded-md text-sm font-medium">Register</Link>
                    </div>
                }
            </div>
        </nav>
    )
}

export default Navbar;

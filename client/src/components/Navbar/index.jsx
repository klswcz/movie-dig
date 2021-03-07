import {Link, useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useEffect} from 'react';

function Navbar() {
    let dispatch = useDispatch()
    let history = useHistory()

    const logout = () => {
        dispatch({type: 'LOGOUT'})
        localStorage.setItem('token', null)
        history.push('/')
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
            <div className=" mx-auto px-4 sm:pr-6 lg:pr-8">
                <div className="flex items-center h-16">
                    <div className="flex items-center w-full">
                        <div className="flex-shrink-0">
                            <Link to="/" className="text-white">MovieDig</Link>
                        </div>
                        <div className="hidden sm:block w-full">
                            {localStorage.getItem('token') !== "null" &&
                            <div className="ml-10 flex items-baseline">
                                <Link to="/dashboard"
                                      className="hover:bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                                <Link to="/account"
                                      className="hover:bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium ml-auto">Settings</Link>
                                <Link to="/wishlist"
                                      className="hover:bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">Wish list</Link>
                                <button onClick={logout}
                                        className="hover:bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">Log out
                                </button>
                            </div>
                            }
                        </div>
                    </div>
                    <div className="mr-2 flex sm:hidden">
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

            <div className="sm:hidden hidden px-2 pt-2 pb-3 space-y-1" id="mobile-menu">
                {localStorage.getItem('token') !== "null" &&
                <div>
                    <Link to="/dashboard"
                          className="block text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                    <Link to="/account"
                          className="block text-white px-3 py-2 rounded-md text-sm font-medium">Settings</Link>
                    <Link to="/wishlist"
                          className="block text-white px-3 py-2 rounded-md text-sm font-medium">Wish list</Link>
                    <hr/>
                    <button onClick={logout}
                            className="block text-white px-3 py-2 rounded-md text-sm font-medium">Log out
                    </button>
                </div>
                }
            </div>
        </nav>
    )
}

export default Navbar;

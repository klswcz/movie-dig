import {Link, useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";

function Navbar() {
    let dispatch = useDispatch()
    let history = useHistory()

    const logout = () => {
        dispatch({type: 'LOGOUT'})
        localStorage.setItem('token', null)
        history.push('/')
    }

    return (
        <nav className="bg-gray-800">
            <div className=" mx-auto px-4 sm:pr-6 lg:pr-8">
                <div className="flex items-center h-16">
                    <div className="flex items-center w-full">
                        <div className="flex-shrink-0">
                            <Link to="/" className="text-white">MovieDig</Link>
                        </div>
                        <div className="hidden md:block w-full">
                            {localStorage.getItem('token') !== "null" &&
                            <div className="ml-10 flex items-baseline">
                                <Link to="/dashboard"
                                      className="hover:bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                                <Link to="/account"
                                      className="hover:bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium ml-auto">Settings</Link>
                                <button onClick={logout}
                                        className="hover:bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">Log out
                                </button>
                            </div>
                            }
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
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
        </nav>
    )
}

export default Navbar;

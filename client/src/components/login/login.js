import React from 'react';
import {login as loginService} from '../../services/AuthServices'
import { useHistory } from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";

function Login() {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    let history = useHistory();
    let dispatch = useDispatch();

    const login = () => {
        const emailField = document.getElementById('email');
        const passwordField = document.getElementById('password');

        if (emailField.checkValidity() && passwordField.checkValidity())
            loginService({
                email: email,
                password: password
            }).then(res => {
                dispatch({type: "SET_TOKEN", payload: res.data.token})
                history.push('/dashboard')
            }).catch(res => {
                dispatch({type: "SHOW_ALERT", payload: res.response.data.messageBag})
            })
    };

    return (
        <div className="h-screen-minus-navbar pb-14 grid grid-cols-1">
            <div className="max-w-lg place-self-center">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" action="" method="POST" onSubmit={e => e.preventDefault()}>
                    <input type="hidden" name="remember" value="true"/>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input id="email" name="email" value={email} onChange={event => {
                                setEmail(event.target.value)
                            }} type="email" autoComplete="email" required
    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
    placeholder="Email address"/>
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input id="password" name="password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)}
    required
    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
    placeholder="Password"/>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input id="remember_me" name="remember_me" type="checkbox"
                                   className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                            </input>
                            <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="/reset-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button type="submit" onClick={login}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <span className="absolute left-0 inset-y-0 flex items-center pl-3">
          </span>
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login

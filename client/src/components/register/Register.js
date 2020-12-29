import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import {register as registerService} from '../../services/AuthServices'
import { useHistory } from "react-router-dom";
import Alert from '../UI/alert'
function Register() {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const dispatch = useDispatch();
    let history = useHistory();

    const register = () => {
        const emailField = document.getElementById('email');
        const passwordField = document.getElementById('password');
        const confirmPasswordField = document.getElementById('confirmPassword');
        if (
            passwordField.value === confirmPasswordField.value
            && emailField.checkValidity()
            && passwordField.checkValidity()
        ) {
            confirmPasswordField.setCustomValidity('');
            registerService({
                email: email,
                password: password
            }).then(res => {
                dispatch({type: "SHOW_ALERT", payload: [{msg: 'Sign in to your new account.'}]})
                history.push('/login')
            }).catch(res => {
                dispatch({type: "SHOW_ALERT", payload: res.response.data.messageBag})
            })
        } else {
            confirmPasswordField.setCustomValidity('Password must be matching.');
        }
    };

    return (
        <div className="h-screen-minus-navbar pb-14 grid grid-cols-1">
            <div className="max-w-lg place-self-center">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create a new account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" action="" method="POST" onSubmit={e => e.preventDefault()}>
                    <input type="hidden" name="remember" value="true"/>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input value={email} onChange={event => {
                                setEmail(event.target.value)
                            }} id="email" name="email" type="email" autoComplete="email" required
                                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                   placeholder="Email address"/>
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input value={password} onChange={event => {
                                setPassword(event.target.value)
                            }} id="password" name="password" type="password" autoComplete="current-password"
                                   required
                                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                   placeholder="Password"/>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">Confirm password</label>
                            <input value={confirmPassword} onChange={event => {
                                setConfirmPassword(event.target.value)
                            }} id="confirmPassword" name="confirmPassword" type="password"
                                   autoComplete="current-confirm-password"
                                   required
                                   className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                   placeholder="Confirm password"/>
                        </div>
                    </div>
                    <div>
                        <button type="submit" onClick={register}
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <span className="absolute left-0 inset-y-0 flex items-center pl-3">
          </span>
                            Sign up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register;

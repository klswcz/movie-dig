import React, {useEffect, useState} from 'react';
import {login as loginService} from '../../services/AuthServices'
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import Input from "../UI/Form/Input";
import Button from "../UI/Form/Button";

function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    let history = useHistory();
    let dispatch = useDispatch();

    useEffect(() => {
        if (localStorage.getItem('token') !== 'null') {
            history.push({pathname: "/dashboard",});
        }
    }, []);

    const login = () => {
        const emailField = document.getElementById('email');
        const passwordField = document.getElementById('password');

        if (emailField.checkValidity() && passwordField.checkValidity()) {
            loginService({
                email: email,
                password: password
            }).then(res => {
                localStorage.setItem('token', res.data.token)
                history.push('/dashboard')
            }).catch(res => {
                dispatch({type: "SHOW_ALERT", payload: res.response.data.messageBag})
            })
        }
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
                    <div className="rounded-md shadow-sm -space-y-px">
                        <Input name={'email'} type={'email'} value={email} placeholder={'Email address'}
                               required={true} onChange={event => setEmail(event.target.value)}/>
                        <Input name={'password'} type={'password'} value={password} placeholder={'Password'}
                               required={true} onChange={event => setPassword(event.target.value)}/>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <a href="/reset-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <Button onClick={login} label={'Sign in'}/>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login

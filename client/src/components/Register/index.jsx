import React, {useEffect} from 'react';
import {useDispatch} from "react-redux";
import {register as registerService} from '../../services/AuthServices'
import {useHistory} from "react-router-dom";
import Input from "../UI/Form/Input";
import Button from "../UI/Form/Button";

function Register() {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const dispatch = useDispatch();
    let history = useHistory();

    useEffect(() => {
        if (localStorage.getItem('token') !== 'null') {
            history.push({pathname: "/dashboard",});
        }
    }, [history]);

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
                        <Input name={'email'} type={'email'} value={email} placeholder={'Email address'}
                               required={true} onChange={event => setEmail(event.target.value)}/>
                        <Input name={'password'} type={'password'} value={password} placeholder={'Password'}
                               required={true} onChange={event => setPassword(event.target.value)}/>
                        <Input name={'confirmPassword'} type={'password'} value={confirmPassword} placeholder={'Confirm password'}
                               required={true} onChange={event => setConfirmPassword(event.target.value)}/>
                    </div>
                    <div>
                        <Button onClick={register} label={'Sign up'} />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register;

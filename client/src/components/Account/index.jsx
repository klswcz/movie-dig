import React, {useEffect} from 'react';
import {useHistory} from "react-router-dom";
import Button from "../UI/Form/Button";
import {get as getAccountService} from "../../services/AccountServices";

function Account(props) {
    let history = useHistory();
    let account = {
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    }

    useEffect(() => {
        if (localStorage.getItem('token') === 'null') {
            history.push({pathname: "/login",});
        } else {
            getAccountService().then(res => {
                this.account = {
                    email: res.data.email,
                    password: '',
                    first_name: '',
                    last_name: ''
                }
                console.log(res.data);
            })
        }
    }, [history]);

    const update = () => {
        const emailField = document.getElementById('email');
        const passwordField = document.getElementById('password');
    }

    return (
        <div className="h-screen-minus-navbar pb-14 grid grid-cols-1">
            <form className="mt-8 space-y-6" action="" method="POST" onSubmit={e => e.preventDefault()}>
                <Button onClick={update} label={'Update'}/>
            </form>
        </div>
    )
}

export default Account

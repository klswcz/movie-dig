import React, { useEffect } from "react"
import { register as registerService } from "../../services/AuthServices"
import { useHistory } from "react-router-dom"
import Input from "../UI/Form/Input"
import Button from "../UI/Form/Button"

function Register() {
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [firstName, setFirstName] = React.useState("")
    const [lastName, setLastName] = React.useState("")
    const history = useHistory()

    useEffect(() => {
        if (localStorage.getItem("token") !== "null") {
            history.push({ pathname: "/dashboard" })
        }
    }, [history])

    const register = () => {
        const passwordField = document.getElementById("password")
        const confirmPasswordField = document.getElementById("confirm_password")
        if (passwordField.value === confirmPasswordField.value && passwordField.value !== "") {
            confirmPasswordField.setCustomValidity("")
            registerService({
                email: email,
                first_name: firstName,
                last_name: lastName,
                password: password
            }).then(() => {
                setEmail("")
                setFirstName("")
                setLastName("")
                setPassword("")
                setConfirmPassword("")
            })
        } else {
            confirmPasswordField.setCustomValidity("Password must be matching.")
        }
    }

    return (
        <div className="pb-14 mt-16 grid grid-cols-1">
            <div className="w-11/12 sm:w-96 place-self-center">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create a new account</h2>
                </div>
                <form className="mt-8 space-y-6" action="" method="POST" onSubmit={(e) => e.preventDefault()}>
                    <input type="hidden" name="remember" value="true" />
                    <Input
                        name={"email"}
                        type={"email"}
                        value={email}
                        required={true}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <Input
                        name={"first_name"}
                        type={"text"}
                        value={firstName}
                        required={true}
                        onChange={(event) => setFirstName(event.target.value)}
                    />
                    <Input
                        name={"last_name"}
                        type={"text"}
                        value={lastName}
                        required={true}
                        onChange={(event) => setLastName(event.target.value)}
                    />
                    <Input
                        name={"password"}
                        type={"password"}
                        value={password}
                        required={true}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <Input
                        name={"confirm_password"}
                        type={"password"}
                        value={confirmPassword}
                        required={true}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                    />
                    <Button onClick={register} label={"Sign up"} />
                </form>
            </div>
        </div>
    )
}

export default Register

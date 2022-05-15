import React from "react"
import { Link } from "react-router-dom"

function Button(props) {
    const button = (
        <button
            type={props.to ? "button" : "submit"}
            onClick={props.onClick}
            className={`${props.customClass} ${
                props.widthAuto ? "w-auto" : "w-full"
            } group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                props.customColor ? props.customColor : "bg-indigo-600 hover:bg-indigo-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3"></span>
            {props.label}
        </button>
    )

    return props.to ? <Link to={props.to}>{button}</Link> : button
}

export default Button

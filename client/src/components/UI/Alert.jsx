import React from 'react';
import {useDispatch, useSelector} from "react-redux";

function Alert() {
    const dispatch = useDispatch();
    const alert = useSelector(state => state.alert)

    const hideAlert = () => {
        dispatch({type: 'HIDE_ALERT'})
    }

    return (
        <div
            className="py-1 px-5 bg-indigo-600 left-2 right-2 text-sm rounded-md fixed mr-auto ml-auto top-1 text-center md:w-1/2 mt-2 z-50">
            <div className="flex items-center justify-between flex-wrap">
                <div className="w-0 flex-1 flex items-center flex-col">
                    {alert.messageBag.map((message, index) => {
                        return (
                            <p key={index} className="ml-3 font-medium text-left text-white py-2 w-full">
                                {message.msg}
                            </p>
                        )
                    })}
                </div>
                <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
                    <button type="button" onClick={hideAlert}
                            className="text-white mr-1 ml-1 flex p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white sm:-mr-2">
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Alert;

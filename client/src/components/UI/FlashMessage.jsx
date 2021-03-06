import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";

function FlashMessage() {
    const dispatch = useDispatch();
    const flashMessage = useSelector(state => state.flashMessage)

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch({type: 'HIDE_FLASH_MESSAGE'})
        }, 3000)

        return () => clearTimeout(timer)
    }, [flashMessage, dispatch])

    return (
        <div
            className="py-3 px-5 bg-indigo-600 text-blue-900 text-sm rounded-md fixed mr-auto ml-auto text-center left-0 right-0 top-2 w-max z-50"
            role="alert">
            <p className="font-medium text-white truncate w-full">
                {flashMessage.messageBag.map((message, index) => {
                    return (
                        <span key={index}>
                            {message.msg}
                        </span>
                    )
                })}
            </p>
        </div>
    )
}

export default FlashMessage;

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
            className="py-1 px-5 bg-indigo-600 left-2 right-2 text-sm rounded-md fixed mr-auto ml-auto top-1 text-center md:w-1/2 mt-2 z-50"
            role="alert">
            {flashMessage.messageBag.map((message, index) => {
                return (
                    <p key={index} className="mx-3 font-medium text-left text-white py-2 w-full ">
                        {message.msg}
                    </p>
                )
            })}
        </div>
    )
}

export default FlashMessage;

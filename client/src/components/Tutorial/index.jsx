
import {useEffect} from "react";
import {useHistory} from "react-router-dom";
import Button from "../UI/Form/Button";

function Tutorial() {
    const history = useHistory();

    useEffect(() => {
    }, [history]);

    return (
        <div className="pb-14 px-4 mt-16">
            <div className="pt-5 mb-3">
                <h1 className="text-3xl font-extrabold text-gray-900">Tutorial page</h1>
            </div>
            { localStorage.getItem('token') !== 'null' &&
                <div className="mt-5">
                    <Button label={'Go to Movie Rating form'} widthAuto={true} to={'/movies/rate'}/>
                </div>

            }
        </div>
    )
}

export default Tutorial

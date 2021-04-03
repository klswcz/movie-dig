
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
                <h1 className="text-4xl">Tutorial page</h1>
            </div>
            <div className="mt-5">
                <Button label={'Go to Movie Rating form'} widthAuto={true} to={'/movies/rating/batch'}/>
            </div>
        </div>
    )
}

export default Tutorial

import {account as accountService} from "../../services/AuthServices";
import {useDispatch} from "react-redux";

function Dashboard() {
    let dispatch = useDispatch();

    const getAccountData = () => {
        accountService().then(res => {
            console.log(res.data);
        }).catch(res => {
            dispatch({type: "SHOW_ALERT", payload: res.response.data.messageBag})
        })
    };

    return (
        <div className="h-screen-minus-navbar pb-14">
            <h1>Dashboard</h1>
            <p className="pt-3">Hello, <span className="italic">username</span></p>
            <button onClick={getAccountData}>get account info</button>
        </div>
    )
}

export default Dashboard;

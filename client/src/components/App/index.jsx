import Layout from "../Layout";
import {BrowserRouter as Router} from "react-router-dom";
import ScrollToTop from "./scrollToTop";

function App() {
    return (
        <Router>
            <ScrollToTop>
                <Layout/>
            </ScrollToTop>
        </Router>
    );
}

export default App;

import ScrollMenu from "react-horizontal-scrolling-menu";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";

function HorizontalScroll(props) {
    return (
        <ScrollMenu
            arrowLeft={<FontAwesomeIcon icon={faChevronLeft}/>}
            arrowRight={<FontAwesomeIcon icon={faChevronRight}/>}
            arrowClass={'px-5 h-72 flex bg-indigo-100 hover:bg-indigo-600 text-indigo-600 hover:text-indigo-50 duration-500 cursor-pointer flex items-center'}
            wheel={false}
            dragging={false}
            clickWhenDrag={false}
            transition={0.3}
            translate={-1}
            data={props.children}
        />
    )
}

export default HorizontalScroll
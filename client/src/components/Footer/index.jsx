import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithub, faLinkedin} from "@fortawesome/free-brands-svg-icons";
import {faEnvelopeOpenText} from "@fortawesome/free-solid-svg-icons";

function Footer() {
    return (
        <div id="footer" className="w-full h-14 bg-blue-500 text-center text-white pt-3 absolute bottom-0">
            <p>Damian Klisiewicz / 2021 /
                <a  className="ml-2" href="https://github.com/klswcz" target="_blank"><FontAwesomeIcon icon={faGithub}/></a>
                <a  className="ml-2" href="https://www.linkedin.com/in/damian-klisiewicz/" target="_blank"><FontAwesomeIcon
                    icon={faLinkedin}/></a>
                <a  className="ml-2" href="mailto:damianklisiewicz@gmail.com"><FontAwesomeIcon icon={faEnvelopeOpenText}/></a>
            </p>
        </div>
    )
}

export default Footer

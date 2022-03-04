import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithub, faLinkedin} from "@fortawesome/free-brands-svg-icons";

function Footer() {
    return (
        <div id="footer" className="w-full h-14 bg-blue-600 text-center text-white pt-3 absolute bottom-0">
            <p>Damian Klisiewicz |
                <a className="ml-2" href="https://klswcz.dev" rel="noopener">klswcz.dev </a>
                |
                <a className="ml-2" href="https://github.com/klswcz" rel="noopener"><FontAwesomeIcon
                    icon={faGithub}/> GitHub </a>
                |
                <a className="ml-2" href="https://www.linkedin.com/in/damian-klisiewicz/"
                   rel="noopener"><FontAwesomeIcon
                    icon={faLinkedin}/> LinkedIn </a>
                | 2022
            </p>
        </div>
    )
}

export default Footer

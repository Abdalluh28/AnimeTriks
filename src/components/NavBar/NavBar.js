import { Link } from 'react-router-dom'
import './NavBar.css'
import Example from './Modal'


export function NavBar() {


   


    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
            <div className="container">
                <Link to="/" className="main-logo">AnimeTrix</Link>
                <div className="" id="collapsibleNavId">
                    <div className="d-flex ms-auto my-2 my-lg-0 form">
                        <div>
                            <Example />
                        </div>
                    </div>
                </div>
            </div>
            
        </nav>


    )
}
import { Link } from "react-router-dom";
import './SideBar.css'
import { BottomNav } from "./BottomNav";

export function SideBar() {
    
    return (
        <>
        <div className=" d-none d-md-flex flex-column SideBar ">
            <Link className="firstChild" to=''>
                <i className="fa-solid fa-house"></i>
                <span className="d-none d-lg-block" >Home</span>
            </Link>
            <Link  to='/Popular' id="popular">
                <i className="fa-solid fa-arrow-trend-up"></i>
                <span className="d-none d-lg-block" >Popular</span>
            </Link>
            <Link  to='/Popular/Manga' id="manga">
                <i className="fa-solid fa-book-open"></i>
                <span className="d-none d-lg-block" >Manga</span>
            </Link>
            <Link to='/genres'>
                <i className="fa-solid fa-list"></i>
                <span className="d-none d-lg-block" >Geners</span>
            </Link>
            
        </div>
        <BottomNav />
        </>
    )
}
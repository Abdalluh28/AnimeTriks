import { Link } from 'react-router-dom'
import './BottomNav.css'
import { useState } from 'react';

export function BottomNav() {

    let [showElement, setShowElement ] = useState(false);

    let showOrHide = () => {
        let less = document.querySelector("#less").innerHTML;
        if(less === "Show More") {
            document.querySelector("#less").innerHTML = "Show Less"
            setShowElement(true)
        }
        else {
            document.querySelector("#less").innerHTML = "Show More"
            setShowElement(false)
        }
    }
    let elementOne = 
    <div className='fixed-bottom d-flex justify-content-around flex-wrap '>
        <Link className="firstChild link" to=''>
            <i className="fa-solid fa-house"></i>
            <span>Home</span>
        </Link>
        <Link className="link" to='/Popular'>
            <i className="fa-solid fa-arrow-trend-up"></i>
            <span>Popular</span>
        </Link>
        <Link className={showElement ? "link d-flex": "d-none"} to='/Popular/Manga'>
            <i className="fa-solid fa-book-open"></i>
            <span>Manga</span>
        </Link>
        <Link className={showElement ? "link d-flex": "d-none"} to='/Genres'>
            <i className="fa-solid fa-list"></i>
            <span>Geners</span>
        </Link>
        <Link className="link" onClick={(e) => {
            e.preventDefault();
            showOrHide()
        }}>
            <i className="fa-solid fa-plus-minus"></i>
            <span id='less'>Show More</span>
        </Link>
    </div>
    

    // let elementTwo = 
    // <div className='fixed-bottom d-flex justify-content-around' id='navTwo'>
    //     <Link className="firstChild link" href="">
    //         <i className="fa-solid fa-house"></i>
    //         <span  >Home</span>
    //     </Link>
    //     <Link className="link" href="">
    //         <i className="fa-solid fa-arrow-trend-up"></i>
    //         <span  >Trending</span>
    //     </Link>
    //     <Link className="link" href="">
    //         <i className="fa-solid fa-tv"></i>
    //         <span  >Popular</span>
    //     </Link>
    //     <Link className="link" href="">
    //         <i className="fa-solid fa-video"></i>
    //         <span  >Movies</span>
    //     </Link>
    //     <Link className="link" href="">
    //         <i className="fa-solid fa-list"></i>
    //         <span  >Geners</span>
    //     </Link>
    //     <Link className="link" href=""  onClick={() => {
    //         event.preventDefault();
    //         showMore(0)
    //     }}>
    //         <i className="fa-solid fa-plus-minus"></i>
    //         <span  >Show Less</span>
    //     </Link>
    // </div>
    // element = elementOne
    return (
        <div className="d-md-none">
            {elementOne}
        </div>
    )
}
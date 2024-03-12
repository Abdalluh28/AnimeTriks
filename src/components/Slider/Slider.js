import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Slider.css';

export function Slider() {
    let [animes, setAnimes] = useState([]);
    let [newAnimes, setNewAnimes] = useState([]);
    let [showAnimes, setShowAnimes] = useState([]);
    let [firstAnime, setFirstAnime] = useState([]);

    useEffect(() => {
        fetch("https://api.jikan.moe/v4/top/anime")
            .then(res => res.json())
            .then(data => {
                data.data.shift()
                data.data.length -= 15;
                setAnimes(data.data);
            });
    }, []);

    useEffect(() => {
        let getAnimes = async () => {
            let promises = animes.map(async item => {
                let res = await fetch(`https://kitsu.io/api/edge/anime?page%5Bnumber%5D=1&page%5Bsize%5D=20&filter[text]=${item.title_english}`);
                let data = await res.json();
                return data.data[0];
            });
            let updatedAnimes = await Promise.all(promises);
            setFirstAnime(updatedAnimes[0]);
            updatedAnimes.shift();
            setNewAnimes(updatedAnimes)
        };

        if (animes.length > 0)
            getAnimes();
    }, [animes]);

    useEffect(() => {
        console.log(newAnimes)
        setShowAnimes(
            newAnimes.map(item => (
                <div className="carousel-item" key={item.id}>
                    <div className="row h-100">
                        <div className="col-sm-6 h-100">
                            <img src={item.attributes.posterImage.original} className="img" alt={item.attributes.canonicalTitle} />
                        </div>
                        <div className="col-sm-6 d-flex flex-column justify-content-around">
                            <p className="title"> {item.attributes.canonicalTitle} ({item.attributes.canonicalTitle}) </p>
                            <p> {item.attributes.synopsis.slice(0, 140)}... </p>
                            <div className="d-flex divButton">
                                <Link to={`/anime/${item.id}`} className="button text-center">View</Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))
        );
    }, [newAnimes]);


    

    return (
        <div id="carouselId" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner" role="listbox">
                {firstAnime.length !== 0 && (
                    <div className="carousel-item active">
                        <div className="row h-100">
                            <div className="col-sm-6 h-100">
                                <img src={firstAnime.attributes.posterImage.original} className="img" alt={firstAnime.attributes.canonicalTitle} />
                            </div>
                            <div className="col-sm-6 d-flex flex-column justify-content-around">
                                <p className="title"> {firstAnime.attributes.canonicalTitle} ({firstAnime.attributes.canonicalTitle})</p>
                                <p className=""> {firstAnime.attributes.synopsis.slice(0, 140)}... </p>
                                <div className="d-flex divButton">
                                    <Link to={`/anime/${firstAnime.id}`} className="button text-center">View</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {showAnimes}
            </div>
            <button
                className="carousel-control-prev carousel-buttons"
                type="button"
                data-bs-target="#carouselId"
                data-bs-slide="prev"
            >
                <span >Previous</span>
            </button>
            <button
                className="carousel-control-next carousel-buttons"
                type="button"
                data-bs-target="#carouselId"
                data-bs-slide="next"
            >
                <span >Next</span>
            </button>
        </div>
    );
}

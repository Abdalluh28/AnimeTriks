import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export function RandomAnime() {

    let random = Math.round(Math.random()*1350);
    let randomAnime = Math.round(Math.random()*9);

    let [anime, setAnime] = useState(null);
    useEffect( () => {
        let getRandomAnime = async () => {
            let res = await fetch(`https://kitsu.io/api/edge/anime?page%5Bnumber%5D=${random}&page%5Bsize%5D=10`);
            if(!res.ok)
            {
                random = Math.round(Math.random()*1350);
                randomAnime = Math.round(Math.random()*9);
                getRandomAnime()
            }
            let data = await res.json();
            setAnime(data.data[randomAnime]);
            console.log(anime)
        }
        getRandomAnime();
    } , [])

    let showRandom = () => {
        console.log(anime)
        if(!anime)
            return (
                <div className='d-flex align-items-center'>
                    <h1>Loading</h1>
                    <div className="spinner-border ms-3" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )
        return (
            <Link className='card col-sm-6 col-lg-4 col-xl-3' key={anime.id} to={`anime/${anime.id}`}>
                <div>
                    <img src={anime.attributes.posterImage.original}/>
                </div>
                <p> {anime.attributes.canonicalTitle} </p>
                <p className='parag'>Ep: {anime.attributes.episodeCount ? anime.attributes.episodeCount : 1}</p>
            </Link>
        )
    }

    return (
        <div className='heading special-header mb-5'>
            <div className='header'>
                <h1>Random Anime</h1>
            </div>
            {showRandom()}
        </div>
    )
}
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom";

export function Popular() {

    let [animes, setAnimes] = useState([]);
    let [counter, setCounter] = useState(0);
    let [type, setType] = useState('')
    let params = useParams();


    useEffect( () => {
        if(params.Manga)
        {
            setType('manga')
        }
        else
        {
            setType('anime')
        }
        setAnimes([])
        setCounter(0)
    },[params])

    useEffect( () => {
        let getAnimes = async () => {
            let res = await fetch(`https://kitsu.io/api/edge/${type}?page%5Blimit%5D=10&page%5Boffset%5D=${counter*10}&sort=-averageRating`)
            let data = await res.json();
            if(Array.isArray(data.data)) {
                setAnimes(prevAnimes => [...prevAnimes, ...data.data]);
            }
        }

        getAnimes();
    },[counter,type])
    


    let handleScroll = () => {
        if (innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight)
            setCounter(prevCounter => prevCounter + 1);
    }

    useEffect(() => {
        let debounce = handleDebounce(handleScroll, 500)
        window.addEventListener('scroll', debounce)
        return () => {
            window.removeEventListener('scroll', debounce)
        }
    }, [])

    let handleDebounce = (func, delay) => {
        let timeOut;
        return (...args) => {
            clearTimeout(timeOut)
            timeOut = setTimeout(() => {
                func(...args);
            }, delay)
        }
    }



    let showManga = animes.map(item => {
        let removeCharacters = item.attributes.canonicalTitle.replace(/[^a-zA-Z-9 ]/g,'')
        let name = removeCharacters.split(' ', 5);
        name = name.map(item => item + ' ')
        return (
            <div className="oneAnime col-xl-3 col-lg-4 col-sm-6" key={item.id}>
                <Link to={`/anime/${item.id}${type==='manga'?'/Manga':''}`}>
                    <div>
                        <img src={item.attributes.posterImage.original} alt={item.attributes.canonicalTitle} />
                    </div>
                    <p>{name}</p>
                </Link>
            </div>
        )
    })


    return (
        <div className="col-md-10 main row">
            {showManga.length > 0 ? showManga : (
                <div className='d-flex align-items-center'>
                    <h1>Loading</h1>
                    <div className="spinner-border ms-3" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )}
        </div>
    )
}
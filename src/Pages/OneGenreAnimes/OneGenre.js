import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import '../Genres/Genres.css'
import './OneGenre.css'

export function OneGenre() {
    let params = useParams();
    let [animeName, setAnimeName] = useState('');
    let [animeId, setAnimeId] = useState('');
    let [ids, setIds] = useState([]);
    let [animes, setAnimes] = useState([]);
    let [counter, setCounter] = useState(0);
    let [type, setType] = useState('')


    useEffect( () => {
        if(params.manga)
        {
            console.log('manga')
            setType('manga')
        }
        else
        {
            setType('anime')
        }
    },[params])

    useEffect(() => {
        let name = params.genreName.toLocaleLowerCase().replaceAll(' ', '-')
        if(params.genreName==='Sci-Fi')
            name = "science-fiction"
        setAnimeName(name);
    }, [params])

    useEffect(() => {
        let getAnimeId = async () => {
            try {
                let res = await fetch(`https://kitsu.io/api/edge/categories?filter[slug]=${animeName}`)
                if (!res.ok) {
                    throw new Error('Failed to fetch anime ID');
                }
                let data = await res.json()
                setAnimeId(data.data[0].id);
            } catch (error) {
                console.error(error);
            }
        }

        if (animeName)
            getAnimeId();
    }, [animeName])

    useEffect(() => {
        let getIds = async () => {
            try {
                let res = await fetch(`https://kitsu.io/api/edge/categories/${animeId}/relationships/${type}`)
                if (!res.ok) {
                    throw new Error('Failed to fetch anime IDs');
                }
                let data = await res.json();
                setIds(data.data.map(item => item.id))
            } catch (error) {
                console.error(error);
            }
        }

        if (animeId)
            getIds();
    }, [animeId])

    useEffect(() => {
        let getAnimes = async () => {
            try {
                let newAnimes = await Promise.all(ids.slice(counter * 10, counter * 10 + 10).map(async (id) => {
                    let res = await fetch(`https://kitsu.io/api/edge/${type}/${id}`)
                    if (!res.ok) {
                        throw new Error('Failed to fetch anime data');
                    }
                    let data = await res.json()
                    return data.data
                }))
                setAnimes(prevAnimes => [...prevAnimes, ...newAnimes])
                console.log(animes);
            } catch (error) {
                console.error(error);
            }
        }

        if (ids.length > 0)
            getAnimes()
    }, [ids, counter])

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

    let showAnimes = animes.map(item => {
        let removeCharacters = item.attributes.canonicalTitle.replace(/[^a-zA-Z-9 ]/g,'')
        let name = removeCharacters.split(' ', 5);
        name = name.map(item => item + ' ')
        return (
            <div className="oneAnime col-xl-3 col-lg-4 col-sm-6" key={item.id}>
                <Link to={`/anime/${item.id}${type === 'manga'?'/manga':''}`}>
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
            {showAnimes.length > 0 ? showAnimes : (
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

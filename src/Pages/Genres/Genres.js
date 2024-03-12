import React, { useEffect, useState } from "react";
import './Genres.css';
import { Link, useParams } from "react-router-dom";

export function Genres() {
    let [genres, setGenres] = useState([]);
    let [loading, setLoading] = useState(true);
    let [ids, setIds] = useState([]);
    let [images, setImages] = useState([]);
    let [counter, setCounter] = useState(0);
    let [fetchingData, setFetchingData] = useState(false)
    let [type , setType] = useState('anime');

    let params = useParams();


    let startIdx, endIdx;

    useEffect( () => {
        if(params.MangaName)
        {
            console.log('manga')
            setType('manga')
        }
        else
        {
            setType('anime')
        }
    },[params])

    useEffect( () => {
        setGenres([])
        setIds([])
        setImages([])
    },[type])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setFetchingData(true);
                const res = await fetch(`https://kitsu.io/api/edge/categories?page%5Blimit%5D=10&page%5Boffset%5D=${counter * 10}&sort=-totalMediaCount`);
                const data = await res.json();
                const newGenres = data.data.filter(item => item.attributes.totalMediaCount > 1);
                setGenres(prevGenres => [...prevGenres, ...newGenres]);
                setLoading(false);
                console.log(genres)
                setFetchingData(false)

                let random = Math.round( Math.random() * 10)

                const newIds = await Promise.all(newGenres.map(async (item) => {
                    try {
                        const res = await fetch(`https://kitsu.io/api/edge/categories/${item.id}/relationships/${type}`);
                        const data = await res.json();
                        return data.data[random].id;
                    } catch (e) {
                        console.log("error:", e);
                    }
                }));
                setIds(prevIds => [...prevIds, ...newIds]);

            } catch (error) {
                console.error("Fetch error:", error);
                setFetchingData(false)
            }
        };
        fetchData();
    }, [counter,type]);

    useEffect(() => {
        const fetchImages = async () => {
            console.log(counter)
            try {
                startIdx = counter * 10;
                endIdx = Math.min(startIdx + 10, ids.length);
                const newImages = await Promise.all(ids.slice(startIdx, endIdx).map(async (id) => {
                    const res = await fetch(`https://kitsu.io/api/edge/${type}/${id}`);
                    const data = await res.json();
                    return data.data.attributes.posterImage.original;
                }));
                setImages(prevImages => [...prevImages, ...newImages]);
                console.log(images)
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };
        if (ids.length > 0) {
            fetchImages();
        }
    }, [ids]);

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
            setCounter(prevCounter => prevCounter + 1);
        }
    };

    useEffect(() => {
        let debounceScroll = debounce(handleScroll, 500);
        window.addEventListener("scroll", debounceScroll);
        return () => {
            window.removeEventListener("scroll", debounceScroll);
        };
    }, []);

    const showGenres = () => {
        console.log(startIdx, endIdx);
        return genres.slice(startIdx, endIdx).map((genre, index) => (
            <div key={genre.id} className="oneCategory col-lg-3 col-sm-6">
                <div style={{ backgroundImage: `url(${images[index]})` }}></div>
                <Link to={`/genres/${genre.attributes.title}${type === 'manga' ? '/manga':''}`}>{genre.attributes.title}</Link>
            </div>
        ));
    };

    let debounce = (func, delay) => {
        let timeOut;
        return (...args) => {
            clearTimeout(timeOut);
            timeOut = setTimeout(() => {
                func(...args)
            }, (delay))
        }
    }

    return (
        <div className="col-md-10 main row">
            <div className="d-flex my-4">
                <div className="me-3 radio">
                    <input type="radio" id="anime" name="type" value='anime' defaultChecked onClick={() => {setType('anime')}} />
                    <label htmlFor='anime' className="ps-2">anime</label>
                </div>
                <div className="me-3 radio">
                    <input type="radio" id="manga" name="type" value='manga' onClick={() => {setType('manga')}} />
                    <label htmlFor='manga' className="ps-2">manga</label>
                </div>
            </div>
            {fetchingData ?  <div>loading</div> : null}
            {loading ? <div>loading</div> : showGenres()}
        </div>
    );
}

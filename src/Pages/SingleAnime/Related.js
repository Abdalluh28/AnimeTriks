/* eslint-disable no-restricted-globals */
// Your code using location

import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import './Related.css';

export function RelatedAnime(props) {
    
    let params = useParams();
    let id = params.AnimeId;
    let categories = props.genres;
    let [category, setCategory] = useState('');
    let [loading, setLoading] = useState(true);
    let [type, setType] = useState('')

    useEffect(() => {
        if (params.MangaName) {
            console.log('manga')
            setType('manga')
        }
        else {
            setType('anime')
        }

    }, [params])




    let timeOut;
    useEffect(() => {
        timeOut = setTimeout(() => {
            setLoading(false);
        }, 7000)
    })

    useEffect(() => {
        let fetchGenres = async () => {
            try {
                // Fetch all categories
                let res = await fetch(`https://kitsu.io/api/edge/categories?page%5Blimit%5D=250`);
                let data = await res.json();
                let fetchedCategories = data.data.map(item => item.attributes.title);

                // Find the first matching category among fetched categories and provided genres
                let matchingCategory = categories.find(genre => fetchedCategories.includes(genre));
                if (matchingCategory) {
                    setCategory(matchingCategory);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchGenres();
    }, [categories]);

    let [genres, setGenres] = useState([]);
    let [originalName, setOriginalName] = useState('');

    useEffect(() => {
        let fetchedAnimes = async () => {
            try {
                if (!category) return; // Exit early if category is not set

                let res = await fetch(`https://kitsu.io/api/edge/${type}/${id}`)
                let data = await res.json();
                setOriginalName(data.data.attributes.canonicalTitle)


                // Fetch animes based on the selected category
                let resTwo = await fetch(`https://kitsu.io/api/edge/${type}?page%5Bnumber%5D=1&page%5Bsize%5D=12&filter[categories]=${category}`);
                let dataTwo = await resTwo.json();
                setGenres(dataTwo.data);
                setLoading(false);
                console.log(category);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchedAnimes();
    }, [category, id]);



    useEffect( () => {
        let popStateEvent = () => {
            window.location.reload();
        }

        window.addEventListener('popstate',popStateEvent)
        return () => {
            window.removeEventListener('popstate',popStateEvent)
        }
    },[]) 
    

    let showGenres = useMemo(() => {
        return genres.map(item => {
            if (item.attributes.canonicalTitle === originalName)
                return null;
            return (
                <div key={item.id} className="card col-lg-3 col-md-4 col-sm-6" >
                    <span onClick={() => {
                        location.href = `/#/anime/${item.id}${type === 'manga'? '/manga':''}`
                    }}>
                        <div>
                            <img src={item.attributes.posterImage.original} alt={item.attributes.canonicalTitle} />
                        </div>
                        <p>{item.attributes.canonicalTitle}</p>
                        {type === 'anime' ? <p className='episode'>Ep: {item.attributes.episodeCount ? item.attributes.episodeCount : 1}</p>
                            : null}
                    </span>
                </div>
            )
        });
    }, [genres, originalName]);

    return (
        <div className="mt-5">
            {type === 'anime' ? <h1>Related Animes</h1> : <h1>Related Manga</h1>}
            <div className="container-fluid mt-4">
                <div className="row">
                    {loading ? (
                        <div className='d-flex align-items-center'>
                            <h1>Loading</h1>
                            <div className="spinner-border ms-3" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    ) : showGenres.length > 0 ? showGenres : <div>No related anime found</div>}
                </div>
            </div>
        </div>
    );
}

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import './Anime.css'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';


// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


// import required modules
import { Pagination, Navigation } from 'swiper/modules';
import { RelatedAnime } from "./Related";



export function Anime() {

    let breakpoints = {
        0: {
            slidesPerView: 2,
        },
        400: {
            slidesPerView: 3,
        },
        639: {
            slidesPerView: 4,
        },
        865: {
            slidesPerView: 5
        },
        1000: {
            slidesPerView: 5
        },
        1500: {
            slidesPerView: 6
        },
    }

    const [swiperRef, setSwiperRef] = useState(null);

    let params = useParams();
    let [type, setType] = useState('')
    let [anime, setAnime] = useState(null);
    let [genres, setGenres] = useState([]);
    let [characters, setCharacters] = useState([]);
    let [description, sendDescription] = useState('');
    let [allGenres, setAllGenres] = useState([]);
    let [streamingLinks, setStreamingLinks] = useState([]);
    let [urls, setUrls] = useState([]);
    console.log(params.AnimeId)


    useEffect( () => {
    },[])


    useEffect(() => {
        if (params.MangaName) {
            console.log('manga')
            setType('manga')
        }
        else {
            setType('anime')
        }
    }, [params])



    let [Loading, setLoading] = useState(true)


    useEffect(() => {
        let timeOut = setTimeout(() => {
            setLoading(false)
        }, 7000)
    }, [])



    useEffect(() => {
        let getAllGenres = async () => {
            let res = await fetch("https://kitsu.io/api/edge/categories?page%5Blimit%5D=220&page%5Boffset%5D=0");
            let data = await res.json();
            setAllGenres(data.data.map(item => item.attributes.title))
            console.log(allGenres)
        }

        getAllGenres();
    }, [params])


    useEffect(() => {
        let fetchAnime = async () => {
            try {
                if (params?.AnimeId) {
                    let res = await fetch(`https://kitsu.io/api/edge/${type}/${params.AnimeId}`);
                    if (!res.ok) {
                        throw new Error('Failed to fetch anime data');
                    }
                    let data = await res.json();
                    setAnime(data.data);
                    makeIcons(data.data.attributes.averageRating);
                    if (data.data.attributes.synopsis) {
                        sendDescription(data.data.attributes.synopsis.slice(0, data.data.attributes.synopsis.search(/(Source)/) - 1))
                    }
                    let name = data.data.attributes.canonicalTitle
                    let reg = /[0-9]|(Season)|(Part)|(The Final Season)|(Specials)/g;
                    name = name.slice(0, 14)
                    name = name.replace(reg, '');
                    console.log(name)
                    let newRes = await fetch(`https://kitsu.io/api/edge/${type}?page%5Bnumber%5D=1&page%5Bsize%5D=20&filter[text]=${name}`);
                    let newId = await newRes.json();
                    newId = await newId.data[0].id
                    let genreIds = await fetch(`https://kitsu.io/api/edge/${type}/${newId}/relationships/categories`)
                    let genreIdsData = await genreIds.json();
                    genreIdsData = genreIdsData.data.map(item => item.id)
                    let genreIdsList = await Promise.all(
                        genreIdsData.map(async item => {
                            let res = await fetch(`https://kitsu.io/api/edge/categories/${item}`);
                            let data = await res.json();
                            console.log(data.data.attributes.title)
                            if (allGenres.includes(data.data.attributes.title) || data.data.attributes.title === 'Sci-Fi')
                                return data.data.attributes.title;
                            else
                                return ''
                        })
                    )
                    let charactersId = await fetch(`https://kitsu.io/api/edge/${type}/${anime.id}/relationships/characters`)
                    let charactersIdData = await charactersId.json();
                    setGenres(genreIdsList);
                    console.log(charactersIdData)
                    if (type === 'anime') {
                        let characterIdsList = await Promise.all(
                            charactersIdData.data.map(async item => {
                                try {
                                    let res = await fetch(`https://kitsu.io/api/edge/anime-characters/${item.id}/character`);
                                    if (!res.ok) {
                                        console.log('Error')
                                        return null;
                                    }
                                    let data = await res.json();
                                    return data.data;
                                }
                                catch (e) {
                                    console.log('Error')
                                }
                            })
                        )
                        setCharacters(characterIdsList);


                        let resTwo = await fetch(`https://kitsu.io/api/edge/anime/${anime.id}/relationships/streaming-links`)
                        let dataTwo = await resTwo.json()
                        let streamingIds = await Promise.all(
                            dataTwo.data.map(async item => {
                                let res = await fetch(`https://kitsu.io/api/edge/streaming-links/${item.id}`)
                                let data = await res.json();
                                return data.data.attributes.url
                            })
                        )
                        setUrls(streamingIds)
                    }



                }
            } catch (error) {
                console.log('error');
            }
        }

        fetchAnime();
    }, [type, allGenres])

    let showGenres = genres.map(item => {
        if (item != '')
            return (
                <Link key={item} className="m-3 genre" to={`/genres/${item}${type === 'manga' ? '/manga' : ''}`}>
                    <i className="fa-solid fa-circle-dot me-1"></i>
                    <span>{item}</span>
                </Link>
            )
    })

    let showCharacters = characters.map(item => {
        if (item && item.attributes && item.attributes.image) {
            return (
                <SwiperSlide className='card' key={item.id} >
                    <div className="character">
                        <img src={item.attributes.image.original} />
                    </div>
                </SwiperSlide>
            )
        }
        else {
            return <></>;
        }
    })


    let showStreamingLinks = urls.map(item => {
        let end = item.indexOf('.co')
        let start, title;
        if (item.includes('www.')) {
            start = item.indexOf('.')
            title = item.substring(start + 1, end)
        }
        else if (item.includes('https://') || item.includes('http://')) {
            start = item.indexOf('://')
            title = item.substring(start + 3, end)
        }
        else {
            title = item.substring(0, item.indexOf('.co'))
        }
        console.log(title)
        if(title==='')
            return ''
        return (
            <Link key={item} className="m-3 genre" to={item} target="blank" rel="noopener noreferrer">
                <i className="fa-solid fa-circle-dot me-1"></i>
                <span>{title}</span>
            </Link>
        )
    })



    let makeIcons = (rate) => {
        let newRate = Math.floor(rate / 20);
        console.log(newRate);
        for (let i = 0; i < newRate; i++) {
            document.querySelectorAll(".icon")[i].classList.add('fa-star');
            document.querySelectorAll(".icon")[i].classList.add('fa-solid');
        }
        document.querySelectorAll(".icon")[newRate].classList.add('fa');
        document.querySelectorAll(".icon")[newRate].classList.add('fa-star-half-o');
        for(let i = newRate+1; i<5;i++)
        {
            document.querySelectorAll(".icon")[i].classList.add('fa-regular');
            document.querySelectorAll(".icon")[i].classList.add('fa-star');
        }
    }



    let getAnime = () => {
        if (anime) {
            return (
                <div className='col-md-10 main' key={anime.attributes.canonicalTitle}>
                    <div className="row">
                        <div className="col-lg-6 image">
                            <img src={anime.attributes.posterImage.original} />
                        </div>
                        <div className="col-lg-6">
                            <h1> {anime.attributes.canonicalTitle} </h1>
                            <div className="d-flex justify-content-between align-items-center my-4">
                                <div className="d-flex justify-content-center align-items-center">
                                    <div>
                                        <i className="me-1 icon"></i>
                                        <i className="me-1 icon"></i>
                                        <i className="me-1 icon"></i>
                                        <i className="me-1 icon"></i>
                                        <i className="me-2 icon"></i>
                                    </div>
                                    {anime.attributes.averageRating === null ? '' : ((anime.attributes.averageRating) / 10).toFixed(2)}
                                </div>
                                <div>
                                    {anime.attributes.startDate?.slice(0, 4)}
                                </div>
                            </div>
                            <div className="my-4">
                                <h6>THE GENRES</h6>
                                <span className="d-flex flex-wrap">
                                    {showGenres.length > 0 ? showGenres : Loading ?
                                        <div className="d-flex align-items-center">
                                            <h1>Loading</h1>
                                            <div className="spinner-border ms-3" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </div>
                                        : <div><h1>No data Provided</h1></div>}
                                </span>
                            </div>
                            <div className="my-4">
                                <h6>THE SYNOPSIS</h6>
                                <span>{description}</span>
                            </div>
                            <div className="my-4 heading special-header">
                                {type === 'anime' ? <h6>THE CAST</h6> : null}
                                <Swiper navigation={true} modules={[Navigation]} className="mySwiper"
                                    onSwiper={setSwiperRef}
                                    slidesPerView={5}
                                    breakpoints={breakpoints}
                                    centeredSlides={false}
                                    spaceBetween={30}
                                    pagination={{
                                        type: '',
                                    }}

                                >
                                    {type === 'anime' ? showCharacters.length > 0 ? showCharacters : Loading ?
                                        <div className="d-flex align-items-center">
                                            <h1>Loading</h1>
                                            <div className="spinner-border ms-3" role="status">
                                                <span className="sr-only">Loading...</span>
                                            </div>
                                        </div>
                                        : <div><h1>No data Provided</h1></div> : null}
                                </Swiper>
                            </div>

                        </div>
                    </div>
                    {type === 'anime' ? <div className="container-fluid">
                    <div className="row">
                        <h1 className="mb-4 col-12">Watch: </h1>
                        {showStreamingLinks.length > 0 ? <span className="d-flex flex-wrap">{showStreamingLinks}</span> : Loading ?
                            <div className="d-flex align-items-center">
                                <h1>Loading</h1>
                                <div className="spinner-border ms-3" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                            : <div><h1>No data Provided</h1></div>}
                    </div>
                    </div> : ''}
                    <div>
                        <RelatedAnime genres={genres} />
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className='d-flex align-items-center'>
                    <h1>Loading</h1>
                    <div className="spinner-border ms-3" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            )
        }
    }

    return (
        <>
            {getAnime()}
        </>
    )
}
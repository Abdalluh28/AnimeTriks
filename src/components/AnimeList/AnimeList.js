import { useEffect, useState } from 'react';
import './AnimeList.css'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


// import required modules
import { Pagination, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';



export function AnimeList(props) {


  let title = props.title;
  let [type, setType] = useState('');
  let breakpoints;

  useEffect(() => {
    if (title === 'Manga')
      setType('manga')

  }, [title])

  breakpoints = {
    0: {
      slidesPerView: 1,
    },
    400: {
      slidesPerView: 2,
    },
    639: {
      slidesPerView: 3,
    },
    865: {
      slidesPerView: 4
    },
    1000: {
      slidesPerView: 5
    },
    1500: {
      slidesPerView: 6
    },
  }


  const [swiperRef, setSwiperRef] = useState(null);

  let [animes, setAnimes] = useState([])
  let url = props.url;
  useEffect(() => {
    fetch(url).then((res) => {
      return res.json();
    }).then((data) => {
      setAnimes(data.data)
    })
  }, [])

  let items = animes.map((item) => {
    return (
      <SwiperSlide className='card' key={item.id}>
        <Link to={`anime/${item.id}${type === 'manga' ? '/manga' : ''}`}>
          <div>
            <img src={item.attributes.posterImage.original} />
          </div>
          <p> {item.attributes.canonicalTitle} </p>
          <p className='parag'>Ep: {item.attributes.episodeCount ? item.attributes.episodeCount : 1}</p>
        </Link>
      </SwiperSlide>
    );
  })

  return (
    <div className='heading special-header'>
      <div className='header'>
        <h1>{title}</h1>
        {title === 'Popular' ? <Link className='btn btn-outline-dark' to='/Popular'>
          <span>Load More</span>
          <i className="fa-solid fa-right-long"></i>
        </Link> : <Link className='btn btn-outline-dark' to='/Popular/Manga'>
          <span>Load More</span>
          <i className="fa-solid fa-right-long"></i>
        </Link>}
      </div>
      <Swiper
        onSwiper={setSwiperRef}
        slidesPerView={5}
        breakpoints={breakpoints}
        centeredSlides={false}
        spaceBetween={30}
        pagination={{
          type: '',
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {items.length > 0 ? items : <div className='d-flex align-items-center'>
          <h1>Loading</h1>
          <div className="spinner-border ms-3" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>}
      </Swiper>
    </div>
  );
}
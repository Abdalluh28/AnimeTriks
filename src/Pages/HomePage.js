import { AnimeList } from "../components/AnimeList/AnimeList"
import { Footer } from "../components/Footer/Footer"
import { RandomAnime } from "../components/Random/Random"
import { Slider } from "../components/Slider/Slider"

export function HomePage () {


    let urls = [
        'https://kitsu.io/api/edge/anime?page%5Bnumber%5D=1&page%5Bsize%5D=20&sort=-favoritesCount',
        'https://kitsu.io/api/edge/manga?page%5Bnumber%5D=1&page%5Blimit%5D=20&sort=-favoritesCount',
    ]

    return (
        <div className='col-md-10'>
            <Slider />
            <AnimeList title='Popular' url={urls[0]}  />
            <AnimeList title='Manga' url={urls[1]}  />
            <RandomAnime />
            <Footer />
        </div>
    )
}
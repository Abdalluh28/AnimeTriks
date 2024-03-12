import { Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import { NavBar } from './components/NavBar/NavBar';
import { SideBar } from './components/SideBar/SideBar';

import { HomePage } from './Pages/HomePage';
import { Anime } from './Pages/SingleAnime/Anime';
import { Genres } from './Pages/Genres/Genres';
import { OneGenre } from './Pages/OneGenreAnimes/OneGenre';
import { Popular } from './Pages/Popular/Popular';
import { RelatedAnime } from './Pages/SingleAnime/Related';
import Example from './components/NavBar/Modal';

function App() {







  

  return (
    <>
      <NavBar >
        <Example />
      </NavBar>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-2 sideBar' > <SideBar /> </div> 
          <div className='col-2'></div>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/anime/:AnimeId' element={<Anime />} >
              <Route path='' element={<RelatedAnime />} />
            </Route>
            <Route path='/genres' element={<Genres />} />
            <Route path='/genres/:genreName' element={<OneGenre />} />
            <Route path='/Popular' element={<Popular />} />
            <Route path='/Popular/:Manga' element={<Popular />} />
            <Route path='/anime/:AnimeId/:MangaName' element={<Anime />} />
            <Route path='/genres/:genreName/:manga' element={<OneGenre />} />
          </Routes>
        </div>
      </div>
    </>
  );
}


export default App;

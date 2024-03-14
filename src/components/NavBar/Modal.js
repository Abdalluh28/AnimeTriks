import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './Modal.css'
import { Link } from 'react-router-dom';

function Example() {
    const [show, setShow] = useState(false);
    const [animes, setAnimes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [renderAnimes, setRenderAnimes] = useState([])
    let [counter, setCounter] = useState(0)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const getAnimes = async () => {
        try {
            
            if (searchTerm.trim() === '') return;
            const res = await fetch(`https://kitsu.io/api/edge/anime?page%5Bnumber%5D=1&page%5Bsize%5D=20&filter[text]=${searchTerm}`);
            const data = await res.json();
            setAnimes(data.data);
        } catch (error) {
            console.error('Error fetching animes:', error);
        }
    }

    useEffect(() => {
        const debounceInput = setTimeout(() => {
            setAnimes([])
            setRenderAnimes([])
            setCounter(0)
            getAnimes();
        }, 500);
        return () => clearTimeout(debounceInput);
    }, [searchTerm]);


    let newLocatoin = (e,i) => {
        handleClose();
        location.href = `/anime/${animes[i].id}`
    }

    useEffect(() => {
        let showAllAnimes = () => {
            console.log(animes);
            let newAnimes = [];
            if(animes.length === 0)
            {
                setRenderAnimes([])
                return;
            }
            if (renderAnimes.length > 0)
                newAnimes = [...renderAnimes]
            
            for (let i = counter; i < counter + 5 && i < animes.length; i++) {
                console.log(i)
                let anyvar = <div key={animes[i].id} className='anime row'>
                    <div to={`/anime/${animes[i].id}`} onClick={() => {newLocatoin(event,i)}} className='animeImage col-7'>
                        <img src={animes[i].attributes.posterImage.original} />
                    </div>
                    <div className='animeText col-5'>
                        <div to={`/anime/${animes[i].id}`}  onClick={() => {newLocatoin(event,i)}}>{animes[i].attributes.canonicalTitle}</div>
                        <div><div className='btn btn-primary' onClick={() => {newLocatoin(event,i)}} >View</div></div>
                    </div>
                </div>
                newAnimes = [...newAnimes, anyvar]
            }
            setRenderAnimes(newAnimes);
        }

        if (animes.length > 0)
            showAllAnimes();
    }, [animes, counter])

    return (
        <>
            <Button onClick={handleShow}>Search</Button>
            <Modal show={show} onHide={handleClose} scrollable={true} className='dark-modal'  >
                <Modal.Header closeButton>
                    <Modal.Title>SearchBar</Modal.Title>
                </Modal.Header>
                <Modal.Body className='text-dark' >
                    <form className='form-floating mb-4'>
                        <input
                            type='text'
                            id='word'
                            className='form-control'
                            placeholder='Enter Anime Name'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <label htmlFor='word'>Enter Anime Name</label>
                    </form>
                    {animes.length > 0 ? renderAnimes : null}
                    {counter < animes.length ? <button className='btn btn-dark' onClick={() => {
                        setCounter(oldValue => oldValue + 5)
                    }}>Load More</button> : ''}
                </Modal.Body>
            </Modal>

        </>
    );
}

export default Example;

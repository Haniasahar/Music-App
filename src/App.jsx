import React from 'react';
import './App.css'
import { useState } from 'react'
import { FaMusic } from "react-icons/fa";
import music1 from './assets/music1.jpg';
import music2 from './assets/music2.jpg';

function App() {

  const [keyword, setKeyword] = useState("");
  const [tracks, setTracks] = useState([]);

  const getTracks = async () => {
    let data = await fetch(`https://v1.nocodeapi.com/haniya/spotify/lMbFBWURaOMmsNWy/search?q=${keyword}&type=track`);
    let c_data = await data.json();
    console.log(c_data.tracks.items);
    setTracks(c_data.tracks.items);
    document.getElementById("img").style.display="none";
  }

  return (

    <>

      <nav className="navbar navbar-light bg-light flex justify-content-around">


        <div className='flex text-xl'>
          <FaMusic />
          <h1 className="navbar-brand">KIDS MUSiC</h1>
        </div>

        <div className="nav_content">

          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            type="search"
            placeholder="Search"
            aria-label="Search"
          />

          <button id='btn' onClick={getTracks} className="btn btn-outline-success" >
            Search
          </button>

        </div>

      </nav>

      <div className='text-center mt-20' id='info'>

        <h1 className='fs-1 fw-bold'>SEARCH YOUR FAVOURITE SONG
          <br />
          (Espacially For Children !!!)
        </h1>

        <div id='img'>
          <img src={music1} width="30%" height="100px"/>
          <img src={music2} width="30%" height="100px"/>
        </div>

      </div>

      <div className="container">

        <div className="row">

          {tracks.map((element) => {

            return <div key={element.id} className="col-lg-3 col-md-6 col-sm-8 py-2">

              <div className="card">

                <img src={element.album.images[1].url} className="card-img-top" alt="baby_songs" />

                <div className="card-body">

                  <h5 className="card-title">{element.name}</h5>

                  <p className="card-text">
                    Artist:{element.album.artists[0].name}
                  </p>

                  <p className="card-text">
                    Release Date:{element.album.release_date}
                  </p>

                  <p className="card-text">
                    Popularity:{element.popularity}
                  </p>

                  <audio src={element.preview_url} controls className='w-100'></audio>

                </div>

              </div>

            </div>

          })
          }

        </div>

      </div>

    </>

  )

}

export default App

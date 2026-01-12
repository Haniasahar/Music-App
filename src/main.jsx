import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

//censor ship , allow only child songs
//components based structure
//playlist details page
//playlist delete
//going backk

// recently played save in local storage, can be deleted
//defaul tracks not working
// not searching on enter btn
//login and then showing username on the page
//your library ????

//sidebar 










//             <Route path="*" element={<Navigate to="/login" replace />} />





// can you plz explain me this ??
// ...prev.slice(0, 9)
// toISOString()

//  if (favorites.some(t => t.id === track.id)) {
//       setFavorites(prev => prev.filter(t => t.id !== track.id));
//     }



//   // Format time
//   const formatTime = (ms) => {
//     const minutes = Math.floor(ms / 60000);
//     const seconds = ((ms % 60000) / 1000).toFixed(0);
//     return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   };
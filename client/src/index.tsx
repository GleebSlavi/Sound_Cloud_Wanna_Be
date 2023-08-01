import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import PlayerProvider from './providers/PlayerProvider';
import StreamProvider from './providers/StreamProvider';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <PlayerProvider>
        <StreamProvider>
          <App />
        </StreamProvider>
      </PlayerProvider>
    </BrowserRouter>
  </React.StrictMode>
);
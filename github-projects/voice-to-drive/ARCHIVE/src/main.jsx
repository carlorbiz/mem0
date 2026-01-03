console.log('🔵 main.jsx is loading...');

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('🔵 React imported successfully');

// Load Google Identity Services (new auth library)
const gsiScript = document.createElement('script');
gsiScript.src = 'https://accounts.google.com/gsi/client';
gsiScript.async = true;
gsiScript.defer = true;
document.head.appendChild(gsiScript);

// Load Google API client (for Drive API calls)
const gapiScript = document.createElement('script');
gapiScript.src = 'https://apis.google.com/js/api.js';
gapiScript.async = true;
gapiScript.defer = true;
document.head.appendChild(gapiScript);

console.log('🔵 About to render React app...');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('🔵 React app rendered!');

// TEMPORARILY DISABLED - Service worker caching old version
// Register service worker for PWA
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker
//       .register('/sw.js')
//       .then(registration => {
//         console.log('Service Worker registered:', registration);
//       })
//       .catch(error => {
//         console.error('Service Worker registration failed:', error);
//       });
//   });
// }

// Unregister any existing service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
      console.log('Unregistered service worker');
    }
  });
}

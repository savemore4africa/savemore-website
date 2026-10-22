/*
  SAVEMORE GAMES: server settings.

  enabled: false  -> the Daily Challenge and Leaderboards stay hidden. Safe to upload before the server exists.
  enabled: true   -> switch on ONLY after the server has been deployed and tested with admin-tools.html.

  apiBase: the address of your games server (a free Cloudflare Worker). Already set to your worker.
           (Nothing secret is in this file.)
  firebase: the same public web settings your Member Portal already uses.
*/
window.SM_GAMES_CONFIG = {
  enabled: false,
  apiBase: 'https://savemore-games.buymore4africa.workers.dev',
  firebase: {
    apiKey: 'AIzaSyBj8opxzN423qkwPGy5IhhxWHBPAZlwOJo',
    authDomain: 'savemore-portal.firebaseapp.com',
    projectId: 'savemore-portal',
    storageBucket: 'savemore-portal.firebasestorage.app',
    messagingSenderId: '32261102803',
    appId: '1:32261102803:web:82ad3eaf3eb3998621c826'
  },
  sdkVersion: '10.12.0'
};

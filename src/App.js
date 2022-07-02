const axios = require('axios');
var request = require('request');
const Databox = require('databox');
const tokens = require("../util/tokens")

var client = new Databox({
    push_token: tokens.databoxToken
});

// --- GET CURRENT MARIBOR TEMPERATURE ---
axios.get('http://api.weatherapi.com/v1/current.json?key=' + tokens.weatherKey + '&q=Maribor&aqi=yes')
    .then(res => {
        client.push({
            key: 'Current temperature',
            value: res.data.current.temp_c,
            date: '2018-02-23 09:00:00'
        }, function(result){
            console.log(result);
        });
    })
    .catch(error => {
        console.error(error);
    });

// --- GET SPOTIFY USERS PLAYLISTS AND NUMBER OF ADDED SONGS ---
function getUserPlaylists(token) {
    axios.get('https://api.spotify.com/v1/users/iycp6t4rftwsk24u10hbsnngx/playlists', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(res => {
        /*console.log(`statusCode: ${res.status}`);
       console.log(res.data.items[0].tracks.total)*/
       client.push({
           key: 'TracksInAlbum',
           value: res.data.items[0].tracks.total,
           date: '2022-02-23 09:00:00'
       }, function(result){
           console.log(result);
       });
    }).catch(error => {
        console.error(error);
    });
}

// --- GET SPOTIFY ARTIST POPULARITY RANKING AND FOLLOWERS ---
function getArtistInfo(token) {
    axios.get('https://api.spotify.com/v1/artists/5cj0lLjcoR7YOSnhnX0Po5', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(res => {
        client.insertAll([
            {
                key: 'Popularity',
                value: res.data.popularity,
                date: '2022-02-23 09:00:00'
            },
            {
                key: 'Followers',
                value: res.data.followers.total,
                date: '2022-02-23 09:00:00'
            }
        ], function(result){
            console.log(result);
        });
    })
    .catch(error => {
        console.error(error);
    });
}

const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + (btoa(tokens.spotifyID + ':' + tokens.spotifySecret))
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true,
    method: 'post',
}

request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {  // Auth 2 token obtained
        token = body.access_token;
        getArtistInfo(token)
        getUserPlaylists(token)
    }
});

const axios = require('axios');
var request = require('request');
const Databox = require('databox');
const tokens = require("../util/tokens")

var client = new Databox({
    push_token: tokens.databoxToken
});

function getDate() {
    return new Date().toISOString()
        .replace(/T/, ' ')     // replace T with a space
        .replace(/\..+/, '')     // delete the dot and everything after;
}

// --- GET CURRENT MARIBOR TEMPERATURE ---
axios.get('http://api.weatherapi.com/v1/current.json?key=' + tokens.weatherKey + '&q=Maribor&aqi=yes')
    .then(res => {
        const date = getDate()
        client.push({
            key: 'Current temperature',
            value: res.data.current.temp_c,
            date: date
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
        const date = getDate()
        client.push({
            key: 'Tracks in album',
            value: res.data.items[0].tracks.total,
            date: date
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
        const date = getDate()
        client.insertAll([
            {
                key: 'Popularity',
                value: res.data.popularity,
                date: date
            },
            {
                key: 'Followers',
                value: res.data.followers.total,
                date: date
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


// --- GET CURRENT BITCOIN VALUE IN EUR ---
axios.get('https://blockchain.info/ticker').then(res => {
    const date = getDate()
    client.push({
        key: 'BTC value',
        value: res.data.EUR.last,
        date: date
    }, function(result){
        console.log(result);
    });
}).catch(error => {
    console.error(error);
});
const axios = require('axios');
var request = require('request');
const Databox = require('databox');
const tokens = require("../util/tokens")
const fs = require("fs");

var client = new Databox({
    push_token: tokens.databoxToken
});

function getDate() {
    return new Date().toISOString()
        .replace(/T/, ' ')     // replace T with a space
        .replace(/\..+/, '')     // delete the dot and everything after;
}

fs.readFile("log.json", function(err, data) { // If this is beginning of logs
    if (data.length === 0) { // File is empty!
        const content = {logs: []}
        fs.writeFile('log.json', JSON.stringify(content, null, 4), err => {
            if (err) {
                console.error(err);
            }
        });
    }
})

function saveLog(provider, date, metrics, status, message) {
    const newLog = {
        provider: provider,
        date: date,
        metrics: metrics,
        KPICount: metrics.length,
        status: status
    }
    if (status !== "OK") {
        newLog.error_message = message
    }

    fs.readFile("log.json", function(err, data) {
        var obj = JSON.parse(data)
        obj['logs'].push(newLog)

        fs.writeFile("log.json", JSON.stringify(obj, null, 4),function(err) {
            if(err) console.log('error', err);
        });
    })
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

            // SAVE LOG
            const metrics = [{
                key: "Current temperature",
                value: res.data.current.temp_c
            }]
            saveLog("WeatherApi", date, metrics, result.status, result.message)
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
            console.log(result.message)
            // SAVE LOG
            const metrics = [{
                key: "Tracks in album",
                value: res.data.items[0].tracks.total
            }]
            saveLog("Spotify", date, metrics, result.status, result.message)
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
            console.log(result.message)

            // SAVE LOG
            const metrics = [{
                key: "Popularity",
                value: res.data.popularity
            },
            {
                key: "Followers",
                value: res.data.followers.total
            }]
            saveLog("Spotify", date, metrics, result.status, result.message)
        });
    })
    .catch(error => {
        console.error(error);
    });
}

const authOptions = { // Getting auth 2 key
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + (btoa(tokens.spotifyID + ':' + tokens.spotifySecret)) // Initial authorization
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true,
    method: 'post'
}

request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {  // Auth 2 token obtained
        token = body.access_token;
        getArtistInfo(token) // 2 metrics
        getUserPlaylists(token) // 1 metric
    }
});


// --- GET CURRENT BITCOIN VALUE IN EUR ---
axios.get('https://blockchain.info/ticker').then(res => {
    const date = getDate()
    client.push({
        key: 'BTC value',
        value: res.data.EUR.last, // Last value of BTC in EUR
        date: date
    }, function(result){
        console.log(result.message);

        // SAVE LOG
        const metrics = [{
            key: "BTC value",
            value: res.data.EUR.last
        }]
        saveLog("Blockchain", date, metrics, result.status, result.message)
    });
}).catch(error => {
    console.error(error);
});
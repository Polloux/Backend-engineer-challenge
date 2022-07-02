const axios = require('axios');


var weatherToken = require('./Util/weatherToken.js')

axios.get('http://api.weatherapi.com/v1/current.json?key=' + weatherToken + '&q=Maribor&aqi=yes')
    .then(res => {
        console.log(`statusCode: ${res.status}`);
        //console.log(res);
        console.log(res.data.current.temp_c)
    })
    .catch(error => {
        console.error(error);
    });


/*const https = require('https');

const options = {
    //hostname: 'api.spotify.com',
    //hostname: 'accounts.spotify.com/api/token',
    hostname: 'api.weatherapi.com/v1/',
    //port: 443,
    //path: '/v1/artists/1HY2Jd0NmPuamShAr6KMms/top-tracks',
    //path: '/v1/albums/6akEvsycLGftJxYudPjmqK/tracks',
    path: 'current.json?key=86a6e20e378b427885730234220207&q=Maribor&aqi=yes',

    method: 'GET',
    headers: {
        'Authorization': 'Bearer f09f7e5e3eb04ea8a3a82baf0dad1295'
    }
};

const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);

    res.on('data', d => {
        process.stdout.write(d);
    });
});

req.on('error', error => {
    console.error(error);
});

req.end();*/

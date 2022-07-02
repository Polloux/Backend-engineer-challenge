const axios = require('axios');

axios
    .get('https://jsonplaceholder.typicode.com/todos/13')
    .then(res => {
        console.log(`statusCode: ${res.status}`);
        console.log(res);
    })
    .catch(error => {
        console.error(error);
    });
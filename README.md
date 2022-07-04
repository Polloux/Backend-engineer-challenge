# Backend engineer challenge
The documentation covers several of the project's components that I developed for the Databox technical evaluation for the Junior Playmaker position.

# INDEX?

## Architecture choice
I have attempted a [Kotlin](https://kotlinlang.org/) implementation, as it is very similar to [Java](https://www.java.com/en/), but found that a [NodeJS](https://nodejs.org/en/) solution was overall more readable and generally faster, especially for [REST API](https://restfulapi.net/) service development.

I chose [IntelliJ Idea](https://www.jetbrains.com/idea/) as my IDE. It's got a powerful toolkit for personalization, setting run and build parameters, debugging code and has a wide variety of useful keyboard shortcuts.

For my unit tests I used [Jest](https://jestjs.io/).

## Metrics and services
I made care to incorporate a variety of authentication methods in my metrics. I used a combination of OAuth, APIkey and no authentication service providers:
* [Spotify](https://spotify.com/) (3 metrics)
* [WeatherAPI](https://www.weatherapi.com/) (1 metric)
* [Blockchain](https://www.blockchain.com/) (1 metric)

### Spotify metrics
To access further API requests, I must first get a bearer 2.0 authentication key, which refreshes every hour. With the second API key I could now get Spotify metrics. My Spotify metrics include a specific artist ID. I chose [Doja Cat](https://open.spotify.com/artist/5cj0lLjcoR7YOSnhnX0Po5) as my sample.
API call supplies all publicly available artist data, from which I gathered information on popularity ranking and number of followers.

### WeatherAPI metric
WeatherAPI requests in the app are made using a pre-generated API key obtained after registration. It returns information on location, pressure, humidity, temperature, wind, air quality and more in Maribor. I chose to extract temperature in Celsius.

### Blockchain metric
Blockchain ticker metric is a publicly accessible service that returns the current value of 1 BTC in various currencies. My metric used the EUR currency.


## Local logging
I have implemented a json logging system where individual log objects get stored in a logs array in the `logs.json` file. Log example:

```json
{
    "logs": [
        {
            "provider": "Spotify",
            "date": "2022-07-04 02:07:02",
            "metrics": [
                {
                    "key": "Popularity",
                    "value": 89
                },
                {
                    "key": "Followers",
                    "value": 20051895
                }
            ],
            "KPICount": 2,
            "status": "OK"
        }
    ]
}
```

## Unit tests
I have implemenented 3 different tests:
* Date format checking
* Blockchain API Testing
* Databox push testing

Date format test checks whether date has correct RegEx pattern for format consistency and also tests if given date exists, taking number of days, months and leap years into account. Blockchain API testing tests whether the site is responding with status 200 on request. Databox push test checks whether sample push data can be sent to our metric library with our token.


## Deployment instructions
The following installations are required to build or operate the program:
* JavaScript runtime environment: [NodeJS](https://nodejs.org/en/)
* Integrated development environment: [IntelliJ Idea](https://www.jetbrains.com/idea/)

### IntelliJ Idea setup
We begin by cloning the Git repository.
```
$ git clone https://github.com/Polloux/Backend-engineer-challenge.git
```
Installing dependencies.
```
$ npm install
```

The app code is full of comments which can help you understand my program even better.


### Storing personal tokens
Add directory `util` in the root of the repository and in it create a file `tokens.js` for storing your tokens. Add `util` to `.gitignore` for protection.
It should end up like this.
```js
const databoxToken = "yourToken";
const spotifyID = "yourToken";
const spotifySecret = "yourToken";
const weatherKey = "yourToken";

module.exports = {
    databoxToken,
    weatherKey,
    spotifyID,
    spotifySecret
}
```

### Running and testing
We can run the app with `npm start` and tests with `npm test`.

## Sample data
If all tests pass and we successfully send metrics and save logs they should look like this.
This is how logs should look like if all tests pass, metrics are sent and logs saved.

```json
{
    "logs": [
        {
            "provider": "Blockchain",
            "date": "2022-07-04 05:18:06",
            "metrics": [
                {
                    "key": "BTC value",
                    "value": 18322.02
                }
            ],
            "KPICount": 1,
            "status": "OK"
        },
        {
            "provider": "WeatherApi",
            "date": "2022-07-04 05:18:06",
            "metrics": [
                {
                    "key": "Current temperature",
                    "value": 18
                }
            ],
            "KPICount": 1,
            "status": "OK"
        },
        {
            "provider": "Spotify",
            "date": "2022-07-04 05:18:06",
            "metrics": [
                {
                    "key": "Popularity",
                    "value": 89
                },
                {
                    "key": "Followers",
                    "value": 20081700
                }
            ],
            "KPICount": 2,
            "status": "OK"
        },
        {
            "provider": "Spotify",
            "date": "2022-07-04 05:18:06",
            "metrics": [
                {
                    "key": "Tracks in album",
                    "value": 50
                }
            ],
            "KPICount": 1,
            "status": "OK"
        }
    ]
}
```        
Objects have `error_message` appended if a push fails.

```json
{
    "provider": "WeatherApi",
    "date": "2022-07-03 15:40:28",
    "metrics": [
        {
            "key": "Current temperature",
            "value": 31
        }
    ],
    "KPICount": 1,
    "status": "UNAUTHORIZED",
    "error_message": "Unauthorized - Invalid token!"
}
```

## Alternatives
* I noticed instructions had me log number of sent metrics. I would remove the parameter as it's not needed. Number of metrics can be calculated by the number of objects in the array and doesn't need to take up additional space.
* Json log quickly fills up. After 2 hours I already had altogether 3000 lines of logs. The longer it gets, the longer it takes to read the file, parse json and write to file. Doing so only after all five metrics have been generated would be a significant optimization. This could be done by keeping a temporary array and later appending it all at once.

## Databox databoard
Link coming soon
Email used in Databox: `neanikolic12@gmail.com`

This assignment was a lot of fun :)

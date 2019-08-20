const express = require('express');
const cors = require('cors');
require('dotenv').config();
const superagent = require('superagent');

const app = express();
app.use(cors());

app.get('/',(request, response) => {
    response.send('it works');
});

app.get('/location',(request, response) => {
    // response.send('here');
    try{
    superagent.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEOCODEAPI_KEY}`)
    .then((geoData) => {
    const location = new Location(request.query.data, geoData.body);
    //throw new Error();
    //console.log(geoData)
    response.send(location);
    });

    } catch(error){
        console.log(error);
        response.status(500).send('sorry, something went wrong')
    }
});

function Location(query, geoData){

    this.search_query = query;
    this.formatted_query = geoData.results[0].formatted_address;
    this.latitude = geoData.results[0].geometry.location.lat;
    this.longitude = geoData.results[0].geometry.location.lng;
}

app.get('/weather',(request, response) => {
    // response.send('Hot');
    try{
        const darkskyData = require('./darksky.json')
        const weather = new Weather(darkskyData)
        response.send(weather.weather);
    } catch(error){
        response.status(500).send('you dun goofed')
    }
});

let myDate = function(milli){
    let date = new Date(milli);
    return date;
}

function Weather(darkskyData){
    let days = [];
    for(const day of darkskyData['daily']['data']){
        let date = new Date(day.time * 1000);
        days.push({
            'forecast': day.summary,
            'time': date.toString().slice(0, 15)
        })
    this.weather = days;
    }};



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('server is listening');
});
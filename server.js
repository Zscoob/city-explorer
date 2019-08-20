const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

app.get('/',(request, response) => {
    response.send('it works');
});

app.get('/location',(request, response) => {
    // response.send('here');
    try{
    const geoData = require('./geo.json');
    const location = new Location(request.query.location, geoData)
    //throw new Error();
    response.send(location);
    } catch(error){
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
        response.send(weather);
    } catch(error){
        response.status(500).send('you dun goofed')
    }
})

// function dhm(t){
//     let cd = 24 * 60 * 60 * 1000,
//         ch = 60 * 60 * 1000,
//         y = ,
//         m = ,
//         d = Math.floor(t / cd),
//         h = Math.floor((t - d * cd) / ch),
//         m = Math.round((t - d * cd - h * ch) / 60000),
//         pad = function(n){return n < 10 ? '0' + n : n;
//     };
//     if(m === 60){
//         h++;
//         m = 0;
//     }
//     if(h === 24){
//         d++;
//         h = 0;
//     }
//     return [d, pad(h), pad(m)].join(':');
// } 
 // this.time = dhm(darkskyData.daily.data[0].time * 1000);

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
    }}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('server is listening');
});
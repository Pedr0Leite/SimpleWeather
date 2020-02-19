"use strict";
const request = require('request');
const bodyParser = require('body-parser');
const express = require('express');
const api_key = require('./credentials'); //Credentials aka API key
var app = express();


var port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));



app.get('/',(req, res)=>{ //Grab the HTML (in ejs format)
res.render('index', {weather: null, error: null});
});

app.post('/', (req, res)=>{ //grab the info from the API and "post it" in the html

    let city = req.body.city; //Grab the city
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`; //URL
    
    request(url, (err, response, body)=>{ //API Call
        if(err){
            res.render('index', {weather:null, error:'Error, please try again!'});
        }else{
            let weather = JSON.parse(body);
            if(weather.main == undefined){
                res.render('index', {weather:null, error:'Sorry, the weather condition for that city is unknown, please try again later or choose another city!'})
            }else{
                let weatherTempInfo = (weather.main.temp - 273.15).toFixed(2);
                let weatherInfo = `Its ${weatherTempInfo} degrees in ${weather.name}! You can expect wind with ${weather.wind.speed} speed and ${weather.main.humidity}% humidity today.`;;
                res.render('index', {weather: weatherInfo, error:null});
            }

        }
    });
});


app.listen(port, (err)=>{
if(err) {
    console.log(err);
};
console.log('Server is running');
});

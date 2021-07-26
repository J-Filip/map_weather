// desc : code that runs on the server (my pc) and listens


// something like importing an express module

const express = require ('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
const pool = require('./db');
require('dotenv').config();

//const enviroment = process.env.NODE_ENV || 'development';




// top level function from express module
const app = express();
// if envirometal variable or 3000 for local
const port = process.env.PORT || 3000;
// listen on localhost 3000 and log msg
app.listen(port, () => console.log(`Server listening at ${port}`));


// host static files from folder 'public'
app.use(express.static('public'));

// accessing client request's body
// limit post request on 1mb
app.use(express.json({limit: '1mb'}));
// define new instance od datastore
let database = new Datastore('database.db');
// load data from server into memory - creates new .db file when run fisrt time
database.loadDatabase();
//database.insert('TEST - inserted text into .db file');
// database.insert({
//     agent: 'Filip',
//     status: 'spreman',

// });

// ROUTES // 

// DESC endpoints - where client sends requests

//  ! when index.html page loads, client reads lat nad lon and sends GET request to server
//  route paramaters to send variables (lat, lon) from client side request
app.get('/api/weather/:latlon', async (request, response)=>{
    console.log('GET REQUEST FROM CLIENT WITH LAT AND LON VARIABLES');
    console.log(request.params);
    const requestData =  request.params.latlon.split(','); 
    const lat = requestData[0];
    const lon = requestData[1];

    // todo - use promise all instead
    // we fetch api server side because we use API KEY (CORS)
    const apiKey = process.env.API_KEY;
    //console.log(apiKey);
    let weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`);
    let weatherData = await weatherResponse.json();
    //console.log(weatherData);
    
    // open API so no key is needed
    let airReponse = await fetch(`https://api.openaq.org/v2/latest?coordinates=${lat},${lon}`);
    let airData = await airReponse.json();
    //console.log(airData);
    
    // we put fetched data to object and send it back to client
    const fetchedData = {
        weather: weatherData,
        air_quality : airData
    };
    response.json(fetchedData);

       });

// !  when client sends POST request to server
app.post('/api/weather', async (request, response) =>{
    console.log('GOT CLIENT REQUEST'); 
    const requestData = request.body;
    // create timestamp and add to request body
    const timestamp = new Date().toLocaleString('de-DE');
    requestData.timestamp = timestamp; 
    //console.log(timestamp);
    // insert client request data to neDB 
    database.insert(requestData);
    
    // destructure data for postgres db
    const {nickname,  lat, lon, weather:{sys:{country:country}}} = requestData;
    const area = requestData.weather.name;
    //console.log(area);
    // insert client request data to postgresDB 
    // returning returns inserted rows 
    try{
        const newCheckin = await pool.query('INSERT INTO checkin (nickname, timestamp, lat, lon, country, area) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [nickname, timestamp, lat, lon, country, area]);
        // response from server to client
        response.json({
            // send this msg back to client when server gets request 
            status: 'VERY NICE! Data stored in the database !',
            newCheckin,
            requestData
        });  
    }catch(err){ 
        console.log(err);
    };
    
})


// ! when client sends GET request to server
app.get('/api/weather', async  (request, response)=>{
    console.log('GET REQUEST FROM CLIENT');
        database.find({}).sort({ timestamp:-1}).exec(function (err, data) {
        if(err){
            response.end();
            return;
        }
        // response to client is data from database as json
        response.json(data);
    })
})

// ! when client sends GET request to server - my checkins
app.get('/api/mylogs', async  (request, response)=>{
    console.log('GET REQUEST FROM CLIENT');

    // get data from postgres DB
    const pgNicknames = await pool.query('SELECT * FROM checkin')
    
    // response to client is data from database as json
    //console.log(pgNicknames.rows);
    response.json(pgNicknames.rows);
});


// ! when client sends GET request to server - my checkins
app.get('/api/mylogs/:country', async  (request, response)=>{
    console.log('GET REQUEST FROM CLIENT');
    const {country} = request.params;

    // get data from postgres DB
    const pgNicknames = await pool.query('SELECT * FROM checkin WHERE country = $1 ORDER BY timestamp DESC LIMIT 20 ', [country])
    
    // response to client is data from database as json
    //console.log(pgNicknames.rows);
    response.json(pgNicknames.rows);
});
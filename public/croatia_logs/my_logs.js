// DESC:  draw map and list only user's checkins

// ! targets
//const myCheckins = document.getElementById('my-checkins');


// ! listeners
//myCheckins.addEventListener('click', getWeather);







// ! FUNCTIONS //

getWeather();

async function getWeather() {
// air and weather rewquest from our server
// let apiResponse = await fetch(`/api/weather/mylogs`)
// let apiJson = await apiResponse.json(); 

  let locationHistory = document.querySelector('.location-history');
  locationHistory.innerHTML = '';
  // send GET request to server
  let response = await fetch('/api/mylogs/HR');
  let data = await response.json();
  console.log(data);
  // response from server is data from database
  for(e of data){
    const { nickname, timestamp, lat, lon, country, area}= e;
    // one row from database    
      // DOM creating elements
      const logDiv = document.createElement('div')
      const row = document.createElement('p');
      //const rowImage = document.createElement('img');

        row.innerText = `Timestamp: ${timestamp}
        Nickname: ${nickname}
        Country: ${country}
        Longitude: ${lon}°
        Latitude: ${lat}° 
        Area: ${area}`;
        
        // City: ${e.weather.name} ||Country: ${e.weather.sys.country}|| Temperature: ${e.weather.main.temp} °C || Atmospheric pressure: ${e.weather.main.pressure} hPa 
        // Air Quality: ${e.airQuality.results[0].measurements[0].value}  ${e.airQuality.results[0].measurements[0].unit} `
        
      // DOM appending elements
      logDiv.append(row);
      locationHistory.appendChild(logDiv);
  }
}

placeMarker();
async function placeMarker() {
 // send GET request to server
 let response = await fetch('/api/mylogs/HR');
 let data = await response.json();
 //console.log(data);
 
  for(e of data){
    // destructuring uuuu
    //  const { lat, lon,timestamp, nickname, weather:{name:name, main:{temp:temp}}}= e;
     const { nickname, timestamp, lat, lon}= e;

     // text for the map marker popup
    let markerText = `${nickname} appeared here at ${timestamp}.`
   
    // add marker to map and position it
  const marker = L.marker([lat, lon]).addTo(mymap);
  marker.bindPopup(markerText); 
  }

};


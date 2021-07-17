
// ! targets


// TODO 
const filterAll = document.getElementById('filterAll');
// ! listeners
//filterAll.addEventListener('click', getWeather);


// ! functions

getWeather();

async function getWeather() {
  let locationHistory = document.querySelector('.location-history');
  locationHistory.innerHTML = '';
  // send GET request to server
  let response = await fetch('/api/weather');
  let data = await response.json();
  console.log(data);
  // response from server is data from database
  for(e of data){
    // one row from database 
    //console.log(e);
    const timestamp = new Date().toLocaleString('ro-RO');
    e.timestamp = timestamp; 
      
      // DOM creating
      const logDiv = document.createElement('p')
      const row = document.createElement('p');
      //const rowImage = document.createElement('img');

      // insert data into elements
      if(e.airQuality.value === -1){
        console.log('no air quality');
        console.log(e);
        row.innerText = `Timestamp: ${e.timestamp}
        Nickname: ${e.nickname}
        Area: ${e.weather.name}  ||Country: ${e.weather.sys.country} || Longitude: ${e.weather.coord.lon}° Latitude: ${e.weather.coord.lat}° || Temperature: ${e.weather.main.temp} °C || Atmospheric pressure: ${e.weather.main.pressure} hPa `;
      }else {

        row.innerText = `Timestamp: ${e.timestamp}
        City: ${e.weather.name}  ||Country: ${e.weather.sys.country} || Longitude: ${e.weather.coord.lon}° Latitude: ${e.weather.coord.lat}° || Temperature: ${e.weather.main.temp} °C || Atmospheric pressure: ${e.weather.main.pressure} hPa 
        Air Quality: ${e.airQuality.results[0].measurements[0].value}  ${e.airQuality.results[0].measurements[0].unit} `
        //rowImage.src = e.image64;
      }
        
      // DOM appending elements
      logDiv.append(row);
      locationHistory.appendChild(logDiv);
  }
}

// ! mapping 


placeMarker();
async function placeMarker() {
 // send GET request to server
 let response = await fetch('/api/weather');
 let data = await response.json();
 //console.log(data);

  for(e of data){
    const { lat, lon, weather:{name:name, main:{temp:temp}}}= e;

    let markerText = `The temperature in ${name} is currently ${temp} °​C.`
    if(e.airQuality.value === -1){
      markerText += '(No air quality reading!)';
    }else {
      
      markerText += `The concentration of particulate matter is ${e.airQuality.results[0].measurements[0].value}  ${e.airQuality.results[0].measurements[0].unit}`;

    }

  // destructuring uuuu
  const marker = L.marker([lat, lon]).addTo(mymap);
  marker.bindPopup(markerText); 
  }
};









// TODO filters for diffrend cities, days, etc.

// async function getData15h() {
//   let locationHistory = document.querySelector('.location-history');
//       locationHistory.innerHTML = '';
//   let response = await fetch('/api/15h', optionsGET);
//   let data = await response.json();
//   console.log(data);
//   for(e of data){
//      // const dateNow = new Date(e.timestamp).toLocaleString('ro-RO');

//       let locationHistory = document.querySelector('.location-history');
      

//       const logDiv = document.createElement('p')
//       const row = document.createElement('p');
//       const rowImage = document.createElement('img');

//       row.textContent = `Nickname: ${e.nickname} || latitude: ${e.lat} || longitude: ${e.lon} || timestamp: ${e.timestamp}`;
//       rowImage.src = e.image64;
//       logDiv.append(row, rowImage);
//       locationHistory.append(logDiv);
    
//   }
// }

  
    // async function getDataAll() {
    //   let locationHistory = document.querySelector('.location-history');
    //   locationHistory.innerHTML = '';
    //     let response = await fetch('/api/all', optionsGET);
    //     let data = await response.json();
    //     console.log(data);
    //     for(e of data){
    //         //const dateNow = new Date(e.timestamp).toLocaleString('ro-RO');

    //         const locationHistory = document.querySelector('.location-history');

    //         const logDiv = document.createElement('p')
    //         const row = document.createElement('p');
    //         const rowImage = document.createElement('img');

    //         row.textContent = ` latitude: ${e.lat} || longitude: ${e.lon} || timestamp: ${e.timestamp}`;
    //         rowImage.src = e.image64;
    //         // optional: add photo when checking in
    //         //logDiv.append(row, rowImage);
    //         logDiv.append(row);
    //         locationHistory.append(logDiv);
          
    //     }
    // }
  

  
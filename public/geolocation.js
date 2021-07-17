

const checkInBtn = document.getElementById('check-in_button');
//console.log(x.textContent);

// runs onLoad
function setup() {
  // p5.js library drawing
  // noCanvas();
  // const video = createCapture(VIDEO);
  // video.size(240, 180);
  if ('geolocation' in navigator) {
   // console.log('geolocation available');
    //const sendLocation = document.querySelector('.send-location');
    //sendLocation.addEventListener('click', async (event) => {
      // we made it an async function to wait for fetch response
      checkInBtn.addEventListener('click', () => {

        navigator.geolocation.getCurrentPosition(async (position) => {
          let lat, lon, nickname, weather, airQuality;
          
        try{
          
          lat = position.coords.latitude;
          lon = position.coords.longitude;
          nickname = document.querySelector("#nickname-input").value;
          if (nickname === ''){
            alert('Please enter Your nickname !');
            return ;
          }else{
            //console.log('cool nickname');
            document.querySelector("#nickname-input").value = '';
          }
        
        // DOM manipulation
        document.getElementById('lat').textContent = ` ${lat}°`;
        document.getElementById('lon').textContent = ` ${lon}°`;
        document.getElementById('nickname').textContent = ` ${nickname}!`;
        
        
        // air and weather rewquest from our server
        let apiResponse = await fetch(`/api/weather/${lat},${lon}`)
        let apiJson = await apiResponse.json(); 
        //console.log(apiJson);
        
        // our response is fetched data from server side API fetch 
        weather = apiJson.weather;
        airQuality = apiJson.air_quality;
        
        // dom manipulation - weather and air
          document.getElementById('city').textContent = weather.name;
          document.getElementById('temperature').textContent = weather.main.temp;
          document.getElementById('air_quality-parameter').textContent = airQuality.results[0].measurements[0].parameter;
          document.getElementById('air_quality-value').textContent = airQuality.results[0].measurements[0].value;
          document.getElementById('air_quality-unit').textContent = airQuality.results[0].measurements[0].unit;
          const lastUpdated = airQuality.results[0].measurements[0].lastUpdated;
          const dateNow = new Date(lastUpdated).toLocaleString('ro-RO');
          document.getElementById('air_quality-last_updated').textContent = dateNow;

          // message after check-in
          document.getElementById('logs-after').innerHTML = 'Go to <a href="/logs">Logs</a> to see Your location on the map.';

          // error handling
          }catch (error){
            console.error(error);
            // hardcode air quality if there is no reading
            airQuality = {value:-1}
            document.getElementById('air_quality-all').textContent = 'NO AIR QUALITY RESULTS FOR THIS LOCATION';
            
          };
          
          
          // put data in object
          const data = { lat, lon, nickname, weather, airQuality};
          // we specify options because we are now using POST method
          const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          };        
          
          // šaljemo response na server koji tamo insertamo u bazu
          const dbResponse = await fetch('/api/weather', options);
          const dbJson = await dbResponse.json();
          // we send msg from server back to client (ex. SUCCESS or FAILED) 
          console.log(dbJson);
          
        })
          
        });
        // });
        // if geolocation available in browser
  } else {
    console.log('geolocation not available');
    document.getElementById('geolocation-all').textContent = 'GEOLOCATION NOT AVAILABLE';
  }
}

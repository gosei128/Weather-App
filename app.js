const searchCity = document.getElementById('search')
const searchBtn = document.getElementById('search-btn')


searchBtn.addEventListener('click', ()=>{
    const name = searchCity.value;
    getWeather(name);


})
async function getWeather(cityName){
    
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=Manila&count=10&language=en&format=json`
     
    const response = await fetch(url)

    if(!response.ok){
        console.log('couldnt fetch data')
    }

    const data = await response.json()
    
    

}

getWeather()

function getWeatherInfo(data){


}
const searchCity = document.getElementById('search')
const searchBtn = document.getElementById('search-btn')
const currentDateEl = document.getElementById('current-date')
const weatherIcon = document.getElementById('sun-moon-icon')

searchBtn.addEventListener('click', ()=>{
    const name = searchCity.value;
    getWeather(name);
   
    searchCity.value = ""
})
async function getWeather(cityName){
     try{
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=10&language=en&format=json`
        const response = await fetch(url)
        if(!response.ok){
            console.log('couldnt fetch data')
            return
        }
        const data = await response.json()
        if(!data?.results?.length){
            console.log('no results for that location')
            return
        }
        const { latitude, longitude, name: placeName, country } = data.results[0]
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,apparent_temperature_max&hourly=temperature_2m,weather_code&current=temperature_2m,relative_humidity_2m,precipitation,is_day,wind_speed_10m,apparent_temperature,weather_code&timezone=auto`
        const weatherResponse = await fetch(weatherUrl)
        if(!weatherResponse.ok){
            console.log('couldnt fetch weather data')
            return
        }
        const weatherData = await weatherResponse.json()
        
        const 
        {apparent_temperature ,relative_humidity_2m, precipitation, wind_speed_10m} = weatherData.current

     
        const currentTemp = weatherData.current.temperature_2m
        const currentTime = weatherData.current.time
        const time = new Date(currentTime).toLocaleTimeString([],{
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        })
        const temperature = currentTemp.toFixed(0)



    
        currentWeather(placeName, country, temperature, time)
        currentWeatherData(apparent_temperature, relative_humidity_2m, wind_speed_10m, precipitation)
        dailyForecast(latitude, longitude)
        
        // getWeatherInfo(weatherData)
    }catch(err){
        console.error('Error getting weather:', err)
    }
}
getWeather('manila')


function currentWeather(city, country, temperature, time){
    document.getElementById('h1').innerText = `${city}, ${country}`
    document.getElementById('temp').innerText = `${temperature}°`
    document.getElementById('sun-icon').classList.remove('sr-only')
    const backgroundImg = document.getElementById('cardWeather')
    
    backgroundImg.classList.add('mobile:bg-[url(/assets/images/bg-today-small.svg)]','desktop:bg-[url(/assets/images/bg-today-large.svg)]')
    
    updateCurrentDate()

    // Get current hour for time-based logic
    const currentHour = new Date().getHours();
    
    // if (currentHour > 6 && currentHour < 18) {
    //     // Before 6 AM - early morning
        
    // } 
    //  else if(currentHour > 18 && currentHour < 6 ){
    //     // 6 PM to 6 AM - evening/night
    //     weatherIcon.src = './assets/images/icon-moon.webp';
    // }

}
function updateCurrentDate(){
    if(!currentDateEl) return
    const now = new Date()
    const formatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
    currentDateEl.textContent = formatter.format(now)
}

function currentWeatherData(apparentTemperature, humidity, windSpeed, precipitation){
    document.getElementById('apparentTemp').innerText = `${apparentTemperature}°`;
    document.getElementById('humidity').innerText = `${humidity}%`
    document.getElementById('windSpeed').innerText = `${windSpeed} km/h`
    document.getElementById('precipitation').innerText = `${precipitation} mm`
}

async function dailyForecast(lat, lon){
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,apparent_temperature_max&hourly=temperature_2m,weather_code&current=temperature_2m,relative_humidity_2m,precipitation,is_day,wind_speed_10m,apparent_temperature,weather_code&timezone=auto`
        const weatherResponse = await fetch(weatherUrl)
        if(!weatherResponse.ok){
            console.log('couldnt fetch weather data')
            return
        }
        const weatherData = await weatherResponse.json()

        const {apparent_temperature_max, temperature_2m_max, time, weather_code} = weatherData.daily

        const weatherIcons = {
            0: "icon-sunny.webp",     
            1: "icon-sunny.webp",        
            2: "icon-partly-cloudy.webp", 
            3: "icon-overcast.webp", 
            45: "icon-fog.webp",
            48: "icon-fog.webp",              
            51: "icon-drizzle.webp",      
            53: "icon-drizzle.webp",         
            55: "icon-drizzle.webp",      
            61: "icon-rain.webp",       
            63: "icon-rain.webp",         
            65: "icon-rain.webp",      
            66: "icon-rain.webp",           
            67: "icon-rain.webp",            
            71: "icon-snow.webp",             
            73: "icon-snow.webp",             
            75: "icon-snow.webp",            
            77: "icon-snow.webp",       
            80: "icon-rain.webp",             
            81: "icon-rain.webp",             
            82: "icon-rain.webp",            
            85: "icon-snow.webp",             
            86: "icon-snow.webp",             
            95: "icon-storm.webp",           
            96: "icon-storm.webp",            
            99: "icon-storm.webp"             
          };




        let html ='';
        time.forEach((element, i)=>{
            const weekday = new Date(element).toLocaleDateString('en-US', {
                weekday : "short"
            })

            let iconFile = weatherIcons[weather_code[i]] || 'icon-overcast.webp'

            const forecastHtml = `
            <div class=" mobile:w-[105px] mobile:h-[155px] rounded-[11px] border-1  border-neutral-600 bg-neutral-800" >
                <div class="flex flex-col h-[150px] justify-center items-center p-4 ">
                    <h4>${weekday}</h4>
                    <img src="./assets/images/${iconFile}" class="w-[63px] h-[63px]" alt="">
                <div class="flex justify-between w-[80px]">
                    <p>${(temperature_2m_max[i]).toFixed(0)}°</p>
                    <p>${(apparent_temperature_max[i].toFixed(0))}°</p>
                </div>
                </div>
            </div>`

            html += forecastHtml
        }
    )
    document.getElementById('container-dailyForecast').innerHTML = html
}


const API_Key="14ee28615150bef384263230d7b58bae";
const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userConatiner=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector(".form-container");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const grantAccessButton=document.querySelector("[data-grandAccess]");
const errorPage=document.querySelector("[data-errorPage]");
let searchInput=document.querySelector("[data-searchInput]");


//user Container variables
const cityName=document.querySelector("[data-cityName]");
const countryIcon=document.querySelector("[data-countryIcon]");
const desc=document.querySelector("[data-weatherDesc]");
const weatherIcon=document.querySelector("[data-weatherIcon]");
const temp=document.querySelector("[data-temp]");
const windspeed =document.querySelector("[data-windSpeed]");
const humidity =document.querySelector("[data-humidity]");
const cloudiness =document.querySelector("[data-cloudiness]");

// Switching Tabs
let currentTab =userTab;
currentTab.classList.add("current-tab");

//Putting event Listeners to Tabs
userTab.addEventListener('click',()=>{switchTabs(userTab)}); 
searchTab.addEventListener('click',()=>{switchTabs(searchTab)}); 

//getting session storage from naigator
function getfromSessionStorage(){
    const localCordinates=sessionStorage.getItem("user-coordinates");
    if(!localCordinates){
        console.log("there is no data in session");
        userInfoContainer.classList.remove('active');
        searchForm.classList.remove('active');
        grantAccessContainer.classList.add('active');
    }
    else{
        const coordinates=JSON.parse(localCordinates);
        fetchUserWeatherInfo(coordinates);

        userInfoContainer.classList.add('active');
    }
}


async function fetchUserWeatherInfo(coordinates){
    const{lat,lon}=coordinates;
    //make grantaccess container invisible
    grantAccessContainer.classList.remove('active');
    //make loading screen visible
    loadingScreen.classList.add('active');

   //  API CALL 
   try{
       const res=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_Key}`);
       const data=await res.json();
       loadingScreen.classList.remove('active');
       userInfoContainer.classList.add("active");
       renderWeatherInfo(data);
       console.log(data);
   }
   catch(err){
       loadingScreen.classList.remove('active');
   }
}


function renderWeatherInfo(weatherInfo){
    //getting the data from JSON format
    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather[0]?.description;
    weatherIcon.src=`https://openweathermap.org/img/wn/${weatherInfo?.weather[0]?.icon}.png`;
    let celcius=weatherInfo?.main?.temp-273.15;
    celcius=Math.floor(celcius * 100) / 100;
    temp.innerText=celcius+" °C";
    windspeed.innerText=weatherInfo?.wind?.speed+"m/s";
    humidity.innerText=weatherInfo?.main?.humidity+"%";
    cloudiness.innerText=weatherInfo?.clouds?.all+"%";
}


function switchTabs(clickedTab){
    if(clickedTab===currentTab)return;
    currentTab.classList.remove("current-tab");
    currentTab=clickedTab;
    currentTab.classList.add("current-tab");

    if(!searchForm.classList.contains('active')){
        errorPage.classList.remove("active") ;
        userInfoContainer.classList.remove('active');
        grantAccessContainer.classList.remove('active');
        searchForm.classList.add('active');
    }
    else{
        errorPage.classList.remove("active") ;
        searchForm.classList.remove('active');
        userInfoContainer.classList.add('active');
        //Now the user tab is active , check if Location access is there or not
        getfromSessionStorage();

    }

}



function getLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{

    }
}
function showPosition(position) {
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
grantAccessButton.addEventListener('click',getLocation);


searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(searchInput.value==="")return;
    fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city){
    errorPage.classList.remove("active") ;
    loadingScreen.classList.add('active');
    userInfoContainer.classList.remove('active');
    grantAccessContainer.classList.remove('active');
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_Key}`);
        const data=await response.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
        
    }
    catch(e){
        errorPage.classList.add("active") ;
        userInfoContainer.classList.remove("active");
    }

}

getfromSessionStorage();

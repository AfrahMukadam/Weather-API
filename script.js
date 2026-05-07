const apiKey = "c70557e0268646cdb91142054251706";

const input = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

// Audio setup
const audioRain = new Audio("./rain.mp3");
const audioThunder = new Audio("./thunder.mp3");

audioRain.loop = true;
audioThunder.loop = true;

// Search button click
searchBtn.addEventListener("click", async () => {
    const city = input.value.trim();

    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    // Unlock audio for Chrome/Safari
    try {
        await audioRain.play();
        audioRain.pause();
        audioRain.currentTime = 0;

        await audioThunder.play();
        audioThunder.pause();
        audioThunder.currentTime = 0;

    } catch (e) {
        console.log("Audio unlock blocked:", e);
    }

    getWeather(city);
});

// Fetch weather data
async function getWeather(city) {
    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
        );

        const data = await response.json();

        // Handle invalid city
        if (data.error) {
            alert("City not found. Please try again.");
            document.body.className = "default";
            stopAllSounds();
            return;
        }

        const condition = data.current.condition.text;
        const temp = data.current.temp_c;
        const iconUrl = "https:" + data.current.condition.icon;

        console.log("Condition:", condition);

        // Update UI
        document.getElementById("location").textContent =
            `${data.location.name}, ${data.location.country}`;

        document.getElementById("temp").textContent =
            `${temp}°C`;

        document.getElementById("icon").innerHTML =
            `<img src="${iconUrl}" alt="${condition}">`;

        document.getElementById("condition").textContent =
            condition;

        // Update background and sound
        setWeatherBackground(condition);
        playWeatherSound(condition);

    } catch (err) {
        console.error("Error:", err);
        alert("Error fetching weather data.");

        document.body.className = "default";
        stopAllSounds();
    }
}

// Change background based on weather
function setWeatherBackground(conditionText) {
    const body = document.body;

    // Reset classes
    body.className = "";

    const condition = conditionText.toLowerCase();

    if (
        condition.includes("sunny") ||
        condition.includes("clear")
    ) {
        body.classList.add("sunny");

    } else if (
        condition.includes("cloud") ||
        condition.includes("overcast") ||
        condition.includes("fog") ||
        condition.includes("mist")
    ) {
        body.classList.add("cloudy");

    } else if (
        condition.includes("rain") ||
        condition.includes("drizzle") ||
        condition.includes("shower")
    ) {
        body.classList.add("rainy");

    } else if (
        condition.includes("snow") ||
        condition.includes("sleet") ||
        condition.includes("ice")
    ) {
        body.classList.add("snowy");

    } else {
        body.classList.add("default");
    }
}

// Stop all sounds
function stopAllSounds() {
    audioRain.pause();
    audioThunder.pause();

    audioRain.currentTime = 0;
    audioThunder.currentTime = 0;
}

// Play weather sound
function playWeatherSound(conditionText) {
    const lowerCondition = conditionText.toLowerCase();

    // Stop previous sounds first
    stopAllSounds();

    // Rain sound
    if (
        lowerCondition.includes("rain") ||
        lowerCondition.includes("drizzle") ||
        lowerCondition.includes("shower")
    ) {

        audioRain.play().catch(err => {
            console.log("Rain playback blocked:", err);
        });

    }

    // Thunder sound
    else if (
        lowerCondition.includes("thunder")
    ) {

        audioThunder.play().catch(err => {
            console.log("Thunder playback blocked:", err);
        });

    }
}
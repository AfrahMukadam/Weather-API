const apiKey = "c70557e0268646cdb91142054251706"; // Replace this with your actual API key
const input = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", () => {
    const city = input.value.trim();
    if (city) {
        getWeather(city);
    }
});

async function getWeather(city) {
    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
        );
        const data = await response.json();

        if (data.error) {
            alert("City not found. Please try again.");
            document.body.className = "default";
            return;
        }

        const condition = data.current.condition.text;
        const temp = data.current.temp_c;
        const iconUrl = "https:" + data.current.condition.icon;

        // Debugging
        console.log("Condition:", condition);

        document.getElementById("location").textContent = `${data.location.name}, ${data.location.country}`;
        document.getElementById("temp").textContent = `${temp}°C`;
        document.getElementById("icon").innerHTML = `<img src="${iconUrl}" alt="${condition}">`;
        document.getElementById("condition").textContent = condition;

        setWeatherBackground(condition);
        playWeatherSound(condition);
    } catch (err) {
        console.error("Error:", err);
        alert("Error fetching weather data.");
        document.body.className = "default";
    }
}

function setWeatherBackground(conditionText) {
    const body = document.body;
    body.className = ""; // Reset

    const condition = conditionText.toLowerCase();

    if (condition.includes("sunny") || condition.includes("clear")) {
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

function playWeatherSound(conditionText) {
    const lowerCondition = conditionText.toLowerCase();
    const audioRain = new Audio("https://www.soundjay.com/nature/rain-01.mp3");
    const audioThunder = new Audio("https://www.soundjay.com/nature/thunder-01.mp3");

    audioRain.loop = true;
    audioThunder.loop = true;

    document.querySelectorAll("audio").forEach(audio => audio.pause());

    if (lowerCondition.includes("rain")) {
        audioRain.play();
    } else if (lowerCondition.includes("thunder")) {
        audioThunder.play();
    }
}
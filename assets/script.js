var q = "https://json.geoiplookup.io/";
var userCity = '';
var userState = '';
var fiveDay;
var sevenDay;
var timer = luxon.DateTime.local();
var haveData = false;

function setTimer() {
    var int = setInterval(() => {
        if (haveData) {
            timer = luxon.DateTime.local().setZone(sevenDay.data.timezone)
        } else {
            timer = luxon.DateTime.local();
        }
        $('h3').text(timer.toLocaleString(luxon.DateTime.DATETIME_FULL))
    }, 1000)
}

function displayWeather(data) {
    changeHero(fiveDay.data.city.name);
    $('h1').text(`${fiveDay.data.city.name}  ${parseInt(data.data.current.temp)}`)
    var newSup = $('<sup>');
    var newIcon = $('<i>')
    newIcon.addClass('icofont-fahrenheit')
    newSup.append(newIcon);
    $('h1').append(newIcon);
    $('.temp').each(function(ind, el) {
        $(el).text(`${parseInt(data.data.daily[ind].temp.max)}/${parseInt(data.data.daily[ind].temp.min)}`);
    })
    $('.day').each(function(ind, el) {
        var newDate = new Date(data.data.daily[ind].dt * 1000);
        var day = newDate.toDateString().slice(0, 3);
        $(el).text(`${day} ${newDate.getDate()}`);
    });

    $('.mainWeather').each(function(ind, el) {
        switch (data.data.daily[ind].weather[0].main.trim()) {
            case "Clouds":
                $(this).text('Cloudy');
                break;
            case "Rain":
                $(this).text('Rainy');
                break;
            case "Clear":
                $(this).text('Clear');
                break;
            case "Snow":
                $(this).text('Snow');
                break;
            case "Drizzle":
                $(this).text('Light Rain');
                break;
            case "Thunderstorm":
                $(this).text('Thunderstorms');
                break;
            default:
                $(this).text('Cloudy');
                break;
        }
    })


    $('.weatherIcon').each(function(ind, el) {
        switch (data.data.daily[ind].weather[0].main.trim()) {
            case "Clouds":
                $(this).attr('class', 'weatherIcon icofont-cloudy');
                break;
            case "Rain":
                $(this).attr('class', 'weatherIcon icofont-rainy');
                break;
            case "Clear":
                $(this).attr('class', 'weatherIcon icofont-sun');
                break;
            case "Snow":
                n$(this).attr('class', 'weatherIcon icofont-snow');
                break;
            case "Drizzle":
                $(this).attr('class', 'weatherIcon icofont-rainy-sunny');
                break;
            case "Thunderstorm":
                $(this).attr('class', 'weatherIcon icofont-rainy-thunder');
                break;
            default:
                $(this).attr('class', 'weatherIcon icofont-clouds');
                break;
        }
    })

    $('.content').each(function(ind, el) {
        $(el).text(` Humidity: ${data.data.daily[ind].humidity}        U.V.Index: ${data.data.daily[ind].uvi}      Wind Speed: ${data.data.daily[ind].wind_speed}`);
    });

    setTimeout(() => {
        $('.segment').dimmer('hide');
    }, 250);

}

function addLabel() {

    var haveLabel = false;

    $('.label').each(function(ind, el) {
        if ($(this).text().trim() == fiveDay.data.city.name.trim()) {
            haveLabel = true;
        };
    })

    if (haveLabel) return;

    var newAnch = $('<a>');
    var newDiv = $('<div>');
    var newIcon = $('<i>');
    newIcon.addClass('delete icon');
    newDiv.addClass('ui image label');
    newDiv.text(fiveDay.data.city.name);
    newDiv.append(newIcon);
    newAnch.append(newDiv);
    $('#tagRow').append(newAnch);

    $('.delete').click(function() {
        $($(this).parent().parent()).remove()
    })

    $('.label').click(function() {
        $('#cityInput').val($(this).text().trim());
        getWeather($('#cityInput').val());
    })
}

function getWeather(city) {
    $('.segment').dimmer('show');

    q = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=de7bd5e10ba48f1457012747849901b6`

    axios.get(q)
        .then(res => {
            var lat = res.data.city.coord.lat;
            var lon = res.data.city.coord.lon;

            fiveDay = res;

            q = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=imperial&appid=de7bd5e10ba48f1457012747849901b6`

            axios.get(q)
                .then(res => {
                    sevenDay = res;
                    haveData = true;
                    displayWeather(res);
                    addLabel();
                })
                .catch(e => {
                    console.log(e);
                })
        })
        .catch(e => {
            console.log(e);
        })
}

function changeHero(city) {

    var newstr = "";
    for (var i = 0; i < city.length; i++) {
        if (city[i] === ",") {
            break
        } else if (city[i] === " ") {
            newstr += "-";
        } else {
            newstr += city[i].toLowerCase();
        }
    }
    q = `https://api.teleport.org/api/urban_areas/slug:${newstr}/images/`;
    axios.get(q)
        .then(res => {
            var backImageMobile = new Image();
            backImageMobile.src = res.data.photos[0].image.mobile;
            var backImageWeb = new Image();
            backImageWeb.src = res.data.photos[0].image.web;

            backImageWeb.onload = function() {
                $('#cityHero').css('height', backImageWeb.height);
                $('#cityHero').css('background-image', `url("${backImageWeb.src}"`);
            }

        })
        .catch(e => {
            console.log(e);
        });
}


axios.get(q)
    .then(res => {
        $('h1').text(`${res.data.city}, ${res.data.region}`)
        userCity = res.data.city;
        userState = res.data.region
        getWeather(userCity);
    })
    .catch(e => {
        console.log(e);
    })

$('.ui.accordion').accordion();

$('.delete').click(function() {
    $($(this).parent().parent()).remove()
})

$('.label').click(function() {
    $('#cityInput').val($(this).text().trim());
    getWeather($('#cityInput').val());
})

$('#searchBtn').click(function() {
    if ($('#cityInput').val() != '' || $('#cityInput').val() != null) {
        getWeather($('#cityInput').val());
    }
})

setTimer();
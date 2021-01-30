// Global Variables
var q = "https://json.geoiplookup.io/";
var userCity = '';
var tags = [];
var loc;
var sevenDay;
var timer = luxon.DateTime.local();
var haveData = false;
var unit = "imperial";

// Start the timer and keep track of timezone changes
function setTimer() {
    let int = setInterval(() => {
        if (haveData) {
            timer = luxon.DateTime.local().setZone(sevenDay.data.timezone)
        } else {
            timer = luxon.DateTime.local();
        }
        $('h3').text(timer.toLocaleString(luxon.DateTime.DATETIME_FULL))
    }, 1000)
}

//Animate weather on the canvas dependant on current weather
function animateWeather(weather) {

    function makeCloud(type, num) {
        if (type === 'Norm') {
            let newDiv = $('<div>');
            newDiv.attr('id', 'cloud' + num);
            for (i = 1; i < 4; i++) {
                let newLayer = $('<div>');
                newLayer.addClass('layer' + i);
                newDiv.append(newLayer);
            }
            return newDiv;
        } else if (type === 'Rain') {
            let newDiv = $('<div>');
            newDiv.attr('id', 'rainCloud' + num);
            for (i = 1; i < 4; i++) {
                let newLayer = $('<div>');
                newLayer.addClass('rainLayer' + i);
                newDiv.append(newLayer);
            }
            return newDiv;
        } else if (type === 'Snow') {
            let newDiv = $('<div>');
            newDiv.attr('id', 'snowCloud' + num);
            for (i = 1; i < 4; i++) {
                let newLayer = $('<div>');
                newLayer.addClass('layer' + i);
                newDiv.append(newLayer);
            }
            return newDiv;
        }
    }
    $('.hill').css('background-color', 'green');
    $('#canvas').empty();
    console.log(weather);
    if (weather == "Clouds" || weather == "Clear") {
        $('body').css('background', 'lightblue');
        let newSun = $('<div>');
        newSun.attr('id', 'sun');
        $('#canvas').append(newSun);
        let newCloud = makeCloud('Norm', '1');
        $('#canvas').append(newCloud);
        if (weather == 'Clouds') {
            let newCloud = makeCloud('Norm', '2');
            $('#canvas').append(newCloud);
        }
    } else if (weather == "Rain" || weather == "Drizzle" || weather == "Thunderstorm") {
        $('body').css('background', 'linear-gradient(to bottom, #202020, #111119)');
        let rainCloud = makeCloud('Rain', '1');
        $('#canvas').append(rainCloud);
        let positions = ['12%', '13%', '14%', '15%', '16%', '17%', '18%', '19%'];
        let speeds = [0, 1, 2, 3, 4, 5];
        for (var i = 0; i < 5; i++) {
            let randNum = Math.floor(Math.random() * positions.length);
            let newDrop = $('<div>');
            newDrop.addClass('rainDrop');
            newDrop.css('left', positions[randNum]);
            positions.splice(randNum, 1);
            let rand = Math.floor(Math.random() * speeds.length);
            speeds.splice(rand, 1);
            newDrop.css('animation', `drop 0.${2+rand}s linear infinite`);
            $('#canvas').append(newDrop);
        };
        if (weather == "Thunderstorm" || weather == "Rain") {
            let rainCloud = makeCloud('Rain', '2');
            $('#canvas').append(rainCloud);
            let positions = ['20%', '13%', '14%', '15%', '16%', '17%', '18%', '19%'];
            let speeds = [0, 1, 2, 3, 4, 5];
            for (var i = 0; i < 5; i++) {
                let randNum = Math.floor(Math.random() * positions.length);
                let newDrop = $('<div>');
                newDrop.addClass('rainDrop');
                newDrop.css('right', positions[randNum]);
                positions.splice(randNum, 1);
                let rand = Math.floor(Math.random() * speeds.length);
                newDrop.css('animation', `drop 0.${2+speeds[rand]}s linear infinite`);
                speeds.splice(rand, 1);
                $('#canvas').append(newDrop);
            };
        }
    } else if (weather == "Snow") {
        $('body').css('background', 'linear-gradient(315deg, #b8c6db 0%, #f5f7fa 74%)');
        let snowCloud = makeCloud('Snow', '1');
        $('#canvas').append(snowCloud);
        let positions = ['20%', '21%', '22%', '23%', '16%', '17%', '18%', '19%'];
        let speeds = [0, 1, 2, 3, 4];
        for (var i = 0; i < 4; i++) {
            let randNum = Math.floor(Math.random() * positions.length);
            let newSnow = $('<div>');
            newSnow.addClass('snow');
            newSnow.css('right', positions[randNum]);
            positions.splice(randNum, 1);
            let rand = Math.floor(Math.random() * speeds.length);
            newSnow.css('animation', `snowFall ${5+speeds[rand]}s linear infinite`);
            speeds.splice(rand, 1);
            $('#canvas').append(newSnow);
        };
    }
}

// Populate weather data on the page
function displayWeather(data) {
    changeHero(loc.data.name);
    $('#cityName').text(`${loc.data.name}`)
    $('#cityTemp').text(`${parseInt(data.data.current.temp)}`);
    if (unit == "imperial") {
        $('#cityUnit').attr('class', 'icofont-fahrenheit');
    } else {
        $('#cityUnit').attr('class', 'icofont-celsius');
    }

    $('.high').each(function(ind, el) {
        $(el).text(`${parseInt(data.data.daily[ind].temp.max)}`);
    });

    $('.low').each(function(ind, el) {
        $(el).text(`${parseInt(data.data.daily[ind].temp.min)}`);
    });

    $('.day').each(function(ind, el) {
        let newDate = new Date(data.data.daily[ind].dt * 1000);
        let day = newDate.toDateString().slice(0, 3);
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
    });

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
                $(this).attr('class', 'weatherIcon icofont-snow');
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
    });

    $('.desc').each(function(ind, el) {
        $(el).text(`${data.data.daily[ind].weather[0].description.trim()}`);
    });


    $('.humid').each(function(ind, el) {
        $(el).text(` ${data.data.daily[ind].humidity} %`);
    });


    $('.uvi').each(function(ind, el) {
        $(el).text(` ${data.data.daily[ind].uvi}`);
        let uv = parseInt(data.data.daily[ind].uvi);
        switch (uv) {
            case 11:
                $(this).parent().attr('class', 'ui label image violet');
            case 8:
            case 9:
            case 10:
                $(this).parent().attr('class', 'ui label image red');
                break;
            case 6:
            case 7:
                $(this).parent().attr('class', 'ui label image orange');
                break;
            case 3:
            case 4:
            case 5:
                $(this).parent().attr('class', 'ui label image yellow');
                break;
            case 0:
            case 1:
            case 2:
                $(this).parent().attr('class', 'ui label image green');
                break;
        }
    });


    $('.wind').each(function(ind, el) {
        $(el).text(` ${data.data.daily[ind].wind_speed} MPH`);
    });

    animateWeather(data.data.current.weather[0].main.trim())

    setTimeout(() => {
        $('.segment').dimmer('hide');
    }, 250);

}

// Grab tags from local storage
function getTags() {
    if (localStorage.getItem('tags') === null) return;

    tags = JSON.parse(localStorage.getItem('tags'));

    tags.forEach(element => {
        addTag(element)
    });
}

// Add tag to page and local storage
function addTag(city) {

    let haveTag = false;

    $('.tag').each(function(ind, el) {
        if ($(this).text().trim().toLowerCase() == city.trim().toLowerCase()) {
            haveTag = true;
        };
    })

    if (haveTag) return;

    if (!tags.includes(city)) tags.push(city);

    let newAnch = $('<a>');
    let newDiv = $('<div>');
    let newIcon = $('<i>');
    newIcon.addClass('delete icon');
    newDiv.addClass('ui tag image label');
    newDiv.text(city.trim());
    newDiv.append(newIcon);
    newAnch.append(newDiv);
    $('#tagRow').append(newAnch);

    localStorage.setItem('tags', JSON.stringify(tags));
}

// Openweather API call
function getWeather(city) {
    $('.segment').dimmer('show');

    q = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=de7bd5e10ba48f1457012747849901b6`

    axios.get(q)
        .then(res => {
            console.log(res);
            let lat = res.data.coord.lat;
            let lon = res.data.coord.lon;

            loc = res;

            var qu = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=${unit}&appid=de7bd5e10ba48f1457012747849901b6`

            axios.get(qu)
                .then(res => {
                    sevenDay = res;
                    haveData = true;
                    displayWeather(res);
                    addTag(loc.data.name);
                })
                .catch(e => {
                    console.log(e);
                })
        })
        .catch(e => {
            console.log(e);
        })
}

// change background to city image
function changeHero(city) {

    let newstr = "";
    for (var i = 0; i < city.length; i++) {
        if (city[i] === ",") {
            break
        } else if (city[i] === " ") {
            newstr += "-";
        } else {
            newstr += city[i].toLowerCase();
        }
    }
    if (newstr == "washington-d.c.") newstr = "washington-dc";
    if (newstr == "san-francisco") newstr = "san-francisco-bay-area";
    if ((newstr == "tampa") || (newstr == "tampa-bay")) newstr = "tampa-bay-area";
    if (newstr == "portland") newstr = "portland-or";
    if (newstr == "minneapolis") newstr = "minneapolis-saint-paul"
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

// change from Fahrenheit/Celsius
function setUnit(choice) {
    unit = choice;
    if (unit == "metric") {
        $('#togLabel').text('Celsius');
        $('.icofont-fahrenheit').each(function(ind, el) {
            $(this).attr('class', 'icofont-celsius');
        });
        $('.temp').each(function(ind, el) {
            let temp = parseInt($(this).text());
            let temper = (temp - 32) * (5 / 9);
            temp = Math.round(temper);
            $(this).text(temp);
        });
    } else {
        $('#togLabel').text('Fahrenheit');
        $('.icofont-celsius').each(function(ind, el) {
            $(this).attr('class', 'icofont-fahrenheit');
        });
        $('.temp').each(function(ind, el) {
            let temp = parseInt($(this).text());
            let temper = (temp * (9 / 5)) + 32;
            temp = Math.round(temper);
            $(this).text(temp);
        });
    }
}

$(document).ready(() => {

    axios.get(q)
        .then(res => {
            userCity = res.data.city;
            getWeather(userCity);
        })
        .catch(e => {
            console.log(e);
        })

    $('.ui.accordion').accordion();
    $('.ui.checkbox').checkbox({
        onChecked: function() { setUnit("metric") },
        onUnchecked: function() { setUnit("imperial") }
    });

    $(document).on('click', '.delete', function(e) {
        e.stopPropagation();
        let j = tags.length;
        for (let i = 0; i < j; i++) {
            if ($(this).parent().text() == tags[i]) {
                tags.splice(i, 1);
            }
        }
        localStorage.setItem('tags', JSON.stringify(tags));
        $($(this).parent().parent()).remove()
    })

    $(document).on('click', '.tag', function() {
        $('#cityInput').val($(this).text().trim());
        getWeather($(this).text().trim());
    })

    $('#searchBtn').click(function() {
        if ($('#cityInput').val() != '') {
            getWeather($('#cityInput').val());
        }
    })

    $('form').submit((e) => {
        e.preventDefault();
        if ($('#cityInput').val() != '') {
            getWeather($('#cityInput').val());
        }
    })

    $('#settBtn').click(() => {
        $('.ui.modal').modal('show');
    })

    setTimer();
    getTags();
});
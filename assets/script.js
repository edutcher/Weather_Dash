var q = "https://json.geoiplookup.io/";
var userCity = '';
var tags = [];
var loc;
var sevenDay;
var timer = luxon.DateTime.local();
var haveData = false;
var unit = "imperial";

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

function animateWeather(weather) {
    $('#canvas').empty();
    console.log(weather);
    if (weather == "Clouds" || weather == "Clear") {
        $('body').css('background', 'lightblue');
        var newSun = $('<div>');
        newSun.attr('id', 'sun');
        $('#canvas').append(newSun);
        var cloud1 = $('<div>');
        var cloud2 = $('<div>');
        cloud1.attr('id', 'cloud1');
        cloud2.attr('id', 'cloud2');
        var clouds = [cloud1, cloud2];
        for (i = 0; i < 2; i++) {
            var newLayer1 = $('<div>');
            var newLayer2 = $('<div>');
            var newLayer3 = $('<div>');
            newLayer1.addClass('layer1');
            newLayer2.addClass('layer2');
            newLayer3.addClass('layer3');
            clouds[i].append(newLayer1);
            clouds[i].append(newLayer2);
            clouds[i].append(newLayer3);
            $('#canvas').append(clouds[i]);
        }
    } else if (weather == "Rain" || weather == "Drizzle" || weather == "Thunderstorm") {
        $('body').css('background', 'linear-gradient(to bottom, #202020, #111119)');
        var rainCloud = $('<div>');
        rainCloud.attr('id', 'rainCloud1');
        var newLayer1 = $('<div>');
        var newLayer2 = $('<div>');
        var newLayer3 = $('<div>');
        newLayer1.addClass('rainLayer1');
        newLayer2.addClass('rainLayer2');
        newLayer3.addClass('rainLayer3');
        rainCloud.append(newLayer1);
        rainCloud.append(newLayer2);
        rainCloud.append(newLayer3);
        $('#canvas').append(rainCloud);
        var positions = ['12%', '13%', '14%', '15%', '16%', '17%', '18%', '19%'];
        var speeds = [0, 1, 2, 3, 4, 5];
        for (var i = 0; i < 5; i++) {
            var rand = Math.floor(Math.random() * positions.length);
            var newDrop = $('<div>');
            newDrop.addClass('rainDrop');
            newDrop.css('left', positions[rand]);
            positions.splice(rand, 1);
            var rand = Math.floor(Math.random() * speeds.length);
            speeds.splice(rand, 1);
            newDrop.css('animation', `drop 0.${2+rand}s linear infinite`);
            $('#canvas').append(newDrop);
        };
        if (weather == "Thunderstorm" || weather == "Rain") {
            var rainCloud = $('<div>');
            rainCloud.attr('id', 'rainCloud2');
            var newLayer1 = $('<div>');
            var newLayer2 = $('<div>');
            var newLayer3 = $('<div>');
            newLayer1.addClass('rainLayer1');
            newLayer2.addClass('rainLayer2');
            newLayer3.addClass('rainLayer3');
            rainCloud.append(newLayer1);
            rainCloud.append(newLayer2);
            rainCloud.append(newLayer3);
            $('#canvas').append(rainCloud);
            var positions = ['20%', '13%', '14%', '15%', '16%', '17%', '18%', '19%'];
            var speeds = [0, 1, 2, 3, 4, 5];
            for (var i = 0; i < 5; i++) {
                var rand = Math.floor(Math.random() * positions.length);
                var newDrop = $('<div>');
                newDrop.addClass('rainDrop');
                newDrop.css('right', positions[rand]);
                positions.splice(rand, 1);
                var rand = Math.floor(Math.random() * speeds.length);
                speeds.splice(rand, 1);
                newDrop.css('animation', `drop 0.${2+rand}s linear infinite`);
                $('#canvas').append(newDrop);
            };
        }
    }
}

function displayWeather(data) {
    changeHero(loc.data.data[0].name);
    $('#cityName').text(`${loc.data.data[0].name}`)
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

    $('.humid').each(function(ind, el) {
        $(el).text(` ${data.data.daily[ind].humidity} %`);
    });


    $('.uvi').each(function(ind, el) {
        $(el).text(` ${data.data.daily[ind].uvi}`);
        var uv = parseInt(data.data.daily[ind].uvi);
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

function getTags() {
    if (localStorage.getItem('tags') === null) return;

    tags = JSON.parse(localStorage.getItem('tags'));

    tags.forEach(element => {
        addTag(element)
    });
}

function addTag(city) {

    var haveTag = false;

    $('.tag').each(function(ind, el) {
        if ($(this).text().trim() == city.trim()) {
            haveTag = true;
        };
    })

    if (haveTag) return;

    if (!tags.includes(city)) tags.push(city);

    var newAnch = $('<a>');
    var newDiv = $('<div>');
    var newIcon = $('<i>');
    newIcon.addClass('delete icon');
    newDiv.addClass('ui tag image label');
    newDiv.text(city.trim());
    newDiv.append(newIcon);
    newAnch.append(newDiv);
    $('#tagRow').append(newAnch);

    $('.delete').click(function(e) {
        e.stopPropagation();
        var j = tags.length;
        for (var i = 0; i < j; i++) {
            if ($(this).parent().text() == tags[i]) {
                tags.splice(i, 1);
            }
        }
        localStorage.setItem('tags', JSON.stringify(tags));
        $($(this).parent().parent()).remove()
    })

    localStorage.setItem('tags', JSON.stringify(tags));
}

function getWeather(city) {
    $('.segment').dimmer('show');

    q = `http://api.positionstack.com/v1/forward?access_key=8de1f8f20b5f359e8d3495d7877af09b&query=${city}`

    axios.get(q)
        .then(res => {
            var lat = res.data.data[0].latitude;
            var lon = res.data.data[0].longitude;

            loc = res;

            q = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=${unit}&appid=de7bd5e10ba48f1457012747849901b6`

            axios.get(q)
                .then(res => {
                    sevenDay = res;
                    haveData = true;
                    displayWeather(res);
                    addTag(loc.data.data[0].name);
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

function setUnit(choice) {
    unit = choice;
    if (unit == "metric") {
        $('#togLabel').text('Celsius');
        $('.icofont-fahrenheit').each(function(ind, el) {
            $(this).attr('class', 'icofont-celsius');
        });
        $('.temp').each(function(ind, el) {
            var temp = parseInt($(this).text());
            var temper = (temp - 32) * (5 / 9);
            temp = Math.round(temper);
            $(this).text(temp);
        });
    } else {
        $('#togLabel').text('Fahrenheit');
        $('.icofont-celsius').each(function(ind, el) {
            $(this).attr('class', 'icofont-fahrenheit');
        });
        $('.tempHigh').each(function(ind, el) {
            var temp = parseInt($(this).text());
            var temper = (temp * (9 / 5)) + 32;
            temp = Math.round(temper);
            $(this).text(temp);
        });
    }
}

$(document).ready(() => {

    // axios.get(q)
    //     .then(res => {
    //         userCity = res.data.city;
    //         getWeather(userCity);
    //     })
    //     .catch(e => {
    //         console.log(e);
    //     })

    $('.ui.accordion').accordion();
    $('.ui.checkbox').checkbox({
        onChecked: function() { setUnit("metric") },
        onUnchecked: function() { setUnit("imperial") }
    });

    $('.delete').click(function(e) {
        e.stopPropagation();
        var j = tags.length;
        for (var i = 0; i < j; i++) {
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
        if ($('#cityInput').val() != '' || $('#cityInput').val() != null) {
            getWeather($('#cityInput').val());
        }
    })

    $('form').submit((e) => {
        e.preventDefault();
        if ($('#cityInput').val() != '' || $('#cityInput').val() != null) {
            getWeather($('#cityInput').val());
        }
    })

    $('#settBtn').click(() => {
        $('.ui.modal').modal('show');
    })

    setTimer();
    getTags();
});
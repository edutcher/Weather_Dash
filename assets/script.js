var q = "https://json.geoiplookup.io/";
var userCity = '';
var userState = '';

function getWeather(city) {

    q = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=de7bd5e10ba48f1457012747849901b6`

    axios.get(q)
        .then(res => {
            console.log(res);
            var lat = res.data.city.coord.lat;
            var lon = res.data.city.coord.lon;

            q = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=imperial&appid=de7bd5e10ba48f1457012747849901b6`

            axios.get(q)
                .then(res => {
                    console.log(res);
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
        if (city[i] === " ") {
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


// axios.get(q)
//     .then(res => {
//         $('h1').text(`${res.data.city}, ${res.data.region}`)
//         userCity = res.data.city;
//         userState = res.data.region
//         changeHero(userCity);
//     })
//     .catch(e => {
//         console.log(e);
//     })

$('.ui.accordion').accordion();

$('.delete').click(function() {
    $($(this).parent().parent()).remove()
})

$('.label').click(function() {
    $('#cityInput').val($(this).text().trim())
})

$('#searchBtn').click(function() {
    if ($('#cityInput').val() != '' || $('#cityInput').val() != null) {
        getWeather($('#cityInput').val());
    }
    changeHero($('#cityInput').val())
})
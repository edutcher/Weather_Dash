var q = "https://json.geoiplookup.io/"
var userCity = '';

axios.get(q)
    .then(res => {
        $('h1').text(`${res.data.city}, ${res.data.region}`)
        userCity = res.data.city.toLowerCase();
        var newstr = "";
        for (var i = 0; i < userCity.length; i++) {
            if (userCity[i] === " ") {
                newstr += "-";
            } else {
                newstr += userCity[i]
            }
        }
        q = `https://api.teleport.org/api/urban_areas/slug:${res.data.city.toLowerCase()}/images/`;
        axios.get(q)
            .then(res => {
                console.log(res);
                var backImage = res.data.photos[0].image.web;
                $('#cityHero').css('background-image', `url("${backImage}"`);
            })
            .catch(e => {
                console.log(e);
            });
    })
    .catch(e => {
        console.log(e);
    })

$('.ui.accordion').accordion();

$('.delete').click(function() {
    $($(this).parent().parent()).remove()
})

$('.label').click(function() {
    $('#cityInput').val($(this).text().trim())
})
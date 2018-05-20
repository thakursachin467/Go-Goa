var map_location = [{
        name: 'Casino Royale ',
        location: [15.501766065222494, 73.82690138182622],
        id: "4e64c921aeb7360315e8c0af",
        type: "Casino",
        show: true
    },
    {
        name: ' Casino Pride ',
        location: [15.501886770599752, 73.8277801725433],
        id: "4e07b2b652b165b7d7b03d63",
        type: "Casino",
        show: true
    },
    {
        name: 'Deltin Royale ',
        location: [15.500657379996996, 73.8311574495556],
        id: "53cd6412498e4047bd6577f8",
        type: "Casino",
        show: true
    },
    {
        name: 'Deltin Jaqk ',
        location: [15.502119885335803, 73.82737338175467],
        id: "526b2d0111d20543a7e35ae0",
        type: "Casino",
        show: true
    },
    {
        name: 'Anjuna Beach ',
        location: [15.576338710218398, 73.7406748636064],
        id: "4bd2e62fcaff95210094d3f0",
        type: "Beach",
        show: true
    },
    {
        name: 'Baga Beach ',
        location: [15.557166506557026, 73.75152344495682],
        id: "4b9f686bf964a520ce2037e3",
        type: "Beach",
        show: true
    },
    {
        name: 'Calangute Beach ',
        location: [15.544955805642918, 73.7573152442135],
        id: "4c0a548f340720a11e2d8693",
        type: "Beach",
        show: true
    },
    {
        name: 'Candolim Beach ',
        location: [15.517358733772253, 73.76487650815488],
        id: "4b62f085f964a520ca592ae3",
        type: "Beach",
        show: true
    },
    {
        name: "Chef Fernando's Nostalgia ",
        location: [15.319264671210238, 73.98390110872793],
        id: "4bc1831fb492d13a6639a660",
        type: "Food",
        show: true
    },
    {
        name: "Hard Rock Hotel Goa ",
        location: [15.545985974125125, 73.76672366007875],
        id: "567d33c9498eb5432e95b54a",
        type: "Resort",
        show: true
    },
    {
        name: "Park Hyatt Goa Resort And Spa ",
        location: [15.327479387246473, 73.89870231194088],
        id: "52cc72e2498e3408632fb836",
        type: "Resort",
        show: true
    },
    {
        name: "Vivanta by Taj - Holiday Village, Goa ",
        location: [15.500242448991493, 73.769283283369893],
        id: "541ff72d498e5208ede1ceaf",
        type: "Resort",
        show: true
    },
    {
        name: "Taj Exotica Hotel Benaulim ",
        location: [15.244223978563046, 73.9248824539007],
        id: "4bd7315d304fce72be3233ab",
        type: "Resort",
        show: true
    },
    {
        name: "Thalassa Greek Taverna ",
        location: [15.594663255655089, 73.73508661384811],
        id: "4d04eb89e350b60c83d78542",
        type: "Food",
        show: true
    },
    {
        name: "A Reverie ",
        location: [15.53360928428252, 73.76006375349918],
        id: "4f1b06bfe4b035290dd5121b",
        type: "Food",
        show: true
    },
    {
        name: "Burger Factory ",
        location: [15.585731750701752, 73.74356505641359],
        id: "5081724ae4b0e5b151711fba",
        type: "Food",
        show: true
    }
];
var map, marker;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: {
            lat: 15.496777,
            lng: 73.827827
        },


    });


    ko.applyBindings(new markerdisplay());

}

self.ajaxRequest = function(marker) {
    $.ajax({
        url: "https://api.foursquare.com/v2/venues/" + marker.id + '?client_id=FPFSO3VELDKV40HYOVEDB3212KQ3B5YH42DW0BE3025HRXAA&client_secret=5XHCQR55KPXA30TNRFZOWBMARU5AR5QYKEIIE30XJVEWEFT0&v=20180519',
        datatype: "json",
        success: function(result) {
            var details = result.response.venue;
            console.log(details.likes.summary);
            if (details.hasOwnProperty('likes')) {
                marker.likes = details.likes.summary;
            }
            if (details.hasOwnProperty('rating')) {
                marker.rating = details.rating;
            }

        },
        error: function(error) {
            self.error("Foursquare is unable to provide you results. Try again after some time.")
        }


    });
};


function markerdisplay() {
    var self = this;
    var infowindow = new google.maps.InfoWindow({
        maxwidth: 400,


    });

    self.locationList = [];

    for (var i = 0; i < map_location.length; i++) {
        marker = new google.maps.Marker({


            position: {
                lat: map_location[i].location[0],
                lng: map_location[i].location[1]
            },

            map: map,
            name: map_location[i].name,
            id: map_location[i].id,
            show: ko.observable(map_location[i].show),
            type: map_location[i].type

        });


        self.locationList.push(marker);

        self.locationList[self.locationList.length - 1];
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            ajaxRequest(marker);

            return function() {

                infowindow.setContent("<p><b>" + map_location[i].name + "</b>" + "<div>" + map_location[i].type + "</div>" + "<div>" + "Likes: " + marker.likes + "</div>" + "<div>" + "Rating: " + marker.rating + " ⭐" + "</div>" + "</p>");
                infowindow.open(map, marker);

                if (marker.getAnimation() !== null) {
                    marker.setAnimation(null);
                } else {
                    infowindow.close();
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                }


            }
        })(marker, i));

    }
    


    self.searchText = ko.observable('');
    self.search = ko.dependentObservable(function() {
        infowindow.close();
        var search = self.searchText().toLowerCase();
        for (var i = 0; i < self.locationList.length; i++) {
            if (self.locationList[i].name.toLowerCase().indexOf(search) > -1) {
                self.locationList[i].show(true);
                self.locationList[i].setVisible(true);


            } else {
                self.locationList[i].show(false);
                self.locationList[i].setVisible(false);


            }



        }



    });

    self.function1 =  function() {
        for (var j = 0; j < self.locationList.length; j++) {
            if (self.locationList[j].type.localeCompare("Casino")==0)
             { 
                self.locationList[j].show(true);
                self.locationList[j].setVisible(true);

            }
            else{
              self.locationList[j].show(false);
              self.locationList[j].setVisible(false);
            }
        }
    }
    self.function2 =  function() {
        for (var j = 0; j < self.locationList.length; j++) {
            if (self.locationList[j].type.localeCompare("Beach")==0)
             { 
                self.locationList[j].show(true);
                self.locationList[j].setVisible(true);

            }
            else{
              self.locationList[j].show(false);
              self.locationList[j].setVisible(false);
            }
        }
    }
    self.function3 =  function() {
        for (var j = 0; j < self.locationList.length; j++) {
            if (self.locationList[j].type.localeCompare("Resort")==0)
             { 
                self.locationList[j].show(true);
                self.locationList[j].setVisible(true);

            }
            else{
              self.locationList[j].show(false);
              self.locationList[j].setVisible(false);
            }
        }
    }
    self.function4 =  function() {
        for (var j = 0; j < self.locationList.length; j++) {
            if (self.locationList[j].type.localeCompare("Food")==0)
             { 
                self.locationList[j].show(true);
                self.locationList[j].setVisible(true);

            }
            else{
              self.locationList[j].show(false);
              self.locationList[j].setVisible(false);
            }
        }
    }
    self.function5 =  function() {
        for (var j = 0; j < self.locationList.length; j++) {
           
                self.locationList[j].show(true);
                self.locationList[j].setVisible(true);

            
           
        }
    }

}
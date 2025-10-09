google.charts.load('current', {
    packages: ['corechart']
      }).then(function () {
        var query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/10-nVF_FYuLg8kvyCRwmaIs1p8ZhH_dMd5XYLHPj2ncY/gviz/tq?gid=0&headers=1');
    query.send(function (response) {
      if (response.isError()) {
        console.log('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
        return;
      };
      var dt = response.getDataTable();
      var markerJsonData = dt.toJSON();
      markerJsonData = JSON.parse(markerJsonData);
      markersData = markerJsonData.rows;
      markersFields = markerJsonData.cols;
      var rows = [];
      markersData.forEach((marker, i) =>
      {
        var rowObject = {};
        for (var j=0; j<marker.c.length; j++) {
            if (marker.c[j]) {
              rowObject[markersFields[j].label] = marker.c[j].v;
            }
            else {
              rowObject[markersFields[j].label] = "";
            }
        };
        rows.push(rowObject);
      });
      markers = rows;
      buildMap(markers);
      //resizeToolTips();
    });
  });

function buildMap (markers) {
    console.log(markers);
 var map = L.map('map').setView([37.33556055149797, -121.88534082386907], 16
            );
            var myMarker = L.marker(map.getCenter()).addTo(map);
            
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                 maxZoom: 19,
                 attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
            map.locate({setView: true, watch: true, maxZoom: 16});
            function onLocationFound(e) {

                myMarker.setLatLng(e.latlng);
                map.setView(marker.getLatLng(),map.getZoom()); 
                //alert('Marker has been set to position :'+marker.getLatLng().toString());
                //var radius = e.accuracy;

                //myMarker = L.marker(e.latlng).addTo(map)
                    //.bindPopup("You are within " + radius + " meters from this point").openPopup();

                //L.circle(e.latlng, radius).addTo(map);
            }


            map.on('locationfound', onLocationFound);

            function onLocationError(e) {
                alert(e.message);
            }

            map.on('locationerror', onLocationError);

markers.forEach((element, index, array) => {
      
        //create the marker layer
        var location = [0,0]
        if (element.coordinates) {
          location = element.coordinates.split(',');
        };
        //popup HTML
        var popupBodyText =""
        if (element.popupBody) {
          popupBodyText = '<p>'+element.popupBody+'</p>';
        }
        else {
          popupBodyText = element.popupBody;
        };
        var popupBodyImage = ""
        if (element.imageURL) {
          popupBodyImage = '<img src="'+element.imageURL+'">';
        }

        var popupButton = ""
        if (element.buttonURL) {
          popupButton = '<a href="'+element.buttonURL+'"><button>More</button></a>';
        }
        var myUSDZ=""
        if (element.usdz) {
          myUSDZ='ios-src="assets/'+element.usdz+'" ';
        }

        var myModel = ""
        if (element.model) {
            myModel='<model-viewer src="assets/'+element.model+'" '+myUSDZ+' autoplay ar ar-scale="fixed" camera-controls touch-action="pan-y" alt="'+element.popupHead+'" shadow-intensity="2" max-camera-orbit="auto 90deg auto" xr-environment></model-viewer>'
        }

         var popup = L.popup({
            pane: 'fixed', // created above
            className: 'popup-fixed',
            autoPan: false,
            maxWidth : 560,
        }).setContent('<div class = "modal-content"></button><h3>'+element.popupHead+'</h3>'+ popupBodyText+myModel+'</div>');


        var thisMarker = L.marker(location, {
            alt:element.popupHead,
            title:element.popupHead,
        
        
        }).bindPopup(popup).addTo(map);
        thisMarker._icon.classList.add("huechange");
    
        thisMarker.addTo(map);
        
    
    });
     //fixed pane for popups
      var pane = map.createPane('fixed', document.getElementById('map'));

}

var map;

  var simbolo_flecha = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
    strokeColor: '#FFFFFF',
    strokeOpacity:  0,
    strokeWeight: 2,
    scale:        2,
    fillColor:      '#FFFFFF',
    fillOpacity:  1
  };
  var metropolitanoTotal;

initMap();

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -12.0221087, lng: -77.0407332},
    zoom: 13
  });


 metropolitanoTotal = new google.maps.Polyline({
    path: metropolitano,
    geodesic: true,
    editable: true,
    visible: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2,
    icons: [{
      icon: simbolo_flecha,
      offset: '5%',
      repeat: '50px'
    }]
  });

	metropolitanoTotal.setMap(map);

}

function guardar(){
  var array = [];

  for (var i = 0; i < metropolitanoTotal.getPath().j.length; i++) {
    array[i] = metropolitanoTotal.getPath().j[i].lat()+","+metropolitanoTotal.getPath().j[i].lng()
  };

 console.log(array);

}
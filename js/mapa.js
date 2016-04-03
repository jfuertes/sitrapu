function initMap(){
	var latitude = -12.020345;
	var longitude = -77.050299;
	var opciones = {
		zoom:14,
		mapTypeId:google.maps.MapTypeId.ROADMAP,
		center: new google.maps.LatLng(latitude, longitude)
	};
	var  canvas = $("#mapa")[0];
	window.map = new google.maps.Map(canvas, opciones);
}

$(document).ready(function(){
	//google.maps.event.addDomListener(window,'load',todoBien);
});


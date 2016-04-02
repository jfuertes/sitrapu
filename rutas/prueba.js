var map					= null;
var directionsOrigen;
var directionsDestino;
var directionsService 	= new google.maps.DirectionsService();
var rutas				= [];
var iconos				= [];
var latlng				= null;
var latLngs				= ['origen', 'destino', 'punto', 'croquis', 'punto_de_interes', 'informacion_punto_de_interes'];
latLngs.origen = null, latLngs.destino = null, latLngs.punto = null, latLngs.croquis = null, latLngs.punto_de_interes = null, latLngs.informacion_punto_de_interes = null;
var anuncios			= [];
var colores				= ['#EE0000', '#0088DD'];
var punto				= ['origen', 'destino', 'punto', 'croquis', 'punto_de_interes', 'informacion_punto_de_interes'];
punto.origen = null, punto.destino = null, punto.punto = null, punto.croquis = null, punto.punto_de_interes = null, punto.informacion_punto_de_interes = null;
var marcadores			= [];
var listadoInicial		= null;
var listadoPuntos		= null;
var ruta_short_url		= null;
var mapInfoContainer	= null;
var long_url			= null;
var short_url			= null;
var infowindow			= new google.maps.InfoWindow();
var tra					= null;
var trb					= null;
var experimento			= 0;
var geocoder			= null;
var overlay				= null;
var autocomplete		= null;
google.maps.visualRefresh = true;
var testTrFunction = true;
var simboloCirculo = {
	path: google.maps.SymbolPath.CIRCLE,
	strokeColor: '#999999',
	strokeWeight:	3,
	fillColor: '#FFFFFF',
	fillOpacity: 1,
	scale: 6,
};				
var simbolo_flecha = {
	path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
	strokeColor: '#FFFFFF',
	strokeOpacity: 0,
	strokeWeight: 2,
	scale: 2,
	fillColor: '#FFFFFF',
	fillOpacity: 1
};
//var google=null,baseUrl=null,FB=null,o=null,d=null,p=null;
function sub_puntos(ruta_original)
{
	"use strict";
	var ruta_nueva = [];
	ruta_original.forEach(function(punto, index)
	{
		if(index<ruta_original.length-1)
		{
			ruta_nueva.push(punto);
			var x1 = punto.lat();
			var y1 = punto.lng();
			var x2 = ruta_original[index+1].lat();
			var y2 = ruta_original[index+1].lng();
			
			var e = 0.001;
			
			var dt = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
			var n = dt/e;
			var n = n.toFixed(0);
			
			if(n>1){
				
				var dx = (x2-x1)/n;
				var dy = (y2-y1)/n;
				
				for(var i=1; i <= n-1; i++){
					ruta_nueva.push(new google.maps.LatLng(x1 + (dx * i), y1 + (dy * i)));
				}
				
			}
		}
	});
	
	return ruta_nueva;
	
}

function puntos_interseccion()
{
	"use strict";
	
	
	
}

function trTest(ruta, color)
{
  console.log('f');
	var time1 = new Date().getTime();
	ruta = sub_puntos(ruta);
	var conjuntoA = [];
	var conjuntoB = [];
	var conjuntoC = [];
	var dir = 0;
	
	ruta.forEach(function(punto, index)
	{
		
		var da = google.maps.geometry.spherical.computeDistanceBetween(latLngs.origen, punto);
		if(da<=700)
		{
			
			var arr = [];
			arr.index = index;
			arr.dist = da;
			arr.latLng = punto;
			conjuntoA.push(arr);
			if(dir==0 | dir == 2)
			{
				dir=1;
			}
		}
		
		var db = google.maps.geometry.spherical.computeDistanceBetween(latLngs.destino, punto);
		if(db<=700)
		{
			var arr = [];
			arr.index = index;
			arr.dist = db;
			arr.latLng = punto;
			conjuntoB.push(arr);
			if(dir==0)
			{
				dir=2;
			}
		}
		
	});
	
	conjuntoA.forEach(function(puntoA, index)
	{
		
		conjuntoB.forEach(function(puntoB, index2)
		{
			console.log('dir:' +dir+ ' paIdx:' +puntoA.index+ ' pbIdx' +puntoB.index);
			if((dir==1 & puntoA.index < puntoB.index) | (puntoA.index > puntoB.index))
			{
				
				if(puntoA.index > puntoB.index)
				{
					
					r1a = ruta.slice(puntoA.index).concat(ruta.slice(0, puntoB.index+1));
					r1b = ruta.slice(puntoB.index+1, puntoA.index);
					
				} else {
					
					r1a = ruta.slice(puntoA.index, puntoB.index+1);
					r1b = ruta.slice(puntoB.index).concat(ruta.slice(0, puntoA.index+1));
					
				}
				
				var arr = [];
				arr.trayecto = r1a;
				arr.indexA = puntoA.index;
				arr.distA = puntoA.dist;
				arr.latLngA = puntoA.latLng;
				arr.indexB = puntoB.index;
				arr.distB = puntoB.dist;
				arr.latLngB = puntoB.latLng;
				arr.totalDistRuta = google.maps.geometry.spherical.computeLength(r1a);
				arr.totalDist = arr.totalDistRuta + ((puntoA.dist + puntoB.dist)*100);
				conjuntoC.push(arr);
			
			}
			
		});
		
	});
	
	conjuntoC.sort(compare);
  console.log('dir:' + dir);
  console.log(conjuntoA);
  console.log(conjuntoB);
	
	var ruta = new google.maps.Polyline({
		path: conjuntoC[0].trayecto,
		strokeColor: color,
		strokeOpacity: 0.8,
		strokeWeight: 9,
		clickable: false,
		map:map,
		icons: [{
			icon: simboloCirculo,
			offset: '0%'
		},{
			icon: simboloCirculo,
			offset: '100%'
		},{
			icon: simbolo_flecha,
			offset: '5%',
			repeat: '50px'
		}]
	});
	
	var time2 = new Date().getTime();
	console.log('t:'+(time2-time1));
	ruta_caminando(latLngs.origen, conjuntoC[0].latLngA, 'origen');
	ruta_caminando(conjuntoC[0].latLngB, latLngs.destino, 'destino');
	
	return ruta;
	
}

function ruta_caminando(origen, destino, tipo)
{
	var start = origen;
	var end = destino;
	var request = {
		origin:start,
		destination:end,
		travelMode: google.maps.TravelMode.WALKING 
	};
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			if(tipo == 'origen')
			{
				directionsOrigen.setDirections(response);
				directionsOrigen.setMap(map);
			} else {
				directionsDestino.setDirections(response);
				directionsDestino.setMap(map);
			}
		}
	});
}

function compare(a,b) {
  if (a.totalDist < b.totalDist)
     return -1;
  if (a.totalDist > b.totalDist)
    return 1;
  return 0;
}

function tr(ruta1, color)
{
	"use strict";
	var time1 = new Date().getTime();
	if(tra!==null)
	{
		tra.setMap(null);
	}
	if(trb!==null)
	{
		trb.setMap(null);
	}
	ruta1 = sub_puntos(ruta1);
	var indexA = 0;
	var indexB = 0;
	var mda = 500;
	var mdb = 500;
	var mdanterior = 500;
	var locka = 0;
	var lockb = 0;
	var r1a = null;
	var r1b = null;
	var conjuntoA = [];
	var conjuntoB = [];
	var contadorA = 0;
	var contadorB = 0;
	
	ruta1.forEach(function(punto, index)
	{
		
		var da = google.maps.geometry.spherical.computeDistanceBetween(latLngs.origen, punto);
		if(da<=500)
		{
			if(locka ===0)
			{
				if(da<mdanterior)
				{
					indexA = index;
					if(lockb === 1)
					{
						lockb = 0;
						mdb = 500;
					}
				}
				mdanterior = da;
			}
			conjuntoA.push(punto);
			contadorA++;
		}
		
		var db = google.maps.geometry.spherical.computeDistanceBetween(latLngs.destino, punto);
		if(db<=500)
		{
			
			if(lockb ===0)
			{
				if(db<mdb)
				{
					indexB = index;
					mdb = db;
					if(conjuntoA.length>0)
					{
						locka = 1;
					}
				} else {
					lockb = 1;
				}
			}
			conjuntoB.push(punto);
			contadorB++;
		}
		
	});
	
	console.log('A:'+indexA+', B:'+indexB);
	
	if(indexA > indexB)
	{
		
		r1a = ruta1.slice(indexA).concat(ruta1.slice(0, indexB+1));
		r1b = ruta1.slice(indexB+1, indexA);
		
	} else {
		
		r1a = ruta1.slice(indexA, indexB+1);
		r1b = ruta1.slice(indexB).concat(ruta1.slice(0, indexA+1));
		
	}
					
	
				
	
	var time2 = new Date().getTime();
	console.log('t:'+(time2-time1));
	
	var lineSymbol = {
		path: 'M 0,-2 0,2',
		strokeOpacity: 0.7,
		strokeColor: color,
		scale: 2
	};
					
	var ruta = new google.maps.Polyline({
		path: r1b,
		strokeColor: color,
		strokeOpacity: 0,
		strokeWeight: 1,
		clickable: false,
		icons: [{
			icon: lineSymbol,
			offset: '0',
			repeat: '20px'
		}]
	});
	
	ruta.setMap(map);
	
	tra = new google.maps.Polyline({
		path: r1a,
		strokeColor: '#FF0000',
		strokeOpacity: 0.8,
		strokeWeight: 9,
		clickable: false,
		icons: [{
			icon: simboloCirculo,
			offset: '0%'
		},{
			icon: simboloCirculo,
			offset: '100%'
		},{
			icon: simbolo_flecha,
			offset: '5%',
			repeat: '50px'
		}]
	});
	
	tra.setMap(map);
	
	return ruta;
}

function tr2(ruta1)
{
	
	"use strict";
	var time1 = new Date().getTime();
	if(tra!==null)
	{
		tra.setMap(null);
	}
	if(trb!==null)
	{
		trb.setMap(null);
	}
	ruta1 = sub_puntos(ruta1);
	var indexA = 0;
	var indexB = 0;
	var mda = 500;
	var mdb = 500;
	var mdanterior = 500;
	var locka = 0;
	var lockb = 0;
	var r1a = null;
	var conjuntoA = [];
	var conjuntoB = [];
	var contadorA = 0;
	var contadorB = 0;
	
	ruta1.forEach(function(punto, index)
	{
		
		var da = google.maps.geometry.spherical.computeDistanceBetween(latLngs.origen, punto);
		if(da<=500)
		{
			conjuntoA.push(index);
			contadorA++;
		}
		
		var db = google.maps.geometry.spherical.computeDistanceBetween(latLngs.destino, punto);
		if(db<=500)
		{
			conjuntoB.push(index);
			contadorB++;
		}
		
	});
	
	console.log('A:'+contadorA+', B:'+contadorB);
	var dTotal = null;
	var path = new Array();
	for(var i=0; i<conjuntoA.length; i++)
	{
		
		for(var ii=0; ii<conjuntoB.length; ii++)
		{
			
			if(conjuntoA[i] > conjuntoB[ii])
			{
				
				r1a = ruta1.slice(conjuntoA[i]).concat(ruta1.slice(0, conjuntoB[ii]+1));
				
			} else {
				
				r1a = ruta1.slice(conjuntoA[i], conjuntoB[ii]+1);
				
			}
			
			var dTemp = google.maps.geometry.spherical.computeLength(r1a);
			if(dTotal==null | dTotal > dTemp)
			{
				
				path = r1a;
				dTotal = dTemp;
				
			}
			
		}
		
	}
	
	
			
		
	var simboloCirculo = {
		path: google.maps.SymbolPath.CIRCLE,
		strokeColor: '#999999',
		strokeWeight:	3,
		fillColor: '#FFFFFF',
		fillOpacity: 1,
		scale: 6,
	};				
	var simbolo_flecha = {
		path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
		strokeColor: '#FFFFFF',
		strokeOpacity:	0,
		strokeWeight:	2,
		scale:				2,
		fillColor:			'#FFFFFF',
		fillOpacity:	1
	};
				
	tra = new google.maps.Polyline({
		path: path,
		strokeColor: '#FF0000',
		strokeOpacity: 0.8,
		strokeWeight: 9,
		clickable: false,
		icons: [{
			icon: simboloCirculo,
			offset: '0%'
		},{
			icon: simboloCirculo,
			offset: '100%'
		},{
			icon: simbolo_flecha,
			offset: '5%',
			repeat: '50px'
		}]
	});
	
	tra.setMap(map);
	var time2 = new Date().getTime();
	console.log('t:'+(time2-time1));
	
}

var sombraMarcador = new google.maps.MarkerImage(
	baseUrl + 'cdn/imagenes/sprites.png',
	new google.maps.Size(30,21),
	new google.maps.Point(48,0),
	new google.maps.Point(8,21)
);

marcadores.origen = new google.maps.MarkerImage(
	baseUrl + 'cdn/imagenes/sprites.png',
	new google.maps.Size(16, 21),
	new google.maps.Point(0, 0), 
	new google.maps.Point(8, 21)
);
marcadores.destino = new google.maps.MarkerImage(
	baseUrl + 'cdn/imagenes/sprites.png',
	new google.maps.Size(16, 21), 
	new google.maps.Point(16, 0), 
	new google.maps.Point(8, 21)
);
marcadores.punto = new google.maps.MarkerImage(
	baseUrl + 'cdn/imagenes/sprites.png',
	new google.maps.Size(16, 21), 
	new google.maps.Point(32, 0), 
	new google.maps.Point(8, 21)
);
/*
marcadores.croquis = {
	path:				'M15.133,15.442c-19.256,19.256-19.256,50.476,0,69.732L50,120.041l34.866-34.867c19.257-19.256,19.257-50.476,0-69.732  C65.61-3.814,34.39-3.814,15.133,15.442z M71.718,72.027c-11.994,11.994-31.442,11.995-43.437,0  c-11.995-11.995-11.995-31.442,0-43.437c11.995-11.995,31.443-11.995,43.437,0C83.712,40.584,83.712,60.032,71.718,72.027z',
	strokeOpacity:	1,
	strokeWeight:	1,
	strokeColor:	'#ffffff',
	fillColor:			'#ff0000',
	fillOpacity:	1,
	scale:				1
};

marcadores.croquis = new google.maps.MarkerImage(
	baseUrl + 'cdn/imagenes/marcadores.png',
	new google.maps.Size(16, 21), 
	new google.maps.Point(32, 0), 
	new google.maps.Point(8, 21)
);
*/
lePath = 'M 25.3333,-7.62939e-006L 73.3333,7.62939e-006L 73.3333,52L 25.3333,100L 25.3333,-7.62939e-006 Z';
lePath = 'M15.133,15.442c-19.256,19.256-19.256,50.476,0,69.732L50,120.041l34.866-34.867c19.257-19.256,19.257-50.476,0-69.732  C65.61-3.814,34.39-3.814,15.133,15.442z M71.718,72.027c-11.994,11.994-31.442,11.995-43.437,0  c-11.995-11.995-11.995-31.442,0-43.437c11.995-11.995,31.443-11.995,43.437,0C83.712,40.584,83.712,60.032,71.718,72.027z';
lePath = 'M 0,0 L 0,-30 L 10,-30 L 10,-30 L 10,-10 Z';
marcadores.croquis = {
	path:				lePath,
	strokeOpacity:	1,
	strokeWeight:	1,
	strokeColor:	'#ffffff',
	fillColor:			'#ff0000',
	fillOpacity:	1,
	scale:				1
};
marcadores.punto_de_interes = new google.maps.MarkerImage(
	baseUrl + 'cdn/imagenes/marcadores.png',
	new google.maps.Size(16, 21), 
	new google.maps.Point(0, 21), 
	new google.maps.Point(8, 21)
);

google.maps.Polyline.prototype.getBounds = function() {
  var bounds = new google.maps.LatLngBounds();
  this.getPath().forEach(function(e) {
    bounds.extend(e);
  });
  return bounds;
};

function post_poi(id)
{
	"use strict";
    FB.api('me/rutadirecta:create?point_of_interest=http://mty.rutadirecta.com/open_graph/punto_de_interes/'+id, 'post', function(response) {
        if (!response || response.error) {
            console.log('point_of_interest: Error occured => ' + response.error.message);
        } else {
            console.log('point_of_interest: Post was successful! Action ID: ' + response.id);
        }
    });
}

function initmap()
{
	"use strict";
		
	geocoder = new google.maps.Geocoder();
	var rendererOptions = {
		suppressMarkers: true,
		suppressInfoWindows: true,
		preserveViewport: true,
		polylineOptions: {
			icons: [{
				icon: {
					path: google.maps.SymbolPath.CIRCLE,
					strokeColor: '#FFFFFF',
					strokeWeight:	1,
					strokeOpacity:.8,
					fillColor: '#666666',
					fillOpacity: .8,
					scale: 3,
				},
				offset: '0',
				repeat: '12px'
			}],
			strokeOpacity:0
		}
	};
	directionsOrigen = new google.maps.DirectionsRenderer(rendererOptions);
	directionsDestino = new google.maps.DirectionsRenderer(rendererOptions);
    latlng = new google.maps.LatLng(config.lat, config.lng);
    var myOptions = {
        zoom: 13,
        center: latlng,
        draggableCursor: 'default',
        draggingCursor: 'pointer',
		
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		panControl: false,
		zoomControl: true,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.LARGE,
			position: google.maps.ControlPosition.LEFT_BOTTOM
		},
		streetViewControl: false
	};
    map = new google.maps.Map(document.getElementById('map'), myOptions);
	
	/*
	var adUnitDiv = document.createElement('div');
	var adUnitOptions = {
		format: google.maps.adsense.AdFormat.BANNER,
		position: google.maps.ControlPosition.BOTTOM_RIGHT,
		backgroundColor: '#ffffff',
		borderColor: '#cccccc',
		titleColor: '#E1771E',
		textColor: '#666666',
		urlColor: '#79A800',
		channelNumber:'5059317058',
		map: map,
		visible: true,
		publisherId: 'pub-6036797173827730'
	}
	adUnit = new google.maps.adsense.AdUnit(adUnitDiv, adUnitOptions);
	*/
	
	overlay = new google.maps.OverlayView();
	overlay.draw = function() {};
	overlay.setMap(map); 
	
	var input = document.getElementById('search-query');
	var options = {
		bounds: map.getBounds()
	};

	autocomplete = new google.maps.places.Autocomplete(input, options);
	autocomplete.bindTo('bounds', map);
	
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		var place = autocomplete.getPlace();
		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(17);
		}
		
	});
	
	var contextMenuOptions={};
	contextMenuOptions.classNames={menu:'context_menu', menuSeparator:'context_menu_separator'};
	
	var menuItems=[];
	menuItems.push({className:'context_menu_item', eventName:'directions_origin_click', id:'directionsOriginItem', label:'Marcar como Origen'});
	menuItems.push({className:'context_menu_item', eventName:'directions_destination_click', id:'directionsDestinationItem', label:'Marcar como Destino'});
	menuItems.push({});
	menuItems.push({className:'context_menu_item', eventName:'directions_punto_click', id:'directionsPointItem', label:'Rutas por Punto'});
	menuItems.push({});
	menuItems.push({className:'context_menu_item', eventName:'clear_map_click', label:'Limpiar mapa'});
	contextMenuOptions.menuItems=menuItems;
	
	var contextMenu=new ContextMenu(map, contextMenuOptions);
	
	google.maps.event.addListener(map, 'rightclick', function(mouseEvent){
		contextMenu.show(mouseEvent.latLng);
	});
	
	google.maps.event.addListener(contextMenu, 'menu_item_selected', function(latLng, eventName){
		switch(eventName){
			case 'directions_origin_click':
				
				$('#comoLlegarBtn:not(.active)').click();
				placeMarker('origen', latLng);
				break;
			case 'directions_destination_click':
				$('#comoLlegarBtn:not(.active)').click();
				placeMarker('destino', latLng);
				break;
			case 'directions_punto_click':
				$('#rutasPorPuntoBtn:not(.active)').click();
				placeMarker('punto', latLng);
				break;
			case 'clear_map_click':
				limpiar_mapa();
				$('#resetRutasBtn').click();
				break;
		}

	});
	
}

function mostrar_punto_de_interes(id)
{
	"use strict";
	
	$.post(baseUrl+'ajax/obtener_punto_de_interes', {id:id}, function(data){
		
		limpiar_mapa();
		
		var locacion = new google.maps.LatLng(data.punto.lat, data.punto.lng);
		var titulo = data.punto.nombre;
		var contenido = null;
		if(data.punto.descripcion!==null)
		{
			
			contenido = '<strong>'+titulo+'</strong>'+
							'<p>'+data.punto.descripcion+'</p>'+
							'<p>ver rutas que pasan por aquÃ­ &raquo;</p>';
			
		} else {
			
			contenido = '<strong>'+titulo+'</strong>'+
							'<p><a class="buscarRutasPorPuntoInteres" href="javascript:void(0);">Ver rutas que pasan por aquÃ­ &raquo;</a></p>';
			
		}
		
		latLngs.punto = locacion;
		
		punto.informacion_punto_de_interes = new google.maps.Marker({
			position:		locacion, 
			map:			map,
			title:		titulo,
			shadow:		sombraMarcador,
			icon:		marcadores.croquis
		});
		
		latLngs.punto.informacion_punto_de_interes = location;
		
		google.maps.event.addListener(punto.informacion_punto_de_interes, 'click', function(){
			
			infowindow.setContent(contenido);
			infowindow.open(map, punto.informacion_punto_de_interes);
			
		});
		
		infowindow.setContent(contenido);
		infowindow.open(map, punto.informacion_punto_de_interes);
		
	}, 'json');
	
}

function print_url()
{
	"use strict";
	
	var url_arr = [];
	
	if(latLngs.origen!==null)
	{
		
		url_arr.push('o='+latLngs.origen.lat().toFixed(6)+','+latLngs.origen.lng().toFixed(6));
		
	}
	
	if(latLngs.destino!==null)
	{
		
		url_arr.push('d='+latLngs.destino.lat().toFixed(6)+','+latLngs.destino.lng().toFixed(6));
		
	}
	
	if(latLngs.punto!==null)
	{
		
		url_arr.push('p='+latLngs.punto.lat().toFixed(6)+','+latLngs.punto.lng().toFixed(6));
		
	}
	
	var url_str = url_arr.join('&');
	
	return baseUrl+'?'+url_str ;
	
	
}

function placeMarker(tipo, location, callback)
{
	"use strict";
	
	var callback = typeof callback !== 'undefined' ? callback : false;
	
	if (geocoder) {
      geocoder.geocode({'latLng': location}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          if (results[0]) {
		
			if (punto[tipo] !== null) {
				punto[tipo].setMap(null);
			}
            punto[tipo] = new google.maps.Marker({
				position:		location, 
				map:			map,
				icon:		marcadores[tipo],
				title:		tipo.charAt(0).toUpperCase() + tipo.slice(1),
				shadow:		sombraMarcador,
				draggable:		true,
				zIndex:		9999
			});
			
			latLngs[tipo] = location;
			$('#urlstr_output').val(print_url()).parent().show();
			$('#url_corta').attr('checked',false);
			short_url = null;
			
			google.maps.event.addListener(punto[tipo], 'dragend', function(event) {
				
				geocoder.geocode({'latLng': event.latLng}, function(b, c) {
			
					$('#search_'+tipo).val(b[0].formatted_address);
					latLngs[tipo] = event.latLng;
					$('.accionBtn').click();
					$('#urlstr_output').val(print_url()).parent().show();
					$('#url_corta').attr('checked',false);
					short_url = null;
					limpiar_trayectos();
					
				});	
				
			});
            $('#search_'+tipo).val(results[0].formatted_address);
			$('.accionBtn').click();
			return true;
          }
        }
      });
    }
	
	if(callback !== false)
	{
	
		callback(rid);
	
	}

}

function limpiar_trayectos()
{
	"use strict";
	
	if(tra!==null)
	{
		tra.setMap(null);
	}
	if(trb!==null)
	{
		trb.setMap(null);
	}
	
	$.each(iconos, function(i,icono){
		icono.setMap(null);
	});
	
	directionsOrigen.setMap(null);
	directionsDestino.setMap(null);
	
}

function limpiar_mapa()
{
	"use strict";
	
	$('a.ruta').removeClass('active');
	
	long_url = null;
	short_url = null;
	
	$.each(rutas, function(i,ruta){
		ruta.setMap(null);
	});
	rutas = [];
	
	limpiar_trayectos();

	if (punto.origen !== null) {
		punto.origen.setMap(null);
		latLngs.origen = null;
		
	}
	if (punto.destino !== null) {
		punto.destino.setMap(null);
		latLngs.destino = null;
	}
	if (punto.punto !== null) {
		punto.punto.setMap(null);
		latLngs.punto = null;
		
	}
	if (punto.croquis !== null) {
		punto.croquis.setMap(null);
		latLngs.croquis = null;
	}
	if (punto.punto_de_interes !== null) {
		punto.punto_de_interes.setMap(null);
		latLngs.punto_de_interes = null;
	}
	if (punto.informacion_punto_de_interes !== null) {
		punto.informacion_punto_de_interes.setMap(null);
		latLngs.informacion_punto_de_interes = null;
	}
	
	$('#mapInfoContainer').html('');
	$('#urlstr_output').val('');
	$('#url_corta').attr('checked',false);
	short_url = null;	
	
}

function resetRutas()
{
	"use strict";
	
	limpiar_mapa();
	$('#listadoRutas').html(listadoInicial);
	$('.toolTextBox').val('');
	$('#panelSuperior').html('<span>Listado de rutas</span>');
	
}

function resetPuntos()
{
	"use strict";
	
	$('#listadoRutas').html(listadoPuntos);
	$('#panelSuperior').html('<a href="javascript:;" id="resetRutasBtn">&laquo; Volver</a> &bull; <span>Resultados de la bÃºsqueda</span>');
	
}

function limpiarRutas()
{
	"use strict";
	
	$.each(rutas, function(i,ruta){
		ruta.setMap(null);
	});
	
	$.each(iconos, function(i,icono){
		icono.setMap(null);
	});
	
	rutas = [];
	$('a.ruta').removeClass('active');
	
}

function imprimir_ruta(id,inicial)
{
	"use strict";
	
	var inicial = typeof inicial !== 'undefined' ? inicial : false;
	
	if(inicial === false)
	{
	
		$('#mapInfoContainer').html('<div class="ajaxLoader"><img src="'+baseUrl+'imagenes/ajaxLoader.gif" /></div>');
	
	}
	
	$.post(
		'http://buzity.com/api/get/route',
		{id:id},
		
		function(json){
			
			$.each(rutas, function(i,ruta){
				ruta.setMap(null);
			});
			$.each(iconos, function(i,icono){
				icono.setMap(null);
			});
			
			if(tra!==null)
			{
				tra.setMap(null);
			}
			if(trb!==null)
			{
				trb.setMap(null);
			}
					
			mapInfoContainer = '';
			
			if(inicial === false)
			{
				
				$('#mapInfoContainer').html('');
				
			}
			
			$.each(json, function(i,rutaInfo){	

				var trayectoria = google.maps.geometry.encoding.decodePath(rutaInfo.trayecto.replace(/\\\\/g,"\\"));
				
				var limiteRuta = new google.maps.LatLngBounds();
				
				$.each(trayectoria, function(i,punto){	

					limiteRuta.extend(punto);
					
				});
				
				var color = colores[i];
				var strokeOpacity = .6;
				var strokeWeight = 4;
				
				if(rutaInfo.color!=null)
				{
					color = rutaInfo.color;
				}
				
				if(latLngs.origen !== null && latLngs.destino !== null && json.length === 1)
				{
					
					if(testTrFunction)
					{
						var ruta = trTest(trayectoria, colores[i]);
					} else {
						var ruta = tr(trayectoria, colores[i]);
					}
					
					var kms = google.maps.geometry.spherical.computeLength(ruta.getPath())/1000;
					kms = kms.toFixed(2);
					
					rutas.push(ruta);
					
				} else {
					
					
					$.each(rutaInfo.paradas, function(i,parada){
							var image = new google.maps.MarkerImage(baseUrl+'cdn/imagenes/iconografia/'+parada.icono,
							new google.maps.Size(20, 20),
							new google.maps.Point(0,0),
							new google.maps.Point(10, 10));
							
							var marker = new google.maps.Marker({
								position: new google.maps.LatLng(parada.lat,parada.lng),
								title:parada.nombre,
								map: map,
								icon: image
							});
							iconos.push(marker);
						});
          
					if(rutaInfo.tipo === 'Metro' | rutaInfo.tipo === 'BRT' | rutaInfo.paradas.size > 0)
					{
												
						strokeOpacity = 1
						strokeWeight = 7;
						
						
					}
					else
					{
						
						var path_type = google.maps.SymbolPath.FORWARD_CLOSED_ARROW;
						
					}
					
					var simbolo_flecha = {
						path:				path_type,
						strokeOpacity:	1,
						strokeWeight:	1,
						scale:				2,
						fillColor:			colores[i],
						fillOpacity:	1
					};
					
					var ruta = new google.maps.Polyline({
						path: trayectoria,
						strokeColor: color,
						strokeOpacity: strokeOpacity,
						strokeWeight: strokeWeight,
						clickable: false,
						icons: [{
							icon: simbolo_flecha,
							offset: '0',
							repeat: '50px'
						}]
					});
					
					var kms = google.maps.geometry.spherical.computeLength(ruta.getPath())/1000;
					kms = kms.toFixed(2);
					
					rutas.push(ruta);
					ruta.setMap(map);
					
				}
								
				if(latLngs.punto !== null)
				{
					
					map.panTo(latLngs.punto);
					
				} else if(latLngs.origen!==null && latLngs.destino!==null) {
					
					var limiteMapa = new google.maps.LatLngBounds();
					limiteMapa.extend(latLngs.origen);
					limiteMapa.extend(latLngs.destino);
					map.fitBounds(limiteMapa);
				
				} else {
					
					map.fitBounds(limiteRuta);
					
				}
				if(inicial === false)
				{
          
          var foto = '';
          var telefono = '';
          if(rutaInfo.thumb!==null)
          {
            foto =			'<td valign="top">'+
                    '<p><a class="foto_ruta_lnk" href="'+baseUrl+'imagenes/rutas/full/'+rutaInfo.thumb+'" rel="image"><img class="foto_ruta" src="'+baseUrl+'imagenes/rutas/thumbs/'+rutaInfo.thumb+'" /></a></p>'+
                  '</td>';
          }
          if(rutaInfo.telefono!==null)
          {
            telefono =		'<p><strong>Telefono:</strong> '+rutaInfo.telefono+'</p>';
          }
          mapInfoContainer = '<div class="infoRuta" style="border-left:solid 5px '+colores[i]+'">'+
            '<input type="text" class="short_url_input" value="" onclick="this.select()" readonly />'+
            '<div class="infoRutaContainer">'+
              '<strong>'+rutaInfo.nombreLargo+'</strong>'+
              '<div class="detalle_ruta">'+
                '<table>'+
                  '<tr>'+
                    foto+
                    '<td valign="top">'+
                      '<p><strong>Tipo de Ruta:</strong> '+rutaInfo.tipo+'</p>'+
                      '<p><strong>Longitud:</strong> '+kms+' kms.</p>'+
                      telefono+
                    '</td>'+
                  '</tr>'+
                '</table>'+
                '<p>'+
                '<strong>Perfil de la ruta:</strong><br />'+
                '<a href="'+rutaInfo.canonical_url+'" rel="bookmark">'+rutaInfo.canonical_url+'</a>'+
                '</p>'+
              '</div>'+
            '</div>'+
          '</div>';
          
          $('#mapInfoContainer').append(mapInfoContainer);
          /*  
					$.getJSON('http://rut.as/yourls-api.php?jsoncallback=?',
					{
						signature:	'921ca55844',
						action:		'shorturl',
						format:		'json',
						url:		rutaInfo.canonical_url
					},
					function(data) {
						
						ruta_short_url = data.shorturl;
						
							
					});
          */
				}
			});
			
		},
		'json'
	);
	
}
function imprimir_ruta1(id,inicial)
{
	"use strict";
	
	var inicial = typeof inicial !== 'undefined' ? inicial : false;
	
	if(inicial === false)
	{
	
		$('#mapInfoContainer').html('<div class="ajaxLoader"><img src="'+baseUrl+'imagenes/ajaxLoader.gif" /></div>');
	
	}
	
	$.post(
		'http://buzity.com/api/get/route',
		{id:id},
		
		function(json){
			
			$.each(rutas, function(i,ruta){
				ruta.setMap(null);
			});
			$.each(iconos, function(i,icono){
				icono.setMap(null);
			});
			
			if(tra!==null)
			{
				tra.setMap(null);
			}
			if(trb!==null)
			{
				trb.setMap(null);
			}
					
			mapInfoContainer = '';
			
			if(inicial === false)
			{
				
				$('#mapInfoContainer').html('');
				
			}
			
			$.each(json, function(i,rutaInfo){	

				var trayectoria = google.maps.geometry.encoding.decodePath(rutaInfo.trayecto.replace(/\\\\/g,"\\"));
				
				var limiteRuta = new google.maps.LatLngBounds();
				
				$.each(trayectoria, function(i,punto){	

					limiteRuta.extend(punto);
					
				});
				
				var color = colores[i];
				var strokeOpacity = .6;
				var strokeWeight = 4;
				
				if(rutaInfo.color!=null)
				{
					color = rutaInfo.color;
				}
				
				if(latLngs.origen !== null && latLngs.destino !== null && json.length === 1)
				{
					
					if(testTrFunction)
					{
						var ruta = trTest(trayectoria, colores[i]);
					} else {
						var ruta = tr(trayectoria, colores[i]);
					}
					
					var kms = google.maps.geometry.spherical.computeLength(ruta.getPath())/1000;
					kms = kms.toFixed(2);
					
					rutas.push(ruta);
					
				} else {
					
					
					$.each(rutaInfo.paradas, function(i,parada){
							var image = new google.maps.MarkerImage(baseUrl+'cdn/imagenes/iconografia/'+parada.icono,
							new google.maps.Size(20, 20),
							new google.maps.Point(0,0),
							new google.maps.Point(10, 10));
							
							var marker = new google.maps.Marker({
								position: new google.maps.LatLng(parada.lat,parada.lng),
								title:parada.nombre,
								map: map,
								icon: image
							});
							iconos.push(marker);
						});
          
					if(rutaInfo.tipo === 'Metro' | rutaInfo.tipo === 'BRT' | rutaInfo.paradas.size > 0)
					{
												
						strokeOpacity = 1
						strokeWeight = 7;
						
						
					}
					else
					{
						
						var path_type = google.maps.SymbolPath.FORWARD_CLOSED_ARROW;
						
					}
					
					var simbolo_flecha = {
						path:				path_type,
						strokeOpacity:	1,
						strokeWeight:	1,
						scale:				2,
						fillColor:			colores[i],
						fillOpacity:	1
					};
					
					var ruta = new google.maps.Polyline({
						path: trayectoria,
						strokeColor: color,
						strokeOpacity: strokeOpacity,
						strokeWeight: strokeWeight,
						clickable: false,
						icons: [{
							icon: simbolo_flecha,
							offset: '0',
							repeat: '50px'
						}]
					});
					
					var kms = google.maps.geometry.spherical.computeLength(ruta.getPath())/1000;
					kms = kms.toFixed(2);
					
					rutas.push(ruta);
					ruta.setMap(map);
					
				}
								
				if(latLngs.punto !== null)
				{
					
					map.panTo(latLngs.punto);
					
				} else if(latLngs.origen!==null && latLngs.destino!==null) {
					
					var limiteMapa = new google.maps.LatLngBounds();
					limiteMapa.extend(latLngs.origen);
					limiteMapa.extend(latLngs.destino);
					map.fitBounds(limiteMapa);
				
				} else {
					
					map.fitBounds(limiteRuta);
					
				}
				if(inicial === false)
				{
          
          var foto = '';
          var telefono = '';
          if(rutaInfo.thumb!==null)
          {
            foto =			'<td valign="top">'+
                    '<p><a class="foto_ruta_lnk" href="'+baseUrl+'imagenes/rutas/full/'+rutaInfo.thumb+'" rel="image"><img class="foto_ruta" src="'+baseUrl+'imagenes/rutas/thumbs/'+rutaInfo.thumb+'" /></a></p>'+
                  '</td>';
          }
          if(rutaInfo.telefono!==null)
          {
            telefono =		'<p><strong>Telefono:</strong> '+rutaInfo.telefono+'</p>';
          }
          mapInfoContainer = '<div class="infoRuta" style="border-left:solid 5px '+colores[i]+'">'+
            '<input type="text" class="short_url_input" value="" onclick="this.select()" readonly />'+
            '<div class="infoRutaContainer">'+
              '<strong>'+rutaInfo.nombreLargo+'</strong>'+
              '<div class="detalle_ruta">'+
                '<table>'+
                  '<tr>'+
                    foto+
                    '<td valign="top">'+
                      '<p><strong>Tipo de Ruta:</strong> '+rutaInfo.tipo+'</p>'+
                      '<p><strong>Longitud:</strong> '+kms+' kms.</p>'+
                      telefono+
                    '</td>'+
                  '</tr>'+
                '</table>'+
                '<p>'+
                '<strong>Perfil de la ruta:</strong><br />'+
                '<a href="'+rutaInfo.canonical_url+'" rel="bookmark">'+rutaInfo.canonical_url+'</a>'+
                '</p>'+
              '</div>'+
            '</div>'+
          '</div>';
          
          $('#mapInfoContainer').append(mapInfoContainer);
          /*  
					$.getJSON('http://rut.as/yourls-api.php?jsoncallback=?',
					{
						signature:	'921ca55844',
						action:		'shorturl',
						format:		'json',
						url:		rutaInfo.canonical_url
					},
					function(data) {
						
						ruta_short_url = data.shorturl;
						
							
					});
          */
				}
			});
			
		},
		'json'
	);
	
}
function mostrar_embed_code()
{
	"use strict";
	
	var embed_code = '<div class="contenedor_embed_code">'+
	'<div class="table_row">'+
		'<h3>Insertar mapa en la ubicaciÃ³n actual:</h3>'+
	'</div>'+
	'<div class="table" id="embeber_mapa_table">'+
		'<div class="table_cell size_selector">'+
			'<p><strong>TamaÃ±o:</strong></p>'+
			'<p><input class="embed_size_radio" name="embed_size" type="radio" value="350x200" checked> 350 x 200</p>'+
			'<p><input class="embed_size_radio" name="embed_size" type="radio" value="500x400"> 500 x 400</p>'+
			//'<p><input class="embed_size_radio" name="embed_size" type="radio" value="custom"> <input name="map_width" type="text" id="map_width"> x <input name="map_height" type="text" id="map_height"></p> '+
		'</div>'+
		'<div class="table_cell">'+
			'<p><strong>CÃ³digo para insertar mapa:</strong></p>'+
			'<p><textarea class="embed_code" name="embed_code" cols="" rows="" readonly onClick="this.select();" id="embed_code"><a id="rd-rpp" width="350" height="200" href="http://mty.rutadirecta.com" api="rpp" latlng="'+latLngs.punto.lat()+','+latLngs.punto.lng()+'">Rutas de camiones</a><script src="http://rut.as/rpp"></script></textarea></p>'+
			'<p>Selecciona el tamaÃ±o y luego copia y pega este cÃ³digo en tu sitio web.</p>'+
		'</div>'+
	'</div>'+
'</div>';
		
	$('#mapInfoContainer').html(embed_code);	
	
}

function switch_urlcorta(object)
{
	"use strict";
	
	if(object.checked)
	{
		
		if(short_url!==null)
		{
			
			$('#urlstr_output').val(short_url);
			
		} else {
		
			$.getJSON('http://rut.as/yourls-api.php?jsoncallback=?',
			{
				signature:	'921ca55844',
				action:		'shorturl',
				format:		'json',
				url:		$('#urlstr_output').val()
			},
			function(data) {
				
				short_url = data.shorturl;
				long_url = $('#urlstr_output').val();
				$('#urlstr_output').val(data.shorturl);
				
			});
		
		}
		
	} else {
		
		$('#urlstr_output').val(long_url);
		
	}
	
}



$(document).ready(function(){
	
	initmap();
	
	if(ruta_inicial!==null)
	{
		
		imprimir_ruta(ruta_inicial, true);
		
	}
	
	if(punto_de_interes!==null)
	{
		
		mostrar_punto_de_interes(punto_de_interes);
		
	}
	
	listadoInicial = $('#listadoRutas').html();
	
	$('a#resetRutasBtn').live('click', function(e){
		
		resetRutas();
		
	});
	
	$('a#resetPuntosBtn').live('click', function(e){
		
		resetPuntos();
		
	});
	
	$('a.ruta').live("click", function(event) {
		
		event.preventDefault();
		
		$('a.ruta').removeClass('active');
		$(this).addClass('active');
		imprimir_ruta($(this).attr('data-rid'));
		
		return false;
		
    });
	
	$('a.punto_de_interes').live("click", function(event) {
		
		event.preventDefault();
		
		$('a.punto_de_interes').removeClass('active');
		$(this).addClass('active');
		mostrar_punto_de_interes($(this).attr('rel'));
		
		return false;
		
    });
	
	$('#citySelector').change(function(){
		
		window.location = "http://"+$('#citySelector').val()+".rutadirecta.com";
		
	});
	
	$('.mapButtons').click(function(){
		
		$('.mapButtons').removeClass('active');
		$(this).addClass('active');
		
	});
	
	$("#listsSlider").toggle(
		function(){
			$("#listsContainer").animate({ 
				width: "16px"
			}, 500 );
			$("#listsSlider").toggleClass("closed");
		},
		function(){
			$("#listsContainer").animate({ 
				width: "315px"
			}, 500 );
			$("#listsSlider").toggleClass("closed");
		}
	);
	
	$('#mapBtnReset').click(function(){
		
		$('#mapInfoContainer').html('');
		$.each(rutas, function(i,ruta){
			ruta.setMap(null);
		});
		map.setCenter(latlng);
		
	});
	
	$('a.interchangeBtn').live('click', function(event){
		
		event.preventDefault();
		
		var textoOrigen = $('#search_origen').val();
		var textoDestino = $('#search_destino').val();
		var latLngOrigen = latLngs.origen;
		var latLngDestino = latLngs.destino;
		
		if(latLngs.origen !== null)
		{
			
			placeMarker('destino', latLngs.origen);
			
		}
		
		if(latLngs.destino !== null)
		{
			
			placeMarker('origen', latLngs.destino);
			
		}
		
		latLngs.origen = latLngDestino;
		latLngs.destino = latLngOrigen;
		
		$('#search_destino').val(textoOrigen);
		$('#search_origen').val(textoDestino);
		
		$('.accionBtn').click();
		
		
	});
	
	$('#comoLlegarBtn').click(function(){
		
		limpiar_mapa();
		latLngs.origen = null;
		latLngs.destino = null;
		html =		'<div class="contenedor_tool_inputs origen"><div rel="origen" class="markerDragable origen"></div><input type="text" value="" class="toolTextBox" name="origen" id="search_origen" placeholder="DirecciÃ³n del Origen" title="Arrastra el marcador rojo al mapa o escribe la direcciÃ³n del origen" /></div> ' +
				' <a href="javascript:;" class="interchangeBtn" title="Intercambiar ubicaciones"></a> ' +
				'<div class="contenedor_tool_inputs"><div rel="destino" class="markerDragable destino"></div><input type="text" value="" class="toolTextBox" name="destino" id="search_destino" placeholder="DirecciÃ³n del destino" title="Arrastra el marcador rojo al mapa o escribe la direcciÃ³n del destino" /></div> ' +
        '<a id="buscarComoLlegar" class="mapButtons mini accionBtn" href="#">Buscar &raquo;</a> ' +
				'<a class="mapButtons mini cancelar" id="mapAuxBoxCerrar" href="javascript:void(0);" >Ã—</a>';
		$('#mapAuxBox').html(html);
		$(".markerDragable").draggable({helper: 'clone', zIndex: 9999999, cursor: 'move', cursorAt: { bottom:1 , left:8 }, stack: '#map', stop: function(e) {
			var point = new google.maps.Point(e.pageX-$('#map').offset().left,e.pageY-$('#map').offset().top);
			var latLng = overlay.getProjection().fromContainerPixelToLatLng(point);
			placeMarker($(this).attr('rel'), latLng);
		}});
		$('.toolTextBox').tooltip({position:{ my: "right bottom-5", at:"right top"}});
		$('#mapAuxBox').slideDown('fast', function(){
			
			$(this).css('overflow', 'visible');
			
			$('.markerDragable').effect( 'bounce', {distance:10, direction: 'up', times: 2}, 250);
			
			/* autocomplete origen */
			var inputOrigen = document.getElementById('search_origen');
			var options = {
				bounds: map.getBounds()
			};
		
			var autocompleteOrigen = new google.maps.places.Autocomplete(inputOrigen, options);
			autocompleteOrigen.bindTo('bounds', map);
			
			google.maps.event.addListener(autocompleteOrigen, 'place_changed', function() {
				var placeOrigen = autocompleteOrigen.getPlace();
				if (placeOrigen.geometry.viewport) {
					map.fitBounds(placeOrigen.geometry.viewport);
				} else {
					map.setCenter(placeOrigen.geometry.location);
					map.setZoom(16);
				}
				placeMarker('origen', placeOrigen.geometry.location);
				
			});
			
			/* autocomplete destino */
			var inputDestino = document.getElementById('search_destino');
			var options = {
				bounds: map.getBounds()
			};
		
			var autocompleteDestino = new google.maps.places.Autocomplete(inputDestino, options);
			autocompleteDestino.bindTo('bounds', map);
			
			google.maps.event.addListener(autocompleteDestino, 'place_changed', function() {
				var placeDestino = autocompleteDestino.getPlace();
				if (placeDestino.geometry.viewport) {
					map.fitBounds(placeDestino.geometry.viewport);
				} else {
					map.setCenter(placeDestino.geometry.location);
					map.setZoom(16);
				}
				placeMarker('destino', placeDestino.geometry.location);
				
			});
			
		});
		
	});
	
	$('#rutasPorPuntoBtn').click(function(){
		
		limpiar_mapa();
		html =		'<strong>Punto:</strong> <div class="contenedor_tool_inputs"><div rel="punto" class="markerDragable punto"></div><input value="" class="toolTextBox" name="punto" id="search_punto" type="text"></div> ' +
        '<a id="buscarRutasPorPunto" class="mapButtons mini accionBtn" href="#">Buscar &raquo;</a> ' +
				'<a class="mapButtons mini cancelar" id="mapAuxBoxCerrar" href="#" >Ã—</a>';
		$('#mapAuxBox').html(html);
		$(".markerDragable").draggable({helper: 'clone', zIndex: 9999999, cursor: 'move', cursorAt: { bottom:1 , left:8 }, stop: function(e) {
				var point=new google.maps.Point(e.pageX-$('#map').offset().left,e.pageY-$('#map').offset().top);
				var latLng = overlay.getProjection().fromContainerPixelToLatLng(point);
				placeMarker($(this).attr('rel'), latLng);
			}
		});
		$('#mapAuxBox').slideDown('fast', function(){
			
			$(this).css('overflow', 'visible');
			$('.markerDragable').effect( 'bounce', {distance:10, direction: 'up', times: 3}, 250);
			
			/* autocomplete rutas por punto */
			var inputRutasPorPunto = document.getElementById('search_punto');
			var options = {
				bounds: map.getBounds()
			};
		
			var autocompleteRutasPorPunto = new google.maps.places.Autocomplete(inputRutasPorPunto, options);
			autocompleteRutasPorPunto.bindTo('bounds', map);
			
			google.maps.event.addListener(autocompleteRutasPorPunto, 'place_changed', function() {
				var placeRutasPorPunto = autocompleteRutasPorPunto.getPlace();
				if (placeRutasPorPunto.geometry.viewport) {
					map.fitBounds(placeRutasPorPunto.geometry.viewport);
				} else {
					map.setCenter(placeRutasPorPunto.geometry.location);
					map.setZoom(16);
				}
				placeMarker('punto', placeRutasPorPunto.geometry.location);
				
			});
			
		});
		
	});
	
	$('#croquisDigitalBtn').click(function(){
		
		limpiar_mapa();
		html =		'<strong>UbicaciÃ³n:</strong> <div class="contenedor_tool_inputs"><div rel="croquis" class="markerDragable croquis"></div><input value="" class="toolTextBox" name="croquis" id="search_croquis" type="text"></div> ' +
				'<a class="mapButtons mini accionBtn" href="#">Crear croquis &raquo;</a> ' +
				'<a class="mapButtons mini cancelar" id="mapAuxBoxCerrar" href="javascript:void(0);" >Ã—</a>';
		$('#mapAuxBox').html(html);
		$(".markerDragable").draggable({helper: 'clone', zIndex: 9999999, cursor: 'move', cursorAt: { bottom:1 , left:8 }, stop: function(e) {
			var point=new google.maps.Point(e.pageX-$('#map').offset().left,e.pageY-$('#map').offset().top);
			var latLng = overlay.getProjection().fromContainerPixelToLatLng(point);
				placeMarker($(this).attr('rel'), latLng);
			}
		});
		$('#mapAuxBox').slideDown('fast', function(){
			
			$(this).css('overflow', 'visible');
			$('.markerDragable').effect( 'bounce', {distance:10, direction: 'up', times: 3}, 250);
			
			/* autocomplete croquis */
			var inputRutasPorPunto = document.getElementById('search_croquis');
			var options = {
				bounds: map.getBounds()
			};
		
			var autocompleteCroquis = new google.maps.places.Autocomplete(inputCroquis, options);
			autocompleteCroquis.bindTo('bounds', map);
			
			google.maps.event.addListener(autocompleteCroquis, 'place_changed', function() {
				var placeCroquis = autocompleteCroquis.getPlace();
				if (placeCroquis.geometry.viewport) {
					map.fitBounds(placeCroquis.geometry.viewport);
				} else {
					map.setCenter(placeCroquis.geometry.location);
					map.setZoom(16);
				}
				placeMarker('punto', placeCroquis.geometry.location);
				
			});
			
		});
		
	});
	
	$('#puntosDeInteresBtn').live('click', function(event){
		
		event.preventDefault();
		
		limpiar_mapa();
		html =		'<strong>Puntos de interÃ©s cerca de:</strong> <div class="contenedor_tool_inputs"><div rel="punto_de_interes" class="markerDragable punto_de_interes"></div><input value="" class="toolTextBox" name="punto_de_interes" id="search_punto_de_interes" type="text"></div> ' +
				'<a id="buscarPuntosDeInteresPorPunto" class="mapButtons mini accionBtn" href="#">Buscar puntos de interÃ©s &raquo;</a> ' +
				'<a class="mapButtons mini cancelar" id="mapAuxBoxCerrar" href="javascript:void(0);" >Ã—</a>';
		$('#mapAuxBox').html(html);
		$(".markerDragable").draggable({helper: 'clone', zIndex: 99999999, cursor: 'move', cursorAt: { bottom:1 , left:8 }, stop: function(e) {
			var point=new google.maps.Point(e.pageX-$('#map').offset().left,e.pageY-$('#map').offset().top);
			var latLng = overlay.getProjection().fromContainerPixelToLatLng(point);
				placeMarker($(this).attr('rel'), latLng);
			}
		});
		$('#mapAuxBox').slideDown('fast', function(){
			
			$(this).css('overflow', 'visible');
			$('.markerDragable').effect( 'bounce', {distance:10, direction: 'up', times: 3}, 250);
			
			/* autocomplete croquis */
			var inputPuntosDeInteres = document.getElementById('search_punto_de_interes');
			var options = {
				bounds: map.getBounds()
			};
		
			var autocompletePuntosDeInteres = new google.maps.places.Autocomplete(inputPuntosDeInteres, options);
			autocompletePuntosDeInteres.bindTo('bounds', map);
			
			google.maps.event.addListener(autocompletePuntosDeInteres, 'place_changed', function() {
				var placePuntosDeInteres = autocompletePuntosDeInteres.getPlace();
				if (placePuntosDeInteres.geometry.viewport) {
					map.fitBounds(placePuntosDeInteres.geometry.viewport);
				} else {
					map.setCenter(placePuntosDeInteres.geometry.location);
					map.setZoom(16);
				}
				placeMarker('punto_de_interes', placePuntosDeInteres.geometry.location);
				
			});
			
		});
		
		return false;
		
	});
	
	$('a#buscarComoLlegar').live('click', function(event){
		
		if(latLngs.origen !== null && latLngs.destino !== null)
		{
			
			$('#listadoRutas').html('<div class="ajaxLoader"><img src="'+baseUrl+'imagenes/ajaxLoader.gif" /></div>');	
			limpiarRutas();
			
			//$.post(baseUrl + 'ajax/como_llegar', {lat1:latLngs.origen.lat(), lng1:latLngs.origen.lng(), lat2:latLngs.destino.lat(), lng2:latLngs.destino.lng()}, function(json){
      $.post('http://buzity.com/api/get/como_llegar', {lat1:latLngs.origen.lat(), lng1:latLngs.origen.lng(), lat2:latLngs.destino.lat(), lng2:latLngs.destino.lng()}, function(json){
				
				$('#listadoRutas').html('');
				
				$('#panelSuperior').html('<a href="javascript:;" id="resetRutasBtn">&laquo; Volver</a> &bull; <span>Resultados de la bÃºsqueda</span>');
				
				if(json.status === 'ok')
				{
					$('#listadoRutas').append('<ul>');
					
					$.each(json.resultado, function(i, rutaresultado){
						
						$('#listadoRutas ul').append('<li><a class="ruta" href="javascript:void(0);" data-rid="'+rutaresultado.id+'">'+rutaresultado.nombre+'</a></li>');
						
					});
					
				} else {
					
					$('#listadoRutas').append(json.error);
					
				}
				
			},'json');
		
		}

	});
	
	$('a#buscarRutasPorPunto').live('click', function(event){
		
		
		$('#listadoRutas').html('<div class="ajaxLoader"><img src="'+baseUrl+'imagenes/ajaxLoader.gif" /></div>');
		$('#mapInfoContainer').html('<div class="ajaxLoader"><img src="'+baseUrl+'imagenes/ajaxLoader.gif" /></div>');	
		
		limpiarRutas();
		
		$.post('http://buzity.com/api/get/rutas_por_punto', {lat:latLngs.punto.lat(), lng:latLngs.punto.lng()}, function(json){
			
			$('#listadoRutas').html('');
			
			$('#panelSuperior').html('<a href="javascript:;" id="resetRutasBtn">&laquo; Volver</a> &bull; <span>Resultados de la bÃºsqueda</span>');
			
			if(json.status === 'ok')
			{
				
				$('#listadoRutas').append('<ul>');
				
				$.each(json.resultado, function(i, rutaresultado){
					
					$('#listadoRutas ul').append('<li><a class="ruta" href="javascript:void(0);" data-rid="'+rutaresultado.id+'">'+rutaresultado.nombre+'</a></li>');
					
				});
				
			} else {
				
				$('#listadoRutas').append(json.error);
				
			}
			
		},'json');
		
		mostrar_embed_code();

	});
	
	$('#embeber_mapa_lnk').live('click', function(event){
		
		$('.table_cell').show();
		
	});
	
	$('.embed_size_radio').live('click', function(event){
		
		if($(this).val() === '350x200')
		{
			
			$('#embed_code').text('<a id="rd-rpp" width="350" height="200" href="http://mty.rutadirecta.com" api="rpp" latlng="'+latLngs.punto.lat()+','+latLngs.punto.lng()+'">Rutas de camiones</a><script src="http://rut.as/rpp"></script>');
			
		} else if($(this).val() === '500x400') {
			
			$('#embed_code').text('<a id="rd-rpp" width="500" height="400" href="http://mty.rutadirecta.com" api="rpp" latlng="'+latLngs.punto.lat()+','+latLngs.punto.lng()+'">Rutas de camiones</a><script src="http://rut.as/rpp"></script>');
			
		}
		
	});
	
	$('#buscarPuntosDeInteresPorPunto').live('click', function(event){
		
		
		$('#listadoRutas').html('<div class="ajaxLoader"><img src="'+baseUrl+'imagenes/ajaxLoader.gif" /></div>');	
		limpiarRutas();
		
		$.post(baseUrl + 'ajax/puntos_de_interes_por_punto', {lat:latLngs.punto_de_interes.lat(), lng:latLngs.punto_de_interes.lng()}, function(json){
			
			$('#listadoRutas').html('');
			
			$('#panelSuperior').html('<a href="javascript:;" id="resetRutasBtn">&laquo; Volver</a> &bull; <span>Resultados de la bÃºsqueda</span>');
			
			if(json.status === 'ok')
			{
				
				$('#listadoRutas').append('<ul>');
				
				$.each(json.resultado, function(i, rutaresultado){
					
					$('#listadoRutas ul').append('<li><a class="punto_de_interes" href="javascript:void(0);" rel="'+rutaresultado.id+'">'+rutaresultado.nombre+'</a></li>');
										
				});
				
				listadoPuntos = $('#listadoRutas').html();
				
			} else {
				
				$('#listadoRutas').append(json.error);
				
			}
			
		},'json');

	});
	
	$('.buscarRutasPorPuntoInteres').live('click', function(event){
		
		
		$('#listadoRutas').html('<div class="ajaxLoader"><img src="'+baseUrl+'imagenes/ajaxLoader.gif" /></div>');	
		limpiarRutas();
		
		$.post(baseUrl + 'ajax/rutas_por_punto', {lat:latLngs.punto.lat(), lng:latLngs.punto.lng()}, function(json){
			
			$('#listadoRutas').html('');
			
			$('#panelSuperior').html('<a href="javascript:;" id="resetPuntosBtn">&laquo; Volver</a> &bull; <span>Resultados de la bÃºsqueda</span>');
			
			if(json.status === 'ok')
			{
				
				$('#listadoRutas').append('<ul>');
				
				$.each(json.resultado, function(i, rutaresultado){
					
					$('#listadoRutas ul').append('<li><a class="ruta" href="javascript:void(0);" data-rid="'+rutaresultado.id+'">'+rutaresultado.nombre+'</a></li>');
					
				});
				
			} else {
				
				$('#listadoRutas').append(json.error);
				
			}
			
		},'json');

	});
	
	$('.crearPuntoDeInteresBtn').live('click',function(){
		
		$('#listadoRutas').html('<div class="ajaxLoader"><img src="'+baseUrl+'imagenes/ajaxLoader.gif" /></div>');	
		
	});
	
	$('a#mapAuxBoxCerrar').live('click', function(event){
		
		event.preventDefault();
		
		$('.mapButtons').removeClass('active');
		$('.contenedor_urlstr').hide();
		$('#mapAuxBox').slideUp('fast', function(){
			
			$('#mapAuxBox').html('');
			
		});
		
	});
	
	$('.foto_ruta_lnk').live('click', function(e){

		$.colorbox({href:$(this).attr('href')});
		e.preventDefault();

	});
	
	if(p!==null)
	{
		
		$('#rutasPorPuntoBtn:not(.active)').click();
		if(p!==null)
		{
			
			llp = p.split(',');
			p = placeMarker('punto', new google.maps.LatLng(llp[0], llp[1]));
			
			
		}
		
		
	} else if(o!==null || d!==null)
	{
		
		$('#comoLlegarBtn:not(.active)').click();
		if(o!==null)
		{
			
			llo = o.split(',');
			o = placeMarker('origen', new google.maps.LatLng(llo[0], llo[1]));
			
			
		}
		
		if(d!==null)
		{
			
			lld = d.split(',');
			d = placeMarker('destino', new google.maps.LatLng(lld[0], lld[1]));
			
			
		}
		
	}
	/*
	if ($('.contenedorAdsenseMapa').height() == 0) {
        console.log('adblock activated');
		$('#map').css('-webkit-filter','blur(4px)');
		$('.contenedorAdsenseMapa').css({'top':'18px', 'left':'18px', 'background':'transparent', 'border':'none'}).html('<img src="http://mty.rutadirecta.com/imagenes/adblock_petition.png" />');
		
    }
	*/
	$('#comoLlegarBtn').click();
});

window.map="";
/**
 * List Controller
 * @version v0.2.2 - 2015-04-23 * @link http://csluni.org
 * @author Eisson Alipio <eisson.alipio@gmail.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
(function(){
  'use strict';

  angular.module('Controllers', ['uiGmapgoogle-maps'])

  .filter('estadoFilter', function(){
  return function(id){
    var estados = ['Inactivo', 'Activo'];
      return estados[id];
    };
  })
  .controller('TabsController',['$scope', '$route','$http', function($scope, $route, $http){
    ////console.log($route.current);
     $scope.$route = $route;
  }])

  .controller('historicoController',['$scope', '$route','$http', function($scope, $route, $http){
     $scope.$route = $route;
  }])

.controller('CentrosController',['$scope', '$http', function($scope, $http){

  $scope.first=true;
    var markers =[];
    var infoWindow;
    var user = "img/user.png";
    var centroimg = "img/centros.png";
    var geoLatitude ;
    var geoLongitude;
    //$scope.dist_rela=9999999;
    $scope.min=9999999;

    $scope.printMarkers = function(map, data){
      var beachMarker;
      beachMarker = new google.maps.Marker({ position: {lat: parseFloat(data.latitud), lng: parseFloat(data.longitud)}, map: map, icon: centroimg, animation: google.maps.Animation.DROP, title: data.nombre });
      markers.push(beachMarker);
      beachMarker.addListener('click', function() {
      $scope.first=false;
      if (infoWindow !== void 0) { infoWindow.close(); }
         infoWindow = new google.maps.InfoWindow({
            content: "<div id='up'><div id='up_right'><table style='font-size: 0.95em;'><tbody><tr><td>Sensor Prueba</td></tr><tr>"+
            "<td><b>SmartFlow Camera</b></td></tr></table></div><div id='up_left'><img src='img/centros_big.png'/></div></div>"+"<hr>"+"<table style='font-size: 0.875em;'><tr><td><i class='fa fa-map-marker fa-1x'></i></td><td>"+data.direccion+", "+data.distrito+", "+data.provincia+", "+data.departamento+"</td>"+
          "</tr><tr><td><i class='fa fa-phone fa-1.5x'></i></td><td>Entrantes: 30 vehiculos/min</td></tr><tr><td><i class='fa fa-clock-o fa-1x'></i></td><td>Salientes: 62 vehiculos/min</td>"+
          "</tr><tr><td><i class='fa fa-user fa-1x'></i></td><td>Municipalidad de LIMA</td></tr></tbody></table>",
          maxHeight: 400,
          maxWidth: 300
         });
        if (infoWindow) { infoWindow.close(); }
        infoWindow.open(map, beachMarker);
      });
      //$scope.dist_rela=Math.sqrt(Math.pow((geoLatitude-$scope.data.latitud),2)+Math.pow((geoLongitude-$scope.data.longitud),2));
   };

    $scope.handleLocationError = function(browserHasGeolocation, infoWindow, pos){
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
    }
    $scope.initMap = function(){
      var data  = [
{"codigo":"00006171","tipo":"CENTRO","departamento":"LIMA","provincia":"LIMA","distrito":"LIMA","direccion":"Av. Paseo de la Republica","telefono":"3287304","horario":"08:00 - 20:00 HORAS","resp":"CARLOS ALBERTO ESPINOZA FLORES","latitud":-12.0911631,"longitud":-77.0347864},
{"codigo":"00006171","tipo":"CENTRO","departamento":"LIMA","provincia":"LIMA","distrito":"LIMA","direccion":"Av. Paseo de la Republica","telefono":"3287304","horario":"08:00 - 20:00 HORAS","resp":"CARLOS ALBERTO ESPINOZA FLORES","latitud":-12.0922327,"longitud":-77.0325547},
{"codigo":"00006171","tipo":"CENTRO","departamento":"LIMA","provincia":"LIMA","distrito":"LIMA","direccion":"Av. Paseo de la Republica","telefono":"3287304","horario":"08:00 - 20:00 HORAS","resp":"CARLOS ALBERTO ESPINOZA FLORES","latitud":-12.0932817,"longitud":-77.0255487},
{"codigo":"00006171","tipo":"CENTRO","departamento":"LIMA","provincia":"LIMA","distrito":"LIMA","direccion":"Av. Paseo de la Republica","telefono":"3287304","horario":"08:00 - 20:00 HORAS","resp":"CARLOS ALBERTO ESPINOZA FLORES","latitud":-12.0935967,"longitud":-77.0240787},
{"codigo":"00006171","tipo":"CENTRO","departamento":"LIMA","provincia":"LIMA","distrito":"LIMA","direccion":"Av. Paseo de la Republica","telefono":"3287304","horario":"08:00 - 20:00 HORAS","resp":"CARLOS ALBERTO ESPINOZA FLORES","latitud":-12.0912467,"longitud":-77.0212467},
{"codigo":"00006171","tipo":"CENTRO","departamento":"LIMA","provincia":"LIMA","distrito":"LIMA","direccion":"Av. Paseo de la Republica","telefono":"3287304","horario":"08:00 - 20:00 HORAS","resp":"CARLOS ALBERTO ESPINOZA FLORES","latitud":-12.0912157,"longitud":-77.0161617}];
      var pos;
          geoLongitude = -77.0347292;
          geoLatitude = -12.101175;
          map = new google.maps.Map(document.getElementById('map'), { center: {lat: geoLatitude, lng: geoLongitude}, zoom: 15 });
          pos = { lat: geoLatitude, lng: geoLongitude };
          map.setCenter(pos);
var flightPlanCoordinates = [
{"lat":-12.105751397200535, "lng":-77.06361053744808},
{"lat":-12.106208078111667, "lng":-77.06373284588182},
{"lat":-12.107463080550781, "lng":-77.06239020037026},
{"lat":-12.109378943576218, "lng":-77.05935235133973},
{"lat":-12.113210574805343, "lng":-77.05310485426054},
{"lat":-12.109067740323411, "lng":-77.04865021348638},
{"lat":-12.110837692307063, "lng":-77.04671418670347},
{"lat":-12.110469297605247, "lng":-77.04620759965599},
{"lat":-12.110436578919987, "lng":-77.04413460448131},
{"lat":-12.11084065460684, "lng":-77.04314909370646},
{"lat":-12.108335586386481, "lng":-77.04049993133606},
{"lat":-12.111243403576095, "lng":-77.03757181843412},
{"lat":-12.110302482777612, "lng":-77.03693323845914},
{"lat":-12.10359823734789, "lng":-77.03162502959498},
{"lat":-12.102864972892391, "lng":-77.0273314537244},
{"lat":-12.102021557450831, "lng":-77.01866587725084},
{"lat":-12.102411817294353, "lng":-77.01648384093545},
{"lat":-12.103311108702313, "lng":-77.01652739836203},
{"lat":-12.103528527082874, "lng":-77.01615253048999},
{"lat":-12.104131210082924, "lng":-77.01643276353548},
{"lat":-12.105252654639283, "lng":-77.01657480566826},
{"lat":-12.10578562763099, "lng":-77.01639754895473},
{"lat":-12.106437188691514, "lng":-77.0167162825743},
{"lat":-12.108976987407063, "lng":-77.01471221035229},
{"lat":-12.1086984403421, "lng":-77.01429196384555},
{"lat":-12.10844444075725, "lng":-77.01358730083922},
{"lat":-12.107852504443812, "lng":-77.01031116530356},
{"lat":-12.100982929147653, "lng":-77.01182695060828},
{"lat":-12.09983053824457, "lng":-77.01201236754105},
{"lat":-12.098594223451483, "lng":-77.01198320705436},
{"lat":-12.093648893769053, "lng":-77.00983884148627},
{"lat":-12.089811246830815, "lng":-77.00773877427395},
{"lat":-12.08925721711302, "lng":-77.00763427113321},
{"lat":-12.088661223794155, "lng":-77.00763705657181},
{"lat":-12.089634300666527, "lng":-77.01438588923844},
{"lat":-12.090604769343782, "lng":-77.02285176202497},
{"lat":-12.090835752939991, "lng":-77.02449490127361},
{"lat":-12.090122744310618, "lng":-77.02479856061126},
{"lat":-12.09071093063742, "lng":-77.02961158733643},
{"lat":-12.091121739611506, "lng":-77.03007062620759},
{"lat":-12.090651304559247, "lng":-77.03357665407765},
{"lat":-12.092385607374526, "lng":-77.04640373911315},
{"lat":-12.092577770763507, "lng":-77.04752029391943},
{"lat":-12.088258865432193, "lng":-77.04814331836792},
{"lat":-12.085409331397768, "lng":-77.04869754546041},
{"lat":-12.08794624600605, "lng":-77.05074482743947},
{"lat":-12.092749095876655, "lng":-77.05334992543743},
{"lat":-12.090122420663214, "lng":-77.05778768097872},
{"lat":-12.091794486652542, "lng":-77.05875991342384},
{"lat":-12.093550476996198, "lng":-77.05929227323315},
{"lat":-12.096012201439812, "lng":-77.05967481300968},
{"lat":-12.096622324498114, "lng":-77.05842120797894},
{"lat":-12.098975560332228, "lng":-77.05946525501975},
{"lat":-12.099920566310319, "lng":-77.0599090328829},
{"lat":-12.099879466514732, "lng":-77.06025088743047},
{"lat":-12.100940729779557, "lng":-77.06079512444035},
{"lat":-12.101070069402965, "lng":-77.0606175952696},
{"lat":-12.102190756421173, "lng":-77.06073511014006},
{"lat":-12.102849866076099, "lng":-77.0605736751267},
{"lat":-12.103874345609311, "lng":-77.06070677342257},
{"lat":-12.104460017706465, "lng":-77.06024760939016},
{"lat":-12.105066670171894, "lng":-77.06019613998859},
{"lat":-12.10566080100598, "lng":-77.06231639976221},
{"lat":-12.105803848446552, "lng":-77.0633959607269}
  ];
  var flightPath = new google.maps.Polyline({
    path: flightPlanCoordinates,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

  flightPath.setMap(map);

          var GeoMarker = new google.maps.Marker({ position: pos, map: map, icon: user });
          $scope.cercano = {};
          console.log(data);
          $.each(data, function( index, value ) {
            $scope.printMarkers(map, value);
            $scope.cercano.nombre = value.nombre;
            $scope.cercano.telefono = value.telefono;
            $scope.cercano.horario = value.horario;
            $scope.cercano.ubica2 = ", "+value.distrito+", "+value.provincia+", "+value.departamento;
            $scope.cercano.tipo = value.tipo;
            $scope.cercano.ubica = value.direccion;
            $scope.cercano.resp = value.resp;
            $scope.cercano.latitud = value.latitud;
            $scope.cercano.longitud = value.longitud;
              /*
              $scope.dist_rela=Math.sqrt(Math.pow((geoLatitude-value.latitud),2)+Math.pow((geoLongitude-value.longitud),2));
              if($scope.dist_rela<$scope.min && $scope.first==true){
                $scope.min = $scope.dist_rela;
              }*/
          });
        $scope.first=false;
          infoWindow = new google.maps.InfoWindow({ content: "<div id='up'><div id='up_right'><table style='font-size: 0.95em;'><tbody><tr><td>"+$scope.cercano.tipo+"</td></tr><tr>"+
          "<td><b>"+$scope.cercano.nombre+"</b></td></tr></table></div><div id='up_left'><img src='img/centros_big.png'/></div></div>"+"<hr>"+"<table style='font-size: 0.875em;'><tr><td><i class='fa fa-map-marker fa-1x'></i></td><td>"+$scope.cercano.ubica+", "+$scope.cercano.ubica2+"</td>"+
          "</tr><tr><td><i class='fa fa-phone fa-1.5x'></i></td><td>"+$scope.cercano.telefono+"</td></tr><tr><td><i class='fa fa-clock-o fa-1x'></i></td><td>"+$scope.cercano.horario+"</td>"+
          "</tr><tr><td><i class='fa fa-user fa-1x'></i></td><td>" + $scope.cercano.resp+"</td></tr></tbody></table><p>Centro Mas Cercano</p>", maxHeight: 400, maxWidth: 300 });
          var beachMarker2 = new google.maps.Marker({ position: {lat: parseFloat($scope.cercano.latitud), lng: parseFloat($scope.cercano.longitud)}, map: map, icon: centroimg });
    }
    $scope.initMap();
  }])

  .controller('VacunasController',['$scope', '$http', '$route', function ($scope, $http, $route) {
      $scope.init = function(){
        document.title = "Vacunas";
        ////console.log($route.current.activetab);
        $route.current.activetab ? $scope.$route = $route : null

        $http.post ('administracion/api/getVacunas.php')
            .success(function(data) {
                    $scope.vacunas = data;
                    //console.log(data);
                })
            .error(function(data) {
                    //console.log('Error: ' + data);
            });
      }
      $scope.init();
  }])

  .controller('AcercaController',['$scope', '$http', function($scope, $http){
    //
  }])

})();

(function(){

'use strict';

var app = angular.module('eissonApp', [
  'ngRoute',
  'ngAnimate',
  'angular-loading-bar',
  'ui.materialize',
  'angularMoment',
  'Controllers',
  'ui.validate',
  'uiGmapgoogle-maps']);



    app.config(['$routeProvider', 'cfpLoadingBarProvider' , function($routeProvider, cfpLoadingBarProvider){
      cfpLoadingBarProvider.includeSpinner   = true;
      cfpLoadingBarProvider.latencyThreshold = 1;


      $routeProvider.
      
        when('/centros', {
          templateUrl: 'views/centros.html',
          caseInsensitiveMatch: true,
          controller: 'CentrosController',
          activetab: 'centros'
        }).

        when('/acerca', {
          templateUrl: 'views/acerca.html',
          caseInsensitiveMatch: true,
          controller: 'AcercaController',
          activetab: 'acerca'
        }).
        when('/historico', {
          templateUrl: 'views/historico.php',
          caseInsensitiveMatch: true,
          controller: 'historicoController',
          activetab: 'historico'
        }).
        
        otherwise({
          redirectTo: '/acerca'
        });

      }])
  .config(function(uiGmapGoogleMapApiProvider) {
      uiGmapGoogleMapApiProvider.configure({
          //    key: 'your api key',
          v: '3.17',
          libraries: 'weather,geometry,visualization'
      });
  });

})();
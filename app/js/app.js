'use strict';
   var SampleApp =  angular.module('SampleApp',
       ['ngRoute',
           'ngAnimate'
       ]);

        SampleApp.config([
            '$locationProvider',
            '$routeProvider',
            function($locationProvider, $routeProvider) {
                $locationProvider.hashPrefix('!');
                // routes
                $routeProvider
                    .when("/", {
                        templateUrl: "./partials/partial1.html",
                        controller: "mainController"
                    })
                    .otherwise({
                        redirectTo: '/'
                    });
            }
        ]);




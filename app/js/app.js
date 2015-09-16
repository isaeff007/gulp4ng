(function() {
    'use strict';

    require('angular');
    require('angular-route');
    require('angular-animate');
//make the controller avail. like an npm module
    var mainCtrl = require('./controllers/mainController');
    var SampleApp = angular.module('SampleApp',
        ['ngRoute',
            'ngAnimate'
        ]);

    SampleApp.config([
        '$locationProvider',
        '$routeProvider',
        function ($locationProvider, $routeProvider) {
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
    ])
        //load controller that exprots the function($scope)
        .controller('mainController', ['$scope', mainCtrl]);


}());

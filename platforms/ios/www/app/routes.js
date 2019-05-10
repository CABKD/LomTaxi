"use strict";

angular.module("ngApp").config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){

    $urlRouterProvider.otherwise("/home");
 
    $stateProvider.state("login", {
        url: "/login",
        templateUrl: "app/components/login.html",
        title: "Login",
        controller: "LoginController",
        controllerAs: "Login"
    })
    .state("home", {
        url: "/home",
        templateUrl: "app/components/home.html",
        title: "Sensors",
        controller: "HomeController",
        controllerAs: "Home"
    })
    .state("settings", {
        url: "/settings",
        templateUrl: "app/components/settings.html",
        title: "Settings",
        controller: "SettingsController",
        controllerAs: "SettingsController"
    })
    .state("histo", {
        url: "/histo",
        templateUrl: "app/components/histo.html",
        title: "Histo",
        controller: "HistoController",
        controllerAs: "HistoController"
    });


}]);

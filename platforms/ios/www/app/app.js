"use strict";
angular.module("ngApp", [
	"ngAnimate", 
	"ngAria", 
	"ui.router", 
	"ngMaterial",
	"ngMdIcons", 
	"ngCordova", 
	"ngStorage", 
	"angularMoment",
	"ngMessages",
	"swipe",
	'ngSanitize',
	'angular-sortable-view',
	'angularPaho',
    'ngFileUpload',
    'google.places'
    ])
    
    .filter('startFrom', function() {
        return function(input, start) {
            start = +start;
            return input.slice(start);
        }
    })
// ngTouch is No Longer Supported by Angular-Material
.run(function ($rootScope, $state, AuthService, AUTH_EVENTS, $location, API_ENDPOINT, MqttClient, shared, $cordovaFile, $window) {

    $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
        if (!AuthService.isAuthenticated() ) {
            if (next.name !== 'login'  ) {
                event.preventDefault();
                $state.go('login');
            }
            
        }else{
        	$rootScope.userFirstName = AuthService.userFirstName(); 	
        	$rootScope.userLastName = AuthService.userLastName(); 	
        	$rootScope.avatar = API_ENDPOINT.urlImages+"/"+AuthService.userAvatar();
        	$rootScope.userId = AuthService.userId();
        }
     
    });
    
  
    document.addEventListener("backbutton", function (e) {
        if($location.path().match('home') || $location.path().match('login')){
//          navigator.app.exitApp();
          e.preventDefault();
        }  else{
          e.preventDefault();
          history.back();
        }
      }, false);
      
    $rootScope.back = function (e) {
        if($location.path().match('home') || $location.path().match('login')){
//          navigator.app.exitApp();
          e.preventDefault();

        }  else{
          e.preventDefault();
          history.back();
        }
	}
    
    $rootScope.changePage = function(page){
   	if($state.current.name === page){
    		$state.reload(page);
    	}else{
        	$location.path(page);
    	}
 	}
    $rootScope.logout = function(){
    	$rootScope.logOut = true;
    }
    $rootScope.cancelLogout = function(){
    	$rootScope.logOut = false;
    }
    $rootScope.confirmLogout = function(){
    	$rootScope.logOut = false;
    	AuthService.logout();
    	$location.path('login');
    }
	
})

.config(function($mdThemingProvider) { // Angular-Material Color Theming
  $mdThemingProvider.theme('default')
    .primaryPalette('green')
    .accentPalette('pink');
  
 
})

.controller("HeaderController", function($state, $rootScope, $scope, $location, $mdSidenav, $mdComponentRegistry){

	$rootScope.avatarLoad = false;
	  var ctrl = $rootScope;

//	  $rootScope.toggle = angular.noop;
	  $rootScope.toggle = function(){
		  $mdSidenav('left').toggle();
	  };

/*    this.isOpen = function() { return false };
    $mdComponentRegistry
    .when("left")
    .then( function(sideNav){
      ctrl.isOpen = angular.bind( sideNav, sideNav.isOpen );
      ctrl.toggle = angular.bind( sideNav, sideNav.toggle );
    });

    this.toggleRight = function() {
    $mdSidenav("left").toggle()
        .then(function(){
        });
    };

    this.close = function() {
    $mdSidenav("right").close()
        .then(function(){
        });
    };
*/
   
	  $rootScope.isActive = function (viewLocation) {
			var res = $location.path().match(viewLocation); 
			return  res != null;
	    };
    
}).directive('imageOnload', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
            	$rootScope.avatarLoad = true;
            });
            element.bind('error', function(){
            });
        }
    };
});
  


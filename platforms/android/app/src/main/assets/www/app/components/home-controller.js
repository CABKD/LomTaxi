'use strict';

/**
 * @ngdoc function
 * @name MaterialApp.controller:ProjectsCtrl
 * @description
 * # ProjectsCtrl
 * Controller of MaterialApp
 */
angular.module('ngApp').controller('HomeController', function ( $rootScope, $scope, WS, $timeout, $mdDialog, $location, MqttClient, shared, API_ENDPOINT, $interval, $window, $state) {

	var preserveViewport = false;	
	var rideId = 0; // received in request accept topic
	
	
	$scope.rideStatus = 0; // 0 :iddle, 1 : request, 2 : No drivers available, 3 : drivers available, 4 : taxi is coming , 5 : taxi is arrived, 6 : goto destination, 7 : arrived to destination, 8 : scoring
	$scope.showPopup = false;
	//$scope.etat=0;
	$scope.wait = false;
	$scope.mqttConnect = false;
	$scope.adresse="";
//	$scope.time="";
	$rootScope.titleBar = "Request an Autonomous POD";
	$scope.dest_lat=null;
	$scope.dest_lng=null;
	$scope.donnee=null;
	var stationName = [];
	var stationLat = [];
	var stationLng = [];
	var puStation;
	var myLatlng;
	var ref;
	$scope.TN=null;
	$scope.TU=null;
	$scope.TAN=null;
	var shuttle = {};
	$scope.shuttle = shuttle;
	var rideRequest = null;
	/* $scope.noshow=null; */
	var tamv=100;
	function setArrivedTime(){
		var da = new Date();
		var n = da.toString().split(' ');
		$scope.today=n[1]+", "+n[2]+" "+n[3];
		var h = n[4].split(':');
		$scope.hour=h[0]+":"+h[1];
	}
	setArrivedTime();
	
	var userPos = null;

	
	
	/**********************************************************
	 * Map section
	 */
	$scope.mapLoad= false;
	var freeShuttlesMarker = [];
	var customerMarker=[];
	var bounds;
	
	var map, GeoMarker;
	var geocoder = null;
	var geocoder1=null;
	var options = {
			  enableHighAccuracy: true,
			  timeout: 5000,
			  maximumAge: 1000
			};
	
	$rootScope.centerLocalisation = function(){
	
	 	if($scope.rideStatus < 4){
			getPosition();
		} 
		preserveViewport = false;

	}

	function getPosition() {
		
			   if (navigator && navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(
			function(position){     
				  $scope.localisationFound = true;  
					 var lat = parseFloat(position.coords.latitude.toFixed(6));
				   var lng = parseFloat(position.coords.longitude.toFixed(6));         
				
				   userPos = {"lat":lat, "lng":lng}; 
				//  map.setCenter({lat: 48.786081, lng: 2.174604}); 
				  map.setCenter(userPos); 
				  showCustomer(userPos)
				 },
			   function(err) {setTimeout(getPosition,50);},options);  
			   }     
	  }
	  var closest=-1;
var prevColor="#0feaac";	

/* var prev_image="https://www.lifeonmaps.com/images/mg-pin.png";
var image="https://www.lifeonmaps.com/images/mg-pin24.png"; */
var prev_image={url: "./assets/img/mg-pin.png"}
var image={url: "./assets/img/mg-pin24.png"}
var stationMarker=[];
 //====== STATIONS
 
 stationName[0]="Parking Lot";
 stationLat[0]="48.784939";
 stationLng[0]="2.177946";
 stationName[1]="TRAM";
 stationLat[1]="48.784939";
 stationLng[1]="2.177946";
 stationName[2]="PICARDIE";
 stationLat[2]="48.784896";
 stationLng[2]="2.171036";
 stationName[3]="LECLERC";
 stationLat[3]="48.784435";
 stationLng[3]="2.169032";
 stationName[4]="BOROTRA";
 stationLat[4]="48.781934";
 stationLng[4]="2.168714";
 stationName[5]="BRETAGNE";
 stationLat[5]="48.783572";
 stationLng[5]="2.165957";
 stationName[6]="MOZART";
 stationLat[6]="48.785503";
 stationLng[6]="2.169211";
 stationName[7]="GOUNOD";
 stationLat[7]="48.785667";
 stationLng[7]="2.172534";

$scope.affiche_stat_dest=function(){
	
	
	 closest=getDropOff();
	 console.log(closest)
 	 if(closest!=-1){
	 	stationMarker[closest].setIcon(prev_image);} 
		switch(closest){
			case 1:
			 document.getElementById("bouton1").style.backgroundColor="red";
			document.getElementById("bouton2").style.backgroundColor=prevColor;
			document.getElementById("bouton3").style.backgroundColor=prevColor;
			document.getElementById("bouton4").style.backgroundColor=prevColor;
			document.getElementById("bouton5").style.backgroundColor=prevColor; 
			document.getElementById("bouton6").style.backgroundColor=prevColor; 
			document.getElementById("bouton7").style.backgroundColor=prevColor; 
			$scope.station=1;
			break;
			case 2:
			 document.getElementById("bouton2").style.backgroundColor="red";
			document.getElementById("bouton1").style.backgroundColor=prevColor;
			document.getElementById("bouton3").style.backgroundColor=prevColor;
			document.getElementById("bouton4").style.backgroundColor=prevColor;
			document.getElementById("bouton5").style.backgroundColor=prevColor; 
			document.getElementById("bouton6").style.backgroundColor=prevColor; 
			document.getElementById("bouton7").style.backgroundColor=prevColor; 
			$scope.station=2;
			break;
			case 3:
			 document.getElementById("bouton3").style.backgroundColor="red";
			document.getElementById("bouton2").style.backgroundColor=prevColor;
			document.getElementById("bouton1").style.backgroundColor=prevColor;
			document.getElementById("bouton4").style.backgroundColor=prevColor;
			document.getElementById("bouton5").style.backgroundColor=prevColor; 
			document.getElementById("bouton6").style.backgroundColor=prevColor; 
			document.getElementById("bouton7").style.backgroundColor=prevColor; 
			$scope.station=3;
			break;
			case 4:
			 document.getElementById("bouton4").style.backgroundColor="red";
			document.getElementById("bouton2").style.backgroundColor=prevColor;
			document.getElementById("bouton3").style.backgroundColor=prevColor;
			document.getElementById("bouton1").style.backgroundColor=prevColor;
			document.getElementById("bouton5").style.backgroundColor=prevColor; 
			document.getElementById("bouton6").style.backgroundColor=prevColor; 
			document.getElementById("bouton7").style.backgroundColor=prevColor; 
			$scope.station=4;
			break;
			 case 5:
			 document.getElementById("bouton5").style.backgroundColor="red";
			document.getElementById("bouton2").style.backgroundColor=prevColor;
			document.getElementById("bouton3").style.backgroundColor=prevColor;
			document.getElementById("bouton4").style.backgroundColor=prevColor;
			document.getElementById("bouton1").style.backgroundColor=prevColor; 
			document.getElementById("bouton6").style.backgroundColor=prevColor; 
			document.getElementById("bouton7").style.backgroundColor=prevColor; 
			$scope.station=5;
			
			break; 
			case 6:
			document.getElementById("bouton6").style.backgroundColor="red";
		   document.getElementById("bouton2").style.backgroundColor=prevColor;
		   document.getElementById("bouton3").style.backgroundColor=prevColor;
		   document.getElementById("bouton4").style.backgroundColor=prevColor;
		   document.getElementById("bouton1").style.backgroundColor=prevColor; 
		   document.getElementById("bouton5").style.backgroundColor=prevColor; 
		   document.getElementById("bouton7").style.backgroundColor=prevColor; 
		   $scope.station=6;
		   
		   break;
		   case 7:
		   document.getElementById("bouton7").style.backgroundColor="red";
		  document.getElementById("bouton2").style.backgroundColor=prevColor;
		  document.getElementById("bouton3").style.backgroundColor=prevColor;
		  document.getElementById("bouton4").style.backgroundColor=prevColor;
		  document.getElementById("bouton1").style.backgroundColor=prevColor; 
		  document.getElementById("bouton5").style.backgroundColor=prevColor; 
		  document.getElementById("bouton6").style.backgroundColor=prevColor; 
		  $scope.station=7 ;
		  
		  break;
			default :-1;
			document.getElementById("bouton2").style.backgroundColor=prevColor;
			document.getElementById("bouton1").style.backgroundColor=prevColor;
			document.getElementById("bouton3").style.backgroundColor=prevColor;
			document.getElementById("bouton4").style.backgroundColor=prevColor;
			document.getElementById("bouton5").style.backgroundColor=prevColor;
			document.getElementById("bouton6").style.backgroundColor=prevColor; 
			document.getElementById("bouton7").style.backgroundColor=prevColor; 
			break;
		}
		console.log('Closest marker is: ' + stationName[closest]);
		$scope.donnee=1;
		closest=-1;
}




function init_stations(){
	var pos_tram=new google.maps.LatLng(48.785849,2.176051);
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
		  var pos = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		  };
		  var ma_position=new google.maps.LatLng(pos.lat,pos.lng);
		  var distance=google.maps.geometry.spherical.computeDistanceBetween(ma_position,pos_tram)
		  console.log(distance+" cal_dist")
		  if(distance>300){
			document.getElementById("bouton2").disabled = true;
			document.getElementById("bouton3").disabled = true;
			document.getElementById("bouton4").disabled = true;
			document.getElementById("bouton5").disabled = true;
			document.getElementById("bouton6").disabled = true;
			document.getElementById("bouton7").disabled = true;
		  }
		  if(distance <300){
			document.getElementById("bouton1").disabled = true;
		  }
		})
	}
 var myLatLng = new google.maps.LatLng(48.785849,2.176051);
 
 
	for(var i=1; i<=stationLat.length; i++){
	 
	 myLatLng = new google.maps.LatLng(stationLat[i],stationLng[i]);
	 stationMarker[i] = new google.maps.Marker({
		 position: myLatLng,
		 map: map,
		 title: stationName[i],
	     icon: image
	   });
	}
	   google.maps.event.addListener(stationMarker[1],'click', function(){
				
		stationMarker[1].setIcon(prev_image);
		stationMarker[2].setIcon(image);
		stationMarker[3].setIcon(image);
		stationMarker[4].setIcon(image);
		stationMarker[5].setIcon(image);
		stationMarker[6].setIcon(image);
		stationMarker[7].setIcon(image);
	
		document.getElementById("bouton1").style.backgroundColor="red";
		document.getElementById("bouton2").style.backgroundColor=prevColor;
		document.getElementById("bouton3").style.backgroundColor=prevColor;
		document.getElementById("bouton4").style.backgroundColor=prevColor;
		document.getElementById("bouton5").style.backgroundColor=prevColor;
		document.getElementById("bouton6").style.backgroundColor=prevColor;
		document.getElementById("bouton7").style.backgroundColor=prevColor;
		
		
			$scope.adresse=document.getElementById("bouton1").value;
	});

	google.maps.event.addListener(stationMarker[2],'click', function(){
			 
		stationMarker[2].setIcon(prev_image);
		stationMarker[1].setIcon(image);
		stationMarker[3].setIcon(image);
		stationMarker[4].setIcon(image);
		stationMarker[5].setIcon(image);
		stationMarker[6].setIcon(image);
		stationMarker[7].setIcon(image);
	
		document.getElementById("bouton2").style.backgroundColor="red";
		document.getElementById("bouton1").style.backgroundColor=prevColor;
		document.getElementById("bouton3").style.backgroundColor=prevColor;
		document.getElementById("bouton4").style.backgroundColor=prevColor;
		document.getElementById("bouton5").style.backgroundColor=prevColor;
		document.getElementById("bouton6").style.backgroundColor=prevColor;
		document.getElementById("bouton7").style.backgroundColor=prevColor;
	
			$scope.adresse=document.getElementById("bouton2").value;
});

google.maps.event.addListener(stationMarker[3],'click', function(){
	 
	stationMarker[3].setIcon(prev_image);
		stationMarker[2].setIcon(image);
		stationMarker[1].setIcon(image);
		stationMarker[4].setIcon(image);
		stationMarker[5].setIcon(image);
		stationMarker[6].setIcon(image);
		stationMarker[7].setIcon(image);
			document.getElementById("bouton3").style.backgroundColor="red";
	document.getElementById("bouton2").style.backgroundColor=prevColor;
		document.getElementById("bouton1").style.backgroundColor=prevColor;
		document.getElementById("bouton4").style.backgroundColor=prevColor;
		document.getElementById("bouton5").style.backgroundColor=prevColor;
		document.getElementById("bouton6").style.backgroundColor=prevColor;
		document.getElementById("bouton7").style.backgroundColor=prevColor;
		$scope.adresse=document.getElementById("bouton3").value;
});

 google.maps.event.addListener(stationMarker[4],'click', function(){  
		
	stationMarker[4].setIcon(prev_image);
		stationMarker[2].setIcon(image);
		stationMarker[3].setIcon(image);
		stationMarker[1].setIcon(image);
		stationMarker[5].setIcon(image);
		stationMarker[6].setIcon(image);
		stationMarker[7].setIcon(image);
		document.getElementById("bouton4").style.backgroundColor="red";
	document.getElementById("bouton2").style.backgroundColor=prevColor;
		document.getElementById("bouton1").style.backgroundColor=prevColor;
		document.getElementById("bouton3").style.backgroundColor=prevColor;
		document.getElementById("bouton5").style.backgroundColor=prevColor;
		document.getElementById("bouton6").style.backgroundColor=prevColor;
		document.getElementById("bouton7").style.backgroundColor=prevColor;
	
		$scope.adresse=document.getElementById("bouton4").value;
}); 

google.maps.event.addListener(stationMarker[5],'click', function(){  
		
	stationMarker[5].setIcon(prev_image);
		stationMarker[2].setIcon(image);
		stationMarker[3].setIcon(image);
		stationMarker[1].setIcon(image);
		stationMarker[4].setIcon(image);
		stationMarker[6].setIcon(image);
		stationMarker[7].setIcon(image);
		document.getElementById("bouton5").style.backgroundColor="red";
	document.getElementById("bouton2").style.backgroundColor=prevColor;
		document.getElementById("bouton1").style.backgroundColor=prevColor;
		document.getElementById("bouton3").style.backgroundColor=prevColor;
		document.getElementById("bouton4").style.backgroundColor=prevColor;
		document.getElementById("bouton6").style.backgroundColor=prevColor;
		document.getElementById("bouton7").style.backgroundColor=prevColor;
	
		$scope.adresse=document.getElementById("bouton4").value;
});
google.maps.event.addListener(stationMarker[6],'click', function(){  
		
	stationMarker[6].setIcon(prev_image);
		stationMarker[2].setIcon(image);
		stationMarker[3].setIcon(image);
		stationMarker[1].setIcon(image);
		stationMarker[5].setIcon(image);
		stationMarker[4].setIcon(image);
		stationMarker[7].setIcon(image);
		document.getElementById("bouton6").style.backgroundColor="red";
	document.getElementById("bouton2").style.backgroundColor=prevColor;
		document.getElementById("bouton1").style.backgroundColor=prevColor;
		document.getElementById("bouton3").style.backgroundColor=prevColor;
		document.getElementById("bouton5").style.backgroundColor=prevColor;
		document.getElementById("bouton4").style.backgroundColor=prevColor;
		document.getElementById("bouton7").style.backgroundColor=prevColor;
	
		$scope.adresse=document.getElementById("bouton4").value;
});
google.maps.event.addListener(stationMarker[7],'click', function(){  
		
	stationMarker[7].setIcon(prev_image);
		stationMarker[2].setIcon(image);
		stationMarker[3].setIcon(image);
		stationMarker[1].setIcon(image);
		stationMarker[5].setIcon(image);
		stationMarker[6].setIcon(image);
		stationMarker[4].setIcon(image);
		document.getElementById("bouton7").style.backgroundColor="red";
	document.getElementById("bouton2").style.backgroundColor=prevColor;
		document.getElementById("bouton1").style.backgroundColor=prevColor;
		document.getElementById("bouton3").style.backgroundColor=prevColor;
		document.getElementById("bouton5").style.backgroundColor=prevColor;
		document.getElementById("bouton6").style.backgroundColor=prevColor;
		document.getElementById("bouton4").style.backgroundColor=prevColor;
	
		$scope.adresse=document.getElementById("bouton7").value;
});

}


	function initMap() {
		if(event.cancelable){
		event.preventDefault();}
	    setTimeout(function(){
			
	        map = new google.maps.Map(document.getElementById('gmaps'), {
	            zoom: 15,
		      
				center: {lat: 48.785849, lng: 2.176051}, 
	            zoomControl: true, //false
	            scaleControl: false, //false
	            streetViewControl: false, //false
				gestureHandling: 'cooperative',//g
				maxZoom: 21,
				draggable:true,
	            disableDefaultUI: true
			});
	        setTimeout(getPosition,50);
			setTimeout(myPosition,50);
		
	    	geocoder = new google.maps.Geocoder();
	    	map.addListener('click', function(e) {
	    		geocoder.geocode({'location': e.latLng}, 
	    				function(results, status) {
		                    if (status === 'OK' && results[0]) {
		                    	$scope.$apply(function () {
									 //$scope.destination=results[0].formatted_address; 
									$scope.adresse=results[0].formatted_address;
		                    	});
		                    }
			        });
	    	})
	    	placesLimit();
			init_stations();
		
	    },10);
	}	    
	
	
	function waitMap(){
		try{
	        bounds = new google.maps.LatLngBounds();
				$scope.mapLoad= true;
			initMap();
			
		}
		catch(e){
			setTimeout(function(){
				waitMap();
			},500);
		}
	}
	waitMap();
	

	function getFreeShuttlesMarker(shuttleId) {
		
		for (var i = 0; i < freeShuttlesMarker.length; i++) {
			
			if(freeShuttlesMarker[i].shuttleId == shuttleId ) {
				return i;
			}
		}
		return -1;
	}


	function getCustomerMarker(customerId) {
	
		for (var i = 0; i < customerMarker.length; i++) {
			
			if(customerMarker[i].customerId == customerId ) {
				return i;
			}
		}
		return -1;
	}

	function clearFreeShuttlesMarker() {
		var thisMarker = null;
		while(thisMarker = freeShuttlesMarker.pop()){
			thisMarker.marker.setMap(null);
			thisMarker.marker1.setMap(null);
		}
		return;
	}

	function clearCustomerMarker() {
		var thisMarker = null;
		while(thisMarker = customerMarker.pop()){
			thisMarker.marker.setMap(null);
			
		}
		return;
	}

	function showMarker(shuttleInfo){
		
		var shuttleId = shuttleInfo.shuttleId;
		
		var index = getFreeShuttlesMarker(shuttleId);
		
		if(index < 0){
			addShuttleMarker(shuttleInfo);	
		}else{
			
			
			freeShuttlesMarker[index].marker.setPosition({"lat":shuttleInfo.lat,"lng":shuttleInfo.lng});
			freeShuttlesMarker[index].marker.setVisible(true);
			 freeShuttlesMarker[index].marker1.setPosition({"lat":shuttleInfo.lat,"lng":shuttleInfo.lng});
			freeShuttlesMarker[index].marker1.setVisible(true); 
			freeShuttlesMarker[index].timestamp = Date.now();
			
		}
	//	  if(shuttleInfo.heading){
				
			freeShuttlesMarker[index].icon.rotation = shuttleInfo.heading;
			freeShuttlesMarker[index].marker.setIcon(freeShuttlesMarker[index].icon);
			 freeShuttlesMarker[index].icon1.rotation = shuttleInfo.heading;
			freeShuttlesMarker[index].marker1.setIcon(freeShuttlesMarker[index].icon1); 
	//	}  

	}
	
	  function showCustomer(customerLoc){
		var customerId = shared.global.customer.customerId;
		var index = getCustomerMarker(customerId);
		 if(index < 0){
			addCustomerMarker(customerLoc);	
		}else{ 
			
			customerMarker[index].marker.setPosition({"lat":customerLoc.lat,"lng":customerLoc.lng});
			customerMarker[index].marker.setVisible(true);
			customerMarker[index].timestamp=Date.now();
	  }  
	}





	function addShuttleMarker(shuttleInfo){
		freeShuttlesMarker.push({
				 "shuttleId" : shuttleInfo.shuttleId,
				 "marker":null, 
				 "marker1":null, 
				 "timestamp":Date.now(), 
				 "icon": 
				  {
					path: carGlass,
					scale: 0.07, //.7
					strokeColor: 'white',
					strokeWeight: .10,
					fillOpacity: 1,
					fillColor: '#303A6B',
					offset: '5%', //5%
				//	 rotation: parseInt(heading[i]),
					anchor: new google.maps.Point(300, 50) // 10,25 orig 10,50 back of car, 10,0 front of car, 10,25 center of car
				},  
				 "icon1":
				{
					path: car,
					scale: 0.07, //.7
					strokeColor: 'white',
					strokeWeight: .10,
					fillOpacity: 1,
					fillColor: '#0FEAAC',
					offset: '5%', //5%
			//		 rotation: parseInt(heading[i]),
					anchor: new google.maps.Point(300, 50) // -500 0 orig 10,50 back of car, 10,0 front of car, 10,25 center of car
				} 
		 }); 
		 var index = freeShuttlesMarker.length - 1; 
		
		 freeShuttlesMarker[index].marker  = new google.maps.Marker({
			position:{"lat":shuttleInfo.lat,"lng":shuttleInfo.lng},
			map: map,
		    icon: freeShuttlesMarker[index].icon
		});
		 freeShuttlesMarker[index].marker1  = new google.maps.Marker({
				position:{"lat":shuttleInfo.lat,"lng":shuttleInfo.lng},
				map: map,
			    icon: freeShuttlesMarker[index].icon1
			}); 
	}


var bonhomme={url:"./assets/img/bonhomme.png"};


	 function addCustomerMarker(customerLoc){

		customerMarker.push({
			"customerId" : shared.global.customer.customerId,
			"marker":null, 
			 
			"timestamp":Date.now(),  
			  "icon": bonhomme,
			
		   
	 }); 
	var index = customerMarker.length - 1; 
	console.log(index+" index");
	customerMarker[index].marker  = new google.maps.Marker({
	   position:{"lat":userPos.lat,"lng":userPos.lng},
	   map: map,
	   icon: customerMarker[index].icon,
	 
   });
	

	} 
	/****************************
	 * check current timestamp and last driver timestamp.
	 * If > 5 secondes hide marker;
	 */
	function checkShuttleActif() {
		//console.log("incheck "+marker.length);
		var ts = Date.now() - 1500;
		
		freeShuttlesMarker.forEach(function (item){

	
			if(item.timestamp < ts) {

				item.marker.setVisible(false);
				item.marker1.setVisible(false);
			}
		});
	}
	

	//=============== ~icon marker vehicle =====================

	
	
	var car="M395.1,269.3l9-9.3c0,0-4.6-55.3-8.6-88c-0.2-1.6-0.8-4.8-2.1-7.6c-2.1-4.3-6.8-11.7-10.5-16.7c-1.4-1.8-3.7-5.1-6.1-6.3c-5.9-3-23.9-7.5-85.1-9l0,0c-0.1,0-0.2,0-0.3,0c-0.1,0-0.2,0-0.3,0l0,0c-61.2,1.4-79.2,5.9-85.1,9c-2.4,1.2-4.8,4.5-6.1,6.3c-3.7,5-8.4,12.4-10.5,16.7c-1.4,2.9-1.9,6.1-2.1,7.6c-4,32.8-8.6,88-8.6,88l9.5,9.8c-4.9,78.4-5,175.2-0.1,253.8l-9.4,9.7c0,0,4.6,55.3,8.6,88c0.2,1.6,0.8,4.8,2.1,7.6c2.1,4.3,6.8,11.7,10.5,16.7c1.4,1.8,3.7,5.1,6.1,6.3c5.9,3,23.9,7.5,85.1,9l0,0c0.1,0,0.2,0,0.3,0c0.1,0,0.2,0,0.3,0l0,0c61.2-1.4,79.2-5.9,85.1-9c2.4-1.2,4.8-4.5,6.1-6.3c3.7-5,8.4-12.4,10.5-16.7c1.4-2.9,1.9-6.1,2.1-7.6c4-32.8,8.6-88,8.6-88l-8.9-9.2C400.1,445.3,400.1,348,395.1,269.3zM291.4,163L291.4,163c0.1,0,0.1,0,0.2,0l0,0c0,0,0,0,0.1,0c0,0,0,0,0.1,0l0,0c0.1,0,0.1,0,0.2,0l0,0c48.5,0.6,69.8,5.8,79.1,9.8c-0.6,2.8-1.6,5.9-3,9.2c-0.7,1.8-2.7,7.4-2.7,19.4c0,5,0.7,42.9,1.4,83.9c-8-0.7-30.6-2.4-74.8-2.5l0,0c-0.2,0-0.3,0-0.5,0s-0.3,0-0.5,0l0,0c-43.9,0.2-66.5,1.8-74.7,2.5c0.7-41,1.4-78.8,1.4-83.9c0-12-1.9-17.6-2.7-19.4c-1.4-3.3-2.3-6.4-3-9.1C221.2,168.9,242.5,163.6,291.4,163z M356,335c0,2.2-1.8,3.9-3.9,3.9s-3.9-1.8-3.9-3.9s1.8-3.9,3.9-3.9S356,332.8,356,335z M291.7,476.5c-5.5,0-10-4.5-10-10s4.5-10,10-10s10,4.5,10,10C301.7,472.1,297.2,476.5,291.7,476.5z M301.7,490.7c0,5.5-4.5,10-10,10s-10-4.5-10-10s4.5-10,10-10S301.7,485.2,301.7,490.7z M291.7,338.9c-5.5,0-10-4.5-10-10s4.5-10,10-10s10,4.5,10,10C301.7,334.5,297.2,338.9,291.7,338.9z M291.7,314.8c-5.5,0-10-4.5-10-10s4.5-10,10-10s10,4.5,10,10S297.2,314.8,291.7,314.8z M236,335c0,2.2-1.8,3.9-3.9,3.9s-3.9-1.8-3.9-3.9s1.8-3.9,3.9-3.9S236,332.8,236,335z M207.1,397L207.1,397c0,10.4-0.6,150.5-1.2,154.7c-0.3,2.1-4.6,6.1-8.5,9.4c-8.1-95.9-8.1-235.3,0.2-330.3c3.8,4,8,8.8,8.3,10.9c0.6,4.2,1.2,144.3,1.2,154.7l0,0c0,0,0,0.1,0,0.3C207.1,396.9,207.1,397,207.1,397z M291.9,631.7L291.9,631.7c-0.1,0-0.1,0-0.2,0l0,0c0,0,0,0-0.1,0c0,0,0,0-0.1,0l0,0c-0.1,0-0.1,0-0.2,0l0,0c-49.3-0.6-70.5-6-79.6-10c0.6-3,1.6-6.5,3.2-10.3c0.7-1.8,2.7-7.4,2.7-19.4c0-5-0.7-42.7-1.4-83.7c8.2,0.8,30.7,2.4,74.7,2.5l0,0c0.2,0,0.3,0,0.5,0s0.3,0,0.5,0l0,0c44.2-0.2,66.8-1.8,74.8-2.5c-0.7,41-1.4,78.7-1.4,83.7c0,12,1.9,17.6,2.7,19.4c1.6,3.8,2.6,7.4,3.2,10.4C362,625.8,340.8,631.1,291.9,631.7z M385.9,561.1c-3.9-3.3-8.2-7.3-8.5-9.4c-0.6-4.2-1.2-144.3-1.2-154.7l0,0c0,0,0-0.1,0-0.3c0-0.2,0-0.3,0-0.3l0,0c0-10.4,0.6-150.5,1.2-154.7c0.3-2.1,4.4-6.9,8.3-10.9C394,325.8,394.1,465.2,385.9,561.1z";
	var iconCar = {
		path: carGlass,
		scale: 0.07, //.7
		strokeColor: 'white',
		strokeWeight: .10,
		fillOpacity: 1,
		fillColor: '#303A6B',
		offset: '0%', //5%
		// rotation: parseInt(heading[i]),
		anchor: new google.maps.Point(300, 50) // 10,25 orig 10,50 back of car, 10,0 front of car, 10,25 center of car
	};
	
	 var carGlass="M395.1,269.3l9-9.3c0,0-4.6-55.3-8.6-88c-0.2-1.6-0.8-4.8-2.1-7.6c-2.1-4.3-6.8-11.7-10.5-16.7c-1.4-1.8-3.7-5.1-6.1-6.3c-5.9-3-23.9-7.5-85.1-9l0,0c-0.1,0-0.2,0-0.3,0c-0.1,0-0.2,0-0.3,0l0,0c-61.2,1.4-79.2,5.9-85.1,9c-2.4,1.2-4.8,4.5-6.1,6.3c-3.7,5-8.4,12.4-10.5,16.7c-1.4,2.9-1.9,6.1-2.1,7.6c-4,32.8-8.6,88-8.6,88l9.5,9.8c-4.9,78.4-5,175.2-0.1,253.8l-9.4,9.7c0,0,4.6,55.3,8.6,88c0.2,1.6,0.8,4.8,2.1,7.6c2.1,4.3,6.8,11.7,10.5,16.7c1.4,1.8,3.7,5.1,6.1,6.3c5.9,3,23.9,7.5,85.1,9l0,0c0.1,0,0.2,0,0.3,0c0.1,0,0.2,0,0.3,0l0,0c61.2-1.4,79.2-5.9,85.1-9c2.4-1.2,4.8-4.5,6.1-6.3c3.7-5,8.4-12.4,10.5-16.7c1.4-2.9,1.9-6.1,2.1-7.6c4-32.8,8.6-88,8.6-88l-8.9-9.2C400.1,445.3,400.1,348,395.1,269.3z M348.2,335";
	var iconGlass = {
		path: car,
		scale: 0.07, //.7
		strokeColor: 'white',
		strokeWeight: .10,
		fillOpacity: 1,
		fillColor: '#0FEAAC',
		offset: '0%', //5%
		// rotation: parseInt(heading[i]),
		anchor: new google.maps.Point(300, 50) // -500 0 orig 10,50 back of car, 10,0 front of car, 10,25 center of car
	};
	 
	
    
	/*********************************************
	 *  Broker
	 * 
	 */
	
	var mqttClient = 0;
	var connectionRequest = false;
	
//	brokerConnect();
	
	var countCheckShuttleActif = 0;
	var refreshBrokerStatus = $interval(function(){
		if(!$scope.localisationFound){
			return;
		}
		if(mqttClient == 0){
			brokerConnect();
		}
	
			if($scope.rideStatus < 3){
			checkShuttleActif();
 
		}
	},1000);

	
  	function brokerConnect() {
  		if(mqttClient == 0  && connectionRequest == false) {
  			connectionRequest = true;
  			var client = 0;
  			var host 		= API_ENDPOINT.broker;
  	   	    var port 	= API_ENDPOINT.mqttPort;
   	   	    var id 		= "pexsi_"+ Math.random().toString(36).substring(2,12);
  	   	    client = new Paho.MQTT.Client(host, Number(port), id);
  	   	    client.onConnectionLost = function (responseObject) {
  	   	    	mqttClient = 0;
  	   	    	$scope.mqttConnect = false;
  	   	    };
  	   	 console.log("Broker try connect **");
  	   	    client.connect({onSuccess:function(){
  	   	    	mqttClient = client;
				$scope.mqttConnect = true;
				subscribe(userPos);
  	   	    	connectionRequest = false;
	   	   	    console.log("Broker connect success **");

			},
			onFailure:function(err){
  	   	    	connectionRequest = false;
	   	   	    console.log("Broker connect failure **");

			},
			userName: "admin@lom.fr",
			password : "ZbJ57qe5",
		    hosts: [ "wss://"+host+":"+port+"/" ],
		    useSSL: true
  	   	    });
  		}
  	}

	 
	  
  	function onMessageArrived(message) {
		/* if($scope.rideStatus<=8 && message.destinationName.search(passengerTopic)!=-1){
			var mess=message.payloadString;
			console.log(mess)
			return;
		} */
		console.log($scope.rideStatus)
		if($scope.rideStatus == 4 && message.destinationName.search(rideStartTopic) != -1){
			console.log("je suis la")
			unSubscribe(rideStartTopic);
			preserveViewport = false;
			itinerairePickUpHide();
			$rootScope.titleBar = "SHUTTLE IS ARRIVED";
			return;
		}
		if($scope.rideStatus == 1 && message.destinationName.search(rideRequestTopic) != -1){
			var mess = JSON.parse(message.payloadString);
			$scope.wait = false;
			
			$scope.showPopup = true;
			
			   if(mess.result == false) {
				$scope.rideStatus = 2;
				$scope.confirmation =0
			}else{  
				
				//$scope.rideStatus = 3;
				

				$scope.rideInfo = mess.rideInfo;
				console.log($scope.rideInfo)
				puStation=mess.rideInfo.puStation;
				$scope.time=mess.rideInfo.durationText
				//puStation=getClosestStation();
				
				console.log(puStation+"station")
				
				$scope.station_accueil=stationName[puStation];
				console.log($scope.station_accueil)
				$scope.confirmation=2;
				initRidetoCustomer(mess.shuttleId);
				rideId = mess.rideId;
				rideStartTopic = "/lomt/ridestart/";
				console.log(stationLat[puStation]+","+stationLng[puStation])
				mqttClient.subscribe(rideStartTopic+mess.shuttleId);
			/* 	 Promise.all([calculTN(mess.shuttleId),calculTU()]).then(function(values){
					$scope.TAN=values[0]-values[1]
					console.log($scope.TAN+"value")
					if($scope.TAN>tamv){
						$scope.rideStatus = 2;
						$rootScope.titleBar = "Request an Autonomous POD";
					}
				})  */
			/* 	console.log(shuttleMarker.marker.getPosition())
				console.log(stationLat[puStation]+","+stationLng[puStation]) */
				/* calculTN().then(result=>{
				$scope.TN=result;
				console.log($scope.TN) });
				calculTU().then(resultat=>{
					$scope.TU=resultat;
					console.log($scope.TU)
				}) */
			
				
				
			}
			return; 
		}
		if(($scope.rideStatus == 4  || $scope.rideStatus == 6) && message.destinationName.search(taxiTopic) != -1){
			var trame = message.payloadString;
			
			if(trame.search(/\$MILLA,/i) == -1) {
				return ;
			}
			
		 var result = nmeaDataDecode(trame);
		 console.log(shuttleMarker)
			showMarker(result);
			shuttleMarker.marker.setPosition({"lat":result.lat, "lng":result.lng});
			shuttleMarker.marker1.setPosition({"lat":result.lat, "lng":result.lng});    
			shuttleMarker.marker.setVisible(false); 
			shuttleMarker.marker1.setVisible(false);
			
			if($scope.rideStatus == 4) {
				itinerairePickUp();
			
			}else {
				
				itineraireDestination();
			}
			return;
		}

		/* if(($scope.rideStatus == 4  || $scope.rideStatus == 6) && message.destinationName.search(userPosTopic) != -1){
			var trame = message.payloadString;
			
			if(trame.search(/\#USER_POS,/i) == -1) {
				return ;
			}
			
			var result = decodeLocTrame(trame);
			showCustomer(result);
			if($scope.rideStatus == 6) {

				customerMarker[0].marker.setVisible(false);
			}
			
		
			return;
		} */

		if($scope.rideStatus < 4 && message.destinationName.search(vehiclesTopic) != -1){
			
			var trame = message.payloadString;
			if(trame.search(/\$MILLA,/i) == -1) {
				return ;
			}
			var result = nmeaDataDecode(trame);
			
			if($scope.rideStatus < 3) {
				
				showMarker(result);
				
						}
		}

		if($scope.rideStatus<6 && message.destinationName.search(noshowTopic)!=-1){
				var data= JSON.parse(message.payloadString)
			console.log(data.ride)
			if(data.ride=="noride"){
				$scope.showPopup = true;
				console.log("noshow")
				$scope.noshow=1;
			}
		}


		if($scope.rideStatus<8 && message.destinationName.search(endTopic)!=-1){
			var data= JSON.parse(message.payloadString)
		console.log(data.ride)
		if(data.ride=="endride"){
			$scope.showPopup = true;
			console.log("end ride")
			$scope.showPopup = true;
		$scope.rideStatus = 7;
		$scope.affiche=0;
		$rootScope.titleBar = "ARRIVED TO DESTINATION";
		}
	}

	if($scope.rideStatus<8 && message.destinationName.search(cancelmissionTopic)!=-1){
		var data= JSON.parse(message.payloadString)
	console.log(data.ride)
	if(data.ride=="cancel"){
	document.getElementById("supp").disabled=true;
	document.getElementById("buttondelete").style.visibility="hidden"
//	$scope.delete=0;
		console.log("cancel ride")
		
	}
}
	
if($scope.rideStatus<8 && message.destinationName.search(inboardTopic)!=-1){
	var data= JSON.parse(message.payloadString)
console.log(data.ride)
if(data.ride=="onboard"){
	itinerairePickUpHide();
	
}
}




	  }
	  
 $scope.confirm= function(){
	
	 if(puStation==$scope.station){
		$scope.m_erreur=1;
	//	$scope.confirmation =3;
		$scope.confirmation=1;
	var mess = {
		"confirm":$scope.confirmation+" "+shared.global.customer.customerId}
	 var message = new Paho.MQTT.Message(JSON.stringify(mess));
	 
	 message.destinationName = "/lomt/ride/confirm/"/* +shared.global.customer.customerId */;
	
	 mqttClient.send(message);
	$scope.rideStatus=1;
//	$scope.etat=1;
	}
	else{
		$scope.confirmation=0;
		$scope.rideStatus=3;
	}
	/*   var mess = {
		"confirm":$scope.confirmation}
	 var message = new Paho.MQTT.Message(JSON.stringify(mess));
	 
	 message.destinationName = "/lomt/ride/confirm/"+shared.global.customer.customerId;
	 console.log(message.destinationName)
	 console.log(message.payloadString)
	 mqttClient.send(message);  */
 }

 $scope.annule=function(){
	 $scope.annule=1;
	 $scope.showPopup=true
	 }

$scope.m_err=function(){
	$scope.etat=1;
		$scope.rideStatus=9;
		$scope.m_erreur=0;
}

$scope.noannule=function(){
	document.getElementById("supp").style.visibility="hidden"
	document.getElementById("supp").disabled = true;
	$scope.annule=0;
	$scope.showPopup=false
}

 $scope.annuler= function(){
	 $scope.annule=0;
	$scope.confirmation=1;
	var mess = {
		"confirm":$scope.confirmation+" "+shared.global.customer.customerId}
	 var message = new Paho.MQTT.Message(JSON.stringify(mess));
	 
	 message.destinationName = "/lomt/ride/confirm/"/* +shared.global.customer.customerId */;
	 console.log(message.destinationName)
	 console.log(message.payloadString)
	 mqttClient.send(message);
	$scope.rideStatus=1;
	$scope.etat=1;
	$scope.showPopup=true
}


 $scope.infirmer= function(){
	$scope.confirmation=1;
	var mess = {
		"confirm":$scope.confirmation+" "+shared.global.customer.customerId}
	 var message = new Paho.MQTT.Message(JSON.stringify(mess));
	 
	 message.destinationName = "/lomt/ride/confirm/"/* +shared.global.customer.customerId */;
	
	 mqttClient.send(message);
	$scope.rideStatus=1;
	$scope.etat=1;

}
  	function nmeaDataDecode(trame) {
  		var data = trame.replace(/\$MILLA,/i, "");
 		data = data.replace(/\\r\\n/i, "");
		 data = data.split(',');
        return ({
        	"timeStamp"   :       data[0],
            "shuttleId"    :       data[1],   
			"lat"   :       parseFloat(data[2]),
			 "lng"   :       parseFloat(data[3]),
			 "speed" :parseFloat(data[4]),
			 "heading"   :  parseInt(data[5]),
		//	 "curStage" :parseInt(data[5])
		//	 "curStage" :parseInt(data[9])
		});
	
	  }
	  
	 /*  function decodeLocTrame(trame) {
		var data = trame.replace(/\#USER_POS,/i, "");
	   data = data.replace(/\\r\\n/i, "");
	   data = data.split(',');
	  return ({
		  "lat"   :       parseFloat(data[0]),
		   "lng"   :       parseFloat(data[1]),
	  });
	} */


	var vehiclesTopic = null;
	var rideRequestTopic = null;
	var taxiTopic = null;
	var rideStartTopic = null;
	//var userPosTopic=null;
	var passengerTopic=null;
	var noshowTopic=null;
	var endTopic=null;
	var cancelmissionTopic=null;
	var inboardTopic=null;
	function subscribeTaxiTopic(shuttleId){
		taxiTopic = "/lomt/shuttle/"+shuttleId;
		
		mqttClient.subscribe(taxiTopic+"/#");
	} 
	
	/*   function subscribeUserTopic(customerId){
		userPosTopic = "/lomt/user/position/"+customerId;
		mqttClient.subscribe(userPosTopic+"/#");
		
	} 
	  */

	function subscribe(latlng){
		
		if(latlng && mqttClient != 0){
	//		unSubscribe(userPosTopic);
			unSubscribe(rideStartTopic);
			unSubscribe(vehiclesTopic);
			unSubscribe(noshowTopic)
			unSubscribe(endTopic)
			unSubscribe(cancelmissionTopic)
			unSubscribe(inboardTopic)
			  /* userPosTopic = "/lomt/user/position/"+shared.global.customer.customerId;
			mqttClient.subscribe(userPosTopic+"/#");  */ 
			 var lat = latlng.lat.toFixed(1) * 10;
			var lng = latlng.lng.toFixed(1) * 10; 
		
			vehiclesTopic = "/lomt/shuttle";
			mqttClient.subscribe(vehiclesTopic+"/#");
			
			unSubscribe(rideRequestTopic);
			rideRequestTopic = "/lomt/ride/result/"+shared.global.customer.customerId;
			mqttClient.subscribe(rideRequestTopic+"/#");
			noshowTopic="/lomt/ride/noshow/"+shared.global.customer.customerId;
			mqttClient.subscribe(noshowTopic+"/#");
			endTopic="/lomt/ride/end/"+shared.global.customer.customerId;
			mqttClient.subscribe(endTopic+"/#");
			cancelmissionTopic="/lomt/cancelmission/"+shared.global.customer.customerId
			mqttClient.subscribe(cancelmissionTopic+"/#");
			inboardTopic="/lomt/inboard/"+shared.global.customer.customerId
			mqttClient.subscribe(inboardTopic+"/#");
			mqttClient.onMessageArrived = onMessageArrived;
		}
	}
	function unSubscribe(topic){
		if(topic) {
			mqttClient.unsubscribe(topic+"/#");
			topic = null;
		}
	}
  	/***********************************
  	 *  Geolocalisation
  	 */
	function myPosition(){
		var imgUser = {
            url:"./assets/img/bonhomme.png",
            
          };
	/* 	var image={
			url:"https://www.lifeonmaps.com/images/map-marker-17-64x64.png"
		} */
		GeoMarker = new GeolocationMarker();
	/* 	GeoMarker=new google.maps.Marker({
			icon: imgUser
		}) */
	     GeoMarker.setCircleOptions(
			{//fillColor: '#808080',
			fillOpacity: 0,
  			strokeWeight: 0
		}); 
	    GeoMarker.setPositionOptions({
				  enableHighAccuracy: true,
				  timeout: 5000,
				  maximumAge: 1000
		});
	    google.maps.event.addListenerOnce(GeoMarker, 'position_changed', function() {
			var pos = this.getPosition(); 
			//var pos=userPos;
		 userPos = {"lat":pos.lat(), "lng":pos.lng()}; 
		// userPos = {"lat":resultat.lat(), "lng":resultat.lng()}; 
	    	$scope.localisationFound = true;
	    	map.setCenter(userPos);
			showCustomer(userPos)
	  		if(!vehiclesTopic) {
	  			subscribe(this.getPosition());
	  		}		
	    });
	    google.maps.event.addListener(GeoMarker, 'geolocation_error', function(e) {
	      console.log('There was an error obtaining your position. Message: ' + e.message);
	    });
	    GeoMarker.setMap(map);
		
	}
	
	

	function clearGeoMarker(){
		if(GeoMarker != null) {
			GeoMarker.setMap(null);
			GeoMarker = null;
		}
		
	}
	/***********************************
	 *  Ride request
	 */
	
	function request(){
		$scope.wait = true;
		$scope.rideStatus = 1;
	//	$scope.confirmation=2;
		if($scope.donnee==1){
			//$scope.station=getDropOff();
			console.log($scope.station+"stationdrop")
		}
		if(selectedPlace == null) {
	       //	 geocoder.geocode({'address': $scope.destination}, function(results, status) {
				geocoder.geocode({'address': $scope.adresse}, function(results, status) {
	          if (status === 'OK') {
	 	       	 selectedPlace = {
		    			/*  "lat":results[0].geometry.location.lat(), 
		    			 "lng":results[0].geometry.location.lng(), */
					//	"address": $scope.destination,
						 "address":  $scope.adresse,
						 "station": $scope.station,  
						 "lat":Number(stationLat[$scope.station]), 
		    			 "lng":Number(stationLng[$scope.station]),  
						 };
						 console.log(selectedPlace.lat +" "+ selectedPlace.lng)	
						/*  document.getElementById("conf").addEventListener("click", function(){
							sendRideRequest();
						  });  */
	 	      	sendRideRequest();
	          } else {
	            alert('Geocode was not successful for the following reason: ' + status);
	            $scope.wait = false;
				$scope.rideStatus=0;
			//	init_stations();
	          }
	        });
			
		}else{
			sendRideRequest();
		/* 	document.getElementById("conf").addEventListener("click", function(){
				sendRideRequest();
			  });  */
		}
		
	}
	
	function remplir_input1(){
				$scope.adresse=document.getElementById("bouton1").value;
			document.getElementById("station").value=1;
			$scope.station=document.getElementById("station").value;
			 stationMarker[1].setIcon(prev_image);
			 stationMarker[2].setIcon(image);
			 stationMarker[3].setIcon(image);
		 	 stationMarker[4].setIcon(image);
			 stationMarker[5].setIcon(image); 
			 stationMarker[6].setIcon(image);
			 stationMarker[7].setIcon(image);
			 document.getElementById("bouton1").style.backgroundColor="red";
			 document.getElementById("bouton2").style.backgroundColor=prevColor;
			 document.getElementById("bouton3").style.backgroundColor=prevColor;
			  document.getElementById("bouton4").style.backgroundColor=prevColor;
			 document.getElementById("bouton5").style.backgroundColor=prevColor; 
			 document.getElementById("bouton6").style.backgroundColor=prevColor;
			 document.getElementById("bouton7").style.backgroundColor=prevColor;
	 }
	
	
	function remplir_input2(){

			document.getElementById("station").value=2;
			$scope.adresse=document.getElementById("bouton2").value;
			$scope.station=document.getElementById("station").value;
			stationMarker[2].setIcon(prev_image);
			stationMarker[1].setIcon(image);
			stationMarker[3].setIcon(image);
			stationMarker[4].setIcon(image);
			stationMarker[5].setIcon(image);
			stationMarker[6].setIcon(image);
			stationMarker[7].setIcon(image); 
			document.getElementById("bouton2").style.backgroundColor="red";
			document.getElementById("bouton1").style.backgroundColor=prevColor;
			document.getElementById("bouton3").style.backgroundColor=prevColor;
			 document.getElementById("bouton4").style.backgroundColor=prevColor;
			document.getElementById("bouton5").style.backgroundColor=prevColor; 
			document.getElementById("bouton6").style.backgroundColor=prevColor;
			 document.getElementById("bouton7").style.backgroundColor=prevColor;
		}
	
		function remplir_input3(){
	
			document.getElementById("station").value=3;
			$scope.adresse=document.getElementById("bouton3").value;
			$scope.station=document.getElementById("station").value;
			stationMarker[3].setIcon(prev_image);
			stationMarker[1].setIcon(image);
			 stationMarker[2].setIcon(image);
			  stationMarker[4].setIcon(image);
			 stationMarker[5].setIcon(image); 
			 stationMarker[6].setIcon(image);
			 stationMarker[7].setIcon(image);
			 document.getElementById("bouton3").style.backgroundColor="red";
			 document.getElementById("bouton2").style.backgroundColor=prevColor;
			 document.getElementById("bouton1").style.backgroundColor=prevColor;
			  document.getElementById("bouton4").style.backgroundColor=prevColor;
			 document.getElementById("bouton5").style.backgroundColor=prevColor; 
			document.getElementById("bouton6").style.backgroundColor=prevColor;
			 document.getElementById("bouton7").style.backgroundColor=prevColor;
		}
	
	 	function remplir_input4(){
	
			document.getElementById("station").value=4;
			$scope.adresse=document.getElementById("bouton4").value;
			$scope.station=document.getElementById("station").value;
			stationMarker[4].setIcon(prev_image);
			stationMarker[1].setIcon(image);
			stationMarker[2].setIcon(image);
			stationMarker[3].setIcon(image);
			stationMarker[5].setIcon(image);
			stationMarker[6].setIcon(image);
			stationMarker[7].setIcon(image);
			document.getElementById("bouton4").style.backgroundColor="red";
		document.getElementById("bouton2").style.backgroundColor=prevColor;
		document.getElementById("bouton3").style.backgroundColor=prevColor;
		document.getElementById("bouton1").style.backgroundColor=prevColor;
		document.getElementById("bouton5").style.backgroundColor=prevColor;
	document.getElementById("bouton6").style.backgroundColor=prevColor;
			 document.getElementById("bouton7").style.backgroundColor=prevColor;
		}  
	
	 	function remplir_input5(){
	
			document.getElementById("station").value=5;
			$scope.adresse=document.getElementById("bouton5").value;
			$scope.station=document.getElementById("station").value;
			stationMarker[5].setIcon(prev_image);
			stationMarker[1].setIcon(image);
			 stationMarker[2].setIcon(image);
			 stationMarker[3].setIcon(image);
			 stationMarker[4].setIcon(image);
			 stationMarker[6].setIcon(image);
			 stationMarker[7].setIcon(image);
			 document.getElementById("bouton5").style.backgroundColor="red";
		document.getElementById("bouton2").style.backgroundColor=prevColor;
		document.getElementById("bouton3").style.backgroundColor=prevColor;
		document.getElementById("bouton4").style.backgroundColor=prevColor;
		document.getElementById("bouton1").style.backgroundColor=prevColor;
		document.getElementById("bouton6").style.backgroundColor=prevColor;
		document.getElementById("bouton7").style.backgroundColor=prevColor;
		} 
	 
		function remplir_input7(){
	
			document.getElementById("station").value=7;
			$scope.adresse=document.getElementById("bouton7").value;
			$scope.station=document.getElementById("station").value;
			stationMarker[7].setIcon(prev_image);
			stationMarker[1].setIcon(image);
			 stationMarker[2].setIcon(image);
			 stationMarker[3].setIcon(image);
			 stationMarker[4].setIcon(image);
			 stationMarker[6].setIcon(image);
			 stationMarker[5].setIcon(image);
			 document.getElementById("bouton7").style.backgroundColor="red";
		document.getElementById("bouton2").style.backgroundColor=prevColor;
		document.getElementById("bouton3").style.backgroundColor=prevColor;
		document.getElementById("bouton4").style.backgroundColor=prevColor;
		document.getElementById("bouton1").style.backgroundColor=prevColor;
		document.getElementById("bouton6").style.backgroundColor=prevColor;
		document.getElementById("bouton5").style.backgroundColor=prevColor;
		}
		function remplir_input6(){
	
			document.getElementById("station").value=6;
			$scope.adresse=document.getElementById("bouton6").value;
			$scope.station=document.getElementById("station").value;
			stationMarker[6].setIcon(prev_image);
			stationMarker[1].setIcon(image);
			 stationMarker[2].setIcon(image);
			 stationMarker[3].setIcon(image);
			 stationMarker[4].setIcon(image);
			 stationMarker[5].setIcon(image);
			 stationMarker[7].setIcon(image);
			 document.getElementById("bouton6").style.backgroundColor="red";
		document.getElementById("bouton2").style.backgroundColor=prevColor;
		document.getElementById("bouton3").style.backgroundColor=prevColor;
		document.getElementById("bouton4").style.backgroundColor=prevColor;
		document.getElementById("bouton1").style.backgroundColor=prevColor;
		document.getElementById("bouton5").style.backgroundColor=prevColor;
		document.getElementById("bouton7").style.backgroundColor=prevColor;
		}

	$scope.request = function(){
		request();
	}

	//remplir les input
	     $scope.remplir_input1=function(){
		
		remplir_input1();
	}  
	 $scope.remplir_input2=function(){
		remplir_input2();
	}
	$scope.remplir_input3=function(){
		remplir_input3();
	}
	$scope.remplir_input4=function(){
		remplir_input4();
	}
	 $scope.remplir_input5=function(){
		remplir_input5();
	}  
	
	$scope.remplir_input6=function(){
		remplir_input6();
	}  
	$scope.remplir_input7=function(){
		remplir_input7();
	}  
	$scope.cancelRequest = function(){
		$scope.rideStatus = 0;
		$scope.showPopup = false;
		$scope.wait = false;
		initMap()
	}
	$scope.close = function(){
		$scope.showPopup = false;
		
		
	}
	$scope.retry = function(){
		$scope.rideStatus = 1;
		$scope.confirmation =0
		request();
	}

	function sendRideRequest(){
		geocoder.geocode({'location': userPos}, 
			function(results, status) {
                if (status === 'OK' && results[0]) {
                	$scope.$apply(function () {
						var userAddr = results[0].formatted_address;
						//var station=document.getElementById('adress').value;
                		var mess = {
                				"control":"LOMT_RIDEREQUEST",
								"customerId": shared.global.customer.customerId,
                				"userLocation" : {
                					      "lat" : userPos.lat, 
									"lng" : userPos.lng,     
									  /*  "lat": 36.130654,
									"lng":-115.153077, */   
                					"address" : userAddr
								},
								
                				"destLocation" : {
                					/* "lat" : selectedPlace.lat, 
                					"lng" : selectedPlace.lng,  */
									"address" : selectedPlace.address,
									/*  "station": selectedPlace.station, */
									"station": $scope.station,
									"lat" : Number( stationLat[$scope.station]), 
                					"lng" : Number(stationLng[$scope.station]), 
                				},
                				"userInfo" : {
                					"firstName" : $rootScope.userFirstName,
                					"lastName" : $rootScope.userLastName,
                					"avatar" : shared.global.customer.avatar,
								},
								
						}
						console.log(mess.destLocation.lat)
                	  	var message = new Paho.MQTT.Message(JSON.stringify(mess));
                	  	message.destinationName = "/lomt/ride/request/"+shared.global.customer.customerId;
                	  	message.retained = false;
                	  	mqttClient.send(message);
						  rideRequest = mess;
						  console.log(rideRequest.destLocation.lat)
                	  	$scope.destAddr = rideRequest.destLocation.address;
                	});
                }else{
                	alert('Geocode was not successful for the following reason: ' + status);
     	            $scope.wait = false;
     	            $scope.rideStatus=0;
                }
        });
	}
	$scope.arrivedToDestination = function(event){
		
		event.stopPropagation();
		$scope.rideStatus = 8;
	//	unSubscribe(vehiclesTopic);
		console.log($scope.rideStatus)	}

	$scope.goscoring = function(event){
		console.log($scope.rideStatus)
		
		$scope.affiche=0;
	//	unSubscribe(vehiclesTopic);
		
	}
	

	$scope.showpop=function(event){
		
		event.stopPropagation();
		$scope.etat=1;
		$scope.rideStatus=9;
	
	}
//console.log($scope.etat+" etat1")
	$scope.endRide = function(event){
	//	setTimeout(masquernotification,5000);
		event.stopPropagation();
		sendRideUpdate("customerScoring");
		console.log($scope.rideStatus+" ridestatus")
		
		$interval.cancel(refreshBrokerStatus);
	//	$rootScope.changePage('home');
		if(mqttClient != 0){
			 unSubscribe(rideRequestTopic);
			 unSubscribe(vehiclesTopic);
			 unSubscribe(subscribeTaxiTopic);
		//	 unSubscribe(subscribeUserTopic);
			 unSubscribe(rideStartTopic);
			unSubscribe(noshowTopic);
			unSubscribe(endTopic)
			unSubscribe(cancelmissionTopic)
			unSubscribe(inboardTopic)
			 mqttClient.disconnect();
		
		}
		mqttClient = 0;
		clearGeoMarker();
		 $state.reload();
	//	 customerMarker.marker.setVisible(false);
	console.log($scope.etat+" etat2")
	console.log($scope.noshow+" etat2")
	}
	$scope.score = {
			"note": 5,
			"comment":""
	}
	$scope.stareClick = function(score){
    	$scope.score.note=score;
/*    	if(scoreTimeout != null) clearTimeout(scoreTimeout);
    	scoreTimeout = setTimeout(function(){
    		$scope.state=9;
    	}, 	800);
*/    	
    }
	function sendRideUpdate(mode){
		var mess = {
				"rideId": rideId,
				"cmd": mode
		}
		if(mode == "customerScoring" ) {
			mess.comment = $scope.score.comment;
			mess.score = $scope.score.note;
		}
	  	var message = new Paho.MQTT.Message(JSON.stringify(mess));
	  	message.destinationName = "/lomt/ride/update/"+rideId;
	  	mqttClient.send(message);
	}
   

	/***********************************
	 *  Google places limit
	 */
	var selectedPlace = null;
	function placesLimit() {
	//	location=48.782311,2.202922&radius=2500&strictbounds;
	var defaultBounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(48.782311, 2.202922)
		);
		  
		 setTimeout(function(){
		//	 $scope.destination = null;
			 $scope.adresse=null;
             $scope.autocompleteOptions = {
				/*  bounds: defaultBounds,
				 radius:2500, */
                 componentRestrictions: { country: 'fr' },
                 types: ['cities']
             }
             $scope.$on('g-places-autocomplete:select', function(event, place) {
            	 selectedPlace = {
            			 "lat":place.geometry.location.lat(), 
            			 "lng":place.geometry.location.lng(),
            			 "address": place.formatted_address
            			 };
             });

		 },500);
	} 
	

	/***********************************
	 *  drive to customer
	 */
	var markerDest =null;
    var imgDest = {
            url: "./assets/img/marker/destMarker.png",
            size: new google.maps.Size(25, 32),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(12, 32)
          };
	var render= null;
	
	var directionService = null; 
	  
    function itinerairePickUp(){

	

		console.log($scope.rideStatus)
		if(render == null) {
			render = new google.maps.DirectionsRenderer({
			      map   : map,
			      suppressMarkers: true,
				  preserveViewport: preserveViewport,
				  
	//		      polylineOptions: { strokeColor: "#00ff00",strokeWeight:8 }
			  });
		}
		


//Waypoints
var wayPoints=[];
var dist=0;
var Totaltime=0;
/* for(var i=curStage+1;i<puStation;i++){
	wayPoints.push({
		location: new google.maps.LatLng(stationLat[i],stationLng[i]),
		stopover: true
	});
} */
//console.log(wayPoints);


		render.preserveViewport = preserveViewport;
		
			var request = {
	              origin :shuttleMarker.marker.getPosition(),
				//  destination : userPos, 
				// destination:{ "lat": 48.78612, "lng": 2.17464 },
				//destination : {"lat":Number(stationLat[puStation]), "lng":Number(stationLng[puStation])},
				destination : stationLat[puStation]+","+stationLng[puStation],
				//waypoints:wayPoints,
	              travelMode  : google.maps.DirectionsTravelMode.DRIVING // Mode de conduite
		}
		
		 var pos_station=new google.maps.LatLng(stationLat[puStation],stationLng[puStation]);
		 if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
			  var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			  };
			  var ma_position=new google.maps.LatLng(pos.lat,pos.lng);
			  var distance=google.maps.geometry.spherical.computeDistanceBetween(ma_position,pos_station)
			  console.log(distance+" cal_distance")
			  
			  if(distance <10){
				  console.log("intro")
				//window.plugins.bringtofront();
				//cordova.plugins.backgroundMode.moveToForeground();
			/* 	var ref=cordova.InAppBrowser.open("https://www.google.com/maps/dir/?api=1&destination="+Number(stationLat[puStation])+","+Number(stationLng[puStation])+"&dir_action=navigates/data=!3m1!4b1!4m5!4m4!1m1!4e1!1m0!3e2").close();
			ref.close(); */ 
			}
			})
		}  
		
	
    	if(directionService == null){
			directionService = new google.maps.DirectionsService();
				
		};  

		
	
		directionService.route( request, function( response, status ) {
			
			  if ( status == google.maps.DirectionsStatus.OK ) {
				
				  render.setDirections( response );
				  for(var i=0;i<response.routes[0].legs.length;i++){
					dist=dist+response.routes[0].legs[i].distance.value;
					console.log(dist)
					Totaltime= Totaltime+response.routes[0].legs[i].duration.value;
					
				}
				//  var step = parseInt(response.routes[0].legs[0].steps.length/2);
			//	  customerMarker.marker.setVisible(false);
  				 // if(response.routes[0].legs[0].distance.value < 100) {
					if(dist < 10) {
				
				//	   itinerairePickUpHide();
					  
  					  $rootScope.titleBar = "SHUTTLE IS ARRIVED";
  					
  				  }else{
			
					$rootScope.titleBar = "SHUTTLE in "+ (Math.round(Totaltime/60)+' minute(s)');
					$scope.delete=1;
					
  				  }
			  }
		});

		
		preserveViewport = true;
	}








	function itinerairePickUpHide(){
		
		
				if(render != null){
			render.setMap(null);
			render = null;
		}
		$scope.rideStatus = 5;
		setTimeout(masquernotification,5000);
		
		$scope.showPopup = true;
		clearGeoMarker();
		customerMarker[0].marker.setVisible(false); 
		itineraireDestination();
	
			
			
	}

    function itineraireDestination(){
		$scope.rideStatus = 6;
		
	
    	if(markerDest == null) {
    		markerDest = new google.maps.Marker({
    		    position: { "lat":rideRequest.destLocation.lat,"lng":rideRequest.destLocation.lng },
    		    map: map,
    		    icon: imgDest,
    		  });
		}
		console.log(markerDest.position.lat)
    	if(directionService == null){
			directionService = new google.maps.DirectionsService();
		};  
		
		if(render == null) {
			render = new google.maps.DirectionsRenderer({
			      map   : map,
			      suppressMarkers: true,
				  preserveViewport: preserveViewport,
			  	//  suppressPolylines: true,
	//		      polylineOptions: { strokeColor: "#00ff00",strokeWeight:8 }
			  });
		}
		render.preserveViewport = preserveViewport;
	
			///// Waypoints
		/* 	var wayPoints=[];
			var doStation=$scope.station; //document.getElementById("station").value;
			console.log(doStation+"/"+curStage);
			for(var i=curStage+1;i<doStation;i++){
				wayPoints.push({
					location: new google.maps.LatLng(stationLat[i],stationLng[i]),
					stopover: true
				});
			}
			console.log(wayPoints); */
			/////
				var request = {
				  origin : shuttleMarker.marker.getPosition(),
				
				  destination : { "lat":rideRequest.destLocation.lat,"lng":rideRequest.destLocation.lng }, 
				//  waypoints:wayPoints,
				//  optimizeWaypoints: true,
	              travelMode  : google.maps.DirectionsTravelMode.DRIVING // Mode de conduite
		}
		console.log(request.destination)
		directionService.route( request, function( response, status ) {
			var dist=0;
			var Totaltime=0;
		
			  if ( status == google.maps.DirectionsStatus.OK ) {
				 render.setDirections( response );
				
				
				  for(var i=0;i<response.routes[0].legs.length;i++){
					dist=dist+response.routes[0].legs[i].distance.value;
					
					Totaltime= Totaltime+response.routes[0].legs[i].duration.value;
				}
				 
				  
					
				if(dist < 10) {
				
  					//  itineraireDestinationHide();
						$rootScope.titleBar = "ARRIVED TO DESTINATION";
					
  				  }else{
						$rootScope.titleBar = "Destination in "+(Math.round(Totaltime/60)+' minute(s)');
					
  				  }
  				  $scope.tripTime = (Math.round(Totaltime/60)+' minute(s)');  

			  }
		});
		preserveViewport = true;
	}
	function itineraireDestinationHide(){
		
		if(render != null){
			render.setMap(null);
			render = null;
		}
		markerDest.setVisible(false);
		$scope.showPopup = true;
		$scope.rideStatus = 7;
		$scope.affiche=0;
		$rootScope.titleBar = "ARRIVED TO DESTINATION";
		/* if($scope.donnee==1){
			$scope.affiche=	1	}; */
	}

	var shuttleMarker = null;
	function initRidetoCustomer(shuttleId){
		
		$rootScope.titleBar = "SHUTTLE IS COMING";
		shuttleInfo(shuttleId);
        $scope.wait = false;
		$scope.showPopup = true;
		//setTimeout(masquernotification,5000);
		customerMarker[0].marker.setVisible(false); 
		unSubscribe(vehiclesTopic);
		subscribeTaxiTopic(shuttleId);
		
		var index = getFreeShuttlesMarker(shuttleId);

		if(index != -1) {
			shuttleMarker = freeShuttlesMarker[index]; 
			
		}
		clearFreeShuttlesMarker();
		//clearCustomerMarker();
		if(shuttleMarker != null) {
			shuttleMarker.marker.setMap(map);
			shuttleMarker.marker1.setMap(map);
		}
	
	}

	 function masquernotification()
	{
		if(document.getElementById('b_container')!=null){
	  document.getElementById('b_container').click(); 
	}
	
	} 

	$scope.clear_adress=function(){

		document.getElementById("adress").value="";
		$scope.showmess=0;
		$scope.showPopup=false;
	}

$scope.ville="";

	function getDropOff(){
		var distances = [];
		var closest = -1;
		var tab;
		 geocoder1=new google.maps.Geocoder();
		var adresse_dest= document.getElementById("adress").value;
		console.log(adresse_dest)
		if(adresse_dest!=""){
		tab=adresse_dest.split(',');
		$scope.ville=tab[2];
		$scope.showmess=0;
		var check_ville = adresse_dest.includes("Vélizy");
		
		if(check_ville==false){
		
			$scope.showmess=1;
			$scope.showPopup=true;
		}
			geocoder1.geocode({
				'address':adresse_dest},
				function(results,status){
				if(status==google.maps.GeocoderStatus.OK){
					$scope.dest_lat=results[0].geometry.location.lat();
					$scope.dest_lng=results[0].geometry.location.lng();
					
				}
				console.log($scope.dest_lat, " ", $scope.dest_lng)
			});
		
		
		
		var dest = new google.maps.LatLng($scope.dest_lat,$scope.dest_lng);
		console.log(dest);
		for (var i = 1; i < stationLat.length; i++) {
				var stationLatLng = new google.maps.LatLng(stationLat[i],stationLng[i]);
			var d = google.maps.geometry.spherical.computeDistanceBetween(stationLatLng, dest);
			distances[i] = d;
			//console.log(stationName[i]+"="+distances[i]);
			if (closest == -1 || d < distances[closest]) {
				closest = i;
			}
		}
	}
		return closest;
	
	}


	$scope.openmap=function(){
		$scope.rideStatus = 4;
		$scope.showPopup = false;
	//	window.open("https://www.google.com/maps/dir/?api=1&destination="+Number(stationLat[puStation])+","+Number(stationLng[puStation])+"&dir_action=navigates/data=!3m1!4b1!4m5!4m4!1m1!4e1!1m0!3e2");
			 cordova.InAppBrowser.open("https://www.google.com/maps/dir/?api=1&destination="+Number(stationLat[puStation])+","+Number(stationLng[puStation])+"&dir_action=navigates/data=!3m1!4b1!4m5!4m4!1m1!4e1!1m0!3e2");
	//	cordova.plugins.backgroundMode.enable();

//	launchnavigator.navigate([Number(stationLat[puStation]),Number(stationLng[puStation])])
	}


	 $scope.open_nav=function(){
		/*  var dest=rideRequest.destLocation.address;
		 destAddr */
	 window.open("https://www.google.com/maps/dir/?api=1&destination="+$scope.destAddr+"&dir_action=navigates/data=!3m1!4b1!4m5!4m4!1m1!4e1!1m0!3e2")
	}


	$scope.carComing = function(){
		
		$scope.rideStatus = 4;
		$scope.showPopup = false;
		shuttleMarker.marker.setVisible(false); 
		shuttleMarker.marker1.setVisible(false);
		setTimeout(masquernotification,3000);
	//	itinerairePickUp();
	//	openmap();
	//	window.open("https://www.google.com/maps/dir/?api=1&destination="+Number(stationLat[puStation])+","+Number(stationLng[puStation])+"&dir_action=navigates/data=!3m1!4b1!4m5!4m4!1m1!4e1!1m0!3e2");
	}

	/***************************************
	 *  
	 */
	function shuttleInfo(shuttleId){
		WS.collectionFind('shuttles', 
			{	"query":{"shuttleId":shuttleId}
			}).then(
			function(result) {
				if(result.data.length >=1) {
					shuttle = result.data[0];
					$scope.shuttle = shuttle;
					//$scope.avatar = API_ENDPOINT.urlImages+"/"+driver.avatar;
					WS.collectionFind('shuttles', 
							{	"query":{"shuttleId":shuttle.shuttleId}
							}).then(
							function(result) {
								if(result.data.length >=1) {
									$scope.shuttle.vehicle = result.data[0].mark+" "+result.data[0].model/*+" " +result.data[0].color */;
								}
							}, 
							function(errMsg) {}
						);
					
				}
			}, 
			function(errMsg) {
			}
		);
	}


	/***********************************
	 *  Exit page
	 */

	$rootScope.$on('$locationChangeStart', function(event) {
		$interval.cancel(refreshBrokerStatus);
		if(mqttClient != 0){
			 unSubscribe(rideRequestTopic);
			 unSubscribe(vehiclesTopic);
			 unSubscribe(subscribeTaxiTopic);
			 unSubscribe(subscribeUserTopic);
			 unSubscribe(rideStartTopic);
			unSubscribe(noshowTopic)
			unSubscribe(endTopic)
			unSubscribe(cancelmissionTopic)
			unSubscribe(inboardTopic)
			 mqttClient.disconnect();
			 
		}
		mqttClient = 0;
		clearGeoMarker();
	});








	var distanceService=null;
	
	  
  function calculTN(shuttleId){
	var result=null;
	subscribeTaxiTopic(shuttleId);
	return new Promise((resolve,reject)=>{
	

	distanceService= new google.maps.DistanceMatrixService();

	distanceService.getDistanceMatrix({
		origins:[shuttleMarker.marker.getPosition()],
		destinations:[stationLat[puStation]+","+stationLng[puStation]], 
		
		travelMode  : google.maps.DirectionsTravelMode.DRIVING,
		unitSystem: google.maps.UnitSystem.METRIC,
		durationInTraffic: true,
	}, response => {
        console.log(response) //actually returns desired response
        resolve(response.rows[0].elements[0].duration.value);
      });
	
	});	
	
	
} 

function calculTU(){
	var result=null;
	return new Promise((resolve,reject)=>{
	

	distanceService= new google.maps.DistanceMatrixService();

	distanceService.getDistanceMatrix({
		origins:[userPos],
		destinations:[stationLat[puStation]+","+stationLng[puStation]], 
		
		travelMode  : google.maps.DirectionsTravelMode.DRIVING,
		unitSystem: google.maps.UnitSystem.METRIC,
		durationInTraffic: true,
	}, response => {
        console.log(response) //actually returns desired response
        resolve(response.rows[0].elements[0].duration.value);
      });
	
	});	
	
	
} 

});

'use strict';

/**
 * @ngdoc function
 * @name ngApp.controller:MainCtrl
 * @description
 * # MainCtrl
 */
angular.module('ngApp')
  .controller('SettingsController', function($rootScope, $scope, $location, shared, $window, Upload, API_ENDPOINT, $mdDialog, WS, $cordovaAppVersion) {
	   /* cordova.getAppVersion.getVersionNumber().then(function (versionNumber) {
	    //  var appVersion = version;
	       $scope.version = "MillaMobility Version : " + versionNumber;
	    }); 
 */
/* function onDeviceReady(){
    cordova.getAppVersion.getVersionNumber(function (versionNumber) {
		$scope.version = "MillaMobility Version : " + versionNumber;
    });
} */
//onDeviceReady();
	  $rootScope.titleBar = "Account settings";
		var settings  = $window.localStorage.getItem("SETTINGS");
		if(settings) {
			if(shared.global.settings.control  == JSON.parse(settings).control) {
				shared.global.settings= JSON.parse(settings);
			}		  
		}
	  $scope.brokerHostList = shared.global.brokerHostList;
	  $scope.sendBrokerPeriod = shared.global.settings.sendBrokerPeriod;
	  $scope.brokerHost = shared.global.settings.brokerHost;
	  $scope.customer = shared.global.customer;
	  $scope.avatarPict = shared.global.customer.avatar == "" || shared.global.customer.avatar == "avatar" ? null :   API_ENDPOINT.urlImages+"/"+shared.global.customer.avatar;
	  $scope.save = function() {
		  shared.global.settings.brokerHost= $scope.brokerHost;
		  $window.localStorage.setItem("SETTINGS", JSON.stringify(shared.global.settings));
		  update();
	  }
	  
	    $scope.forceClick = function(item){
	        setTimeout(function() {
	        	document.querySelector(item).click();
	        }, 10);
	    	
	    }
	var dataUpdate = {};  
  	var uploadItems = [];
    function update() {
 	   $scope.wait = true;
 	   uploadItems = [];
 	   if($scope.avatarPict != null && $scope.avatarPict != "avatar" && typeof $scope.avatarPict !== 'string') {
 		   uploadItems.push('avatar');
 	   }
 	   if($scope.licencePict != null && $scope.licencePict != "licence" && typeof $scope.licencePict !== 'string') {
 		   uploadItems.push('licence');
 	   }
 	   doUpload(uploadItems);
	 		  
    }
	function doUpload(){
     	if(uploadItems.length <= 0) {
     		// do record
     		dataUpdate['firstname'] = $scope.customer.firstname;
     		dataUpdate['lastname'] = $scope.customer.lastname;
     		dataUpdate['phone'] = $scope.customer.phone;
     		dataUpdate['_id'] = $scope.customer.id;
             WS.collectionUpdate("customers", dataUpdate).then(
                     function(data) {
//                         var alert = $mdDialog.alert().clickOutsideToClose(true).title('Update').textContent("").ok('Ok');
 //                        $mdDialog.show(alert);
  //                       setTimeout(function(){ $mdDialog.hide(alert, "end"); },delaiPopup);
                    	 shared.global.customer = $scope.customer;
                    	 window.localStorage.setItem("UserKey", JSON.stringify(shared.global.customer));
                    	 $scope.wait = false;
                    	 history.back();
                      }, function(errMsg) {
                   	   		$scope.wait = false;
                          	$mdDialog.show(
                       			  $mdDialog.alert()
                       			  .clickOutsideToClose(true)
                       			  .title("Can't update")
                       			  .textContent(errMsg)
                       			  .ok('Ok'))
                       			  .finally(function(){
                                  	   $scope.wait = false;
                       			  });
             });
             return;
     	}
     	$scope.waitPict = true;
     	var uploadItem =uploadItems.shift();
     	$scope.uploadingItem = uploadItem == 'avatar' ? "Uploading customer's picture" : "Uploading customer's licence";
         Upload.upload({
             url: API_ENDPOINT.urlUpload,
             data: {file: uploadItem == 'avatar' ? $scope.avatarPict :$scope.licencePict}
           }).then(function(resp) {
         	  if(uploadItem == 'avatar') {
         		 dataUpdate['avatar'] = resp.data.filename;
         		 shared.global.customer.avatar = resp.data.filename;
         		 window.localStorage.setItem("UserKey", JSON.stringify(shared.global.customer));
         		$rootScope.avatar = API_ENDPOINT.urlImages+"/"+resp.data.filename;

         	  }else{
         		 dataUpdate['licence'] = resp.data.filename;
         		 shared.global.customer.licence = resp.data.filename;
         		 window.localStorage.setItem("UserKey", JSON.stringify(shared.global.customer));
         		$rootScope.licence = API_ENDPOINT.urlImages+"/"+resp.data.filename;
         	  }
         	  doUpload();
          },function (resp) {
        	  $mdDialog.show(
       			  $mdDialog.alert()
       			  .clickOutsideToClose(true)
       			  .title('Upload picture failed')
       			  .textContent("Network error")
       			  .ok('Ok'))
       			  .finally(function(){
                 	   $scope.wait = false;
       			  });
              console.log('Error status: ' + resp.status);
          }, function (evt) {
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              $scope.uploadPercent = progressPercentage; 
              console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    	
     }
  });


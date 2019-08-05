'use strict';

/**
 * @ngdoc function
 * @name ngApp.controller:MainCtrl
 * @description
 * # MainCtrl
 */
angular.module('ngApp')




  .controller('LoginController', function($scope, AuthService, $location, $timeout, $mdDialog,Upload, API_ENDPOINT, shared) {
	$scope.wait = false;

	AuthService.logout();
	$scope.authentication = 'Login';
	$scope.submit = function() {
      	return false;
    }
    $scope.user = {};
    $scope.user.email = AuthService.userEmail();
    $scope.user.password = "";
    $scope.authenticate = function() {
    	$scope.wait = true;

       AuthService.login($scope.user).then(
           function(msg) {
        	   $scope.wait = false;
               $location.path('/home');
           }, function(errMsg) {
           	   $scope.wait = false;
             $mdDialog.show(
                $mdDialog.alert()
                .clickOutsideToClose(true)
                .title('Signup failed')
                .textContent(errMsg)
                .ok('Ok')
                );
            });
    }
  	var uploadItems = [];
  $scope.signup = function() {
	   $scope.wait = true;
	   uploadItems = [];
	   if($scope.user.avatarPict != null) {
		   uploadItems.push('avatar');
	   }
	   if($scope.user.licencePict != null) {
		   uploadItems.push('licence');
	   }
	   doUpload(uploadItems);
		  
  	}
    function doUpload(){
    	if(uploadItems.length <= 0) {
    		// do record
            delete $scope.user.avatarPict;
            delete $scope.user.licencePict;
            AuthService.register($scope.user).then(
                    function(msg) {
                 	   $scope.wait = false;
                        $location.path('/home');
                    }, function(errMsg) {
                 	   $scope.wait = false;
                      $mdDialog.show(
                         $mdDialog.alert()
                         .clickOutsideToClose(true)
                         .title('Signup failed')
                         .textContent(errMsg)
                         .ok('Ok')
                         );
                     });
    		return;
    	}
    	$scope.waitPict = true;
    	var uploadItem =uploadItems.shift();
    	$scope.uploadingItem = uploadItem == 'avatar' ? "Uploading customer's picture" : "Uploading customer's licence";
        Upload.upload({
            url: API_ENDPOINT.urlUpload,
            data: {file: uploadItem == 'avatar' ? $scope.user.avatarPict :$scope.user.licencePict}
          }).then(function(resp) {
        	  if(uploadItem == 'avatar') {
                  $scope.user.avatar = resp.data.filename;
        	  }else{
                  $scope.user.licence = resp.data.filename;
        	  }
        	  doUpload();
         },function (resp) {
       	  $mdDialog.show(
      			  $mdDialog.alert()
      			  .clickOutsideToClose(true)
      			  .title('Upload picture failed')
      			  .textContent(resp)
      			  .ok('Ok')
      			  );
             console.log('Error status: ' + resp.status);
         }, function (evt) {
             var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
             $scope.uploadPercent = progressPercentage; 
             console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
       });
   	
    }
    $scope.forgot = function() {
       AuthService.forgot($scope.user).then(
           function(msg) {
               $location.path('/dashboard/home');
           }, function(errMsg) {
             $mdDialog.show(
                $mdDialog.alert()
                .clickOutsideToClose(true)
                .title('Reset password failed')
                .textContent(errMsg)
                .ok('Ok')
                );
            });
    }            
    $scope.changeLoginMode = function($event){
      $event.stopPropagation();
  	  if($scope.authentication == 'Login'){
  		  $scope.authentication = 'Signup';
  	  }else{
    	  $scope.authentication = 'Login';
  	  };
    	
    }

     $scope.CGU = function ($event) {
        $event.stopPropagation();
          //  window.open("https://millagroup.fr/conditions-generales-dutilisation/");
            cordova.InAppBrowser.open("https://millagroup.fr/conditions-generales-dutilisation/",'_self','closebuttoncaption=Fermer')
        $scope.cgu = 1;
        document.getElementById("input").style.visibility="hidden"
        

    } 

   /*  function window.onback(){

    } */
/*
    $scope.onFileSelect = function($files) {
    	if($scope.user.file == null) return;
    	alert('scope'+JSON.stringify($scope.user.file));
    	
        //$files: an array of files selected, each file has name, size, and type.
//        for (var i = 0; i < $files.length; i++) {
  //        var $file = $files[i];
          Upload.upload({
            url: API_ENDPOINT.urlUpload,
            data: {file: $scope.user.file}
          }).then(function(resp) {
            // file is uploaded successfully
            alert(resp.data.filename);
          }); 
        }
  //  }
    */
    $scope.imageSrc = "./assets/img/avatar.png";
  /*  $scope.getFile = function () {
    	Upload.readAsDataUrl($scope.file, $scope)
                      .then(function(result) {
                          $scope.imageSrc = result;
                      });
    };  
    */
    $scope.forceClick = function(item){
        setTimeout(function() {
        	document.querySelector(item).click();
        }, 10);
    	
    }
    var input = document.getElementById("password");
	input.addEventListener("keyup", function(event) {
	  if (event.keyCode === 13) {
	  event.preventDefault();
	   document.getElementById("mybtn").click();
	  }
	});

  });

 
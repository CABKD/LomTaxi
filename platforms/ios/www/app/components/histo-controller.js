'use strict';

/**
 * @ngdoc function
 * @name ngApp.controller:MainCtrl
 * @description
 * # MainCtrl
 */
angular.module('ngApp')
  .controller('HistoController', function($rootScope, $scope, $location, shared, $window,  API_ENDPOINT, $mdDialog, WS, $cordovaAppVersion) {
	  console.log(shared.global.customer.customerId)
		WS.collectionFind('rides', 
				{	"query":{
					"customerId":shared.global.customer.customerId},
					"startTs" : 0, 
					"endTs":Date.now()
				}).then(
				function(datas) {
					var result = datas.data.reverse();
					console.log(result)
					for(var i = 0; i < result.length; i++){
						result[i].date = formatDate(result[i].rideRequestTs);
						/* result[i].avatar = API_ENDPOINT.urlImages+"/"+result[i].driverInfo.avatar; */
					//	result[i].avatar = API_ENDPOINT.urlImages+"/"+result[i].shuttleInfo.avatar;

					}
					$scope.rides = result;
					$scope.currentPage=1;
					$scope.pageSize = 10;
					$scope.numLimit=10;
					$scope.q = '';
				}, 
				function(errMsg) {
				}
			);
		
	  $rootScope.titleBar = "YOUR RIDES";
	  
	  function formatDate(timestamp){
//		  return new Date(timestamp).toUTCString();
		  return new Date(timestamp).toLocaleString("en-GB");
	  }
		$scope.select = function(item) {
			if($scope.selected == item) {
				$scope.selected = -1;
			}else{
				$scope.selected = item;
			};
			
		}
		
		$scope.charger = function() {
			
			$scope.numLimit = $scope.numLimit+ 10;
		} 


		$scope.isSelected = function(item) {
			return $scope.selected == item;
		}
  });


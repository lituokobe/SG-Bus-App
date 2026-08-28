//module
var busApp = angular.module('busApp',['ngRoute','ngResource']);

//routes
busApp.config(function($routeProvider) {

	$routeProvider

	.when('/',{
		templateUrl: 'page/home.html',
		controller: 'homeController'
	})

	.when('/result',{
		templateUrl: 'page/result.html',
		controller: 'resultController'
	})

	.when('/about',{
		templateUrl: 'page/about.html',
	})

	.when('/contact',{
		templateUrl:'page/contact.html'
	})

});

//services
busApp.service('busStop',function(){
	
	this.stopNumber = null;
	this.area = null;
});

//controllers
busApp.controller('homeController',['$scope','busStop','$window','$http', function($scope,busStop,$window,$http) {
	
	//time message
	$scope.date = new Date();
	$scope.hour = $scope.date.getHours();
	if($scope.hour >= 5 && $scope.hour < 12) {
		$scope.message = "Good morning!";
	}else if ($scope.hour >= 12 && $scope.hour < 18 ) {
		$scope.message = "Good afternoon!";
	}else if ($scope.hour >= 18 && $scope.hour < 24 ) {
		$scope.message = "Good evening!";
	}else {
		$scope.message = "Take a good rest.";
	};

	$scope.ready = false;
	//prvide bus candidate
	function success(position){
		var poslon = position.coords.longitude,
			poslat = position.coords.latitude;

		//get bus stop information		
        $http.get("./script/busStopInfo.json").then(function(res){

		    $scope.busStopInfo = res.data; 

			//get the nearest bus stops
			Object.keys($scope.busStopInfo).forEach(function(key) {
		      if(Math.abs($scope.busStopInfo[key].coords.split(",")[0] - poslon) > 0.00215 ||
		   		Math.abs($scope.busStopInfo[key].coords.split(",")[1] - poslat) > 0.00215) {
			   		delete $scope.busStopInfo[key];
		    	}
		    });					    
			$scope.ready = true;	
		});

		//get MRT station infotmation
		$http.get("./script/mrtStationInfo.json").then(function(res){
		    $scope.mrtStationInfo = res.data.mrtStationInfo;
			//get the nearest MRT station
			$scope.nearestMrtStation = {"coords":"114.483333, 38.066667","name":"shijiazhuang"};
			
			function getDistance(poslon, poslat, geoObject) {
				var a = geoObject.coords.split(",")[0] - poslon,
					b = geoObject.coords.split(",")[1] - poslat;
				return a*a + b*b;
			};

			var c= $scope.mrtStationInfo.length;

			for (var i = 0; i <c; i++) {
				var dis1 = getDistance(poslon, poslat, $scope.mrtStationInfo[i]),
					dis2 = getDistance(poslon, poslat, $scope.nearestMrtStation);
				if (dis1 < dis2){
					$scope.nearestMrtStation = $scope.mrtStationInfo[i];
				}
			};

			var d = $scope.nearestMrtStation.name;

			if (d == 'Redhill' || d == 'TelokBlangah' || d == 'Stevens' || d == 'Novena' ||d == 'FarrerPark' || d == 'Lavender' || d == 'Stadium' || d == 'MarinaBay' || d == 'CityHall' || d == 'HarbourFront' || d == 'DhobyGaut'){
				busStop.area = 'SingaporeCity';
			} else if (d == 'Cashew' || d == 'BeautyWorld' || d == '6thAv'){
				busStop.area = 'UpperBukitTimah';
			} else {
				busStop.area = d;
			} 
		});

	};

	function error(err) {
	  console.warn('Sorry. Unable to Get Location.');
	};

	var options = {
	  enableHighAccuracy: true,
	  timeout: 3800,
	  maximumAge: 0
	};

    $window.navigator.geolocation.getCurrentPosition(success, error, options);

    //user clicks the selected bus stop 
    $scope.selectStopNumber = function(x){
    	busStop.stopNumber = x;
    	$window.location.href = '#!/result'
    }

    //user manually inputs bus stop code
	$scope.$watch('stopNumber',function(){
		busStop.stopNumber = $scope.stopNumber;
	});
}]);

busApp.controller('bodyCtrl',['$scope','busStop', '$interval',  function($scope,busStop,$interval) {
	
	$scope.ready = false;
	var intfunction = $interval(function(){
	    $scope.area = busStop.area;
	    console.log($scope.area);
	    if($scope.area) {
	    	$interval.cancel(intfunction);
	    	$scope.ready = true;
	    }
	}, 1000);

}]);

busApp.controller('resultController',['$scope','$resource','busStop',function($scope,$resource,busStop) {
	
	$scope.stopNumber = busStop.stopNumber;
	
	$scope.busAPI = $resource("https://arrivelah.herokuapp.com");
	
	$scope.busResult = $scope.busAPI.get({id: $scope.stopNumber});
	
	$scope.convertToMinuteNext = function(ms) {
		if (ms) {
			var min = Math.round(ms/60000);
			if (min < 0) {
				return "The bus is at the deck";
			} else if (min == 0) {
				return "The next one is arriving ";
			} else if (min == 1) {
				return "The next bus will arrive in 1 minute.";
			} else {
				return "The next bus will arrive in " + min + " minutes.";
			}			
		}
		else {
			return "No bus for today, see you tomorrow!"
		};
	};

	$scope.convertToMinuteNext2 = function(ms) {
		if (ms) {
			var min = Math.round(ms/60000);
			if (min == 0) {
				return "The next next one is arriving ";
			} else if (min == 1) {
				return "The next next bus will arrive in 1 minute.";
			} else {
				return "The next next bus will arrive in " + min + " minutes.";
			}
		}
		else {
			return "No bus for today, see you tomorrow!"
		}
	};

	$scope.busLoad = function(load) {
		if (load =="SEA") {
			return "Seats Available"
		} else if (load == "SDA") {
			return "Standing Available"
		} else if (load == "LSD") {
			return "Limited Standing"
		}
	};

	$scope.busFeature = function(feature) {
		if (feature == "WAB") {
			return "This bus is wheel-chair accessible"
		}
	}

	$scope.busType = function(type) {
		if (type == "SD") {
			return "Single Deck"
		} else if (type == "DD") {
			return "Double Deck"
		} else if (type == "BD") {
			return "Bendy"
		}
	}

}]);

//directives
busApp.directive('greetingDirective',function(){
	return{
		restrict:'E',
		templateUrl: 'directive/greetingDirective.html',
		replace:true,
		scope:{
			greetingObject: "=",
		}
	}
});

busApp.directive('busStopCandidateDirective',function(){
	return{
		restrict:'E',
		templateUrl: 'directive/busStopCandidateDirective.html',
		replace:true,
		scope:{
			busStopNumberString: "=",
			busStopInfoObject: "=",
		}
	}
});


busApp.directive('busResultDirective',function(){
	return {
		restrict: 'E',
		templateUrl: 'directive/busResultDirective.html',
		replace:true,
		scope: {
			busInfoObject: "=",
			timeNextFunction: "&",
			timeNext2Function: "&",
			loadFunction:"&",
			featureFunction:"&",
			typeFunction:"&"
		}
	}
});

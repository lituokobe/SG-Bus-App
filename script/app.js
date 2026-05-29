//module
var busApp = angular.module('busApp',['ngRoute','ngResource','ngSanitize','ngAnimate']);

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

	.when('/information',{
		templateUrl:'page/information.html',
	})

	.when('/specialthanks',{
		templateUrl:'page/specialthanks.html',
	})

});

//services
busApp.service('busStop',function(){
	
	this.stopNumber = null;
	this.area = null;
	
});

//controllers
busApp.controller('bodyCtrl',['$scope','busStop', '$interval', '$window','$route', '$location', function($scope,busStop,$interval,$window,$route,$location) {
	
	$scope.ready = false;
	var intfunction = $interval(function(){
	    $scope.area = busStop.area;
	    console.log($scope.area);
	    if($scope.area) {
	    	$interval.cancel(intfunction);
	    	$scope.ready = true;
	    }
	}, 1000);

	$scope.refresh = function(){
		if (Object.getPrototypeOf($route.current).hasOwnProperty('controller')){
			$route.reload();
		} else {
			location.reload();
		}
	};

	$scope.go = function ( path ) {
	  $location.path( path );
	};

}]);

busApp.controller('homeController',['$scope','busStop','$window','$http', function($scope,busStop,$window,$http) {
	
	//get time
	$scope.date = new Date();
	$scope.hour = $scope.date.getHours();

	//pass the time outside this controller
	busStop.hour = $scope.hour;

	$scope.message = {};
    
    //time message
	if($scope.hour >= 5 && $scope.hour < 12) {
		$scope.message.topic = "Good morning!";

		var random = Math.floor(Math.random() * 9);
		if (random < 3) {
			$scope.message.content = "Start a wonderful day in a bus!";
		}else if (random < 6) {
			$scope.message.content = "Don't eat your breakfast in the bus.";
		}else {
			$scope.message.content = "Faster! No one wanna be late.";
		};

	}else if ($scope.hour >= 12 && $scope.hour < 18 ) {
		$scope.message.topic = "Good afternoon!";

		var random = Math.floor(Math.random() * 9);
		if (random < 3) {
			$scope.message.content = "Sneak out to take a bus?";
		}else if (random < 6) {
			$scope.message.content = "Why not take a bus to buy a kopi-C?";
		}else {
			$scope.message.content = "The bus has a termination, but life doesn't.";
		};

	}else if ($scope.hour >= 18 && $scope.hour < 24 ) {
		$scope.message.topic = "Good evening!";
		
		var random = Math.floor(Math.random() * 9);
		if (random < 3) {
			$scope.message.content = "Take a bus home for dinner.";
		}else if (random < 6) {
			$scope.message.content = "Take a bus for a date?";
		}else {
			$scope.message.content = "Enjoy the night view on a bus ride~";
		};

	}else {
		$scope.message.topic = "Take a good rest.";

		var random = Math.floor(Math.random() * 10);
		if (random < 3) {
			$scope.message.content = "Or just wanna grab a bus for fun.";
		}else if (random < 5) {
			$scope.message.content = "A bus is the best insomnia cure.";
		}else if (random < 7) {
			$scope.message.content = "There will always be someone sleepless no matter how late it is.";
		}else if (random < 9) {
			$scope.message.content = "The night is beautiful.";
		}else {
			$scope.message.content = "Or check who is still on the road.";
		};

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
		      if(Math.abs($scope.busStopInfo[key].coords.split(",")[0] - poslon) > 0.00212 ||
		   		Math.abs($scope.busStopInfo[key].coords.split(",")[1] - poslat) > 0.00212) {
			   		delete $scope.busStopInfo[key];
		    	}
		    });					    
			// $scope.ready = true;	
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

		$scope.ready = true;

	};

	function error(err) {
	  console.warn('Sorry. Unable to Get Location.');
	};

	var options = {
	  enableHighAccuracy: true,
	  timeout: 4600,
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

busApp.controller('resultController',['$scope','$resource','busStop', '$http','$sce','$animate', function($scope,$resource,busStop,$http, $sce,$animate) {

	$scope.stopNumber = busStop.stopNumber;

	//get the selected bus stop info
	$http.get("./script/busStopInfo.json").then(function(res){

		    $scope.busStopInfo = res.data; 

			//get the nearest bus stops
			Object.keys($scope.busStopInfo).forEach(function(key) {
		      if(key!= $scope.stopNumber) {
			   		delete $scope.busStopInfo[key];
		    	}
		    });
	});
	
	$scope.busAPI = $resource("https://arrivelah.herokuapp.com");
	
	$scope.busResult = $scope.busAPI.get({id: $scope.stopNumber});
	
	$scope.busLoad = function(load) {
		if (load =="SEA") {
			return $sce.trustAsHtml('<div class = "busBlockMajorStyle green green');
		} else if (load == "SDA") {
			return $sce.trustAsHtml('<div class = "busBlockMajorStyle orange orange');
		} else if (load == "LSD") {
			return $sce.trustAsHtml('<div class = "busBlockMajorStyle red red');
		}
	};

	$scope.busType = function(type) {
		if (type == "SD") {
			return $sce.trustAsHtml('single');
		} else if (type == "DD") {
			return $sce.trustAsHtml('double');
		} else if (type == "BD") {
			return $sce.trustAsHtml('bendy');
		}
	}

	$scope.convertToMinute = function(ms) {
		if (ms) {

			var min = Math.round(ms/60000);

			if (min < 0 || min ==0) {
				return $sce.trustAsHtml(' arr"> Arr <br />');  

			} else if (min > 0 && min < 10){
				return $sce.trustAsHtml( ' min'+ min +'">'+ min + '\'<br />');

			} else if (min>=10) {
				return $sce.trustAsHtml( ' min10">'+ min + '\'<br />');
			}		
		}
		else if (busStop.hour <= 5){
			return $sce.trustAsHtml( '<span class = "noMore">No More for Today.<br> See You Tomorrow!</span>');
		};
	};

	$scope.busFeature = function(feature) {
		if (feature == "WAB") {
			return $sce.trustAsHtml( '<i class="fas fa-wheelchair wheelchairIconStyle"></i></div>');
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
			greetingContent: "=",
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

busApp.directive('loading',   ['$http' ,function ($http){
    return {
        restrict: 'A',
        link: function (scope, elm, attrs)
        {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function (v)
            {
                if(v){
                    elm.show();
                }else{
                    elm.hide();
                }
            });
        }
    };

}]);
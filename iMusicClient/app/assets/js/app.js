(function(){
    var app = angular.module('app', ['ngMaterial']);
    app.config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('teal')
            //.accentPalette('orange');
    });
    app.controller('toolBarCtrl', function($scope, $mdSidenav){
        $scope.toggleSliderBar = function(){
            $mdSidenav('left').toggle();
        }
    });
})();

//red, pink, purple, deep-purple, indigo, blue, light-blue, cyan, teal, green, light-green,
//lime, yellow, amber, orange, deep-orange, brown, grey, blue-grey
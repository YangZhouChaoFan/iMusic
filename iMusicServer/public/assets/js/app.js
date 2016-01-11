var app = angular.module('app', ['ngMaterial', 'ngAnimate', 'ngRoute']);
app.config(function ($mdThemingProvider, $routeProvider) {
    //主题设置
    $mdThemingProvider.theme('default')
        .primaryPalette('teal')
        .accentPalette('brown');

    //路由设置
    $routeProvider.when('/', {
        templateUrl: 'home.html',
        controller: 'homeCtrl'
    }).when('/music', {
        templateUrl: 'music.html',
        controller: 'musicCtrl'
    }).when('/user', {
        templateUrl: 'user.html',
        controller: 'userCtrl'
    }).when('/setting', {
        templateUrl: 'setting.html',
        controller: 'settingCtrl'
    }).otherwise({
        redirectTo: '/'
    });
});
app.controller('homeCtrl',function($scope){

}).controller('musicCtrl',function($scope){

}).controller('userCtrl',function($scope){

}).controller('settingCtrl',function($scope){

})
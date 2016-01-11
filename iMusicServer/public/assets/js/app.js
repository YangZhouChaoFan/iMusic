var app = angular.module('app', ['ngMaterial', 'ngAnimate']);
app.config(function ($mdThemingProvider) {
    //主题设置
    $mdThemingProvider.theme('default')
        .primaryPalette('teal')
        .accentPalette('brown');
});
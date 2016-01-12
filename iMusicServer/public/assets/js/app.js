var app = angular.module('app', ['ngMaterial', 'ngAnimate', 'ngRoute', 'chart.js']);
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
app.controller('navCtrl', function ($scope, $mdSidenav) {
    $scope.open = function () {
        $mdSidenav('left').toggle();
    }
}).controller('homeCtrl', function ($scope, $interval) {
    //音乐统计
    $scope.musicLabels = ["国语", "港台", "欧美", "日韩"];
    $scope.musicData = [10, 8, 7, 3];

    //用户统计
    var maximum = document.getElementById('userContainer').clientWidth / 2 || 300;
    $scope.userData = [[]];
    $scope.userLabels = [];
    $scope.userSeries = ['活跃用户'];
    $scope.userOptions = {
        animation: false,
        showScale: false,
        showTooltips: false,
        pointDot: false,
        datasetStrokeWidth: 0.5
    };

    // Update the dataset at 25FPS for a smoothly-animating chart
    $interval(function () {
        getLiveChartData();
    }, 40);

    function getLiveChartData() {
        if ($scope.userData[0].length) {
            $scope.userLabels = $scope.userLabels.slice(1);
            $scope.userData[0] = $scope.userData[0].slice(1);
        }

        while ($scope.userData[0].length < maximum) {
            $scope.userLabels.push('');
            $scope.userData[0].push(getRandomValue($scope.userData[0]));
        }
    }

    function getRandomValue(data) {
        var l = data.length, previous = l ? data[l - 1] : 50;
        var y = previous + Math.random() * 10 - 5;
        return y < 0 ? 0 : y > 100 ? 100 : y;
    }

}).
controller('musicCtrl', function ($scope) {

}).controller('userCtrl', function ($scope) {

}).controller('settingCtrl', function ($scope) {

})
var app = angular.module('app', [
    'ngMaterial',
    'ngAnimate',
    'ngRoute',
    'chart.js',
    'ngFileUpload',
    'ui.grid',
    'ui.grid.pagination',
    'ui.grid.selection',
    'ui.grid.autoResize',
    'ui.grid.resizeColumns'
]);
app.config(function ($mdThemingProvider, $routeProvider, $locationProvider) {
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
app.controller('appCtrl', function ($scope, $timeout) {
    //启动窗口
    $timeout(function () {
        $scope.isHide = true;
        $scope.$apply();
    }, 1000);
}).controller('navCtrl', function ($scope, $mdSidenav) {
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
controller('musicCtrl', function ($scope, i18nService, $mdMedia, $mdDialog, $http) {

    //当前选择标志位
    $scope.zeroFlag = true;
    $scope.singleFlag = false;
    $scope.multiFlag = false;

    //表格初始化
    $scope.data = [];
    i18nService.setCurrentLang('zh-cn');
    $scope.gridOptions = {
        data: 'data',
        enableRowSelection: true,
        enableRowHeaderSelection: true,
        enableSelectAll: true,
        enableColumnResizing: true,
        multiSelect: true,
        columnDefs: [
            {field: 'name', displayName: '歌名'},
            {field: 'author', displayName: '作者'},
            {field: 'type', displayName: '类型'},
            {field: 'path', displayName: '路径'},
        ],
        onRegisterApi: function (gridApi) {
            //获取ui-grid的API
            $scope.gridApi = gridApi;
            //ui-grid的选择事件
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                changeSelectFlag();
            });
            gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                changeSelectFlag();
            });
        }
    };

    //标志位
    $scope.changeSelectFlag = function(){
        var rows = $scope.gridApi.selection.getSelectedRows();
        if (rows.length == 0) {
            $scope.zeroFlag = true;
            $scope.singleFlag = false;
            $scope.multiFlag = false;
        } else if (rows.length == 1) {
            $scope.zeroFlag = false;
            $scope.singleFlag = true;
            $scope.multiFlag = false;
        } else if (rows.length > 1) {
            $scope.zeroFlag = false;
            $scope.singleFlag = false;
            $scope.multiFlag = true;
        }
    }

    $scope.query = function () {
        $http({
            method: 'POST',
            url: '/rest/music/query',
            data: {}
        }).success(function (results) {
            $scope.data = results;
        });
    }

    $scope.delete = function(ev){
        var rows = $scope.gridApi.selection.getSelectedRows();
        var ids = [];
        for(var i = 0; i < rows.length; i++){
            ids.push(rows[i]._id);
        }
        $http({
            method: 'POST',
            url: '/rest/music/delete',
            data: {
                ids: ids
            }
        }).success(function (results) {
            $scope.query();
            console.log(results);
        });
    }

    //新增
    $scope.insert = function (ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        $mdDialog.show({
            controller: function ($scope, $mdDialog, $http) {
                $scope.types = ["国语", "港台", "欧美", "日韩"];
                $scope.cancel = function () {
                    $mdDialog.cancel('cancle');
                };
                $scope.ok = function () {
                    $http({
                        method: 'POST',
                        url: '/rest/music/insert',
                        data: $scope.music
                    }).success(function (results) {
                        $mdDialog.hide('ok');
                    });
                };
            },
            templateUrl: 'tpls/music.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: useFullScreen
        }).then(function (data) {
            console.log(data);
            $scope.query();
        }, function (data) {
            console.log(data);
        });
        $scope.$watch(function () {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function (wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    };

    //更新
    $scope.update = function (ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        $mdDialog.show({
            controller: function ($scope, $mdDialog, $http, parentScope) {
                var rows = parentScope.gridApi.selection.getSelectedRows();
                var id = parentScope.gridApi.selection.getSelectedRows()[0]._id;
                $http({
                    method: 'POST',
                    url: '/rest/music/queryById',
                    data: {
                        id: id
                    }
                }).success(function (results) {
                    $scope.music = results[0];
                });

                $scope.types = ["国语", "港台", "欧美", "日韩"];
                $scope.cancel = function () {
                    $mdDialog.cancel('cancle');
                };
                $scope.ok = function () {
                    $http({
                        method: 'POST',
                        url: '/rest/music/update',
                        data: $scope.music
                    }).success(function (results) {
                        $mdDialog.hide('ok');
                    });
                };
            },
            templateUrl: 'tpls/music.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: useFullScreen,
            resolve: {
                parentScope: function () {
                    return $scope;
                }
            }
        }).then(function (data) {
            console.log(data);
            $scope.query();
        }, function (data) {
            console.log(data);
        });
        $scope.$watch(function () {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function (wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    };

    $scope.query();

}).controller('userCtrl', function ($scope) {

}).controller('settingCtrl', function ($scope) {

})
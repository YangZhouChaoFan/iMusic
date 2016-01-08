(function (nw) {
    var app = angular.module('app', ['ngMaterial', 'ngAnimate']);
    app.config(function ($mdThemingProvider) {
        //主题设置
        $mdThemingProvider.theme('default')
            .primaryPalette('teal')
            .accentPalette('orange');
    });
    app.controller('appCtrl', function ($scope, $timeout) {
        //启动窗口
        nw.Window.get().on('loaded', function () {
            nw.Window.get().show();
            $timeout(function () {
                $scope.isHide = true;
                $scope.$apply();
            }, 1000);
        });
    }).controller('toolBarCtrl', function ($scope, $mdSidenav, $mdDialog) {

        //滑动栏
        $scope.toggleSliderBar = function () {
            $mdSidenav('left').toggle();
        };

        //最小化、还原、最大化、隐藏、托盘
        tray = new nw.Tray({title: 'iMusic', icon: 'app/assets/img/logo.png'});
        tray.on('click', function () {
            nw.Window.get().show();
        });
        menu = new nw.Menu();
        menu.append(new nw.MenuItem({type: 'checkbox', label: '允许通知'}));
        menu.append(new nw.MenuItem({type: 'separator'}));
        menu.append(new nw.MenuItem({
            label: '打开iMusic',
            click: function () {
                nw.Window.get().show();
            }
        }));
        menu.append(new nw.MenuItem({
            label: '关闭iMusic',
            click: function () {
                nw.Window.get().show();
                var confirm = $mdDialog.confirm()
                    .title('Tip')
                    .textContent('Confirm close iMusic?')
                    .ariaLabel('?')
                    .ok('Ok')
                    .cancel('Cancel');
                $mdDialog.show(confirm).then(function () {
                    nw.Window.get().close();
                }, function () {
                    nw.Window.get().show();
                });
            }
        }));
        tray.menu = menu;
        $scope.isNormal = true;
        $scope.minWindow = function () {
            nw.Window.get().minimize();
        };
        $scope.maxWindow = function () {
            if ($scope.isNormal) {
                nw.Window.get().maximize();
            } else {
                nw.Window.get().unmaximize()
            }
            $scope.isNormal = !$scope.isNormal;
        };
        $scope.closeWindow = function () {
            nw.Window.get().hide();
        };
        nw.Window.get().on('maximize', function () {
            $scope.isNormal = false;
            $scope.$apply();
        });
        nw.Window.get().on('unmaximize', function () {
            $scope.isNormal = true;
            $scope.$apply();
        });
    }).controller('channelSelectCtrl', function ($scope, $timeout) {
        $scope.openFolder = function () {
            $('#folderSelect').click();
            /*$timeout(function() {
             angular.element(document.getElementById('folderSelect')).triggerHandler('click');
             }, 100);*/
        }
        $scope.openFile = function () {
            $('#fileSelect').click();
            /*$timeout(function() {
             angular.element(document.getElementById('fileSelect')).triggerHandler('click');
             }, 100);*/
        };
    }).controller('songListCtrl', function ($scope) {
        //歌曲列表
        $scope.songs = [];
        $scope.selectSong = function (index) {
            $scope.selectItem = index;
        }
        angular.element(window).bind('resize', function () {
            $scope.windowWidth = window.innerWidth;
            $scope.$apply();
        });
        $('#fileSelect').bind('change', function () {
            var files = $('#fileSelect').prop('files');
            $scope.songs = [];
            for (var i = 0; i < files.length; i++) {
                $scope.songs.push(
                    {
                        path: files[i].path,
                        name: files[i].name.substr(0, 15)
                    }
                );
            }
        });
    });
})(require('nw.gui'));

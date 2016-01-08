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
        $scope.selectItem = -1;
        $scope.selectSong = function (index) {
            $scope.selectItem = index;
        }

        //窗口事件
        angular.element(window).bind('resize', function () {
            $scope.windowWidth = window.innerWidth;
            $scope.$apply();
        });

        //播放器事件
        document.getElementById('player').addEventListener('ended', function(){
            if(!$scope.isRepeat){
                if($scope.selectItem == $scope.songs.length - 1){
                    $scope.audioStop();
                }else{
                    $scope.audioNext();
                }
            }
            $scope.$apply();
        });

        //选择目录
        $('#folderSelect').bind('change', function () {
            $scope.audioStop();
            $scope.songs = [];
            var fs = require('fs');
            var path = require('path');
            var folder = $('#folderSelect').prop('files')[0].path
            var files = fs.readdirSync(folder);
            for (var i = 0; i < files.length; i++) {
                if (path.extname(files[i]) == '.mp3') {
                    $scope.songs.push({
                        path: folder + '\\' + files[i],
                        name: files[i].substr(0, files[i].indexOf('.mp3'))
                    });
                }
            }
        });

        //选择文件
        $('#fileSelect').bind('change', function () {
            $scope.audioStop();
            var files = $('#fileSelect').prop('files');
            $scope.songs = [];
            for (var i = 0; i < files.length; i++) {
                $scope.songs.push(
                    {
                        path: files[i].path,
                        name: files[i].name.substr(0, files[i].name.indexOf('.mp3'))
                    }
                );
            }
        });

        //监控选择项
        $scope.$watch('selectItem', function(newVal, oldVal){
            $scope.isPlay = false;
            if($scope.songs[newVal]){
                var path = $scope.songs[newVal].path || '';
                $('#player').attr('src', path);
                $scope.isPlay = true;
            }
        });

        //播放控制
        $scope.audioPlay = function(){
            if($scope.isPlay){
                $('#player')[0].pause();
                $scope.isPlay=!$scope.isPlay;
            }else if($scope.selectItem == -1){
                if($scope.songs.length > 0){
                    $scope.selectItem++;
                    $('#player')[0].play();
                    $scope.isPlay=!$scope.isPlay;
                }
            }else{
                $('#player')[0].play();
                $scope.isPlay=!$scope.isPlay;
            }
        };
        $scope.audioStop = function(){
            $('#player').attr('src', '');
            $scope.selectItem = -1;
            $scope.isPlay = false;
        };
        $scope.audioPrev = function(){
            if($scope.selectItem >0 ){
                var path = $scope.songs[--$scope.selectItem].path || '';
                $('#player').attr('src', path);
                $scope.isPlay = true;
            }
        };
        $scope.audioNext = function(){
            if($scope.selectItem < $scope.songs.length - 1){
                var path = $scope.songs[++$scope.selectItem].path || '';
                $('#player').attr('src', path);
                $scope.isPlay = true;
            }
        };
        $scope.audioRepeat = function(){
            if(!$scope.isRepeat){
                $('#player').attr('loop', 'loop');
            }else {
                $('#player').removeAttr('loop');
            }
            $scope.isRepeat = !$scope.isRepeat;
        };
    });
})(require('nw.gui'));

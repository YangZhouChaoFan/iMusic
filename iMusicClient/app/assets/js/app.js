(function (nw) {
    var app = angular.module('app', ['ngMaterial', 'ngAnimate']);
    app.config(function ($mdThemingProvider) {
        //主题设置
        $mdThemingProvider.theme('default')
            .primaryPalette('teal')
            .accentPalette('brown');
    });
    app.controller('appCtrl', function ($scope, $timeout) {
        //启动窗口
        nw.Window.get().on('loaded', function () {
            nw.Window.get().show();
            $timeout(function () {
                $scope.isHide = true;
                $scope.$apply();
            }, 2000);
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
    }).controller('songListCtrl', function ($scope, $interval) {
        //歌曲列表
        $scope.songs = [];
        var songsCookies = JSON.parse(window.localStorage.getItem('songs'));
        $scope.selectItem = -1;
        $scope.selectSong = function (index) {
            $scope.selectItem = index;
        }

        //初始化歌曲列表
        if (songsCookies && songsCookies.length > 0) {
            for (var i = 0; i < songsCookies.length; i++) {
                $scope.songs.push({
                    'name': songsCookies[i].name,
                    'path': songsCookies[i].path
                });
            }
        } else {
            $scope.songs = [{
                'name': '慕寒 - 单身狗之歌',
                'path': 'demo/慕寒 - 单身狗之歌.mp3'
            }];
        }

        //窗口事件
        angular.element(window).bind('resize', function () {
            $scope.windowWidth = window.innerWidth;
            $scope.$apply();
        });

        //关闭时保存列表
        //nw.Window.get().on('closed', function () {
        //});

        $scope.$watch('songs', function (newVal, oldVal) {
              window.localStorage.setItem('songs', JSON.stringify(newVal));
        });

        //禁止拖拽文件
        $(window).on('dragover', function (e) {
            e.preventDefault();
            e.originalEvent.dataTransfer.dropEffect = 'none';
        });
        $(window).on('drop', function (e) {
            e.preventDefault();
        });

        //播放器事件
        document.getElementById('player').addEventListener('ended', function () {
            if (!$scope.isRepeat) {
                if ($scope.selectItem == $scope.songs.length - 1) {
                    $scope.audioStop();
                } else {
                    $scope.audioNext();
                }
            }
            $scope.$apply();
        });

        //进度条滚动
        $interval(function () {
            if (!$scope.lockProcess) {
                if ($('#player')[0].currentTime) {
                    $scope.songProcess = ($('#player')[0].currentTime) / ($('#player')[0].duration) * 100;
                } else {
                    $scope.songProcess = 0;
                }
            }
        }, 100);

        //选择目录
        $('#folderSelect').bind('change', function () {
            if ($('#folderSelect').prop('files').length > 0) {
                var fs = require('fs');
                var path = require('path');
                var folder = $('#folderSelect').prop('files')[0].path;
                var files = fs.readdirSync(folder);
                $scope.audioStop();
                $scope.songs = [];
                for (var i = 0; i < files.length; i++) {
                    if (path.extname(files[i]) == '.mp3') {
                        $scope.songs.push({
                            path: folder + '\\' + files[i],
                            name: files[i].substr(0, files[i].indexOf('.mp3'))
                        });
                    }
                }
            }
        });

        //选择文件
        $('#fileSelect').bind('change', function () {
            var files = $('#fileSelect').prop('files');
            if (files.length > 0) {
                $scope.audioStop();
                $scope.songs = [];
                for (var i = 0; i < files.length; i++) {
                    $scope.songs.push(
                        {
                            path: files[i].path,
                            name: files[i].name.substr(0, files[i].name.indexOf('.mp3'))
                        }
                    );
                }
            }
        });

        //监控选择项
        $scope.$watch('selectItem', function (newVal, oldVal) {
            $scope.isPlay = false;
            if ($scope.songs[newVal]) {
                var path = $scope.songs[newVal].path || '';
                $('#player').attr('src', path);
                $scope.isPlay = true;
            }
        });

        //播放控制
        $scope.audioPlay = function () {
            if ($scope.isPlay) {
                $('#player')[0].pause();
                $scope.isPlay = !$scope.isPlay;
            } else if ($scope.selectItem == -1) {
                if ($scope.songs.length > 0) {
                    $scope.selectItem++;
                    $('#player')[0].play();
                    $scope.isPlay = !$scope.isPlay;
                }
            } else {
                $('#player')[0].play();
                $scope.isPlay = !$scope.isPlay;
            }
        };
        $scope.audioStop = function () {
            $('#player').attr('src', '');
            $scope.selectItem = -1;
            $scope.isPlay = false;
        };
        $scope.audioPrev = function () {
            if ($scope.selectItem > 0) {
                var path = $scope.songs[--$scope.selectItem].path || '';
                $('#player').attr('src', path);
                $scope.isPlay = true;
            }
        };
        $scope.audioNext = function () {
            if ($scope.selectItem < $scope.songs.length - 1) {
                var path = $scope.songs[++$scope.selectItem].path || '';
                $('#player').attr('src', path);
                $scope.isPlay = true;
            }
        };
        $scope.audioRepeat = function () {
            if (!$scope.isRepeat) {
                $('#player').attr('loop', 'loop');
            } else {
                $('#player').removeAttr('loop');
            }
            $scope.isRepeat = !$scope.isRepeat;
        };
        $scope.auidoProcessLock = function () {
            $scope.lockProcess = true;
        };
        $scope.audioProess = function () {
            $('#player')[0].currentTime = ($scope.songProcess / 100) * ($('#player')[0].duration);
            $scope.lockProcess = false;
        };

    });
})(require('nw.gui'));

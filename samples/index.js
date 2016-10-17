(function (angular) {
    'use strict';

    var thisModule = angular.module('appButtons',
        [
            'ngMaterial',
            'pipServices', 'pipButtons', //'appCoreServices.Toasts', 
            'pipLayout', 'pipNav', // 'pipDateTimes',
            'pipTheme.Default', 'pipTheme.Bootbarn', 'pipTheme',

            'appButtons.Refresh', 'appButtons.ToggleButtons'
        ]
    );

    // Configure application services before start
    thisModule.config(
        function ($stateProvider, $urlRouterProvider, pipTranslateProvider,
                   pipSideNavProvider, pipAppBarProvider, $mdIconProvider,
                  $compileProvider, $httpProvider) {

            $compileProvider.debugInfoEnabled(false);
            $httpProvider.useApplyAsync(true);
            
            var content = [
                { title: 'Refresh', state: 'refresh', url: '/refresh', auth: false,
                    controller: 'RefreshController', templateUrl: 'refresh_sample/refresh.html' },
                { title: 'Toggle Buttons', state: 'toggle_buttons', url: '/toggle_buttons', auth: false,
                    controller: 'ToggleButtonsController', templateUrl: 'toggle_buttons_sample/toggle_buttons.html' },
            ],
            contentItem, i;

            $mdIconProvider.iconSet('icons', 'images/icons.svg', 512);

            pipAppBarProvider.globalSecondaryActions([
                {name: 'global.signout', title: 'SIGNOUT', state: 'signout'}
            ]);

            // String translations
            pipTranslateProvider.translations('en', {
                CONTROLS: 'Buttons',
                SIGNOUT: 'Sign out'
            });

            pipTranslateProvider.translations('ru', {
                CONTROLS: 'Кнопки',
                SIGNOUT: 'Выйти'
            });

            for (i = 0; i < content.length; i++) {
                contentItem = content[i];
                $stateProvider.state(contentItem.state, contentItem);
            }

            $urlRouterProvider.otherwise('/progress');

            // Configure navigation menu
            pipSideNavProvider.sections([
                {
                    links: [{title: 'CONTROLS', url: '/progress'}]
                }/*, Links only for publishing samples
                {
                    links: links
                }

                /*,
                {
                    links: [{title: 'SIGNOUT', url: '/signout'}]
                }*/
            ]);
        }
    );

    thisModule.controller('pipSampleController',
        function ($scope, $rootScope, $state, $mdSidenav, $timeout, pipTranslate, $mdTheming, pipTheme, 
                  $mdMedia) {

           // pipTheme.setCurrentTheme('bootbarn-warm');
            
            $scope.pages = [
                { title: 'Refresh', state: 'refresh', url: '/refresh',
                    controller: 'RefreshController', templateUrl: '../samples/refresh/refresh.html' },
                { title: 'Toggle Buttons', state: 'toggle_buttons', url: '/toggle_buttons',
                    controller: 'ToggleButtonsController', 
                    templateUrl: '../samples/toggle_buttons/toggle_buttons.html' }
            ];

            var allThemes = _.keys(_.omit($mdTheming.THEMES, 'default'));
            $scope.themes = [];
            _.each(allThemes, function (theme) {
                if (theme.indexOf('bootbarn') == -1) {
                    $scope.themes.push(theme);
                }
            })

            $scope.selected = {};
            $timeout(function () {
                $scope.selected.pageIndex = _.findIndex($scope.pages, {state: $state.current.name});
            });

            $scope.onNavigationSelect = function (stateName) {
                if ($state.current.name !== stateName) {
                    $state.go(stateName);
                }
            };

            $scope.onDropdownSelect = function (obj) {
                if ($state.current.name !== obj.state) {
                    $state.go(obj.state);
                }
            };

            $scope.isPadding = function () {
                return $rootScope.$state
                    ? !($rootScope.$state.name === 'tabs' ||
                    $rootScope.$state.name === 'dropdown' && $mdMedia('xs')) : true;
            };
        }
    );

})(window.angular);

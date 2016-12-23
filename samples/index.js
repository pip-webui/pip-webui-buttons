(function (angular) {
    'use strict';

    var thisModule = angular.module('appButtons',
        [
            'ngMaterial',
            'ui.router', 'ui.utils', 'ngResource', 'ngAria', 'ngCookies', 'ngSanitize', 'ngMessages',
            'ngMaterial', 'wu.masonry', 'LocalStorageModule', 'ngAnimate',

            'pipServices',
            'pipTheme.Default', 'pipTheme', 

            'pipButtons',
            'appButtons.Refresh', 'appButtons.ToggleButtons', 'appComponentsStyles.ActionList',
            'appComponentsStyles.DrilldownList', 'appBasicBehaviors.FabTooltipVisibility'

        ]
    );

    var content = [
        { 
            title: 'Refresh', state: 'refresh', url: '/refresh', auth: false,
            controller: 'RefreshController', templateUrl: 'refresh_sample/refresh.html' 
        },
        { 
            title: 'Toggle Buttons', state: 'toggle_buttons', url: '/toggle_buttons', auth: false,
            controller: 'ToggleButtonsController', templateUrl: 'toggle_buttons_sample/toggle_buttons.html' 
        },
        { 
            title: 'Action List', state: 'action_list', url: '/action_list', auth: false,
            controller: 'ActionListController', templateUrl: 'action_list_sample/action_list.html' 
        },
        { 
            title: 'Drilldown List', state: 'drilldown_list', url: '/drilldown_list', auth: false,
            controller: 'DrilldownListController', templateUrl: 'drilldown_list_sample/drilldown_list.html' 
        },
        { 
            title: 'Fabs', state: 'fabs', url: '/fabs', auth: false,
            controller: 'FabTooltipVisibilityController', templateUrl: 'fabs_sample/fab_tooltip_visibility.html' 
        },                        
    ];

    // Configure application services before start
    thisModule.config(
        function ($stateProvider, $urlRouterProvider, $mdIconProvider,
                  $compileProvider, $httpProvider) { 
            // pipTranslateProvider, pipSideNavProvider, pipAppBarProvider,

            $compileProvider.debugInfoEnabled(false);
            $httpProvider.useApplyAsync(true);

            var contentItem, i;

            $mdIconProvider.iconSet('icons', 'images/icons.svg', 512);

            for (i = 0; i < content.length; i++) {
                contentItem = content[i];
                $stateProvider.state(contentItem.state, contentItem);
            }

            $urlRouterProvider.otherwise('/refresh');
        }
    );

    thisModule.controller('pipSampleController',

        function ($scope, $rootScope, $injector, $state, $mdSidenav, $timeout, $mdTheming,
                  $mdMedia, localStorageService) {

            var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null,
                pipTheme = $injector.has('pipTheme') ? $injector.get('pipTheme') : null;

            $scope.isTranslated = !!pipTranslate;
            $scope.isTheme = !!pipTheme;
            $scope.$mdMedia = $mdMedia;

            $rootScope.$theme = localStorageService.get('theme') || 'blue';
            if ($scope.isTheme) {
                $scope.themes = _.keys(_.omit($mdTheming.THEMES, 'default'));
            } else {
                $scope.themes = [];
            }

            $scope.languages = ['en', 'ru'];
            if (!$rootScope.$language) {
                $rootScope.$language = 'en';
            }

            $scope.content = content;
            $scope.menuOpened = false;

            // Update page after language changed
            $rootScope.$on('languageChanged', function(event) {
                $state.reload();
            });

            // Update page after theme changed
            $rootScope.$on('themeChanged', function(event) {
                $state.reload();
            });

            $scope.onSwitchPage = function (state) {
                $mdSidenav('left').close();
                $state.go(state);
            };

            $scope.onThemeClick = function(theme) {
                console.log('onThemeClick');
                if ($scope.isTheme) {
                    console.log('onThemeClick1');
                    setTimeout(function () {
                        pipTheme.use(theme, false, false);
                        $rootScope.$theme = theme;
                        $rootScope.$apply();
                    }, 0);                      
                }
            };

            $scope.onToggleMenu = function () {
                $mdSidenav('left').toggle();
            };

            $scope.onLanguageClick = function(language) {
                console.log('onLanguageClick');
                if (pipTranslate) {
                    console.log('onLanguageClick1', language);
                    setTimeout(function () {
                        pipTranslate.use(language);
                        $rootScope.$apply();
                    }, 0);   
                } 
             
            };

            $scope.isActiveState = function (state) {
                return $state.current.name == state;
            };
        }
    );

})(window.angular);
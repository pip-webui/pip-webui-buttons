(function (angular) {
    'use strict';

    var thisModule = angular.module('appButtons',
        [
            'ngMaterial',
            'ui.router', 'ui.utils', 'ngResource', 'ngAria', 'ngCookies', 'ngSanitize', 'ngMessages',
            'ngMaterial', 'wu.masonry', 'LocalStorageModule', 'angularFileUpload', 'ngAnimate',

            'pipServices',
            'pipTheme.Default', 'pipTheme.Bootbarn', 'pipTheme', 

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
                  $compileProvider, $httpProvider) { // pipTranslateProvider, pipSideNavProvider, pipAppBarProvider,

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

        function ($scope, $rootScope, $injector, $state, $mdSidenav, $timeout, $mdTheming, $mdMedia, localStorageService) {

            var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null,
                // appThemesDefault = $injector.has('appThemesDefault') ? $injector.get('appThemesDefault') : null,
                pipTheme = $injector.has('pipTheme') ? $injector.get('pipTheme') : null;

            $scope.isTranslated = !!pipTranslate;
            $scope.isTheme = !!pipTheme;
            $scope.$mdMedia = $mdMedia;

            $rootScope.$theme = localStorageService.get('theme');
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


// (function (angular) {
//     'use strict';

//     var thisModule = angular.module('appButtons',
//         [
//             'ngMaterial',
//             'pipServices', 'pipButtons', //'appCoreServices.Toasts', 
//             'pipLayout', 'pipNav', // 'pipDateTimes',
//             'pipTheme.Default', 'pipTheme.Bootbarn', 'pipTheme',

//             'appButtons.Refresh', 'appButtons.ToggleButtons'
//         ]
//     );

//     // Configure application services before start
//     thisModule.config(
//         function ($stateProvider, $urlRouterProvider, pipTranslateProvider,
//                    pipSideNavProvider, pipAppBarProvider, $mdIconProvider,
//                   $compileProvider, $httpProvider) {

//             $compileProvider.debugInfoEnabled(false);
//             $httpProvider.useApplyAsync(true);
            
//             var content = [
//                 { title: 'Refresh', state: 'refresh', url: '/refresh', auth: false,
//                     controller: 'RefreshController', templateUrl: 'refresh_sample/refresh.html' },
//                 { title: 'Toggle Buttons', state: 'toggle_buttons', url: '/toggle_buttons', auth: false,
//                     controller: 'ToggleButtonsController', templateUrl: 'toggle_buttons_sample/toggle_buttons.html' },
//             ],
//             contentItem, i;

//             $mdIconProvider.iconSet('icons', 'images/icons.svg', 512);

//             pipAppBarProvider.globalSecondaryActions([
//                 {name: 'global.signout', title: 'SIGNOUT', state: 'signout'}
//             ]);

//             // String translations
//             pipTranslateProvider.translations('en', {
//                 CONTROLS: 'Buttons',
//                 SIGNOUT: 'Sign out'
//             });

//             pipTranslateProvider.translations('ru', {
//                 CONTROLS: 'Кнопки',
//                 SIGNOUT: 'Выйти'
//             });

//             for (i = 0; i < content.length; i++) {
//                 contentItem = content[i];
//                 $stateProvider.state(contentItem.state, contentItem);
//             }

//             $urlRouterProvider.otherwise('/progress');

//             // Configure navigation menu
//             pipSideNavProvider.sections([
//                 {
//                     links: [{title: 'CONTROLS', url: '/progress'}]
//                 }/*, Links only for publishing samples
//                 {
//                     links: links
//                 }

//                 /*,
//                 {
//                     links: [{title: 'SIGNOUT', url: '/signout'}]
//                 }*/
//             ]);
//         }
//     );

//     thisModule.controller('pipSampleController',
//         function ($scope, $rootScope, $state, $mdSidenav, $timeout, pipTranslate, $mdTheming, pipTheme, 
//                   $mdMedia) {

//            // pipTheme.setCurrentTheme('bootbarn-warm');
            
//             $scope.pages = [
//                 { title: 'Refresh', state: 'refresh', url: '/refresh',
//                     controller: 'RefreshController', templateUrl: '../samples/refresh/refresh.html' },
//                 { title: 'Toggle Buttons', state: 'toggle_buttons', url: '/toggle_buttons',
//                     controller: 'ToggleButtonsController', 
//                     templateUrl: '../samples/toggle_buttons/toggle_buttons.html' }
//             ];

//             var allThemes = _.keys(_.omit($mdTheming.THEMES, 'default'));
//             $scope.themes = [];
//             _.each(allThemes, function (theme) {
//                 if (theme.indexOf('bootbarn') == -1) {
//                     $scope.themes.push(theme);
//                 }
//             })

//             $scope.selected = {};
//             $timeout(function () {
//                 $scope.selected.pageIndex = _.findIndex($scope.pages, {state: $state.current.name});
//             });

//             $scope.onNavigationSelect = function (stateName) {
//                 if ($state.current.name !== stateName) {
//                     $state.go(stateName);
//                 }
//             };

//             $scope.onDropdownSelect = function (obj) {
//                 if ($state.current.name !== obj.state) {
//                     $state.go(obj.state);
//                 }
//             };

//             $scope.isPadding = function () {
//                 return $rootScope.$state
//                     ? !($rootScope.$state.name === 'tabs' ||
//                     $rootScope.$state.name === 'dropdown' && $mdMedia('xs')) : true;
//             };
//         }
//     );

// })(window.angular);

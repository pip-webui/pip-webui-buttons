/* eslint-disable no-console */

(function (angular, _) {
    'use strict';

    var thisModule = angular.module('appButtons.Refresh', []);


    thisModule.controller('RefreshController',
        function($scope, $injector, $timeout) {
            var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;

            if (pipTranslate) {
                pipTranslate.translations('en', {
                    SHOW_REFRESH: 'Show refresh',
                    SAMPLE: 'Sample',                    
                    CODE: 'Code'
                });
                pipTranslate.translations('ru', {
                    SHOW_REFRESH: 'Показать refresh',
                    SAMPLE: 'Пример',  
                    CODE: 'Пример кода'
                });
                $scope.refresh = pipTranslate.translate('SHOW_REFRESH');
                $scope.sample = pipTranslate.translate('SAMPLE');
                $scope.code = pipTranslate.translate('CODE');  
            } else {
                $scope.refresh = 'Show refresh';
                $scope.sample = 'Sample';
                $scope.code = 'Code';   
            }

            $timeout(function() {
                $('pre code').each(function(i, block) {
                    Prism.highlightElement(block);
                });
            });
            
            $scope.showRefresh = true;
            $scope.refreshText = '123 New Posts';

            $scope.onRefresh = function () {
                $scope.showRefresh = false;
                console.log('Refresh clicked!!!');
            };

            $scope.onRefreshShow = function () {
                $scope.refreshText = '' + _.random(0, 100) + ' New Posts';
                $scope.showRefresh = true;
            };
        }
    );

})(window.angular, window._);

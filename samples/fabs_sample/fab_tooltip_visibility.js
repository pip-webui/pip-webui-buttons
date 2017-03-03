/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('appBasicBehaviors.FabTooltipVisibility', []);

    thisModule.controller('FabTooltipVisibilityController',
        function($scope, $injector) {
            var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;

            if (pipTranslate) {
                pipTranslate.translations('en', {
                    SAMPLE: 'Sample',                    
                    CODE: 'Code'
                });
                pipTranslate.translations('ru', {
                    SAMPLE: 'Пример',  
                    CODE: 'Пример кода'
                });
                $scope.sample = pipTranslate.translate('SAMPLE');
                $scope.code = pipTranslate.translate('CODE');  
            } else {
                $scope.sample = 'Sample';
                $scope.code = 'Code';   
            }

            $scope.speedDialButtons = [
                {icon: 'icons:goal', tooltip: 'ADD GOAL'}
            ];
            $scope.opened = false;
            $scope.showTooltip = false;

            $scope.onClick = function () {
                $scope.showTooltip = false;    
            }

            $scope.demo = {};
            $scope.demo.selectedDirection = 'left';
            $scope.demo.selectedMode = 'md-fling';
            $scope.demo.isOpen = false;
        }
    );

})();


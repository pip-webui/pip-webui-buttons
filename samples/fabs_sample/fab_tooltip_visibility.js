/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('appBasicBehaviors.FabTooltipVisibility', []);

    thisModule.controller('FabTooltipVisibilityController',
        function($scope) {
            $scope.speedDialButtons = [
                {icon: 'icons:goal', tooltip: 'ADD GOAL'}
            ];
            $scope.showTooltip = false; 

            $scope.onClick = function () {
                $scope.showTooltip = false;    
            }
        }
    );

})();


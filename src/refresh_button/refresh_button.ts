/// <reference path="../../typings/tsd.d.ts" />

(function () {
    'use strict';

    var thisModule = angular.module('pipRefreshButton', ['ngMaterial']);

    thisModule.directive('pipRefreshButton',
        function ($parse) {
            return {
                restrict: 'EA',
                scope: false,
                template: String() +
                '<md-button class="pip-refresh-button" tabindex="-1" ng-click="onClick($event)" aria-label="REFRESH">' +
                '<md-icon md-svg-icon="icons:refresh"></md-icon>' +
                '<span class="pip-refresh-text"></span>' +
                '</md-button>',
                replace: false,
                link: function ($scope, $element, $attrs: any) {
                    var width, text, show,
                        textGetter = $parse($attrs.pipText),
                        visibleGetter = $parse($attrs.pipVisible),
                        refreshGetter = $parse($attrs.pipRefresh),
                        $button = $element.children('.md-button'),
                        $text = $button.children('.pip-refresh-text');

                    show = function () {
                        // Set a new text
                        text = textGetter($scope);
                        $text.text(text);

                        // Show button
                        $button.show();

                        // Adjust position
                        width = $button.width();
                        $button.css('margin-left', '-' + width / 2 + 'px');
                    };

                    function hide() {
                        $button.hide();
                    }

                    (<any>$scope).onClick = function () {
                        refreshGetter($scope);
                    };

                    $scope.$watch(visibleGetter, function (newValue) {
                        if (newValue) {
                            show();
                        } else {
                            hide();
                        }
                    });

                    $scope.$watch(textGetter, function (newValue: string) {
                        $text.text(newValue);
                    });
                }
            };
        }
    );

})();
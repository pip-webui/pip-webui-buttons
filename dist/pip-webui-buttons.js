(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).buttons = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
    'use strict';
    angular.module('pipButtons', [
        'pipToggleButtons',
        'pipRefreshButton',
        'pipFabTooltipVisibility'
    ]);
})();
},{}],2:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipButtons.Translate', []);
    thisModule.filter('translate', ['$injector', function ($injector) {
        var pipTranslate = $injector.has('pipTranslate')
            ? $injector.get('pipTranslate') : null;
        return function (key) {
            return pipTranslate ? pipTranslate.translate(key) || key : key;
        };
    }]);
})();
},{}],3:[function(require,module,exports){
var FabTooltipVisibilityController = (function () {
    FabTooltipVisibilityController.$inject = ['$element', '$attrs', '$scope', '$timeout', '$parse'];
    function FabTooltipVisibilityController($element, $attrs, $scope, $timeout, $parse) {
        "ngInject";
        var trigGetter = $parse($attrs['pipFabTooltipVisibility']), showGetter = $parse($attrs['pipFabShowTooltip']), showSetter = showGetter.assign;
        $scope.$watch(trigGetter, function (isOpen) {
            if (!_.isFunction(showSetter))
                return;
            if (isOpen) {
                $timeout(function () {
                    showSetter($scope, isOpen);
                }, 600);
            }
            else {
                showSetter($scope, isOpen);
            }
        });
    }
    return FabTooltipVisibilityController;
}());
(function () {
    pipFabTooltipVisibility.$inject = ['$parse', '$timeout'];
    function pipFabTooltipVisibility($parse, $timeout) {
        return {
            restrict: 'A',
            scope: false,
            controller: FabTooltipVisibilityController
        };
    }
    angular
        .module('pipFabTooltipVisibility', [])
        .directive('pipFabTooltipVisibility', pipFabTooltipVisibility);
})();
},{}],4:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipRefreshButton', ['ngMaterial']);
    thisModule.directive('pipRefreshButton', ['$parse', function ($parse) {
        return {
            restrict: 'EA',
            scope: false,
            template: String() +
                '<md-button class="pip-refresh-button" tabindex="-1" ng-click="onClick($event)" aria-label="REFRESH">' +
                '<md-icon md-svg-icon="icons:refresh"></md-icon>' +
                '<span class="pip-refresh-text"></span>' +
                '</md-button>',
            replace: false,
            link: function ($scope, $element, $attrs) {
                var width, text, show, textGetter = $parse($attrs.pipText), visibleGetter = $parse($attrs.pipVisible), refreshGetter = $parse($attrs.pipRefresh), $button = $element.children('.md-button'), $text = $button.children('.pip-refresh-text');
                show = function () {
                    text = textGetter($scope);
                    $text.text(text);
                    $button.show();
                    width = $button.width();
                    $button.css('margin-left', '-' + width / 2 + 'px');
                };
                function hide() {
                    $button.hide();
                }
                $scope.onClick = function () {
                    refreshGetter($scope);
                };
                $scope.$watch(visibleGetter, function (newValue) {
                    if (newValue) {
                        show();
                    }
                    else {
                        hide();
                    }
                });
                $scope.$watch(textGetter, function (newValue) {
                    $text.text(newValue);
                });
            }
        };
    }]);
})();
},{}],5:[function(require,module,exports){
(function () {
    'use strict';
    var thisModule = angular.module('pipToggleButtons', ['pipButtons.Templates']);
    thisModule.directive('pipToggleButtons', function () {
        return {
            restrict: 'EA',
            scope: {
                ngDisabled: '&',
                buttons: '=pipButtons',
                currentButtonValue: '=ngModel',
                currentButton: '=?pipButtonObject',
                multiselect: '=?pipMultiselect',
                change: '&ngChange',
                onlyToggle: '=?pipOnlyToggle'
            },
            templateUrl: 'toggle_buttons/toggle_buttons.html',
            controller: ['$scope', '$element', '$attrs', '$mdMedia', '$timeout', function ($scope, $element, $attrs, $mdMedia, $timeout) {
                var index;
                $scope.$mdMedia = $mdMedia;
                $scope.class = $attrs.class || '';
                $scope.multiselect = $scope.multiselect || false;
                if (!$scope.buttons || _.isArray($scope.buttons) && $scope.buttons.length === 0) {
                    $scope.buttons = [];
                }
                index = _.indexOf($scope.buttons, _.find($scope.buttons, { id: $scope.currentButtonValue }));
                $scope.currentButtonIndex = index < 0 ? 0 : index;
                $scope.currentButton = $scope.buttons.length > 0 ? $scope.buttons[$scope.currentButtonIndex]
                    : $scope.currentButton;
                $scope.buttonSelected = function (index) {
                    if ($scope.disabled()) {
                        return;
                    }
                    if ($scope.buttons[index].diselectable === true && index === $scope.currentButtonIndex
                        && $scope.buttons[index].level !== undefined) {
                        var curLevel_1 = $scope.buttons[index].level, tmp = void 0;
                        curLevel_1--;
                        tmp = _.findIndex($scope.buttons, function (b) { return b['level'] === curLevel_1; });
                        index = tmp > -1 ? tmp : index;
                    }
                    $scope.currentButtonIndex = index;
                    $scope.currentButton = $scope.buttons[$scope.currentButtonIndex];
                    $scope.currentButtonValue = $scope.currentButton.id === undefined ? index : $scope.currentButton.id;
                    $timeout(function () {
                        if ($scope.change) {
                            $scope.change();
                        }
                    });
                };
                $scope.enterSpacePress = function (event) {
                    $scope.buttonSelected(event.index);
                };
                $scope.disabled = function () {
                    if ($scope.ngDisabled) {
                        return $scope.ngDisabled();
                    }
                };
                $scope.highlightButton = function (index) {
                    if ($scope.multiselect && $scope.currentButton.level !== undefined && $scope.buttons[index].level !== undefined) {
                        return $scope.currentButton.level >= $scope.buttons[index].level;
                    }
                    else {
                        return $scope.currentButtonIndex == index;
                    }
                };
            }],
            link: function (scope, elem) {
                elem
                    .on('focusin', function () {
                    elem.addClass('focused-container');
                })
                    .on('focusout', function () {
                    elem.removeClass('focused-container');
                });
            }
        };
    });
})();
},{}],6:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipButtons.Templates');
} catch (e) {
  module = angular.module('pipButtons.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('toggle_buttons/toggle_buttons.html',
    '<div class="pip-toggle-buttons layout-row {{class}}" pip-selected="bufButtonIndex" pip-enter-space-press="enterSpacePress($event)" ng-if="$mdMedia(\'gt-xs\') || onlyToggle"><md-button tabindex="-1" ng-repeat="button in buttons" ng-class="{\'md-accent md-raised selected color-accent-bg\' : highlightButton($index)}" ng-attr-style="{{ \'background-color:\' + (highlightButton($index) ? button.backgroundColor : \'\') + \'!important\' }}" class="pip-selectable pip-chip-button flex" ng-click="buttonSelected($index, $event)" ng-disabled="button.disabled || disabled()">{{button.name || button.title | translate}} <span ng-if="button.checked || button.complete || button.filled" class="pip-tagged">*</span></md-button></div><md-input-container class="md-block" ng-if="$mdMedia(\'xs\') && !onlyToggle"><md-select ng-model="currentButtonIndex" ng-disabled="disabled()" aria-label="DROPDOWN" md-on-close="buttonSelected(currentButtonIndex)"><md-option ng-repeat="action in buttons" value="{{ ::$index }}">{{ (action.title || action.name) | translate }} <span ng-if="action.checked || action.complete || action.filled" class="pip-tagged">*</span></md-option></md-select></md-input-container>');
}]);
})();



},{}]},{},[6,1,2,3,4,5])(6)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYnV0dG9ucy50cyIsInNyYy9kZXBlbmRlbmNpZXMvdHJhbnNsYXRlLnRzIiwic3JjL2ZhYnMvZmFiX3Rvb2x0aXBfdmlzaWJpbGl0eS50cyIsInNyYy9yZWZyZXNoX2J1dHRvbi9yZWZyZXNoX2J1dHRvbi50cyIsInNyYy90b2dnbGVfYnV0dG9ucy90b2dnbGVfYnV0dG9ucy50cyIsInRlbXAvcGlwLXdlYnVpLWJ1dHRvbnMtaHRtbC5taW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNFQSxDQUFDO0lBQ0csWUFBWSxDQUFDO0lBRWIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7UUFDekIsa0JBQWtCO1FBQ2xCLGtCQUFrQjtRQUNsQix5QkFBeUI7S0FDNUIsQ0FBQyxDQUFDO0FBRVAsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7QUNUTCxDQUFDO0lBQ0csWUFBWSxDQUFDO0lBRWIsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUU1RCxVQUFVLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxVQUFVLFNBQVM7UUFDOUMsSUFBSSxZQUFZLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUM7Y0FDMUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFM0MsTUFBTSxDQUFDLFVBQVUsR0FBRztZQUNoQixNQUFNLENBQUMsWUFBWSxHQUFJLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNwRSxDQUFDLENBQUE7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUVQLENBQUMsQ0FBQyxFQUFFLENBQUM7O0FDZEw7SUFLSSx3Q0FDSSxRQUFhLEVBQ2IsTUFBMkIsRUFDM0IsTUFBc0IsRUFDdEIsUUFB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Y2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCLvu78vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdwaXBCdXR0b25zJywgW1xyXG4gICAgICAgICdwaXBUb2dnbGVCdXR0b25zJyxcclxuICAgICAgICAncGlwUmVmcmVzaEJ1dHRvbicsXHJcbiAgICAgICAgJ3BpcEZhYlRvb2x0aXBWaXNpYmlsaXR5J1xyXG4gICAgXSk7XHJcblxyXG59KSgpO1xyXG5cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgdGhpc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBCdXR0b25zLlRyYW5zbGF0ZScsIFtdKTtcclxuXHJcbiAgICB0aGlzTW9kdWxlLmZpbHRlcigndHJhbnNsYXRlJywgZnVuY3Rpb24gKCRpbmplY3Rvcikge1xyXG4gICAgICAgIHZhciBwaXBUcmFuc2xhdGUgPSAkaW5qZWN0b3IuaGFzKCdwaXBUcmFuc2xhdGUnKSBcclxuICAgICAgICAgICAgPyAkaW5qZWN0b3IuZ2V0KCdwaXBUcmFuc2xhdGUnKSA6IG51bGw7XHJcblxyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwaXBUcmFuc2xhdGUgID8gcGlwVHJhbnNsYXRlLnRyYW5zbGF0ZShrZXkpIHx8IGtleSA6IGtleTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbn0pKCk7XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbmNsYXNzIEZhYlRvb2x0aXBWaXNpYmlsaXR5Q29udHJvbGxlciB7XHJcbiAgICBwcml2YXRlIF9lbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBfc2NvcGU6IGFuZ3VsYXIuSVNjb3BlO1xyXG4gICAgcHJpdmF0ZSBfdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICRlbGVtZW50OiBhbnksXHJcbiAgICAgICAgJGF0dHJzOiBhbmd1bGFyLklBdHRyaWJ1dGVzLFxyXG4gICAgICAgICRzY29wZTogYW5ndWxhci5JU2NvcGUsXHJcbiAgICAgICAgJHRpbWVvdXQ6IG5nLklUaW1lb3V0U2VydmljZSxcclxuICAgICAgICAkcGFyc2VcclxuICAgICkge1xyXG4gICAgICAgIFwibmdJbmplY3RcIjtcclxuICAgICAgICBsZXQgdHJpZ0dldHRlciA9ICRwYXJzZSgkYXR0cnNbJ3BpcEZhYlRvb2x0aXBWaXNpYmlsaXR5J10pLFxyXG4gICAgICAgICAgICBzaG93R2V0dGVyID0gJHBhcnNlKCRhdHRyc1sncGlwRmFiU2hvd1Rvb2x0aXAnXSksXHJcbiAgICAgICAgICAgIHNob3dTZXR0ZXIgPSBzaG93R2V0dGVyLmFzc2lnbjtcclxuXHJcbiAgICAgICAgJHNjb3BlLiR3YXRjaCh0cmlnR2V0dGVyLCAoaXNPcGVuKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghXy5pc0Z1bmN0aW9uKHNob3dTZXR0ZXIpKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBpZiAoaXNPcGVuKSB7XHJcbiAgICAgICAgICAgICAgICAkdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd1NldHRlcigkc2NvcGUsIGlzT3Blbik7XHJcbiAgICAgICAgICAgICAgICB9LCA2MDApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2hvd1NldHRlcigkc2NvcGUsIGlzT3Blbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuKCgpID0+IHtcclxuICAgIGZ1bmN0aW9uIHBpcEZhYlRvb2x0aXBWaXNpYmlsaXR5KCRwYXJzZSwgJHRpbWVvdXQpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgICAgICBzY29wZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IEZhYlRvb2x0aXBWaXNpYmlsaXR5Q29udHJvbGxlclxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcEZhYlRvb2x0aXBWaXNpYmlsaXR5JywgW10pXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgncGlwRmFiVG9vbHRpcFZpc2liaWxpdHknLCBwaXBGYWJUb29sdGlwVmlzaWJpbGl0eSk7XHJcblxyXG59KSgpOyIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHRoaXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwUmVmcmVzaEJ1dHRvbicsIFsnbmdNYXRlcmlhbCddKTtcclxuXHJcbiAgICB0aGlzTW9kdWxlLmRpcmVjdGl2ZSgncGlwUmVmcmVzaEJ1dHRvbicsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRwYXJzZSkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgICAgICAgICBzY29wZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogU3RyaW5nKCkgK1xyXG4gICAgICAgICAgICAgICAgJzxtZC1idXR0b24gY2xhc3M9XCJwaXAtcmVmcmVzaC1idXR0b25cIiB0YWJpbmRleD1cIi0xXCIgbmctY2xpY2s9XCJvbkNsaWNrKCRldmVudClcIiBhcmlhLWxhYmVsPVwiUkVGUkVTSFwiPicgK1xyXG4gICAgICAgICAgICAgICAgJzxtZC1pY29uIG1kLXN2Zy1pY29uPVwiaWNvbnM6cmVmcmVzaFwiPjwvbWQtaWNvbj4nICtcclxuICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cInBpcC1yZWZyZXNoLXRleHRcIj48L3NwYW4+JyArXHJcbiAgICAgICAgICAgICAgICAnPC9tZC1idXR0b24+JyxcclxuICAgICAgICAgICAgICAgIHJlcGxhY2U6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKCRzY29wZSwgJGVsZW1lbnQsICRhdHRyczogYW55KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdpZHRoLCB0ZXh0LCBzaG93LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0R2V0dGVyID0gJHBhcnNlKCRhdHRycy5waXBUZXh0KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJsZUdldHRlciA9ICRwYXJzZSgkYXR0cnMucGlwVmlzaWJsZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZnJlc2hHZXR0ZXIgPSAkcGFyc2UoJGF0dHJzLnBpcFJlZnJlc2gpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkYnV0dG9uID0gJGVsZW1lbnQuY2hpbGRyZW4oJy5tZC1idXR0b24nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHRleHQgPSAkYnV0dG9uLmNoaWxkcmVuKCcucGlwLXJlZnJlc2gtdGV4dCcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzaG93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTZXQgYSBuZXcgdGV4dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gdGV4dEdldHRlcigkc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGV4dC50ZXh0KHRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2hvdyBidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgJGJ1dHRvbi5zaG93KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBZGp1c3QgcG9zaXRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGggPSAkYnV0dG9uLndpZHRoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRidXR0b24uY3NzKCdtYXJnaW4tbGVmdCcsICctJyArIHdpZHRoIC8gMiArICdweCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGhpZGUoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRidXR0b24uaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+JHNjb3BlKS5vbkNsaWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWZyZXNoR2V0dGVyKCRzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCh2aXNpYmxlR2V0dGVyLCBmdW5jdGlvbiAobmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCh0ZXh0R2V0dGVyLCBmdW5jdGlvbiAobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGV4dC50ZXh0KG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICApO1xyXG5cclxufSkoKTsiLCIvLyAvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4vLyBjbGFzcyBUb2dnbGVCdXR0b25zQ29udHJvbGxlciB7XHJcbi8vICAgICBwcml2YXRlIF9lbGVtZW50O1xyXG4vLyAgICAgcHJpdmF0ZSBfc2NvcGU6IGFuZ3VsYXIuSVNjb3BlO1xyXG4vLyAgICAgcHJpdmF0ZSBfdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlO1xyXG5cclxuLy8gICAgIHB1YmxpYyAkbWRNZWRpYTogYW5ndWxhci5tYXRlcmlhbC5JTWVkaWE7XHJcbi8vICAgICBwdWJsaWMgY2xhc3M6IHN0cmluZztcclxuLy8gICAgIHB1YmxpYyBtdWx0aXNlbGVjdDogYm9vbGVhbjtcclxuLy8gICAgIHB1YmxpYyBidXR0b25zO1xyXG4vLyAgICAgcHVibGljIGN1cnJlbnRCdXR0b25WYWx1ZTtcclxuLy8gICAgIHB1YmxpYyBjdXJyZW50QnV0dG9uSW5kZXg6IG51bWJlcjtcclxuLy8gICAgIHB1YmxpYyBjdXJyZW50QnV0dG9uO1xyXG4vLyAgICAgcHVibGljIGJ1dHRvblNlbGVjdGVkO1xyXG4vLyAgICAgcHVibGljIGRpc2FibGVkO1xyXG4vLyAgICAgcHVibGljIGVudGVyU3BhY2VQcmVzczogRnVuY3Rpb247XHJcbi8vICAgICBwdWJsaWMgbmdEaXNhYmxlZDogRnVuY3Rpb247XHJcbi8vICAgICBwdWJsaWMgaGlnaGxpZ2h0QnV0dG9uO1xyXG4vLyAgICAgcHVibGljIGNoYW5nZTogRnVuY3Rpb247XHJcbi8vICAgICBwdWJsaWMgb25seVRvZ2dsZTogYm9vbGVhbjtcclxuICAgIFxyXG4vLyAgICAgY29uc3RydWN0b3IoXHJcbi8vICAgICAgICAgJG1kTWVkaWE6IGFuZ3VsYXIubWF0ZXJpYWwuSU1lZGlhLFxyXG4vLyAgICAgICAgICRlbGVtZW50OiBhbnksXHJcbi8vICAgICAgICAgJGF0dHJzOiBhbmd1bGFyLklBdHRyaWJ1dGVzLFxyXG4vLyAgICAgICAgICRzY29wZTogYW5ndWxhci5JU2NvcGUsXHJcbi8vICAgICAgICAgJHRpbWVvdXQ6IG5nLklUaW1lb3V0U2VydmljZVxyXG4vLyAgICAgKSB7XHJcbi8vICAgICAgICAgXCJuZ0luamVjdFwiO1xyXG4vLyAgICAgICAgICB0aGlzLiRtZE1lZGlhID0gJG1kTWVkaWE7XHJcbi8vICAgICAgICAgIHRoaXMuY2xhc3MgPSAkYXR0cnNbJ2NsYXNzJ10gfHwgJyc7XHJcbi8vICAgICAgICAgIHRoaXMubXVsdGlzZWxlY3QgPSAkc2NvcGVbJ211bHRpc2VsZWN0J10gfHwgZmFsc2U7XHJcbi8vICAgICAgICAgIHRoaXMubmdEaXNhYmxlZCA9ICRzY29wZVsnbmdEaXNhYmxlZCddO1xyXG4vLyAgICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b25WYWx1ZSA9ICRzY29wZVsnY3VycmVudEJ1dHRvblZhbHVlJ107XHJcbi8vICAgICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbiA9ICRzY29wZVsnY3VycmVudEJ1dHRvbiddO1xyXG4vLyAgICAgICAgICB0aGlzLmNoYW5nZSA9ICRzY29wZVsnY2hhbmdlJ107XHJcbi8vICAgICAgICAgIHRoaXMub25seVRvZ2dsZSA9ICRzY29wZVsnb25seVRvZ2dsZSddO1xyXG5cclxuLy8gICAgICAgICAgdGhpcy5idXR0b25zID0gISRzY29wZVsnYnV0dG9ucyddIHx8IF8uaXNBcnJheSgkc2NvcGVbJ2J1dHRvbnMnXSkgJiYgJHNjb3BlWydidXR0b25zJ10ubGVuZ3RoID09PSAwID8gXHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIFtdIDogJHNjb3BlWydidXR0b25zJ107XHJcbiAgICAgICAgIFxyXG4vLyAgICAgICAgIGxldCBpbmRleCA9IF8uaW5kZXhPZih0aGlzLmJ1dHRvbnMsIF8uZmluZCh0aGlzLmJ1dHRvbnMsIHtpZDogdGhpcy5jdXJyZW50QnV0dG9uVmFsdWV9KSk7XHJcbi8vICAgICAgICAgdGhpcy5jdXJyZW50QnV0dG9uSW5kZXggPSBpbmRleCA8IDAgPyAwIDogaW5kZXg7XHJcbi8vICAgICAgICAgdGhpcy5jdXJyZW50QnV0dG9uID0gdGhpcy5idXR0b25zLmxlbmd0aCA+IDAgPyB0aGlzLmJ1dHRvbnNbdGhpcy5jdXJyZW50QnV0dG9uSW5kZXhdIDogdGhpcy5jdXJyZW50QnV0dG9uO1xyXG4gICAgICAgXHJcbi8vICAgICAgICAgdGhpcy5idXR0b25TZWxlY3RlZCA9IChpbmRleCkgPT4ge1xyXG4vLyAgICAgICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCgpKSB7IHJldHVybjsgfVxyXG4vLyAgICAgICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b25JbmRleCA9IGluZGV4O1xyXG4vLyAgICAgICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b24gPSB0aGlzLmJ1dHRvbnNbdGhpcy5jdXJyZW50QnV0dG9uSW5kZXhdO1xyXG4vLyAgICAgICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b25WYWx1ZSA9IHRoaXMuY3VycmVudEJ1dHRvbi5pZCB8fCBpbmRleDtcclxuXHJcbi8vICAgICAgICAgICAgICR0aW1lb3V0KCAoKSA9PiB7XHJcbi8vICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGFuZ2UpIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZSgpO1xyXG4vLyAgICAgICAgICAgICAgICAgfSB9KTtcclxuLy8gICAgICAgICB9O1xyXG5cclxuLy8gICAgICAgICB0aGlzLmVudGVyU3BhY2VQcmVzcyA9IChldmVudCkgPT4ge1xyXG4vLyAgICAgICAgICAgICAgdGhpcy5idXR0b25TZWxlY3RlZChldmVudC5pbmRleCk7XHJcbi8vICAgICAgICAgfTtcclxuXHJcbi8vICAgICAgICAgdGhpcy5kaXNhYmxlZCA9ICgpID0+IHtcclxuLy8gICAgICAgICAgICAgaWYgKHRoaXMubmdEaXNhYmxlZCkgeyBcclxuLy8gICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm5nRGlzYWJsZWQoKTsgXHJcbi8vICAgICAgICAgICAgIH1cclxuLy8gICAgICAgICB9O1xyXG5cclxuLy8gICAgICAgICB0aGlzLmhpZ2hsaWdodEJ1dHRvbiA9IChpbmRleCkgPT4ge1xyXG4vLyAgICAgICAgICAgICBpZiAodGhpcy5tdWx0aXNlbGVjdCAmJiBcclxuLy8gICAgICAgICAgICAgICAgICFfLmlzVW5kZWZpbmVkKHRoaXMuY3VycmVudEJ1dHRvbi5sZXZlbCkgJiYgXHJcbi8vICAgICAgICAgICAgICAgICAhXy5pc1VuZGVmaW5lZCh0aGlzLmJ1dHRvbnNbaW5kZXhdLmxldmVsKSkge1xyXG5cclxuLy8gICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRCdXR0b24ubGV2ZWwgPj0gdGhpcy5idXR0b25zW2luZGV4XS5sZXZlbDtcclxuLy8gICAgICAgICAgICAgfSBcclxuXHJcbi8vICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRCdXR0b25JbmRleCA9PSBpbmRleDtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICB9XHJcblxyXG5cclxuLy8gfVxyXG5cclxuLy8gKCgpID0+IHtcclxuLy8gICAgIGZ1bmN0aW9uIFRvZ2dsZUJ1dHRvbnNEaXJlY3RpdmUoKSB7XHJcbi8vICAgICAgICAgcmV0dXJuIHtcclxuLy8gICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbi8vICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFRvZ2dsZUJ1dHRvbnNDb250cm9sbGVyLFxyXG4vLyAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd0b2dnbGUnLFxyXG4vLyAgICAgICAgICAgICBzY29wZToge1xyXG4vLyAgICAgICAgICAgICAgICAgbmdEaXNhYmxlZDogJyYnLFxyXG4vLyAgICAgICAgICAgICAgICAgYnV0dG9uczogJz1waXBCdXR0b25zJyxcclxuLy8gICAgICAgICAgICAgICAgIGN1cnJlbnRCdXR0b25WYWx1ZTogJz1uZ01vZGVsJyxcclxuLy8gICAgICAgICAgICAgICAgIGN1cnJlbnRCdXR0b246ICc9P3BpcEJ1dHRvbk9iamVjdCcsXHJcbi8vICAgICAgICAgICAgICAgICBtdWx0aXNlbGVjdDogJz0/cGlwTXVsdGlzZWxlY3QnLFxyXG4vLyAgICAgICAgICAgICAgICAgY2hhbmdlOiAnJm5nQ2hhbmdlJyxcclxuLy8gICAgICAgICAgICAgICAgIG9ubHlUb2dnbGU6ICc9P3BpcE9ubHlUb2dnbGUnXHJcbi8vICAgICAgICAgICAgIH0sXHJcbi8vICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbSkge1xyXG4vLyAgICAgICAgICAgICAgICAgZWxlbVxyXG4vLyAgICAgICAgICAgICAgICAgICAgIC5vbignZm9jdXNpbicsIGZ1bmN0aW9uICgpIHtcclxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgZWxlbS5hZGRDbGFzcygnZm9jdXNlZC1jb250YWluZXInKTtcclxuLy8gICAgICAgICAgICAgICAgICAgICB9KVxyXG4vLyAgICAgICAgICAgICAgICAgICAgIC5vbignZm9jdXNvdXQnLCBmdW5jdGlvbiAoKSB7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW0ucmVtb3ZlQ2xhc3MoJ2ZvY3VzZWQtY29udGFpbmVyJyk7XHJcbi8vICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbi8vICAgICAgICAgICAgIH0sXHJcbi8vICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndG9nZ2xlX2J1dHRvbnMvdG9nZ2xlX2J1dHRvbnMuaHRtbCdcclxuLy8gICAgICAgICB9O1xyXG4vLyAgICAgfVxyXG5cclxuLy8gICAgIGFuZ3VsYXJcclxuLy8gICAgICAgICAubW9kdWxlKCdwaXBUb2dnbGVCdXR0b25zJywgWydwaXBCdXR0b25zLlRlbXBsYXRlcyddKVxyXG4vLyAgICAgICAgIC5kaXJlY3RpdmUoJ3BpcFRvZ2dsZUJ1dHRvbnMnLCBUb2dnbGVCdXR0b25zRGlyZWN0aXZlKTtcclxuXHJcbi8vIH0pKCk7XHJcblxyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgdGhpc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBUb2dnbGVCdXR0b25zJywgWydwaXBCdXR0b25zLlRlbXBsYXRlcyddKTtcclxuXHJcbiAgICB0aGlzTW9kdWxlLmRpcmVjdGl2ZSgncGlwVG9nZ2xlQnV0dG9ucycsXHJcbiAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgICAgICAgICBzY29wZToge1xyXG4gICAgICAgICAgICAgICAgICAgIG5nRGlzYWJsZWQ6ICcmJyxcclxuICAgICAgICAgICAgICAgICAgICBidXR0b25zOiAnPXBpcEJ1dHRvbnMnLFxyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRCdXR0b25WYWx1ZTogJz1uZ01vZGVsJyxcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50QnV0dG9uOiAnPT9waXBCdXR0b25PYmplY3QnLFxyXG4gICAgICAgICAgICAgICAgICAgIG11bHRpc2VsZWN0OiAnPT9waXBNdWx0aXNlbGVjdCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlOiAnJm5nQ2hhbmdlJyxcclxuICAgICAgICAgICAgICAgICAgICBvbmx5VG9nZ2xlOiAnPT9waXBPbmx5VG9nZ2xlJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndG9nZ2xlX2J1dHRvbnMvdG9nZ2xlX2J1dHRvbnMuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICRtZE1lZGlhLCAkdGltZW91dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbmRleDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRtZE1lZGlhID0gJG1kTWVkaWE7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsYXNzID0gJGF0dHJzLmNsYXNzIHx8ICcnO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5tdWx0aXNlbGVjdCA9ICRzY29wZS5tdWx0aXNlbGVjdCB8fCBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEkc2NvcGUuYnV0dG9ucyB8fCBfLmlzQXJyYXkoJHNjb3BlLmJ1dHRvbnMpICYmICRzY29wZS5idXR0b25zLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuYnV0dG9ucyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBfLmluZGV4T2YoJHNjb3BlLmJ1dHRvbnMsIF8uZmluZCgkc2NvcGUuYnV0dG9ucywge2lkOiAkc2NvcGUuY3VycmVudEJ1dHRvblZhbHVlfSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jdXJyZW50QnV0dG9uSW5kZXggPSBpbmRleCA8IDAgPyAwIDogaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRCdXR0b24gPSAkc2NvcGUuYnV0dG9ucy5sZW5ndGggPiAwID8gJHNjb3BlLmJ1dHRvbnNbJHNjb3BlLmN1cnJlbnRCdXR0b25JbmRleF1cclxuICAgICAgICAgICAgICAgICAgICAgICAgOiAkc2NvcGUuY3VycmVudEJ1dHRvbjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmJ1dHRvblNlbGVjdGVkID0gZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuZGlzYWJsZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmJ1dHRvbnNbaW5kZXhdLmRpc2VsZWN0YWJsZSA9PT0gdHJ1ZSAmJiBpbmRleCA9PT0gJHNjb3BlLmN1cnJlbnRCdXR0b25JbmRleCBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAmJiAkc2NvcGUuYnV0dG9uc1tpbmRleF0ubGV2ZWwgIT09IHVuZGVmaW5lZCkgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjdXJMZXZlbCA9ICRzY29wZS5idXR0b25zW2luZGV4XS5sZXZlbCwgdG1wO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyTGV2ZWwtLTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bXAgPSBfLmZpbmRJbmRleCgkc2NvcGUuYnV0dG9ucywgKGIpID0+IHsgcmV0dXJuIGJbJ2xldmVsJ10gPT09IGN1ckxldmVsOyB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gdG1wID4gLTEgPyB0bXA6IGluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY3VycmVudEJ1dHRvbkluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jdXJyZW50QnV0dG9uID0gJHNjb3BlLmJ1dHRvbnNbJHNjb3BlLmN1cnJlbnRCdXR0b25JbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jdXJyZW50QnV0dG9uVmFsdWUgPSAkc2NvcGUuY3VycmVudEJ1dHRvbi5pZCA9PT0gdW5kZWZpbmVkID8gaW5kZXg6ICRzY29wZS5jdXJyZW50QnV0dG9uLmlkO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS5jaGFuZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2hhbmdlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5lbnRlclNwYWNlUHJlc3MgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmJ1dHRvblNlbGVjdGVkKGV2ZW50LmluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGlzYWJsZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGUubmdEaXNhYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRzY29wZS5uZ0Rpc2FibGVkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuaGlnaGxpZ2h0QnV0dG9uID0gZnVuY3Rpb24gKGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGUubXVsdGlzZWxlY3QgJiYgJHNjb3BlLmN1cnJlbnRCdXR0b24ubGV2ZWwgIT09IHVuZGVmaW5lZCAmJiAkc2NvcGUuYnV0dG9uc1tpbmRleF0ubGV2ZWwgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHNjb3BlLmN1cnJlbnRCdXR0b24ubGV2ZWwgPj0gJHNjb3BlLmJ1dHRvbnNbaW5kZXhdLmxldmVsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRzY29wZS5jdXJyZW50QnV0dG9uSW5kZXggPT0gaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAub24oJ2ZvY3VzaW4nLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtLmFkZENsYXNzKCdmb2N1c2VkLWNvbnRhaW5lcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAub24oJ2ZvY3Vzb3V0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVDbGFzcygnZm9jdXNlZC1jb250YWluZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgKTtcclxuXHJcbn0pKCk7IFxyXG5cclxuIiwiKGZ1bmN0aW9uKG1vZHVsZSkge1xudHJ5IHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcEJ1dHRvbnMuVGVtcGxhdGVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBCdXR0b25zLlRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgndG9nZ2xlX2J1dHRvbnMvdG9nZ2xlX2J1dHRvbnMuaHRtbCcsXG4gICAgJzxkaXYgY2xhc3M9XCJwaXAtdG9nZ2xlLWJ1dHRvbnMgbGF5b3V0LXJvdyB7e2NsYXNzfX1cIiBwaXAtc2VsZWN0ZWQ9XCJidWZCdXR0b25JbmRleFwiIHBpcC1lbnRlci1zcGFjZS1wcmVzcz1cImVudGVyU3BhY2VQcmVzcygkZXZlbnQpXCIgbmctaWY9XCIkbWRNZWRpYShcXCdndC14c1xcJykgfHwgb25seVRvZ2dsZVwiPjxtZC1idXR0b24gdGFiaW5kZXg9XCItMVwiIG5nLXJlcGVhdD1cImJ1dHRvbiBpbiBidXR0b25zXCIgbmctY2xhc3M9XCJ7XFwnbWQtYWNjZW50IG1kLXJhaXNlZCBzZWxlY3RlZCBjb2xvci1hY2NlbnQtYmdcXCcgOiBoaWdobGlnaHRCdXR0b24oJGluZGV4KX1cIiBuZy1hdHRyLXN0eWxlPVwie3sgXFwnYmFja2dyb3VuZC1jb2xvcjpcXCcgKyAoaGlnaGxpZ2h0QnV0dG9uKCRpbmRleCkgPyBidXR0b24uYmFja2dyb3VuZENvbG9yIDogXFwnXFwnKSArIFxcJyFpbXBvcnRhbnRcXCcgfX1cIiBjbGFzcz1cInBpcC1zZWxlY3RhYmxlIHBpcC1jaGlwLWJ1dHRvbiBmbGV4XCIgbmctY2xpY2s9XCJidXR0b25TZWxlY3RlZCgkaW5kZXgsICRldmVudClcIiBuZy1kaXNhYmxlZD1cImJ1dHRvbi5kaXNhYmxlZCB8fCBkaXNhYmxlZCgpXCI+e3tidXR0b24ubmFtZSB8fCBidXR0b24udGl0bGUgfCB0cmFuc2xhdGV9fSA8c3BhbiBuZy1pZj1cImJ1dHRvbi5jaGVja2VkIHx8IGJ1dHRvbi5jb21wbGV0ZSB8fCBidXR0b24uZmlsbGVkXCIgY2xhc3M9XCJwaXAtdGFnZ2VkXCI+Kjwvc3Bhbj48L21kLWJ1dHRvbj48L2Rpdj48bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIiBuZy1pZj1cIiRtZE1lZGlhKFxcJ3hzXFwnKSAmJiAhb25seVRvZ2dsZVwiPjxtZC1zZWxlY3QgbmctbW9kZWw9XCJjdXJyZW50QnV0dG9uSW5kZXhcIiBuZy1kaXNhYmxlZD1cImRpc2FibGVkKClcIiBhcmlhLWxhYmVsPVwiRFJPUERPV05cIiBtZC1vbi1jbG9zZT1cImJ1dHRvblNlbGVjdGVkKGN1cnJlbnRCdXR0b25JbmRleClcIj48bWQtb3B0aW9uIG5nLXJlcGVhdD1cImFjdGlvbiBpbiBidXR0b25zXCIgdmFsdWU9XCJ7eyA6OiRpbmRleCB9fVwiPnt7IChhY3Rpb24udGl0bGUgfHwgYWN0aW9uLm5hbWUpIHwgdHJhbnNsYXRlIH19IDxzcGFuIG5nLWlmPVwiYWN0aW9uLmNoZWNrZWQgfHwgYWN0aW9uLmNvbXBsZXRlIHx8IGFjdGlvbi5maWxsZWRcIiBjbGFzcz1cInBpcC10YWdnZWRcIj4qPC9zcGFuPjwvbWQtb3B0aW9uPjwvbWQtc2VsZWN0PjwvbWQtaW5wdXQtY29udGFpbmVyPicpO1xufV0pO1xufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGlwLXdlYnVpLWJ1dHRvbnMtaHRtbC5taW4uanMubWFwXG4iXX0=
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
(function () {
    'use strict';
    var thisModule = angular.module("pipFabTooltipVisibility", []);
    thisModule.directive("pipFabTooltipVisibility", ['$parse', '$timeout', function ($parse, $timeout) {
        return {
            restrict: 'A',
            scope: false,
            controller: ['$scope', '$attrs', function ($scope, $attrs) {
                var trigGetter = $parse($attrs.pipFabTooltipVisibility), showGetter = $parse($attrs.pipFabShowTooltip), showSetter = showGetter.assign;
                $scope.$watch(trigGetter, function (isOpen) {
                    if (isOpen) {
                        $timeout(function () {
                            showSetter($scope, isOpen);
                        }, 600);
                    }
                    else {
                        showSetter($scope, isOpen);
                    }
                });
            }]
        };
    }]);
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
                change: '&ngChange',
                onlyToggle: '=?pipOnlyToggle'
            },
            templateUrl: 'toggle_buttons/toggle_buttons.html',
            controller: ['$scope', '$element', '$attrs', '$mdMedia', '$timeout', function ($scope, $element, $attrs, $mdMedia, $timeout) {
                var index;
                $scope.$mdMedia = $mdMedia;
                $scope.class = $attrs.class || '';
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
                    $scope.currentButtonIndex = index;
                    $scope.currentButton = $scope.buttons[$scope.currentButtonIndex];
                    $scope.currentButtonValue = $scope.currentButton.id || index;
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
    '<div class="pip-toggle-buttons layout-row {{class}}" pip-selected="bufButtonIndex" pip-enter-space-press="enterSpacePress($event)" ng-if="$mdMedia(\'gt-xs\') || onlyToggle"><md-button tabindex="-1" ng-repeat="button in buttons" ng-class="{\'md-accent md-raised selected color-accent-bg\' : currentButtonIndex == $index}" ng-attr-style="{{ \'background-color:\' + (currentButtonIndex == $index ? button.backgroundColor : \'\') + \'!important\' }}" class="pip-selectable pip-chip-button flex" ng-click="buttonSelected($index, $event)" ng-disabled="button.disabled || disabled()">{{button.name || button.title | translate}} <span ng-if="button.checked || button.complete || button.filled" class="pip-tagged">*</span></md-button></div><md-input-container class="md-block" ng-if="$mdMedia(\'xs\') && !onlyToggle"><md-select ng-model="currentButtonIndex" ng-disabled="disabled()" aria-label="DROPDOWN" md-on-close="buttonSelected(currentButtonIndex)"><md-option ng-repeat="action in buttons" value="{{ ::$index }}">{{ (action.title || action.name) | translate }} <span ng-if="action.checked || action.complete || action.filled" class="pip-tagged">*</span></md-option></md-select></md-input-container>');
}]);
})();



},{}]},{},[6,1,2,3,4,5])(6)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYnV0dG9ucy50cyIsInNyYy9kZXBlbmRlbmNpZXMvdHJhbnNsYXRlLnRzIiwic3JjL2ZhYnMvZmFiX3Rvb2x0aXBfdmlzaWJpbGl0eS50cyIsInNyYy9yZWZyZXNoX2J1dHRvbi9yZWZyZXNoX2J1dHRvbi50cyIsInNyYy90b2dnbGVfYnV0dG9ucy90b2dnbGVfYnV0dG9ucy50cyIsInRlbXAvcGlwLXdlYnVpLWJ1dHRvbnMtaHRtbC5taW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNFQSxDQUFDO0lBQ0csWUFBWSxDQUFDO0lBRWIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7UUFDekIsa0JBQWtCO1FBQ2xCLGtCQUFrQjtRQUNsQix5QkFBeUI7S0FDNUIsQ0FBQyxDQUFDO0FBRVAsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7QUNUTCxDQUFDO0lBQ0csWUFBWSxDQUFDO0lBRWIsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUU1RCxVQUFVLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxVQUFVLFNBQVM7UUFDOUMsSUFBSSxZQUFZLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUM7Y0FDMUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFM0MsTUFBTSxDQUFDLFVBQVUsR0FBRztZQUNoQixNQUFNLENBQUMsWUFBWSxHQUFJLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNwRSxDQUFDLENBQUE7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUVQLENBQUMsQ0FBQyxFQUFFLENBQUM7O0FDZEwsQ0FBQztJQUNHLFlBQVksQ0FBQztJQUViLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FB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QUM7Z0JBRUYsTUFBTSxDQUFDLGVBQWUsR0FBRyxVQUFVLEtBQUs7b0JBQ3BDLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN2QyxDQUFDLENBQUM7Z0JBRUYsTUFBTSxDQUFDLFFBQVEsR0FBRztvQkFDZCxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQzt3QkFDcEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsQ0FBQztvQkFDL0IsQ0FBQztnQkFDTCxDQUFDLENBQUM7WUFDTixDQUFDO1lBQ0QsSUFBSSxFQUFFLFVBQVUsS0FBSyxFQUFFLElBQUk7Z0JBQ3ZCLElBQUk7cUJBQ0MsRUFBRSxDQUFDLFNBQVMsRUFBRTtvQkFDWCxJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUM7Z0JBQ3ZDLENBQUMsQ0FBQztxQkFDRCxFQUFFLENBQUMsVUFBVSxFQUFFO29CQUNaLElBQUksQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsQ0FBQztnQkFDMUMsQ0FBQyxDQUFDLENBQUM7WUFDWCxDQUFDO1NBQ0osQ0FBQztJQUNOLENBQUMsQ0FDSixDQUFDO0FBRU4sQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7QUMxRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCLvu78vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdwaXBCdXR0b25zJywgW1xyXG4gICAgICAgICdwaXBUb2dnbGVCdXR0b25zJyxcclxuICAgICAgICAncGlwUmVmcmVzaEJ1dHRvbicsXHJcbiAgICAgICAgJ3BpcEZhYlRvb2x0aXBWaXNpYmlsaXR5J1xyXG4gICAgXSk7XHJcblxyXG59KSgpO1xyXG5cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgdGhpc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBCdXR0b25zLlRyYW5zbGF0ZScsIFtdKTtcclxuXHJcbiAgICB0aGlzTW9kdWxlLmZpbHRlcigndHJhbnNsYXRlJywgZnVuY3Rpb24gKCRpbmplY3Rvcikge1xyXG4gICAgICAgIHZhciBwaXBUcmFuc2xhdGUgPSAkaW5qZWN0b3IuaGFzKCdwaXBUcmFuc2xhdGUnKSBcclxuICAgICAgICAgICAgPyAkaW5qZWN0b3IuZ2V0KCdwaXBUcmFuc2xhdGUnKSA6IG51bGw7XHJcblxyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwaXBUcmFuc2xhdGUgID8gcGlwVHJhbnNsYXRlLnRyYW5zbGF0ZShrZXkpIHx8IGtleSA6IGtleTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbn0pKCk7XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbihmdW5jdGlvbigpe1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciB0aGlzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoXCJwaXBGYWJUb29sdGlwVmlzaWJpbGl0eVwiLCBbXSk7XHJcblxyXG4gICAgdGhpc01vZHVsZS5kaXJlY3RpdmUoXCJwaXBGYWJUb29sdGlwVmlzaWJpbGl0eVwiLCBmdW5jdGlvbiAoJHBhcnNlLCAkdGltZW91dCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICAgICAgICAgIHNjb3BlOiBmYWxzZSxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24oJHNjb3BlLCAkYXR0cnMpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0cmlnR2V0dGVyID0gJHBhcnNlKCRhdHRycy5waXBGYWJUb29sdGlwVmlzaWJpbGl0eSksXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0dldHRlciA9ICRwYXJzZSgkYXR0cnMucGlwRmFiU2hvd1Rvb2x0aXApLFxyXG4gICAgICAgICAgICAgICAgICAgIHNob3dTZXR0ZXIgPSBzaG93R2V0dGVyLmFzc2lnbjtcclxuXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuJHdhdGNoKHRyaWdHZXR0ZXIsIGZ1bmN0aW9uKGlzT3Blbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc09wZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93U2V0dGVyKCRzY29wZSwgaXNPcGVuKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgNjAwKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93U2V0dGVyKCRzY29wZSwgaXNPcGVuKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbn0pKCk7XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHRoaXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwUmVmcmVzaEJ1dHRvbicsIFsnbmdNYXRlcmlhbCddKTtcclxuXHJcbiAgICB0aGlzTW9kdWxlLmRpcmVjdGl2ZSgncGlwUmVmcmVzaEJ1dHRvbicsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRwYXJzZSkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgcmVzdHJpY3Q6ICdFQScsXHJcbiAgICAgICAgICAgICAgICBzY29wZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogU3RyaW5nKCkgK1xyXG4gICAgICAgICAgICAgICAgJzxtZC1idXR0b24gY2xhc3M9XCJwaXAtcmVmcmVzaC1idXR0b25cIiB0YWJpbmRleD1cIi0xXCIgbmctY2xpY2s9XCJvbkNsaWNrKCRldmVudClcIiBhcmlhLWxhYmVsPVwiUkVGUkVTSFwiPicgK1xyXG4gICAgICAgICAgICAgICAgJzxtZC1pY29uIG1kLXN2Zy1pY29uPVwiaWNvbnM6cmVmcmVzaFwiPjwvbWQtaWNvbj4nICtcclxuICAgICAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cInBpcC1yZWZyZXNoLXRleHRcIj48L3NwYW4+JyArXHJcbiAgICAgICAgICAgICAgICAnPC9tZC1idXR0b24+JyxcclxuICAgICAgICAgICAgICAgIHJlcGxhY2U6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKCRzY29wZSwgJGVsZW1lbnQsICRhdHRyczogYW55KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdpZHRoLCB0ZXh0LCBzaG93LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0R2V0dGVyID0gJHBhcnNlKCRhdHRycy5waXBUZXh0KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJsZUdldHRlciA9ICRwYXJzZSgkYXR0cnMucGlwVmlzaWJsZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZnJlc2hHZXR0ZXIgPSAkcGFyc2UoJGF0dHJzLnBpcFJlZnJlc2gpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkYnV0dG9uID0gJGVsZW1lbnQuY2hpbGRyZW4oJy5tZC1idXR0b24nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHRleHQgPSAkYnV0dG9uLmNoaWxkcmVuKCcucGlwLXJlZnJlc2gtdGV4dCcpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzaG93ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTZXQgYSBuZXcgdGV4dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gdGV4dEdldHRlcigkc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGV4dC50ZXh0KHRleHQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU2hvdyBidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgJGJ1dHRvbi5zaG93KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBZGp1c3QgcG9zaXRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGggPSAkYnV0dG9uLndpZHRoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRidXR0b24uY3NzKCdtYXJnaW4tbGVmdCcsICctJyArIHdpZHRoIC8gMiArICdweCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGhpZGUoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRidXR0b24uaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+JHNjb3BlKS5vbkNsaWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWZyZXNoR2V0dGVyKCRzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCh2aXNpYmxlR2V0dGVyLCBmdW5jdGlvbiAobmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCh0ZXh0R2V0dGVyLCBmdW5jdGlvbiAobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGV4dC50ZXh0KG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICApO1xyXG5cclxufSkoKTtcclxuXHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHRoaXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwVG9nZ2xlQnV0dG9ucycsIFsncGlwQnV0dG9ucy5UZW1wbGF0ZXMnXSk7XHJcblxyXG4gICAgdGhpc01vZHVsZS5kaXJlY3RpdmUoJ3BpcFRvZ2dsZUJ1dHRvbnMnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBuZ0Rpc2FibGVkOiAnJicsXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogJz1waXBCdXR0b25zJyxcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50QnV0dG9uVmFsdWU6ICc9bmdNb2RlbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEJ1dHRvbjogJz0/cGlwQnV0dG9uT2JqZWN0JyxcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2U6ICcmbmdDaGFuZ2UnLFxyXG4gICAgICAgICAgICAgICAgICAgIG9ubHlUb2dnbGU6ICc9P3BpcE9ubHlUb2dnbGUnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0b2dnbGVfYnV0dG9ucy90b2dnbGVfYnV0dG9ucy5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMsICRtZE1lZGlhLCAkdGltZW91dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpbmRleDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLiRtZE1lZGlhID0gJG1kTWVkaWE7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmNsYXNzID0gJGF0dHJzLmNsYXNzIHx8ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoISRzY29wZS5idXR0b25zIHx8IF8uaXNBcnJheSgkc2NvcGUuYnV0dG9ucykgJiYgJHNjb3BlLmJ1dHRvbnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5idXR0b25zID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IF8uaW5kZXhPZigkc2NvcGUuYnV0dG9ucywgXy5maW5kKCRzY29wZS5idXR0b25zLCB7aWQ6ICRzY29wZS5jdXJyZW50QnV0dG9uVmFsdWV9KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRCdXR0b25JbmRleCA9IGluZGV4IDwgMCA/IDAgOiBpbmRleDtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY3VycmVudEJ1dHRvbiA9ICRzY29wZS5idXR0b25zLmxlbmd0aCA+IDAgPyAkc2NvcGUuYnV0dG9uc1skc2NvcGUuY3VycmVudEJ1dHRvbkluZGV4XVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6ICRzY29wZS5jdXJyZW50QnV0dG9uO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuYnV0dG9uU2VsZWN0ZWQgPSBmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS5kaXNhYmxlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jdXJyZW50QnV0dG9uSW5kZXggPSBpbmRleDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRCdXR0b24gPSAkc2NvcGUuYnV0dG9uc1skc2NvcGUuY3VycmVudEJ1dHRvbkluZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRCdXR0b25WYWx1ZSA9ICRzY29wZS5jdXJyZW50QnV0dG9uLmlkIHx8IGluZGV4O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS5jaGFuZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY2hhbmdlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5lbnRlclNwYWNlUHJlc3MgPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmJ1dHRvblNlbGVjdGVkKGV2ZW50LmluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZGlzYWJsZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkc2NvcGUubmdEaXNhYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICRzY29wZS5uZ0Rpc2FibGVkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdmb2N1c2luJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbS5hZGRDbGFzcygnZm9jdXNlZC1jb250YWluZXInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLm9uKCdmb2N1c291dCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW0ucmVtb3ZlQ2xhc3MoJ2ZvY3VzZWQtY29udGFpbmVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG59KSgpO1xyXG4iLCIoZnVuY3Rpb24obW9kdWxlKSB7XG50cnkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQnV0dG9ucy5UZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcEJ1dHRvbnMuVGVtcGxhdGVzJywgW10pO1xufVxubW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd0b2dnbGVfYnV0dG9ucy90b2dnbGVfYnV0dG9ucy5odG1sJyxcbiAgICAnPGRpdiBjbGFzcz1cInBpcC10b2dnbGUtYnV0dG9ucyBsYXlvdXQtcm93IHt7Y2xhc3N9fVwiIHBpcC1zZWxlY3RlZD1cImJ1ZkJ1dHRvbkluZGV4XCIgcGlwLWVudGVyLXNwYWNlLXByZXNzPVwiZW50ZXJTcGFjZVByZXNzKCRldmVudClcIiBuZy1pZj1cIiRtZE1lZGlhKFxcJ2d0LXhzXFwnKSB8fCBvbmx5VG9nZ2xlXCI+PG1kLWJ1dHRvbiB0YWJpbmRleD1cIi0xXCIgbmctcmVwZWF0PVwiYnV0dG9uIGluIGJ1dHRvbnNcIiBuZy1jbGFzcz1cIntcXCdtZC1hY2NlbnQgbWQtcmFpc2VkIHNlbGVjdGVkIGNvbG9yLWFjY2VudC1iZ1xcJyA6IGN1cnJlbnRCdXR0b25JbmRleCA9PSAkaW5kZXh9XCIgbmctYXR0ci1zdHlsZT1cInt7IFxcJ2JhY2tncm91bmQtY29sb3I6XFwnICsgKGN1cnJlbnRCdXR0b25JbmRleCA9PSAkaW5kZXggPyBidXR0b24uYmFja2dyb3VuZENvbG9yIDogXFwnXFwnKSArIFxcJyFpbXBvcnRhbnRcXCcgfX1cIiBjbGFzcz1cInBpcC1zZWxlY3RhYmxlIHBpcC1jaGlwLWJ1dHRvbiBmbGV4XCIgbmctY2xpY2s9XCJidXR0b25TZWxlY3RlZCgkaW5kZXgsICRldmVudClcIiBuZy1kaXNhYmxlZD1cImJ1dHRvbi5kaXNhYmxlZCB8fCBkaXNhYmxlZCgpXCI+e3tidXR0b24ubmFtZSB8fCBidXR0b24udGl0bGUgfCB0cmFuc2xhdGV9fSA8c3BhbiBuZy1pZj1cImJ1dHRvbi5jaGVja2VkIHx8IGJ1dHRvbi5jb21wbGV0ZSB8fCBidXR0b24uZmlsbGVkXCIgY2xhc3M9XCJwaXAtdGFnZ2VkXCI+Kjwvc3Bhbj48L21kLWJ1dHRvbj48L2Rpdj48bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIiBuZy1pZj1cIiRtZE1lZGlhKFxcJ3hzXFwnKSAmJiAhb25seVRvZ2dsZVwiPjxtZC1zZWxlY3QgbmctbW9kZWw9XCJjdXJyZW50QnV0dG9uSW5kZXhcIiBuZy1kaXNhYmxlZD1cImRpc2FibGVkKClcIiBhcmlhLWxhYmVsPVwiRFJPUERPV05cIiBtZC1vbi1jbG9zZT1cImJ1dHRvblNlbGVjdGVkKGN1cnJlbnRCdXR0b25JbmRleClcIj48bWQtb3B0aW9uIG5nLXJlcGVhdD1cImFjdGlvbiBpbiBidXR0b25zXCIgdmFsdWU9XCJ7eyA6OiRpbmRleCB9fVwiPnt7IChhY3Rpb24udGl0bGUgfHwgYWN0aW9uLm5hbWUpIHwgdHJhbnNsYXRlIH19IDxzcGFuIG5nLWlmPVwiYWN0aW9uLmNoZWNrZWQgfHwgYWN0aW9uLmNvbXBsZXRlIHx8IGFjdGlvbi5maWxsZWRcIiBjbGFzcz1cInBpcC10YWdnZWRcIj4qPC9zcGFuPjwvbWQtb3B0aW9uPjwvbWQtc2VsZWN0PjwvbWQtaW5wdXQtY29udGFpbmVyPicpO1xufV0pO1xufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGlwLXdlYnVpLWJ1dHRvbnMtaHRtbC5taW4uanMubWFwXG4iXX0=
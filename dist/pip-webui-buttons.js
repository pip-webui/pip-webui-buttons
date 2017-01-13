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
    FabTooltipVisibilityController.$inject = ['$mdMedia', '$element', '$attrs', '$scope', '$timeout', '$parse'];
    function FabTooltipVisibilityController($mdMedia, $element, $attrs, $scope, $timeout, $parse) {
        "ngInject";
        var trigGetter = $parse($attrs['pipFabTooltipVisibility']), showGetter = $parse(['pipFabShowTooltip']), showSetter = showGetter.assign;
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
var ToggleButtonsController = (function () {
    ToggleButtonsController.$inject = ['$mdMedia', '$element', '$attrs', '$scope', '$timeout'];
    function ToggleButtonsController($mdMedia, $element, $attrs, $scope, $timeout) {
        "ngInject";
        var _this = this;
        this.$mdMedia = $mdMedia;
        this.class = $attrs['class'] || '';
        this.multiselect = $scope['multiselect'] || false;
        this.ngDisabled = $scope['ngDisabled'];
        this.currentButtonValue = $scope['currentButtonValue'];
        this.currentButton = $scope['currentButton'];
        this.change = $scope['change'];
        this.onlyToggle = $scope['onlyToggle'];
        this.buttons = !$scope['buttons'] || _.isArray($scope['buttons']) && $scope['buttons'].length === 0 ?
            [] : $scope['buttons'];
        var index = _.indexOf(this.buttons, _.find(this.buttons, { id: this.currentButtonValue }));
        this.currentButtonIndex = index < 0 ? 0 : index;
        this.currentButton = this.buttons.length > 0 ? this.buttons[this.currentButtonIndex] : this.currentButton;
        this.buttonSelected = function (index) {
            if (_this.disabled()) {
                return;
            }
            _this.currentButtonIndex = index;
            _this.currentButton = _this.buttons[_this.currentButtonIndex];
            _this.currentButtonValue = _this.currentButton.id || index;
            $timeout(function () {
                if (_this.change) {
                    _this.change();
                }
            });
        };
        this.enterSpacePress = function (event) {
            _this.buttonSelected(event.index);
        };
        this.disabled = function () {
            if (_this.ngDisabled) {
                return _this.ngDisabled();
            }
        };
        this.highlightButton = function (index) {
            if (_this.multiselect &&
                !_.isUndefined(_this.currentButton.level) &&
                !_.isUndefined(_this.buttons[index].level)) {
                return _this.currentButton.level >= _this.buttons[index].level;
            }
            return _this.currentButtonIndex == index;
        };
    }
    return ToggleButtonsController;
}());
(function () {
    function ToggleButtonsDirective() {
        return {
            restrict: 'EA',
            controller: ToggleButtonsController,
            controllerAs: 'toggle',
            scope: {
                ngDisabled: '&',
                buttons: '=pipButtons',
                currentButtonValue: '=ngModel',
                currentButton: '=?pipButtonObject',
                multiselect: '=?pipMultiselect',
                change: '&ngChange',
                onlyToggle: '=?pipOnlyToggle'
            },
            link: function (scope, elem) {
                elem
                    .on('focusin', function () {
                    elem.addClass('focused-container');
                })
                    .on('focusout', function () {
                    elem.removeClass('focused-container');
                });
            },
            templateUrl: 'toggle_buttons/toggle_buttons.html'
        };
    }
    angular
        .module('pipToggleButtons', ['pipButtons.Templates'])
        .directive('pipToggleButtons', ToggleButtonsDirective);
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
    '<div class="pip-toggle-buttons layout-row {{toggle.class}}" pip-selected="toggle.bufButtonIndex" pip-enter-space-press="toggle.enterSpacePress($event)" ng-if="!toggle.$mdMedia(\'xs\') || toggle.onlyToggle"><md-button tabindex="-1" ng-repeat="button in toggle.buttons" ng-class="{\'md-accent md-raised selected color-accent-bg\' : toggle.highlightButton($index)}" ng-attr-style="{{ \'background-color:\' + (toggle.highlightButton($index) ? toggle.button.backgroundColor : \'\') + \'!important\' }}" class="pip-selectable pip-chip-button flex" ng-click="toggle.buttonSelected($index, $event)" ng-disabled="button.disabled || toggle.disabled()">{{button.name || button.title | translate}} <span ng-if="button.checked || button.complete || button.filled" class="pip-tagged">*</span></md-button></div><md-input-container class="md-block" ng-if="toggle.$mdMedia(\'xs\') && !toggle.onlyToggle"><md-select ng-model="toggle.currentButtonIndex" ng-disabled="toggle.disabled()" aria-label="DROPDOWN" md-on-close="toggle.buttonSelected(toggle.currentButtonIndex)"><md-option ng-repeat="action in toggle.buttons" value="{{ ::$index }}">{{ (action.title || action.name) | translate }} <span ng-if="action.checked || action.complete || action.filled" class="pip-tagged">*</span></md-option></md-select></md-input-container>');
}]);
})();



},{}]},{},[6,1,2,3,4,5])(6)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYnV0dG9ucy50cyIsInNyYy9kZXBlbmRlbmNpZXMvdHJhbnNsYXRlLnRzIiwic3JjL2ZhYnMvZmFiX3Rvb2x0aXBfdmlzaWJpbGl0eS50cyIsInNyYy9yZWZyZXNoX2J1dHRvbi9yZWZyZXNoX2J1dHRvbi50cyIsInNyYy90b2dnbGVfYnV0dG9ucy90b2dnbGVfYnV0dG9ucy50cyIsInRlbXAvcGlwLXdlYnVpLWJ1dHRvbnMtaHRtbC5taW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNFQSxDQUFDO0lBQ0csWUFBWSxDQUFDO0lBRWIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7UUFDekIsa0JBQWtCO1FBQ2xCLGtCQUFrQjtRQUNsQix5QkFBeUI7S0FDNUIsQ0FBQyxDQUFDO0FBRVAsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7QUNUTCxDQUFDO0lBQ0csWUFBWSxDQUFDO0lBRWIsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUU1RCxVQUFVLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxVQUFVLFNBQVM7UUFDOUMsSUFBSSxZQUFZLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUM7Y0FDMUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFM0MsTUFBTSxDQUFDLFVBQVUsR0FBRztZQUNoQixNQUFNLENBQUMsWUFBWSxHQUFJLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNwRSxDQUFDLENBQUE7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUVQLENBQUMsQ0FBQyxFQUFFLENBQUM7O0FDSUw7SUFLSSx3Q0FDSSxRQUFpQyxFQUNqQyxRQUFhLEVBQ2IsTUFBMkIsRUFDM0IsTUFB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VTtnQkFDOUIsYUFBYSxFQUFFLG1CQUFtQjtnQkFDbEMsV0FBVyxFQUFFLGtCQUFrQjtnQkFDL0IsTUFBTSxFQUFFLFdBQVc7Z0JBQ25CLFVBQVUsRUFBRSxpQkFBaUI7YUFDaEM7WUFDRCxJQUFJLEVBQUUsVUFBVSxLQUFLLEVBQUUsSUFBSTtnQkFDdkIsSUFBSTtxQkFDQyxFQUFFLENBQUMsU0FBUyxFQUFFO29CQUNYLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsQ0FBQztnQkFDdkMsQ0FBQyxDQUFDO3FCQUNELEVBQUUsQ0FBQyxVQUFVLEVBQUU7b0JBQ1osSUFBSSxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUMxQyxDQUFDLENBQUMsQ0FBQztZQUNYLENBQUM7WUFDRCxXQUFXLEVBQUUsb0NBQW9DO1NBQ3BELENBQUM7SUFDTixDQUFDO0lBRUQsT0FBTztTQUNGLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLHNCQUFzQixDQUFDLENBQUM7U0FDcEQsU0FBUyxDQUFDLGtCQUFrQixFQUFFLHNCQUFzQixDQUFDLENBQUM7QUFFL0QsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7QUNuSEw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCLvu78vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdwaXBCdXR0b25zJywgW1xyXG4gICAgICAgICdwaXBUb2dnbGVCdXR0b25zJyxcclxuICAgICAgICAncGlwUmVmcmVzaEJ1dHRvbicsXHJcbiAgICAgICAgJ3BpcEZhYlRvb2x0aXBWaXNpYmlsaXR5J1xyXG4gICAgXSk7XHJcblxyXG59KSgpO1xyXG5cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgdGhpc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBCdXR0b25zLlRyYW5zbGF0ZScsIFtdKTtcclxuXHJcbiAgICB0aGlzTW9kdWxlLmZpbHRlcigndHJhbnNsYXRlJywgZnVuY3Rpb24gKCRpbmplY3Rvcikge1xyXG4gICAgICAgIHZhciBwaXBUcmFuc2xhdGUgPSAkaW5qZWN0b3IuaGFzKCdwaXBUcmFuc2xhdGUnKSBcclxuICAgICAgICAgICAgPyAkaW5qZWN0b3IuZ2V0KCdwaXBUcmFuc2xhdGUnKSA6IG51bGw7XHJcblxyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwaXBUcmFuc2xhdGUgID8gcGlwVHJhbnNsYXRlLnRyYW5zbGF0ZShrZXkpIHx8IGtleSA6IGtleTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbn0pKCk7XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuLypcclxuKGZ1bmN0aW9uKCl7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHRoaXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZShcInBpcEZhYlRvb2x0aXBWaXNpYmlsaXR5XCIsIFtdKTtcclxuXHJcbiAgICB0aGlzTW9kdWxlLmRpcmVjdGl2ZShcInBpcEZhYlRvb2x0aXBWaXNpYmlsaXR5XCIsIGZ1bmN0aW9uICgkcGFyc2UsICR0aW1lb3V0KSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICAgICAgc2NvcGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBmdW5jdGlvbigkc2NvcGUsICRhdHRycykge1xyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbn0pKCk7Ki9cclxuXHJcblxyXG5jbGFzcyBGYWJUb29sdGlwVmlzaWJpbGl0eUNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBfZWxlbWVudDtcclxuICAgIHByaXZhdGUgX3Njb3BlOiBhbmd1bGFyLklTY29wZTtcclxuICAgIHByaXZhdGUgX3RpbWVvdXQ6IG5nLklUaW1lb3V0U2VydmljZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAkbWRNZWRpYTogYW5ndWxhci5tYXRlcmlhbC5JTWVkaWEsXHJcbiAgICAgICAgJGVsZW1lbnQ6IGFueSxcclxuICAgICAgICAkYXR0cnM6IGFuZ3VsYXIuSUF0dHJpYnV0ZXMsXHJcbiAgICAgICAgJHNjb3BlOiBhbmd1bGFyLklTY29wZSxcclxuICAgICAgICAkdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlLFxyXG4gICAgICAgICRwYXJzZVxyXG4gICAgKSB7XHJcbiAgICAgICAgXCJuZ0luamVjdFwiO1xyXG4gICAgICAgICAgdmFyIHRyaWdHZXR0ZXIgPSAkcGFyc2UoJGF0dHJzWydwaXBGYWJUb29sdGlwVmlzaWJpbGl0eSddKSxcclxuICAgICAgICAgICAgICAgICAgICBzaG93R2V0dGVyID0gJHBhcnNlKFsncGlwRmFiU2hvd1Rvb2x0aXAnXSksXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd1NldHRlciA9IHNob3dHZXR0ZXIuYXNzaWduO1xyXG5cclxuICAgICAgICAgICAgICAgICRzY29wZS4kd2F0Y2godHJpZ0dldHRlciwgKGlzT3BlbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc09wZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1NldHRlcigkc2NvcGUsIGlzT3Blbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDYwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1NldHRlcigkc2NvcGUsIGlzT3Blbik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbigoKSA9PiB7XHJcbiAgICBmdW5jdGlvbiBwaXBGYWJUb29sdGlwVmlzaWJpbGl0eSgkcGFyc2UsICR0aW1lb3V0KSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICAgICAgc2NvcGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBGYWJUb29sdGlwVmlzaWJpbGl0eUNvbnRyb2xsZXJcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdwaXBGYWJUb29sdGlwVmlzaWJpbGl0eScsIFtdKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3BpcEZhYlRvb2x0aXBWaXNpYmlsaXR5JywgcGlwRmFiVG9vbHRpcFZpc2liaWxpdHkpO1xyXG5cclxufSkoKTtcclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgdGhpc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBSZWZyZXNoQnV0dG9uJywgWyduZ01hdGVyaWFsJ10pO1xyXG5cclxuICAgIHRoaXNNb2R1bGUuZGlyZWN0aXZlKCdwaXBSZWZyZXNoQnV0dG9uJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHBhcnNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICAgICAgICAgIHNjb3BlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiBTdHJpbmcoKSArXHJcbiAgICAgICAgICAgICAgICAnPG1kLWJ1dHRvbiBjbGFzcz1cInBpcC1yZWZyZXNoLWJ1dHRvblwiIHRhYmluZGV4PVwiLTFcIiBuZy1jbGljaz1cIm9uQ2xpY2soJGV2ZW50KVwiIGFyaWEtbGFiZWw9XCJSRUZSRVNIXCI+JyArXHJcbiAgICAgICAgICAgICAgICAnPG1kLWljb24gbWQtc3ZnLWljb249XCJpY29uczpyZWZyZXNoXCI+PC9tZC1pY29uPicgK1xyXG4gICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwicGlwLXJlZnJlc2gtdGV4dFwiPjwvc3Bhbj4nICtcclxuICAgICAgICAgICAgICAgICc8L21kLWJ1dHRvbj4nLFxyXG4gICAgICAgICAgICAgICAgcmVwbGFjZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgd2lkdGgsIHRleHQsIHNob3csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRHZXR0ZXIgPSAkcGFyc2UoJGF0dHJzLnBpcFRleHQpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aXNpYmxlR2V0dGVyID0gJHBhcnNlKCRhdHRycy5waXBWaXNpYmxlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVmcmVzaEdldHRlciA9ICRwYXJzZSgkYXR0cnMucGlwUmVmcmVzaCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRidXR0b24gPSAkZWxlbWVudC5jaGlsZHJlbignLm1kLWJ1dHRvbicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGV4dCA9ICRidXR0b24uY2hpbGRyZW4oJy5waXAtcmVmcmVzaC10ZXh0Jyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNob3cgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNldCBhIG5ldyB0ZXh0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgPSB0ZXh0R2V0dGVyKCRzY29wZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR0ZXh0LnRleHQodGV4dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTaG93IGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkYnV0dG9uLnNob3coKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEFkanVzdCBwb3NpdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aCA9ICRidXR0b24ud2lkdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGJ1dHRvbi5jc3MoJ21hcmdpbi1sZWZ0JywgJy0nICsgd2lkdGggLyAyICsgJ3B4Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gaGlkZSgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGJ1dHRvbi5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAoPGFueT4kc2NvcGUpLm9uQ2xpY2sgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZnJlc2hHZXR0ZXIoJHNjb3BlKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJHdhdGNoKHZpc2libGVHZXR0ZXIsIGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3coKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuJHdhdGNoKHRleHRHZXR0ZXIsIGZ1bmN0aW9uIChuZXdWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR0ZXh0LnRleHQobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICk7XHJcblxyXG59KSgpOyIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbmNsYXNzIFRvZ2dsZUJ1dHRvbnNDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgX2VsZW1lbnQ7XHJcbiAgICBwcml2YXRlIF9zY29wZTogYW5ndWxhci5JU2NvcGU7XHJcbiAgICBwcml2YXRlIF90aW1lb3V0OiBuZy5JVGltZW91dFNlcnZpY2U7XHJcblxyXG4gICAgcHVibGljICRtZE1lZGlhOiBhbmd1bGFyLm1hdGVyaWFsLklNZWRpYTtcclxuICAgIHB1YmxpYyBjbGFzczogc3RyaW5nO1xyXG4gICAgcHVibGljIG11bHRpc2VsZWN0OiBib29sZWFuO1xyXG4gICAgcHVibGljIGJ1dHRvbnM7XHJcbiAgICBwdWJsaWMgY3VycmVudEJ1dHRvblZhbHVlO1xyXG4gICAgcHVibGljIGN1cnJlbnRCdXR0b25JbmRleDogbnVtYmVyO1xyXG4gICAgcHVibGljIGN1cnJlbnRCdXR0b247XHJcbiAgICBwdWJsaWMgYnV0dG9uU2VsZWN0ZWQ7XHJcbiAgICBwdWJsaWMgZGlzYWJsZWQ7XHJcbiAgICBwdWJsaWMgZW50ZXJTcGFjZVByZXNzOiBGdW5jdGlvbjtcclxuICAgIHB1YmxpYyBuZ0Rpc2FibGVkOiBGdW5jdGlvbjtcclxuICAgIHB1YmxpYyBoaWdobGlnaHRCdXR0b247XHJcbiAgICBwdWJsaWMgY2hhbmdlOiBGdW5jdGlvbjtcclxuICAgIHB1YmxpYyBvbmx5VG9nZ2xlOiBib29sZWFuO1xyXG4gICAgXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAkbWRNZWRpYTogYW5ndWxhci5tYXRlcmlhbC5JTWVkaWEsXHJcbiAgICAgICAgJGVsZW1lbnQ6IGFueSxcclxuICAgICAgICAkYXR0cnM6IGFuZ3VsYXIuSUF0dHJpYnV0ZXMsXHJcbiAgICAgICAgJHNjb3BlOiBhbmd1bGFyLklTY29wZSxcclxuICAgICAgICAkdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlXHJcbiAgICApIHtcclxuICAgICAgICBcIm5nSW5qZWN0XCI7XHJcbiAgICAgICAgIHRoaXMuJG1kTWVkaWEgPSAkbWRNZWRpYTtcclxuICAgICAgICAgdGhpcy5jbGFzcyA9ICRhdHRyc1snY2xhc3MnXSB8fCAnJztcclxuICAgICAgICAgdGhpcy5tdWx0aXNlbGVjdCA9ICRzY29wZVsnbXVsdGlzZWxlY3QnXSB8fCBmYWxzZTtcclxuICAgICAgICAgdGhpcy5uZ0Rpc2FibGVkID0gJHNjb3BlWyduZ0Rpc2FibGVkJ107XHJcbiAgICAgICAgIHRoaXMuY3VycmVudEJ1dHRvblZhbHVlID0gJHNjb3BlWydjdXJyZW50QnV0dG9uVmFsdWUnXTtcclxuICAgICAgICAgdGhpcy5jdXJyZW50QnV0dG9uID0gJHNjb3BlWydjdXJyZW50QnV0dG9uJ107XHJcbiAgICAgICAgIHRoaXMuY2hhbmdlID0gJHNjb3BlWydjaGFuZ2UnXTtcclxuICAgICAgICAgdGhpcy5vbmx5VG9nZ2xlID0gJHNjb3BlWydvbmx5VG9nZ2xlJ107XHJcblxyXG4gICAgICAgICB0aGlzLmJ1dHRvbnMgPSAhJHNjb3BlWydidXR0b25zJ10gfHwgXy5pc0FycmF5KCRzY29wZVsnYnV0dG9ucyddKSAmJiAkc2NvcGVbJ2J1dHRvbnMnXS5sZW5ndGggPT09IDAgPyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgW10gOiAkc2NvcGVbJ2J1dHRvbnMnXTtcclxuICAgICAgICAgXHJcbiAgICAgICAgbGV0IGluZGV4ID0gXy5pbmRleE9mKHRoaXMuYnV0dG9ucywgXy5maW5kKHRoaXMuYnV0dG9ucywge2lkOiB0aGlzLmN1cnJlbnRCdXR0b25WYWx1ZX0pKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b25JbmRleCA9IGluZGV4IDwgMCA/IDAgOiBpbmRleDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b24gPSB0aGlzLmJ1dHRvbnMubGVuZ3RoID4gMCA/IHRoaXMuYnV0dG9uc1t0aGlzLmN1cnJlbnRCdXR0b25JbmRleF0gOiB0aGlzLmN1cnJlbnRCdXR0b247XHJcbiAgICAgICBcclxuICAgICAgICB0aGlzLmJ1dHRvblNlbGVjdGVkID0gKGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRpc2FibGVkKCkpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbkluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbiA9IHRoaXMuYnV0dG9uc1t0aGlzLmN1cnJlbnRCdXR0b25JbmRleF07XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEJ1dHRvblZhbHVlID0gdGhpcy5jdXJyZW50QnV0dG9uLmlkIHx8IGluZGV4O1xyXG5cclxuICAgICAgICAgICAgJHRpbWVvdXQoICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlKCk7XHJcbiAgICAgICAgICAgICAgICB9IH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZW50ZXJTcGFjZVByZXNzID0gKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICB0aGlzLmJ1dHRvblNlbGVjdGVkKGV2ZW50LmluZGV4KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmRpc2FibGVkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5uZ0Rpc2FibGVkKSB7IFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubmdEaXNhYmxlZCgpOyBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0QnV0dG9uID0gKGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm11bHRpc2VsZWN0ICYmIFxyXG4gICAgICAgICAgICAgICAgIV8uaXNVbmRlZmluZWQodGhpcy5jdXJyZW50QnV0dG9uLmxldmVsKSAmJiBcclxuICAgICAgICAgICAgICAgICFfLmlzVW5kZWZpbmVkKHRoaXMuYnV0dG9uc1tpbmRleF0ubGV2ZWwpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudEJ1dHRvbi5sZXZlbCA+PSB0aGlzLmJ1dHRvbnNbaW5kZXhdLmxldmVsO1xyXG4gICAgICAgICAgICB9IFxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudEJ1dHRvbkluZGV4ID09IGluZGV4O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG59XHJcblxyXG4oKCkgPT4ge1xyXG4gICAgZnVuY3Rpb24gVG9nZ2xlQnV0dG9uc0RpcmVjdGl2ZSgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0VBJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogVG9nZ2xlQnV0dG9uc0NvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3RvZ2dsZScsXHJcbiAgICAgICAgICAgIHNjb3BlOiB7XHJcbiAgICAgICAgICAgICAgICBuZ0Rpc2FibGVkOiAnJicsXHJcbiAgICAgICAgICAgICAgICBidXR0b25zOiAnPXBpcEJ1dHRvbnMnLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudEJ1dHRvblZhbHVlOiAnPW5nTW9kZWwnLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudEJ1dHRvbjogJz0/cGlwQnV0dG9uT2JqZWN0JyxcclxuICAgICAgICAgICAgICAgIG11bHRpc2VsZWN0OiAnPT9waXBNdWx0aXNlbGVjdCcsXHJcbiAgICAgICAgICAgICAgICBjaGFuZ2U6ICcmbmdDaGFuZ2UnLFxyXG4gICAgICAgICAgICAgICAgb25seVRvZ2dsZTogJz0/cGlwT25seVRvZ2dsZSdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtXHJcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdmb2N1c2luJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtLmFkZENsYXNzKCdmb2N1c2VkLWNvbnRhaW5lcicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLm9uKCdmb2N1c291dCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbS5yZW1vdmVDbGFzcygnZm9jdXNlZC1jb250YWluZXInKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0b2dnbGVfYnV0dG9ucy90b2dnbGVfYnV0dG9ucy5odG1sJ1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcFRvZ2dsZUJ1dHRvbnMnLCBbJ3BpcEJ1dHRvbnMuVGVtcGxhdGVzJ10pXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgncGlwVG9nZ2xlQnV0dG9ucycsIFRvZ2dsZUJ1dHRvbnNEaXJlY3RpdmUpO1xyXG5cclxufSkoKTtcclxuXHJcbi8qXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHRoaXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwVG9nZ2xlQnV0dG9ucycsIFsncGlwQnV0dG9ucy5UZW1wbGF0ZXMnXSk7XHJcblxyXG4gICAgdGhpc01vZHVsZS5kaXJlY3RpdmUoJ3BpcFRvZ2dsZUJ1dHRvbnMnLFxyXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHJlc3RyaWN0OiAnRUEnLFxyXG4gICAgICAgICAgICAgICAgc2NvcGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBuZ0Rpc2FibGVkOiAnJicsXHJcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uczogJz1waXBCdXR0b25zJyxcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50QnV0dG9uVmFsdWU6ICc9bmdNb2RlbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudEJ1dHRvbjogJz0/cGlwQnV0dG9uT2JqZWN0JyxcclxuICAgICAgICAgICAgICAgICAgICBtdWx0aXNlbGVjdDogJz0/cGlwTXVsdGlzZWxlY3QnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZTogJyZuZ0NoYW5nZScsXHJcbiAgICAgICAgICAgICAgICAgICAgb25seVRvZ2dsZTogJz0/cGlwT25seVRvZ2dsZSdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RvZ2dsZV9idXR0b25zL3RvZ2dsZV9idXR0b25zLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzLCAkbWRNZWRpYSwgJHRpbWVvdXQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS4kbWRNZWRpYSA9ICRtZE1lZGlhO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jbGFzcyA9ICRhdHRycy5jbGFzcyB8fCAnJztcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubXVsdGlzZWxlY3QgPSAkc2NvcGUubXVsdGlzZWxlY3QgfHwgZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghJHNjb3BlLmJ1dHRvbnMgfHwgXy5pc0FycmF5KCRzY29wZS5idXR0b25zKSAmJiAkc2NvcGUuYnV0dG9ucy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmJ1dHRvbnMgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gXy5pbmRleE9mKCRzY29wZS5idXR0b25zLCBfLmZpbmQoJHNjb3BlLmJ1dHRvbnMsIHtpZDogJHNjb3BlLmN1cnJlbnRCdXR0b25WYWx1ZX0pKTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY3VycmVudEJ1dHRvbkluZGV4ID0gaW5kZXggPCAwID8gMCA6IGluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jdXJyZW50QnV0dG9uID0gJHNjb3BlLmJ1dHRvbnMubGVuZ3RoID4gMCA/ICRzY29wZS5idXR0b25zWyRzY29wZS5jdXJyZW50QnV0dG9uSW5kZXhdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogJHNjb3BlLmN1cnJlbnRCdXR0b247XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5idXR0b25TZWxlY3RlZCA9IGZ1bmN0aW9uIChpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmRpc2FibGVkKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmN1cnJlbnRCdXR0b25JbmRleCA9IGluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY3VycmVudEJ1dHRvbiA9ICRzY29wZS5idXR0b25zWyRzY29wZS5jdXJyZW50QnV0dG9uSW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY3VycmVudEJ1dHRvblZhbHVlID0gJHNjb3BlLmN1cnJlbnRCdXR0b24uaWQgfHwgaW5kZXg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLmNoYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jaGFuZ2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmVudGVyU3BhY2VQcmVzcyA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuYnV0dG9uU2VsZWN0ZWQoZXZlbnQuaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5kaXNhYmxlZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS5uZ0Rpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHNjb3BlLm5nRGlzYWJsZWQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5oaWdobGlnaHRCdXR0b24gPSBmdW5jdGlvbiAoaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRzY29wZS5tdWx0aXNlbGVjdCAmJiAkc2NvcGUuY3VycmVudEJ1dHRvbi5sZXZlbCAhPT0gdW5kZWZpbmVkICYmICRzY29wZS5idXR0b25zW2luZGV4XS5sZXZlbCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAkc2NvcGUuY3VycmVudEJ1dHRvbi5sZXZlbCA+PSAkc2NvcGUuYnV0dG9uc1tpbmRleF0ubGV2ZWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gJHNjb3BlLmN1cnJlbnRCdXR0b25JbmRleCA9PSBpbmRleDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbignZm9jdXNpbicsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW0uYWRkQ2xhc3MoJ2ZvY3VzZWQtY29udGFpbmVyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5vbignZm9jdXNvdXQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtLnJlbW92ZUNsYXNzKCdmb2N1c2VkLWNvbnRhaW5lcicpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICApO1xyXG5cclxufSkoKTsgXHJcbiovXHJcbiIsIihmdW5jdGlvbihtb2R1bGUpIHtcbnRyeSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBCdXR0b25zLlRlbXBsYXRlcycpO1xufSBjYXRjaCAoZSkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQnV0dG9ucy5UZW1wbGF0ZXMnLCBbXSk7XG59XG5tb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3RvZ2dsZV9idXR0b25zL3RvZ2dsZV9idXR0b25zLmh0bWwnLFxuICAgICc8ZGl2IGNsYXNzPVwicGlwLXRvZ2dsZS1idXR0b25zIGxheW91dC1yb3cge3t0b2dnbGUuY2xhc3N9fVwiIHBpcC1zZWxlY3RlZD1cInRvZ2dsZS5idWZCdXR0b25JbmRleFwiIHBpcC1lbnRlci1zcGFjZS1wcmVzcz1cInRvZ2dsZS5lbnRlclNwYWNlUHJlc3MoJGV2ZW50KVwiIG5nLWlmPVwiIXRvZ2dsZS4kbWRNZWRpYShcXCd4c1xcJykgfHwgdG9nZ2xlLm9ubHlUb2dnbGVcIj48bWQtYnV0dG9uIHRhYmluZGV4PVwiLTFcIiBuZy1yZXBlYXQ9XCJidXR0b24gaW4gdG9nZ2xlLmJ1dHRvbnNcIiBuZy1jbGFzcz1cIntcXCdtZC1hY2NlbnQgbWQtcmFpc2VkIHNlbGVjdGVkIGNvbG9yLWFjY2VudC1iZ1xcJyA6IHRvZ2dsZS5oaWdobGlnaHRCdXR0b24oJGluZGV4KX1cIiBuZy1hdHRyLXN0eWxlPVwie3sgXFwnYmFja2dyb3VuZC1jb2xvcjpcXCcgKyAodG9nZ2xlLmhpZ2hsaWdodEJ1dHRvbigkaW5kZXgpID8gdG9nZ2xlLmJ1dHRvbi5iYWNrZ3JvdW5kQ29sb3IgOiBcXCdcXCcpICsgXFwnIWltcG9ydGFudFxcJyB9fVwiIGNsYXNzPVwicGlwLXNlbGVjdGFibGUgcGlwLWNoaXAtYnV0dG9uIGZsZXhcIiBuZy1jbGljaz1cInRvZ2dsZS5idXR0b25TZWxlY3RlZCgkaW5kZXgsICRldmVudClcIiBuZy1kaXNhYmxlZD1cImJ1dHRvbi5kaXNhYmxlZCB8fCB0b2dnbGUuZGlzYWJsZWQoKVwiPnt7YnV0dG9uLm5hbWUgfHwgYnV0dG9uLnRpdGxlIHwgdHJhbnNsYXRlfX0gPHNwYW4gbmctaWY9XCJidXR0b24uY2hlY2tlZCB8fCBidXR0b24uY29tcGxldGUgfHwgYnV0dG9uLmZpbGxlZFwiIGNsYXNzPVwicGlwLXRhZ2dlZFwiPio8L3NwYW4+PC9tZC1idXR0b24+PC9kaXY+PG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCIgbmctaWY9XCJ0b2dnbGUuJG1kTWVkaWEoXFwneHNcXCcpICYmICF0b2dnbGUub25seVRvZ2dsZVwiPjxtZC1zZWxlY3QgbmctbW9kZWw9XCJ0b2dnbGUuY3VycmVudEJ1dHRvbkluZGV4XCIgbmctZGlzYWJsZWQ9XCJ0b2dnbGUuZGlzYWJsZWQoKVwiIGFyaWEtbGFiZWw9XCJEUk9QRE9XTlwiIG1kLW9uLWNsb3NlPVwidG9nZ2xlLmJ1dHRvblNlbGVjdGVkKHRvZ2dsZS5jdXJyZW50QnV0dG9uSW5kZXgpXCI+PG1kLW9wdGlvbiBuZy1yZXBlYXQ9XCJhY3Rpb24gaW4gdG9nZ2xlLmJ1dHRvbnNcIiB2YWx1ZT1cInt7IDo6JGluZGV4IH19XCI+e3sgKGFjdGlvbi50aXRsZSB8fCBhY3Rpb24ubmFtZSkgfCB0cmFuc2xhdGUgfX0gPHNwYW4gbmctaWY9XCJhY3Rpb24uY2hlY2tlZCB8fCBhY3Rpb24uY29tcGxldGUgfHwgYWN0aW9uLmZpbGxlZFwiIGNsYXNzPVwicGlwLXRhZ2dlZFwiPio8L3NwYW4+PC9tZC1vcHRpb24+PC9tZC1zZWxlY3Q+PC9tZC1pbnB1dC1jb250YWluZXI+Jyk7XG59XSk7XG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1waXAtd2VidWktYnV0dG9ucy1odG1sLm1pbi5qcy5tYXBcbiJdfQ==
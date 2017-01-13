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

//# sourceMappingURL=pip-webui-buttons.js.map

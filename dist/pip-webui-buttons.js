(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).buttons = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
{
    translate.$inject = ['$injector'];
    function translate($injector) {
        var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        return function (key) {
            return pipTranslate ? pipTranslate['translate'](key) || key : key;
        };
    }
    angular.module('pipButtons.Translate', [])
        .filter('translate', translate);
}
},{}],2:[function(require,module,exports){
{
    pipFabTooltipVisibility.$inject = ['$parse', '$timeout'];
    var FabTooltipVisibilityController_1 = (function () {
        FabTooltipVisibilityController_1.$inject = ['$element', '$attrs', '$scope', '$timeout', '$parse'];
        function FabTooltipVisibilityController_1($element, $attrs, $scope, $timeout, $parse) {
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
        return FabTooltipVisibilityController_1;
    }());
    function pipFabTooltipVisibility($parse, $timeout) {
        return {
            restrict: 'A',
            scope: false,
            controller: FabTooltipVisibilityController_1
        };
    }
    angular
        .module('pipFabTooltipVisibility', [])
        .directive('pipFabTooltipVisibility', pipFabTooltipVisibility);
}
},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./refresh_button/RefreshButton");
require("./toggle_buttons/ToggleButtons");
require("./fabs/FabTooltipVisibility");
angular.module('pipButtons', [
    'pipToggleButtons',
    'pipRefreshButton',
    'pipFabTooltipVisibility'
]);
},{"./fabs/FabTooltipVisibility":2,"./refresh_button/RefreshButton":4,"./toggle_buttons/ToggleButtons":5}],4:[function(require,module,exports){
{
    var RefreshButtonBindings = {
        text: '<pipText',
        visible: '<pipVisible',
        onRefresh: '&?pipRefresh'
    };
    var RefreshButtonChanges = (function () {
        function RefreshButtonChanges() {
        }
        return RefreshButtonChanges;
    }());
    var RefreshButtonController = (function () {
        function RefreshButtonController($scope, $element, $attrs) {
            this.$scope = $scope;
            this.$element = $element;
            this.$attrs = $attrs;
        }
        RefreshButtonController.prototype.$postLink = function () {
            this._buttonElement = this.$element.children('.md-button');
            this._textElement = this._buttonElement.children('.pip-refresh-text');
            if (this.visible) {
                this.show();
            }
            else {
                this.hide();
            }
        };
        RefreshButtonController.prototype.$onChanges = function (changes) {
            if (changes.visible.currentValue === true) {
                this.text = changes.text.currentValue;
                this.show();
            }
            else {
                this.hide();
            }
        };
        RefreshButtonController.prototype.onClick = function ($event) {
            if (this.onRefresh) {
                this.onRefresh({
                    $event: $event
                });
            }
        };
        RefreshButtonController.prototype.show = function () {
            if (this._textElement === undefined || this._buttonElement === undefined) {
                return;
            }
            this._textElement.text(this.text);
            this._buttonElement.show();
            var width = this._buttonElement.width();
            this._buttonElement.css('margin-left', '-' + width / 2 + 'px');
        };
        RefreshButtonController.prototype.hide = function () {
            if (this._textElement === undefined || this._buttonElement === undefined) {
                return;
            }
            this._buttonElement.hide();
        };
        return RefreshButtonController;
    }());
    var RefreshButtonComponent = {
        bindings: RefreshButtonBindings,
        controller: RefreshButtonController,
        template: '<md-button class="pip-refresh-button" tabindex="-1" ng-click="$ctrl.onClick($event)" aria-label="REFRESH">' +
            '<md-icon md-svg-icon="icons:refresh"></md-icon>' +
            '<span class="pip-refresh-text"></span>' +
            '</md-button>'
    };
    angular
        .module('pipRefreshButton', ['ngMaterial'])
        .component('pipRefreshButton', RefreshButtonComponent);
}
},{}],5:[function(require,module,exports){
{
    var ToggleButton = (function () {
        function ToggleButton() {
        }
        return ToggleButton;
    }());
    var ToggleButtonsBindings = {
        ngDisabled: '<?',
        buttons: '<pipButtons',
        currentButtonValue: '=ngModel',
        currentButton: '=?pipButtonObject',
        multiselect: '<?pipMultiselect',
        change: '&ngChange',
        onlyToggle: '<?pipOnlyToggle'
    };
    var ToggleButtonsChanges = (function () {
        function ToggleButtonsChanges() {
        }
        return ToggleButtonsChanges;
    }());
    var ToggleButtonsController = (function () {
        ToggleButtonsController.$inject = ['$element', '$attrs', '$scope', '$timeout', '$injector'];
        function ToggleButtonsController($element, $attrs, $scope, $timeout, $injector) {
            "ngInject";
            this.$element = $element;
            this.$attrs = $attrs;
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.buttons = [];
            this.pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
            this.class = $attrs['class'] || '';
            var index = _.indexOf(this.buttons, _.find(this.buttons, {
                id: this.currentButtonValue
            }));
            this.currentButtonIndex = index < 0 ? 0 : index;
            this.currentButton = this.buttons.length > 0 ? this.buttons[this.currentButtonIndex] : this.currentButton;
        }
        ToggleButtonsController.prototype.$onChanges = function (changes) {
            this.multiselect = changes.multiselect ? changes.multiselect.currentValue : this.multiselect;
            this.disabled = changes.ngDisabled ? changes.ngDisabled.currentValue : this.disabled;
            this.onlyToggle = changes.onlyToggle ? changes.onlyToggle.currentValue : this.onlyToggle;
            if (changes.buttons) {
                this.buttons = _.isArray(changes.buttons.currentValue) && changes.buttons.currentValue.length === 0 ? [] : changes.buttons.currentValue;
            }
            var index = _.indexOf(this.buttons, _.find(this.buttons, {
                id: this.currentButtonValue
            }));
            this.currentButtonIndex = index < 0 ? 0 : index;
            this.currentButton = this.buttons.length > 0 ? this.buttons[this.currentButtonIndex] : this.currentButton;
        };
        ToggleButtonsController.prototype.$postLink = function () {
            var _this = this;
            this.$element
                .on('focusin', function () {
                _this.$element.addClass('focused-container');
            })
                .on('focusout', function () {
                _this.$element.removeClass('focused-container');
            });
        };
        ToggleButtonsController.prototype.buttonSelected = function (index) {
            var _this = this;
            if (this.disabled) {
                return;
            }
            this.currentButtonIndex = index;
            this.currentButton = this.buttons[this.currentButtonIndex];
            this.currentButtonValue = this.currentButton.id || index;
            this.$timeout(function () {
                if (_this.change) {
                    _this.change();
                }
            });
        };
        ToggleButtonsController.prototype.enterSpacePress = function (event) {
            this.buttonSelected(event.index);
        };
        ToggleButtonsController.prototype.highlightButton = function (index) {
            if (this.multiselect &&
                !_.isUndefined(this.currentButton.level) &&
                !_.isUndefined(this.buttons[index].level)) {
                return this.currentButton.level >= this.buttons[index].level;
            }
            return this.currentButtonIndex == index;
        };
        return ToggleButtonsController;
    }());
    var ToggleButtons = {
        bindings: ToggleButtonsBindings,
        templateUrl: 'toggle_buttons/ToggleButtons.html',
        controller: ToggleButtonsController
    };
    angular
        .module('pipToggleButtons', ['pipButtons.Templates'])
        .component('pipToggleButtons', ToggleButtons);
}
},{}],6:[function(require,module,exports){
(function(module) {
try {
  module = angular.module('pipButtons.Templates');
} catch (e) {
  module = angular.module('pipButtons.Templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('toggle_buttons/ToggleButtons.html',
    '<div class="pip-toggle-buttons layout-row {{$ctrl.class}}" \n' +
    '     pip-selected="$ctrl.bufButtonIndex" \n' +
    '     pip-enter-space-press="$ctrl.enterSpacePress($event)"\n' +
    '     ng-if="!$ctrl.pipMedia(\'xs\') || $ctrl.onlyToggle">\n' +
    '    <md-button tabindex="-1" ng-repeat="button in $ctrl.buttons"\n' +
    '               ng-class="{\'md-accent md-raised selected color-accent-bg\' : $ctrl.highlightButton($index)}"\n' +
    '               ng-attr-style="{{ \'background-color:\' + ($ctrl.highlightButton($index) ? button.backgroundColor : \'\') + \'!important\' }}"\n' +
    '               class="pip-selectable pip-chip-button flex" ng-click="$ctrl.buttonSelected($index, $event)"\n' +
    '               ng-disabled="button.disabled || $ctrl.disabled">\n' +
    '        {{button.name || button.title | translate}}\n' +
    '        <span ng-if="button.checked || button.complete || button.filled" class="pip-tagged">*</span>\n' +
    '    </md-button>\n' +
    '</div>\n' +
    '\n' +
    '<md-input-container class="md-block" ng-if="$ctrl.pipMedia(\'xs\') && !$ctrl.onlyToggle">\n' +
    '    <md-select ng-model="$ctrl.currentButtonIndex" ng-disabled="$ctrl.disabled" aria-label="DROPDOWN" \n' +
    '              md-on-close="$ctrl.buttonSelected($ctrl.currentButtonIndex)">\n' +
    '        <md-option ng-repeat="action in $ctrl.buttons" value="{{ ::$index }}">\n' +
    '            {{ (action.title || action.name) | translate }}\n' +
    '            <span ng-if="action.checked || action.complete || action.filled" class="pip-tagged">*</span>\n' +
    '        </md-option>\n' +
    '    </md-select>\n' +
    '</md-input-container>\n' +
    '');
}]);
})();



},{}]},{},[6,1,2,3,4,5])(6)
});

//# sourceMappingURL=pip-webui-buttons.js.map

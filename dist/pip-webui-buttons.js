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
            this.show();
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
            this.pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
            this.class = $attrs['class'] || '';
            var index = _.indexOf(this.buttons, _.find(this.buttons, {
                id: this.currentButtonValue
            }));
            this.currentButtonIndex = index < 0 ? 0 : index;
            this.currentButton = this.buttons.length > 0 ? this.buttons[this.currentButtonIndex] : this.currentButton;
        }
        ToggleButtonsController.prototype.$onChanges = function (changes) {
            this.multiselect = changes.multiselect ? changes.multiselect.currentValue : false;
            this.disabled = changes.ngDisabled ? changes.ngDisabled.currentValue : false;
            this.onlyToggle = changes.onlyToggle ? changes.onlyToggle.currentValue : false;
            this.buttons = !changes.buttons || _.isArray(changes.buttons.currentValue) && changes.buttons.currentValue.length === 0 ? [] : changes.buttons.currentValue;
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZGVwZW5kZW5jaWVzL1RyYW5zbGF0ZUZpbHRlci50cyIsInNyYy9mYWJzL0ZhYlRvb2x0aXBWaXNpYmlsaXR5LnRzIiwic3JjL2luZGV4LnRzIiwic3JjL3JlZnJlc2hfYnV0dG9uL1JlZnJlc2hCdXR0b24udHMiLCJzcmMvdG9nZ2xlX2J1dHRvbnMvVG9nZ2xlQnV0dG9ucy50cyIsInRlbXAvcGlwLXdlYnVpLWJ1dHRvbnMtaHRtbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLENBQUM7SUFDRyxtQkFBbUIsU0FBbUM7UUFDbEQsSUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUUxRixNQUFNLENBQUMsVUFBVSxHQUFXO1lBQ3hCLE1BQU0sQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDdEUsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQUVELE9BQU8sQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQUUsRUFBRSxDQUFDO1NBQ3JDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDeEMsQ0FBQzs7QUNYRCxDQUFDO0lBRUQ7UUFLSSwwQ0FDSSxRQUFhLEVBQ2IsTUFBMkIsRUFDM0IsTUFBc0IsRUFDdEIsUUFBNEIsRUFDNUIsTUFBTTtZQUVOLFVBQVUsQ0FBQztZQUNYLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMseUJBQXlCLENBQUMsQ0FBQyxFQUN0RCxVQUFVLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLEVBQ2hELFVBQVUsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO1lB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QUFLLENBQUM7WUFDakUsQ0FBQztZQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLElBQUksS0FBSyxDQUFDO1FBQzVDLENBQUM7UUFDTCw4QkFBQztJQUFELENBdkZBLEFBdUZDLElBQUE7SUFFRCxJQUFNLGFBQWEsR0FBeUI7UUFDeEMsUUFBUSxFQUFFLHFCQUFxQjtRQUMvQixXQUFXLEVBQUUsbUNBQW1DO1FBQ2hELFVBQVUsRUFBRSx1QkFBdUI7S0FDdEMsQ0FBQTtJQUVELE9BQU87U0FDRixNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1NBQ3BELFNBQVMsQ0FBQyxrQkFBa0IsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUVsRCxDQUFDOztBQ2pKRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ7XHJcbiAgICBmdW5jdGlvbiB0cmFuc2xhdGUoJGluamVjdG9yOiBuZy5hdXRvLklJbmplY3RvclNlcnZpY2UpIHtcclxuICAgICAgICBjb25zdCBwaXBUcmFuc2xhdGUgPSAkaW5qZWN0b3IuaGFzKCdwaXBUcmFuc2xhdGUnKSA/ICRpbmplY3Rvci5nZXQoJ3BpcFRyYW5zbGF0ZScpIDogbnVsbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChrZXk6IHN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gcGlwVHJhbnNsYXRlID8gcGlwVHJhbnNsYXRlWyd0cmFuc2xhdGUnXShrZXkpIHx8IGtleSA6IGtleTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ3BpcEJ1dHRvbnMuVHJhbnNsYXRlJywgW10pXHJcbiAgICAgICAgLmZpbHRlcigndHJhbnNsYXRlJywgdHJhbnNsYXRlKTtcclxufSIsIntcclxuXHJcbmNsYXNzIEZhYlRvb2x0aXBWaXNpYmlsaXR5Q29udHJvbGxlciB7XHJcbiAgICBwcml2YXRlIF9lbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBfc2NvcGU6IGFuZ3VsYXIuSVNjb3BlO1xyXG4gICAgcHJpdmF0ZSBfdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICRlbGVtZW50OiBhbnksXHJcbiAgICAgICAgJGF0dHJzOiBhbmd1bGFyLklBdHRyaWJ1dGVzLFxyXG4gICAgICAgICRzY29wZTogYW5ndWxhci5JU2NvcGUsXHJcbiAgICAgICAgJHRpbWVvdXQ6IG5nLklUaW1lb3V0U2VydmljZSxcclxuICAgICAgICAkcGFyc2VcclxuICAgICkge1xyXG4gICAgICAgIFwibmdJbmplY3RcIjtcclxuICAgICAgICBsZXQgdHJpZ0dldHRlciA9ICRwYXJzZSgkYXR0cnNbJ3BpcEZhYlRvb2x0aXBWaXNpYmlsaXR5J10pLFxyXG4gICAgICAgICAgICBzaG93R2V0dGVyID0gJHBhcnNlKCRhdHRyc1sncGlwRmFiU2hvd1Rvb2x0aXAnXSksXHJcbiAgICAgICAgICAgIHNob3dTZXR0ZXIgPSBzaG93R2V0dGVyLmFzc2lnbjtcclxuXHJcbiAgICAgICAgJHNjb3BlLiR3YXRjaCh0cmlnR2V0dGVyLCAoaXNPcGVuKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghXy5pc0Z1bmN0aW9uKHNob3dTZXR0ZXIpKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBpZiAoaXNPcGVuKSB7XHJcbiAgICAgICAgICAgICAgICAkdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd1NldHRlcigkc2NvcGUsIGlzT3Blbik7XHJcbiAgICAgICAgICAgICAgICB9LCA2MDApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2hvd1NldHRlcigkc2NvcGUsIGlzT3Blbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHBpcEZhYlRvb2x0aXBWaXNpYmlsaXR5KCRwYXJzZSwgJHRpbWVvdXQpOiBuZy5JRGlyZWN0aXZlIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICBzY29wZTogZmFsc2UsXHJcbiAgICAgICAgY29udHJvbGxlcjogRmFiVG9vbHRpcFZpc2liaWxpdHlDb250cm9sbGVyXHJcbiAgICB9O1xyXG59XHJcblxyXG5hbmd1bGFyXHJcbiAgICAubW9kdWxlKCdwaXBGYWJUb29sdGlwVmlzaWJpbGl0eScsIFtdKVxyXG4gICAgLmRpcmVjdGl2ZSgncGlwRmFiVG9vbHRpcFZpc2liaWxpdHknLCBwaXBGYWJUb29sdGlwVmlzaWJpbGl0eSk7XHJcblxyXG59Iiwi77u/aW1wb3J0ICcuL3JlZnJlc2hfYnV0dG9uL1JlZnJlc2hCdXR0b24nO1xyXG5pbXBvcnQgJy4vdG9nZ2xlX2J1dHRvbnMvVG9nZ2xlQnV0dG9ucydcclxuaW1wb3J0ICcuL2ZhYnMvRmFiVG9vbHRpcFZpc2liaWxpdHknO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3BpcEJ1dHRvbnMnLCBbXHJcbiAgICAncGlwVG9nZ2xlQnV0dG9ucycsXHJcbiAgICAncGlwUmVmcmVzaEJ1dHRvbicsXHJcbiAgICAncGlwRmFiVG9vbHRpcFZpc2liaWxpdHknXHJcbl0pOyIsIntcclxuXHJcbmludGVyZmFjZSBJUmVmcmVzaEJ1dHRvbkJpbmRpbmdzIHtcclxuICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxuXHJcbiAgICB0ZXh0OiBhbnk7XHJcbiAgICB2aXNpYmxlOiBhbnk7XHJcbiAgICBvblJlZnJlc2g6IGFueVxyXG59XHJcblxyXG5jb25zdCBSZWZyZXNoQnV0dG9uQmluZGluZ3M6IElSZWZyZXNoQnV0dG9uQmluZGluZ3MgPSB7XHJcbiAgICB0ZXh0OiAnPHBpcFRleHQnLFxyXG4gICAgdmlzaWJsZTogJzxwaXBWaXNpYmxlJyxcclxuICAgIG9uUmVmcmVzaDogJyY/cGlwUmVmcmVzaCdcclxufVxyXG5cclxuY2xhc3MgUmVmcmVzaEJ1dHRvbkNoYW5nZXMgaW1wbGVtZW50cyBuZy5JT25DaGFuZ2VzT2JqZWN0LCBJUmVmcmVzaEJ1dHRvbkJpbmRpbmdzIHtcclxuICAgIFtrZXk6IHN0cmluZ106IG5nLklDaGFuZ2VzT2JqZWN0IDwgYW55ID4gO1xyXG4gICAgLy8gTm90IG9uZSB3YXkgYmluZGluZ3NcclxuICAgIG9uUmVmcmVzaDogbmcuSUNoYW5nZXNPYmplY3QgPCAoe1xyXG4gICAgICAgICRldmVudDogYW55XHJcbiAgICB9KSA9PiBuZy5JUHJvbWlzZSA8IGFueSA+PiA7XHJcbiAgICAvLyBPbmUgd2F5IGJpbmRpbmdzXHJcbiAgICB0ZXh0OiBuZy5JQ2hhbmdlc09iamVjdCA8IHN0cmluZyA+IDtcclxuICAgIHZpc2libGU6IG5nLklDaGFuZ2VzT2JqZWN0IDwgYm9vbGVhbiA+IDtcclxufVxyXG5cclxuY2xhc3MgUmVmcmVzaEJ1dHRvbkNvbnRyb2xsZXIgaW1wbGVtZW50cyBJUmVmcmVzaEJ1dHRvbkJpbmRpbmdzIHtcclxuXHJcbiAgICBwcml2YXRlIF90ZXh0RWxlbWVudDogYW55O1xyXG4gICAgcHJpdmF0ZSBfYnV0dG9uRWxlbWVudDogYW55O1xyXG4gICAgcHJpdmF0ZSBfd2lkdGg6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgdGV4dDogc3RyaW5nO1xyXG4gICAgcHVibGljIHZpc2libGU6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgb25SZWZyZXNoOiAocGFyYW06IHtcclxuICAgICAgICAkZXZlbnQ6IG5nLklBbmd1bGFyRXZlbnRcclxuICAgIH0pID0+IG5nLklQcm9taXNlIDwgYW55ID4gO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgJHNjb3BlOiBuZy5JU2NvcGUsXHJcbiAgICAgICAgcHJpdmF0ZSAkZWxlbWVudDogYW55LFxyXG4gICAgICAgIHByaXZhdGUgJGF0dHJzOiBuZy5JQXR0cmlidXRlc1xyXG4gICAgKSB7fVxyXG5cclxuICAgIHB1YmxpYyAkcG9zdExpbmsoKSB7XHJcbiAgICAgICAgdGhpcy5fYnV0dG9uRWxlbWVudCA9IHRoaXMuJGVsZW1lbnQuY2hpbGRyZW4oJy5tZC1idXR0b24nKTtcclxuICAgICAgICB0aGlzLl90ZXh0RWxlbWVudCA9IHRoaXMuX2J1dHRvbkVsZW1lbnQuY2hpbGRyZW4oJy5waXAtcmVmcmVzaC10ZXh0Jyk7XHJcblxyXG4gICAgICAgIHRoaXMuc2hvdygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyAkb25DaGFuZ2VzKGNoYW5nZXM6IFJlZnJlc2hCdXR0b25DaGFuZ2VzKSB7XHJcbiAgICAgICAgaWYgKGNoYW5nZXMudmlzaWJsZS5jdXJyZW50VmFsdWUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgdGhpcy50ZXh0ID0gY2hhbmdlcy50ZXh0LmN1cnJlbnRWYWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkNsaWNrKCRldmVudCkge1xyXG4gICAgICAgIGlmICh0aGlzLm9uUmVmcmVzaCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uUmVmcmVzaCh7XHJcbiAgICAgICAgICAgICAgICAkZXZlbnQ6ICRldmVudFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzaG93KCkge1xyXG4gICAgICAgIGlmICh0aGlzLl90ZXh0RWxlbWVudCA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuX2J1dHRvbkVsZW1lbnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFNldCBuZXcgdGV4dFxyXG4gICAgICAgIHRoaXMuX3RleHRFbGVtZW50LnRleHQodGhpcy50ZXh0KTtcclxuICAgICAgICAvLyBTaG93IGJ1dHRvblxyXG4gICAgICAgIHRoaXMuX2J1dHRvbkVsZW1lbnQuc2hvdygpO1xyXG4gICAgICAgIC8vIEFkanVzdCBwb3NpdGlvblxyXG4gICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5fYnV0dG9uRWxlbWVudC53aWR0aCgpO1xyXG4gICAgICAgIHRoaXMuX2J1dHRvbkVsZW1lbnQuY3NzKCdtYXJnaW4tbGVmdCcsICctJyArIHdpZHRoIC8gMiArICdweCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGlkZSgpIHtcclxuICAgICAgICB0aGlzLl9idXR0b25FbGVtZW50LmhpZGUoKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbmNvbnN0IFJlZnJlc2hCdXR0b25Db21wb25lbnQ6IG5nLklDb21wb25lbnRPcHRpb25zID0ge1xyXG4gICAgYmluZGluZ3M6IFJlZnJlc2hCdXR0b25CaW5kaW5ncyxcclxuICAgIGNvbnRyb2xsZXI6IFJlZnJlc2hCdXR0b25Db250cm9sbGVyLFxyXG4gICAgdGVtcGxhdGU6ICc8bWQtYnV0dG9uIGNsYXNzPVwicGlwLXJlZnJlc2gtYnV0dG9uXCIgdGFiaW5kZXg9XCItMVwiIG5nLWNsaWNrPVwiJGN0cmwub25DbGljaygkZXZlbnQpXCIgYXJpYS1sYWJlbD1cIlJFRlJFU0hcIj4nICtcclxuICAgICAgICAnPG1kLWljb24gbWQtc3ZnLWljb249XCJpY29uczpyZWZyZXNoXCI+PC9tZC1pY29uPicgK1xyXG4gICAgICAgICc8c3BhbiBjbGFzcz1cInBpcC1yZWZyZXNoLXRleHRcIj48L3NwYW4+JyArXHJcbiAgICAgICAgJzwvbWQtYnV0dG9uPidcclxufTtcclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcFJlZnJlc2hCdXR0b24nLCBbJ25nTWF0ZXJpYWwnXSlcclxuICAgIC5jb21wb25lbnQoJ3BpcFJlZnJlc2hCdXR0b24nLCBSZWZyZXNoQnV0dG9uQ29tcG9uZW50KTtcclxuXHJcbn0iLCJ7XHJcblxyXG5jbGFzcyBUb2dnbGVCdXR0b24ge1xyXG4gICAgaWQ6IGFueTtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGRpc2FibGVkOiBib29sZWFuO1xyXG4gICAgbGV2ZWw6IG51bWJlcjtcclxuICAgIGRpc2VsZWN0YWJsZTogYm9vbGVhbjtcclxuICAgIGZpbGxlZDogYm9vbGVhbjtcclxufVxyXG5cclxuaW50ZXJmYWNlIElUb2dnbGVCdXR0b25zQmluZGluZ3Mge1xyXG4gICAgW2tleTogc3RyaW5nXTogYW55O1xyXG5cclxuICAgIG5nRGlzYWJsZWQ6IGFueTtcclxuICAgIGJ1dHRvbnM6IGFueTtcclxuICAgIGN1cnJlbnRCdXR0b25WYWx1ZTogYW55O1xyXG4gICAgY3VycmVudEJ1dHRvbjogYW55O1xyXG4gICAgbXVsdGlzZWxlY3Q6IGFueTtcclxuICAgIGNoYW5nZTogYW55O1xyXG4gICAgb25seVRvZ2dsZTogYW55XHJcbn1cclxuXHJcbmNvbnN0IFRvZ2dsZUJ1dHRvbnNCaW5kaW5nczogSVRvZ2dsZUJ1dHRvbnNCaW5kaW5ncyA9IHtcclxuICAgIG5nRGlzYWJsZWQ6ICc8PycsXHJcbiAgICBidXR0b25zOiAnPHBpcEJ1dHRvbnMnLFxyXG4gICAgY3VycmVudEJ1dHRvblZhbHVlOiAnPW5nTW9kZWwnLFxyXG4gICAgY3VycmVudEJ1dHRvbjogJz0/cGlwQnV0dG9uT2JqZWN0JyxcclxuICAgIG11bHRpc2VsZWN0OiAnPD9waXBNdWx0aXNlbGVjdCcsXHJcbiAgICBjaGFuZ2U6ICcmbmdDaGFuZ2UnLFxyXG4gICAgb25seVRvZ2dsZTogJzw/cGlwT25seVRvZ2dsZSdcclxufVxyXG5cclxuY2xhc3MgVG9nZ2xlQnV0dG9uc0NoYW5nZXMgaW1wbGVtZW50cyBuZy5JT25DaGFuZ2VzT2JqZWN0LCBJVG9nZ2xlQnV0dG9uc0JpbmRpbmdzIHtcclxuICAgIFtrZXk6IHN0cmluZ106IG5nLklDaGFuZ2VzT2JqZWN0IDwgYW55ID4gO1xyXG4gICAgLy8gTm90IG9uZSB3YXkgYmluZGluZ3NcclxuICAgIGN1cnJlbnRCdXR0b25WYWx1ZTogYW55O1xyXG4gICAgY3VycmVudEJ1dHRvbjogYW55O1xyXG4gICAgY2hhbmdlOiBuZy5JQ2hhbmdlc09iamVjdCA8ICgpID0+IG5nLklQcm9taXNlIDwgdm9pZCA+PiA7XHJcbiAgICAvLyBPbmUgd2F5IGJpbmRpbmdzXHJcbiAgICBuZ0Rpc2FibGVkOiBuZy5JQ2hhbmdlc09iamVjdCA8IGJvb2xlYW4gPiA7XHJcbiAgICBidXR0b25zOiBuZy5JQ2hhbmdlc09iamVjdCA8IFRvZ2dsZUJ1dHRvbltdID4gO1xyXG4gICAgbXVsdGlzZWxlY3Q6IG5nLklDaGFuZ2VzT2JqZWN0IDwgYm9vbGVhbiA+IDtcclxuICAgIG9ubHlUb2dnbGU6IG5nLklDaGFuZ2VzT2JqZWN0IDwgYm9vbGVhbiA+IDtcclxufVxyXG5cclxuY2xhc3MgVG9nZ2xlQnV0dG9uc0NvbnRyb2xsZXIgaW1wbGVtZW50cyBJVG9nZ2xlQnV0dG9uc0JpbmRpbmdzIHtcclxuICAgIGxlbmdodDogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyBuZ0Rpc2FibGVkOiBib29sZWFuO1xyXG4gICAgcHVibGljIGNsYXNzOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgbXVsdGlzZWxlY3Q6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgYnV0dG9uczogVG9nZ2xlQnV0dG9uW107XHJcbiAgICBwdWJsaWMgZGlzYWJsZWQ6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgY3VycmVudEJ1dHRvblZhbHVlOiBhbnk7XHJcbiAgICBwdWJsaWMgY3VycmVudEJ1dHRvbkluZGV4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgY3VycmVudEJ1dHRvbjogYW55O1xyXG4gICAgcHVibGljIGNoYW5nZTogKCkgPT4gbmcuSVByb21pc2UgPCBhbnkgPiA7XHJcbiAgICBwdWJsaWMgb25seVRvZ2dsZTogYm9vbGVhbjtcclxuICAgIHB1YmxpYyBwaXBNZWRpYTogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgJGVsZW1lbnQ6IGFueSxcclxuICAgICAgICBwcml2YXRlICRhdHRyczogYW5ndWxhci5JQXR0cmlidXRlcyxcclxuICAgICAgICBwcml2YXRlICRzY29wZTogYW5ndWxhci5JU2NvcGUsXHJcbiAgICAgICAgcHJpdmF0ZSAkdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlLFxyXG4gICAgICAgICRpbmplY3RvcjogbmcuYXV0by5JSW5qZWN0b3JTZXJ2aWNlXHJcbiAgICApIHtcclxuICAgICAgICBcIm5nSW5qZWN0XCI7XHJcblxyXG4gICAgICAgIHRoaXMucGlwTWVkaWEgPSAkaW5qZWN0b3IuaGFzKCdwaXBNZWRpYScpID8gJGluamVjdG9yLmdldCgncGlwTWVkaWEnKSA6IG51bGw7XHJcbiAgICAgICAgdGhpcy5jbGFzcyA9ICRhdHRyc1snY2xhc3MnXSB8fCAnJztcclxuICAgICAgICBjb25zdCBpbmRleCA9IF8uaW5kZXhPZih0aGlzLmJ1dHRvbnMsIF8uZmluZCh0aGlzLmJ1dHRvbnMsIHtcclxuICAgICAgICAgICAgaWQ6IHRoaXMuY3VycmVudEJ1dHRvblZhbHVlXHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbkluZGV4ID0gaW5kZXggPCAwID8gMCA6IGluZGV4O1xyXG4gICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbiA9IHRoaXMuYnV0dG9ucy5sZW5ndGggPiAwID8gdGhpcy5idXR0b25zW3RoaXMuY3VycmVudEJ1dHRvbkluZGV4XSA6IHRoaXMuY3VycmVudEJ1dHRvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgJG9uQ2hhbmdlcyhjaGFuZ2VzOiBUb2dnbGVCdXR0b25zQ2hhbmdlcykge1xyXG4gICAgICAgIHRoaXMubXVsdGlzZWxlY3QgPSBjaGFuZ2VzLm11bHRpc2VsZWN0ID8gY2hhbmdlcy5tdWx0aXNlbGVjdC5jdXJyZW50VmFsdWUgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmRpc2FibGVkID0gY2hhbmdlcy5uZ0Rpc2FibGVkID8gY2hhbmdlcy5uZ0Rpc2FibGVkLmN1cnJlbnRWYWx1ZSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMub25seVRvZ2dsZSA9IGNoYW5nZXMub25seVRvZ2dsZSA/IGNoYW5nZXMub25seVRvZ2dsZS5jdXJyZW50VmFsdWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5idXR0b25zID0gIWNoYW5nZXMuYnV0dG9ucyB8fCBfLmlzQXJyYXkoY2hhbmdlcy5idXR0b25zLmN1cnJlbnRWYWx1ZSkgJiYgY2hhbmdlcy5idXR0b25zLmN1cnJlbnRWYWx1ZS5sZW5ndGggPT09IDAgPyBbXSA6IGNoYW5nZXMuYnV0dG9ucy5jdXJyZW50VmFsdWU7XHJcblxyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gXy5pbmRleE9mKHRoaXMuYnV0dG9ucywgXy5maW5kKHRoaXMuYnV0dG9ucywge1xyXG4gICAgICAgICAgICBpZDogdGhpcy5jdXJyZW50QnV0dG9uVmFsdWVcclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50QnV0dG9uSW5kZXggPSBpbmRleCA8IDAgPyAwIDogaW5kZXg7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50QnV0dG9uID0gdGhpcy5idXR0b25zLmxlbmd0aCA+IDAgPyB0aGlzLmJ1dHRvbnNbdGhpcy5jdXJyZW50QnV0dG9uSW5kZXhdIDogdGhpcy5jdXJyZW50QnV0dG9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyAkcG9zdExpbmsoKSB7XHJcbiAgICAgICAgdGhpcy4kZWxlbWVudFxyXG4gICAgICAgICAgICAub24oJ2ZvY3VzaW4nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRlbGVtZW50LmFkZENsYXNzKCdmb2N1c2VkLWNvbnRhaW5lcicpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAub24oJ2ZvY3Vzb3V0JywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcygnZm9jdXNlZC1jb250YWluZXInKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGJ1dHRvblNlbGVjdGVkKGluZGV4KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jdXJyZW50QnV0dG9uSW5kZXggPSBpbmRleDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b24gPSB0aGlzLmJ1dHRvbnNbdGhpcy5jdXJyZW50QnV0dG9uSW5kZXhdO1xyXG4gICAgICAgIHRoaXMuY3VycmVudEJ1dHRvblZhbHVlID0gdGhpcy5jdXJyZW50QnV0dG9uLmlkIHx8IGluZGV4O1xyXG5cclxuICAgICAgICB0aGlzLiR0aW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hhbmdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGVudGVyU3BhY2VQcmVzcyhldmVudCkge1xyXG4gICAgICAgIHRoaXMuYnV0dG9uU2VsZWN0ZWQoZXZlbnQuaW5kZXgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBoaWdobGlnaHRCdXR0b24oaW5kZXgpIHtcclxuICAgICAgICBpZiAodGhpcy5tdWx0aXNlbGVjdCAmJlxyXG4gICAgICAgICAgICAhXy5pc1VuZGVmaW5lZCh0aGlzLmN1cnJlbnRCdXR0b24ubGV2ZWwpICYmXHJcbiAgICAgICAgICAgICFfLmlzVW5kZWZpbmVkKHRoaXMuYnV0dG9uc1tpbmRleF0ubGV2ZWwpKSB7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50QnV0dG9uLmxldmVsID49IHRoaXMuYnV0dG9uc1tpbmRleF0ubGV2ZWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50QnV0dG9uSW5kZXggPT0gaW5kZXg7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IFRvZ2dsZUJ1dHRvbnM6IG5nLklDb21wb25lbnRPcHRpb25zID0ge1xyXG4gICAgYmluZGluZ3M6IFRvZ2dsZUJ1dHRvbnNCaW5kaW5ncyxcclxuICAgIHRlbXBsYXRlVXJsOiAndG9nZ2xlX2J1dHRvbnMvVG9nZ2xlQnV0dG9ucy5odG1sJyxcclxuICAgIGNvbnRyb2xsZXI6IFRvZ2dsZUJ1dHRvbnNDb250cm9sbGVyXHJcbn1cclxuXHJcbmFuZ3VsYXJcclxuICAgIC5tb2R1bGUoJ3BpcFRvZ2dsZUJ1dHRvbnMnLCBbJ3BpcEJ1dHRvbnMuVGVtcGxhdGVzJ10pXHJcbiAgICAuY29tcG9uZW50KCdwaXBUb2dnbGVCdXR0b25zJywgVG9nZ2xlQnV0dG9ucyk7XHJcblxyXG59IiwiKGZ1bmN0aW9uKG1vZHVsZSkge1xudHJ5IHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcEJ1dHRvbnMuVGVtcGxhdGVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBCdXR0b25zLlRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgndG9nZ2xlX2J1dHRvbnMvVG9nZ2xlQnV0dG9ucy5odG1sJyxcbiAgICAnPGRpdiBjbGFzcz1cInBpcC10b2dnbGUtYnV0dG9ucyBsYXlvdXQtcm93IHt7JGN0cmwuY2xhc3N9fVwiIFxcbicgK1xuICAgICcgICAgIHBpcC1zZWxlY3RlZD1cIiRjdHJsLmJ1ZkJ1dHRvbkluZGV4XCIgXFxuJyArXG4gICAgJyAgICAgcGlwLWVudGVyLXNwYWNlLXByZXNzPVwiJGN0cmwuZW50ZXJTcGFjZVByZXNzKCRldmVudClcIlxcbicgK1xuICAgICcgICAgIG5nLWlmPVwiISRjdHJsLnBpcE1lZGlhKFxcJ3hzXFwnKSB8fCAkY3RybC5vbmx5VG9nZ2xlXCI+XFxuJyArXG4gICAgJyAgICA8bWQtYnV0dG9uIHRhYmluZGV4PVwiLTFcIiBuZy1yZXBlYXQ9XCJidXR0b24gaW4gJGN0cmwuYnV0dG9uc1wiXFxuJyArXG4gICAgJyAgICAgICAgICAgICAgIG5nLWNsYXNzPVwie1xcJ21kLWFjY2VudCBtZC1yYWlzZWQgc2VsZWN0ZWQgY29sb3ItYWNjZW50LWJnXFwnIDogJGN0cmwuaGlnaGxpZ2h0QnV0dG9uKCRpbmRleCl9XCJcXG4nICtcbiAgICAnICAgICAgICAgICAgICAgbmctYXR0ci1zdHlsZT1cInt7IFxcJ2JhY2tncm91bmQtY29sb3I6XFwnICsgKCRjdHJsLmhpZ2hsaWdodEJ1dHRvbigkaW5kZXgpID8gYnV0dG9uLmJhY2tncm91bmRDb2xvciA6IFxcJ1xcJykgKyBcXCchaW1wb3J0YW50XFwnIH19XCJcXG4nICtcbiAgICAnICAgICAgICAgICAgICAgY2xhc3M9XCJwaXAtc2VsZWN0YWJsZSBwaXAtY2hpcC1idXR0b24gZmxleFwiIG5nLWNsaWNrPVwiJGN0cmwuYnV0dG9uU2VsZWN0ZWQoJGluZGV4LCAkZXZlbnQpXCJcXG4nICtcbiAgICAnICAgICAgICAgICAgICAgbmctZGlzYWJsZWQ9XCJidXR0b24uZGlzYWJsZWQgfHwgJGN0cmwuZGlzYWJsZWRcIj5cXG4nICtcbiAgICAnICAgICAgICB7e2J1dHRvbi5uYW1lIHx8IGJ1dHRvbi50aXRsZSB8IHRyYW5zbGF0ZX19XFxuJyArXG4gICAgJyAgICAgICAgPHNwYW4gbmctaWY9XCJidXR0b24uY2hlY2tlZCB8fCBidXR0b24uY29tcGxldGUgfHwgYnV0dG9uLmZpbGxlZFwiIGNsYXNzPVwicGlwLXRhZ2dlZFwiPio8L3NwYW4+XFxuJyArXG4gICAgJyAgICA8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIiBuZy1pZj1cIiRjdHJsLnBpcE1lZGlhKFxcJ3hzXFwnKSAmJiAhJGN0cmwub25seVRvZ2dsZVwiPlxcbicgK1xuICAgICcgICAgPG1kLXNlbGVjdCBuZy1tb2RlbD1cIiRjdHJsLmN1cnJlbnRCdXR0b25JbmRleFwiIG5nLWRpc2FibGVkPVwiJGN0cmwuZGlzYWJsZWRcIiBhcmlhLWxhYmVsPVwiRFJPUERPV05cIiBcXG4nICtcbiAgICAnICAgICAgICAgICAgICBtZC1vbi1jbG9zZT1cIiRjdHJsLmJ1dHRvblNlbGVjdGVkKCRjdHJsLmN1cnJlbnRCdXR0b25JbmRleClcIj5cXG4nICtcbiAgICAnICAgICAgICA8bWQtb3B0aW9uIG5nLXJlcGVhdD1cImFjdGlvbiBpbiAkY3RybC5idXR0b25zXCIgdmFsdWU9XCJ7eyA6OiRpbmRleCB9fVwiPlxcbicgK1xuICAgICcgICAgICAgICAgICB7eyAoYWN0aW9uLnRpdGxlIHx8IGFjdGlvbi5uYW1lKSB8IHRyYW5zbGF0ZSB9fVxcbicgK1xuICAgICcgICAgICAgICAgICA8c3BhbiBuZy1pZj1cImFjdGlvbi5jaGVja2VkIHx8IGFjdGlvbi5jb21wbGV0ZSB8fCBhY3Rpb24uZmlsbGVkXCIgY2xhc3M9XCJwaXAtdGFnZ2VkXCI+Kjwvc3Bhbj5cXG4nICtcbiAgICAnICAgICAgICA8L21kLW9wdGlvbj5cXG4nICtcbiAgICAnICAgIDwvbWQtc2VsZWN0PlxcbicgK1xuICAgICc8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnJyk7XG59XSk7XG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1waXAtd2VidWktYnV0dG9ucy1odG1sLmpzLm1hcFxuIl19
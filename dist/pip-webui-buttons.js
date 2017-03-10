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
    ToggleButtonsFilter.$inject = ['$injector'];
    function ToggleButtonsFilter($injector) {
        var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        return function (key) {
            return pipTranslate ? pipTranslate['translate'](key) || key : key;
        };
    }
    angular.module('pipButtons.Translate', [])
        .filter('translate', ToggleButtonsFilter);
})();
},{}],3:[function(require,module,exports){
(function () {
    'use strict';
    pipFabTooltipVisibility.$inject = ['$parse', '$timeout'];
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
    angular.module('pipRefreshButton', ['ngMaterial'])
        .component('pipRefreshButton', RefreshButtonComponent);
})();
},{}],5:[function(require,module,exports){
(function () {
    'use strict';
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
        templateUrl: 'toggle_buttons/toggle_buttons.html',
        controller: ToggleButtonsController
    };
    angular
        .module('pipToggleButtons', ['pipButtons.Templates'])
        .component('pipToggleButtons', ToggleButtons);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYnV0dG9ucy50cyIsInNyYy9kZXBlbmRlbmNpZXMvdHJhbnNsYXRlLnRzIiwic3JjL2ZhYnMvZmFiX3Rvb2x0aXBfdmlzaWJpbGl0eS50cyIsInNyYy9yZWZyZXNoX2J1dHRvbi9yZWZyZXNoX2J1dHRvbi50cyIsInNyYy90b2dnbGVfYnV0dG9ucy90b2dnbGVfYnV0dG9ucy50cyIsInRlbXAvcGlwLXdlYnVpLWJ1dHRvbnMtaHRtbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0VBLENBQUM7SUFDRyxZQUFZLENBQUM7SUFFYixPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRTtRQUN6QixrQkFBa0I7UUFDbEIsa0JBQWtCO1FBQ2xCLHlCQUF5QjtLQUM1QixDQUFDLENBQUM7QUFFUCxDQUFDLENBQUMsRUFBRSxDQUFDOztBQ1RMLENBQUM7SUFDRyxZQUFZLENBQUM7SUFFYiw2QkFBNkIsU0FBbUM7UUFDNUQsSUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUUxRixNQUFNLENBQUMsVUFBUyxHQUFXO1lBQ3ZCLE1BQU0sQ0FBQyxZQUFZLEdBQUksWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDdkUsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQUVELE9BQU8sQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQUUsRUFBRSxDQUFDO1NBQ3JDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztBQUVsRCxDQUFDLENBQUMsRUFBRSxDQUFDOztBQ2RMLENBQUM7SUFDRyxZQUFZLENBQUM7SUFFYjtRQUtJLHdDQUNJLFFBQWEsRUFDYixNQUEyQixFQUMzQixNQUFz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QUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUU1QyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDakUsQ0FBQztZQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLElBQUksS0FBSyxDQUFDO1FBQzVDLENBQUM7UUFDTCw4QkFBQztJQUFELENBdkZBLEFBdUZDLElBQUE7SUFFRCxJQUFNLGFBQWEsR0FBeUI7UUFDeEMsUUFBUSxFQUFFLHFCQUFxQjtRQUMvQixXQUFXLEVBQUUsb0NBQW9DO1FBQ2pELFVBQVUsRUFBRSx1QkFBdUI7S0FDdEMsQ0FBQTtJQUVELE9BQU87U0FDRixNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1NBQ3BELFNBQVMsQ0FBQyxrQkFBa0IsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUV0RCxDQUFDLENBQUMsRUFBRSxDQUFDOztBQ3BKTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCLvu78vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdwaXBCdXR0b25zJywgW1xyXG4gICAgICAgICdwaXBUb2dnbGVCdXR0b25zJyxcclxuICAgICAgICAncGlwUmVmcmVzaEJ1dHRvbicsXHJcbiAgICAgICAgJ3BpcEZhYlRvb2x0aXBWaXNpYmlsaXR5J1xyXG4gICAgXSk7XHJcblxyXG59KSgpO1xyXG5cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBmdW5jdGlvbiBUb2dnbGVCdXR0b25zRmlsdGVyKCRpbmplY3RvcjogbmcuYXV0by5JSW5qZWN0b3JTZXJ2aWNlKSB7XHJcbiAgICAgICAgY29uc3QgcGlwVHJhbnNsYXRlID0gJGluamVjdG9yLmhhcygncGlwVHJhbnNsYXRlJykgPyAkaW5qZWN0b3IuZ2V0KCdwaXBUcmFuc2xhdGUnKSA6IG51bGw7XHJcblxyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbihrZXk6IHN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gcGlwVHJhbnNsYXRlICA/IHBpcFRyYW5zbGF0ZVsndHJhbnNsYXRlJ10oa2V5KSB8fCBrZXkgOiBrZXk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdwaXBCdXR0b25zLlRyYW5zbGF0ZScsIFtdKVxyXG4gICAgICAgIC5maWx0ZXIoJ3RyYW5zbGF0ZScsIFRvZ2dsZUJ1dHRvbnNGaWx0ZXIpO1xyXG5cclxufSkoKTtcclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBjbGFzcyBGYWJUb29sdGlwVmlzaWJpbGl0eUNvbnRyb2xsZXIge1xyXG4gICAgICAgIHByaXZhdGUgX2VsZW1lbnQ7XHJcbiAgICAgICAgcHJpdmF0ZSBfc2NvcGU6IGFuZ3VsYXIuSVNjb3BlO1xyXG4gICAgICAgIHByaXZhdGUgX3RpbWVvdXQ6IG5nLklUaW1lb3V0U2VydmljZTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgICAgICRlbGVtZW50OiBhbnksXHJcbiAgICAgICAgICAgICRhdHRyczogYW5ndWxhci5JQXR0cmlidXRlcyxcclxuICAgICAgICAgICAgJHNjb3BlOiBhbmd1bGFyLklTY29wZSxcclxuICAgICAgICAgICAgJHRpbWVvdXQ6IG5nLklUaW1lb3V0U2VydmljZSxcclxuICAgICAgICAgICAgJHBhcnNlXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIFwibmdJbmplY3RcIjtcclxuICAgICAgICAgICAgbGV0IHRyaWdHZXR0ZXIgPSAkcGFyc2UoJGF0dHJzWydwaXBGYWJUb29sdGlwVmlzaWJpbGl0eSddKSxcclxuICAgICAgICAgICAgICAgIHNob3dHZXR0ZXIgPSAkcGFyc2UoJGF0dHJzWydwaXBGYWJTaG93VG9vbHRpcCddKSxcclxuICAgICAgICAgICAgICAgIHNob3dTZXR0ZXIgPSBzaG93R2V0dGVyLmFzc2lnbjtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2godHJpZ0dldHRlciwgKGlzT3BlbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFfLmlzRnVuY3Rpb24oc2hvd1NldHRlcikpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNPcGVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93U2V0dGVyKCRzY29wZSwgaXNPcGVuKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCA2MDApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzaG93U2V0dGVyKCRzY29wZSwgaXNPcGVuKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBwaXBGYWJUb29sdGlwVmlzaWJpbGl0eSgkcGFyc2UsICR0aW1lb3V0KSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICAgICAgc2NvcGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBGYWJUb29sdGlwVmlzaWJpbGl0eUNvbnRyb2xsZXJcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdwaXBGYWJUb29sdGlwVmlzaWJpbGl0eScsIFtdKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3BpcEZhYlRvb2x0aXBWaXNpYmlsaXR5JywgcGlwRmFiVG9vbHRpcFZpc2liaWxpdHkpO1xyXG5cclxufSkoKTsiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGludGVyZmFjZSBJUmVmcmVzaEJ1dHRvbkJpbmRpbmdzIHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcblxyXG4gICAgICAgIHRleHQ6IGFueTtcclxuICAgICAgICB2aXNpYmxlOiBhbnk7XHJcbiAgICAgICAgb25SZWZyZXNoOiBhbnlcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBSZWZyZXNoQnV0dG9uQmluZGluZ3M6IElSZWZyZXNoQnV0dG9uQmluZGluZ3MgPSB7XHJcbiAgICAgICAgdGV4dDogJzxwaXBUZXh0JyxcclxuICAgICAgICB2aXNpYmxlOiAnPHBpcFZpc2libGUnLFxyXG4gICAgICAgIG9uUmVmcmVzaDogJyY/cGlwUmVmcmVzaCdcclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBSZWZyZXNoQnV0dG9uQ2hhbmdlcyBpbXBsZW1lbnRzIG5nLklPbkNoYW5nZXNPYmplY3QsIElSZWZyZXNoQnV0dG9uQmluZGluZ3Mge1xyXG4gICAgICAgIFtrZXk6IHN0cmluZ106IG5nLklDaGFuZ2VzT2JqZWN0IDwgYW55ID4gO1xyXG4gICAgICAgIC8vIE5vdCBvbmUgd2F5IGJpbmRpbmdzXHJcbiAgICAgICAgb25SZWZyZXNoOiBuZy5JQ2hhbmdlc09iamVjdCA8ICh7XHJcbiAgICAgICAgICAgICRldmVudDogYW55XHJcbiAgICAgICAgfSkgPT4gbmcuSVByb21pc2UgPCBhbnkgPj4gO1xyXG4gICAgICAgIC8vIE9uZSB3YXkgYmluZGluZ3NcclxuICAgICAgICB0ZXh0OiBuZy5JQ2hhbmdlc09iamVjdCA8IHN0cmluZyA+IDtcclxuICAgICAgICB2aXNpYmxlOiBuZy5JQ2hhbmdlc09iamVjdCA8IGJvb2xlYW4gPiA7XHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgUmVmcmVzaEJ1dHRvbkNvbnRyb2xsZXIgaW1wbGVtZW50cyBJUmVmcmVzaEJ1dHRvbkJpbmRpbmdzIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfdGV4dEVsZW1lbnQ6IGFueTtcclxuICAgICAgICBwcml2YXRlIF9idXR0b25FbGVtZW50OiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSBfd2lkdGg6IG51bWJlcjtcclxuXHJcbiAgICAgICAgcHVibGljIHRleHQ6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMgdmlzaWJsZTogYm9vbGVhbjtcclxuICAgICAgICBwdWJsaWMgb25SZWZyZXNoOiAocGFyYW06IHtcclxuICAgICAgICAgICAgJGV2ZW50OiBuZy5JQW5ndWxhckV2ZW50XHJcbiAgICAgICAgfSkgPT4gbmcuSVByb21pc2UgPCBhbnkgPiA7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICBwcml2YXRlICRzY29wZTogbmcuSVNjb3BlLFxyXG4gICAgICAgICAgICBwcml2YXRlICRlbGVtZW50OiBhbnksXHJcbiAgICAgICAgICAgIHByaXZhdGUgJGF0dHJzOiBuZy5JQXR0cmlidXRlc1xyXG4gICAgICAgICkge31cclxuXHJcbiAgICAgICAgcHVibGljICRwb3N0TGluaygpIHtcclxuICAgICAgICAgICAgdGhpcy5fYnV0dG9uRWxlbWVudCA9IHRoaXMuJGVsZW1lbnQuY2hpbGRyZW4oJy5tZC1idXR0b24nKTtcclxuICAgICAgICAgICAgdGhpcy5fdGV4dEVsZW1lbnQgPSB0aGlzLl9idXR0b25FbGVtZW50LmNoaWxkcmVuKCcucGlwLXJlZnJlc2gtdGV4dCcpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgJG9uQ2hhbmdlcyhjaGFuZ2VzOiBSZWZyZXNoQnV0dG9uQ2hhbmdlcykge1xyXG4gICAgICAgICAgICBpZiAoY2hhbmdlcy52aXNpYmxlLmN1cnJlbnRWYWx1ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0ID0gY2hhbmdlcy50ZXh0LmN1cnJlbnRWYWx1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvdygpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBvbkNsaWNrKCRldmVudCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vblJlZnJlc2gpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25SZWZyZXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAkZXZlbnQ6ICRldmVudFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc2hvdygpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3RleHRFbGVtZW50ID09PSB1bmRlZmluZWQgfHwgdGhpcy5fYnV0dG9uRWxlbWVudCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gU2V0IG5ldyB0ZXh0XHJcbiAgICAgICAgICAgIHRoaXMuX3RleHRFbGVtZW50LnRleHQodGhpcy50ZXh0KTtcclxuICAgICAgICAgICAgLy8gU2hvdyBidXR0b25cclxuICAgICAgICAgICAgdGhpcy5fYnV0dG9uRWxlbWVudC5zaG93KCk7XHJcbiAgICAgICAgICAgIC8vIEFkanVzdCBwb3NpdGlvblxyXG4gICAgICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuX2J1dHRvbkVsZW1lbnQud2lkdGgoKTtcclxuICAgICAgICAgICAgdGhpcy5fYnV0dG9uRWxlbWVudC5jc3MoJ21hcmdpbi1sZWZ0JywgJy0nICsgd2lkdGggLyAyICsgJ3B4Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGhpZGUoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2J1dHRvbkVsZW1lbnQuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgY29uc3QgUmVmcmVzaEJ1dHRvbkNvbXBvbmVudDogbmcuSUNvbXBvbmVudE9wdGlvbnMgPSB7XHJcbiAgICAgICAgYmluZGluZ3M6IFJlZnJlc2hCdXR0b25CaW5kaW5ncyxcclxuICAgICAgICBjb250cm9sbGVyOiBSZWZyZXNoQnV0dG9uQ29udHJvbGxlcixcclxuICAgICAgICB0ZW1wbGF0ZTogJzxtZC1idXR0b24gY2xhc3M9XCJwaXAtcmVmcmVzaC1idXR0b25cIiB0YWJpbmRleD1cIi0xXCIgbmctY2xpY2s9XCIkY3RybC5vbkNsaWNrKCRldmVudClcIiBhcmlhLWxhYmVsPVwiUkVGUkVTSFwiPicgK1xyXG4gICAgICAgICAgICAnPG1kLWljb24gbWQtc3ZnLWljb249XCJpY29uczpyZWZyZXNoXCI+PC9tZC1pY29uPicgK1xyXG4gICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJwaXAtcmVmcmVzaC10ZXh0XCI+PC9zcGFuPicgK1xyXG4gICAgICAgICAgICAnPC9tZC1idXR0b24+J1xyXG4gICAgfTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgncGlwUmVmcmVzaEJ1dHRvbicsIFsnbmdNYXRlcmlhbCddKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ3BpcFJlZnJlc2hCdXR0b24nLCBSZWZyZXNoQnV0dG9uQ29tcG9uZW50KTtcclxuXHJcbn0pKCk7IiwiLy8gLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBjbGFzcyBUb2dnbGVCdXR0b24ge1xyXG4gICAgICAgIGlkOiBhbnk7XHJcbiAgICAgICAgbmFtZTogc3RyaW5nO1xyXG4gICAgICAgIGRpc2FibGVkOiBib29sZWFuO1xyXG4gICAgICAgIGxldmVsOiBudW1iZXI7XHJcbiAgICAgICAgZGlzZWxlY3RhYmxlOiBib29sZWFuO1xyXG4gICAgICAgIGZpbGxlZDogYm9vbGVhbjtcclxuICAgIH1cclxuXHJcbiAgICBpbnRlcmZhY2UgSVRvZ2dsZUJ1dHRvbnNCaW5kaW5ncyB7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogYW55O1xyXG5cclxuICAgICAgICBuZ0Rpc2FibGVkOiBhbnk7XHJcbiAgICAgICAgYnV0dG9uczogYW55O1xyXG4gICAgICAgIGN1cnJlbnRCdXR0b25WYWx1ZTogYW55O1xyXG4gICAgICAgIGN1cnJlbnRCdXR0b246IGFueTtcclxuICAgICAgICBtdWx0aXNlbGVjdDogYW55O1xyXG4gICAgICAgIGNoYW5nZTogYW55O1xyXG4gICAgICAgIG9ubHlUb2dnbGU6IGFueVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IFRvZ2dsZUJ1dHRvbnNCaW5kaW5nczogSVRvZ2dsZUJ1dHRvbnNCaW5kaW5ncyA9IHtcclxuICAgICAgICBuZ0Rpc2FibGVkOiAnPD8nLFxyXG4gICAgICAgIGJ1dHRvbnM6ICc8cGlwQnV0dG9ucycsXHJcbiAgICAgICAgY3VycmVudEJ1dHRvblZhbHVlOiAnPW5nTW9kZWwnLFxyXG4gICAgICAgIGN1cnJlbnRCdXR0b246ICc9P3BpcEJ1dHRvbk9iamVjdCcsXHJcbiAgICAgICAgbXVsdGlzZWxlY3Q6ICc8P3BpcE11bHRpc2VsZWN0JyxcclxuICAgICAgICBjaGFuZ2U6ICcmbmdDaGFuZ2UnLFxyXG4gICAgICAgIG9ubHlUb2dnbGU6ICc8P3BpcE9ubHlUb2dnbGUnXHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgVG9nZ2xlQnV0dG9uc0NoYW5nZXMgaW1wbGVtZW50cyBuZy5JT25DaGFuZ2VzT2JqZWN0LCBJVG9nZ2xlQnV0dG9uc0JpbmRpbmdzIHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBuZy5JQ2hhbmdlc09iamVjdCA8IGFueSA+IDtcclxuICAgICAgICAvLyBOb3Qgb25lIHdheSBiaW5kaW5nc1xyXG4gICAgICAgIGN1cnJlbnRCdXR0b25WYWx1ZTogYW55O1xyXG4gICAgICAgIGN1cnJlbnRCdXR0b246IGFueTtcclxuICAgICAgICBjaGFuZ2U6IG5nLklDaGFuZ2VzT2JqZWN0IDwgKCkgPT4gbmcuSVByb21pc2UgPCB2b2lkID4+IDtcclxuICAgICAgICAvLyBPbmUgd2F5IGJpbmRpbmdzXHJcbiAgICAgICAgbmdEaXNhYmxlZDogbmcuSUNoYW5nZXNPYmplY3QgPCBib29sZWFuID4gO1xyXG4gICAgICAgIGJ1dHRvbnM6IG5nLklDaGFuZ2VzT2JqZWN0IDwgVG9nZ2xlQnV0dG9uW10gPiA7XHJcbiAgICAgICAgbXVsdGlzZWxlY3Q6IG5nLklDaGFuZ2VzT2JqZWN0IDwgYm9vbGVhbiA+IDtcclxuICAgICAgICBvbmx5VG9nZ2xlOiBuZy5JQ2hhbmdlc09iamVjdCA8IGJvb2xlYW4gPiA7XHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgVG9nZ2xlQnV0dG9uc0NvbnRyb2xsZXIgaW1wbGVtZW50cyBJVG9nZ2xlQnV0dG9uc0JpbmRpbmdzIHtcclxuICAgICAgICBsZW5naHQ6IG51bWJlcjtcclxuXHJcbiAgICAgICAgcHVibGljIG5nRGlzYWJsZWQ6IGJvb2xlYW47XHJcbiAgICAgICAgcHVibGljIGNsYXNzOiBzdHJpbmc7XHJcbiAgICAgICAgcHVibGljIG11bHRpc2VsZWN0OiBib29sZWFuO1xyXG4gICAgICAgIHB1YmxpYyBidXR0b25zOiBUb2dnbGVCdXR0b25bXTtcclxuICAgICAgICBwdWJsaWMgZGlzYWJsZWQ6IGJvb2xlYW47XHJcbiAgICAgICAgcHVibGljIGN1cnJlbnRCdXR0b25WYWx1ZTogYW55O1xyXG4gICAgICAgIHB1YmxpYyBjdXJyZW50QnV0dG9uSW5kZXg6IG51bWJlcjtcclxuICAgICAgICBwdWJsaWMgY3VycmVudEJ1dHRvbjogYW55O1xyXG4gICAgICAgIHB1YmxpYyBjaGFuZ2U6ICgpID0+IG5nLklQcm9taXNlIDwgYW55ID4gO1xyXG4gICAgICAgIHB1YmxpYyBvbmx5VG9nZ2xlOiBib29sZWFuO1xyXG4gICAgICAgIHB1YmxpYyBwaXBNZWRpYTogYW55O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgcHJpdmF0ZSAkZWxlbWVudDogYW55LFxyXG4gICAgICAgICAgICBwcml2YXRlICRhdHRyczogYW5ndWxhci5JQXR0cmlidXRlcyxcclxuICAgICAgICAgICAgcHJpdmF0ZSAkc2NvcGU6IGFuZ3VsYXIuSVNjb3BlLFxyXG4gICAgICAgICAgICBwcml2YXRlICR0aW1lb3V0OiBuZy5JVGltZW91dFNlcnZpY2UsXHJcbiAgICAgICAgICAgICRpbmplY3RvcjogbmcuYXV0by5JSW5qZWN0b3JTZXJ2aWNlXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIFwibmdJbmplY3RcIjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucGlwTWVkaWEgPSAkaW5qZWN0b3IuaGFzKCdwaXBNZWRpYScpID8gJGluamVjdG9yLmdldCgncGlwTWVkaWEnKSA6IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3MgPSAkYXR0cnNbJ2NsYXNzJ10gfHwgJyc7XHJcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gXy5pbmRleE9mKHRoaXMuYnV0dG9ucywgXy5maW5kKHRoaXMuYnV0dG9ucywge1xyXG4gICAgICAgICAgICAgICAgaWQ6IHRoaXMuY3VycmVudEJ1dHRvblZhbHVlXHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50QnV0dG9uSW5kZXggPSBpbmRleCA8IDAgPyAwIDogaW5kZXg7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbiA9IHRoaXMuYnV0dG9ucy5sZW5ndGggPiAwID8gdGhpcy5idXR0b25zW3RoaXMuY3VycmVudEJ1dHRvbkluZGV4XSA6IHRoaXMuY3VycmVudEJ1dHRvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyAkb25DaGFuZ2VzKGNoYW5nZXM6IFRvZ2dsZUJ1dHRvbnNDaGFuZ2VzKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXVsdGlzZWxlY3QgPSBjaGFuZ2VzLm11bHRpc2VsZWN0ID8gY2hhbmdlcy5tdWx0aXNlbGVjdC5jdXJyZW50VmFsdWUgOiBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5kaXNhYmxlZCA9IGNoYW5nZXMubmdEaXNhYmxlZCA/IGNoYW5nZXMubmdEaXNhYmxlZC5jdXJyZW50VmFsdWUgOiBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5vbmx5VG9nZ2xlID0gY2hhbmdlcy5vbmx5VG9nZ2xlID8gY2hhbmdlcy5vbmx5VG9nZ2xlLmN1cnJlbnRWYWx1ZSA6IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5idXR0b25zID0gIWNoYW5nZXMuYnV0dG9ucyB8fCBfLmlzQXJyYXkoY2hhbmdlcy5idXR0b25zLmN1cnJlbnRWYWx1ZSkgJiYgY2hhbmdlcy5idXR0b25zLmN1cnJlbnRWYWx1ZS5sZW5ndGggPT09IDAgPyBbXSA6IGNoYW5nZXMuYnV0dG9ucy5jdXJyZW50VmFsdWU7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IF8uaW5kZXhPZih0aGlzLmJ1dHRvbnMsIF8uZmluZCh0aGlzLmJ1dHRvbnMsIHtcclxuICAgICAgICAgICAgICAgIGlkOiB0aGlzLmN1cnJlbnRCdXR0b25WYWx1ZVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbkluZGV4ID0gaW5kZXggPCAwID8gMCA6IGluZGV4O1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b24gPSB0aGlzLmJ1dHRvbnMubGVuZ3RoID4gMCA/IHRoaXMuYnV0dG9uc1t0aGlzLmN1cnJlbnRCdXR0b25JbmRleF0gOiB0aGlzLmN1cnJlbnRCdXR0b247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgJHBvc3RMaW5rKCkge1xyXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50XHJcbiAgICAgICAgICAgICAgICAub24oJ2ZvY3VzaW4nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcygnZm9jdXNlZC1jb250YWluZXInKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAub24oJ2ZvY3Vzb3V0JywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2ZvY3VzZWQtY29udGFpbmVyJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBidXR0b25TZWxlY3RlZChpbmRleCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b25JbmRleCA9IGluZGV4O1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b24gPSB0aGlzLmJ1dHRvbnNbdGhpcy5jdXJyZW50QnV0dG9uSW5kZXhdO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b25WYWx1ZSA9IHRoaXMuY3VycmVudEJ1dHRvbi5pZCB8fCBpbmRleDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuJHRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhbmdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2UoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZW50ZXJTcGFjZVByZXNzKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uU2VsZWN0ZWQoZXZlbnQuaW5kZXgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGhpZ2hsaWdodEJ1dHRvbihpbmRleCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tdWx0aXNlbGVjdCAmJlxyXG4gICAgICAgICAgICAgICAgIV8uaXNVbmRlZmluZWQodGhpcy5jdXJyZW50QnV0dG9uLmxldmVsKSAmJlxyXG4gICAgICAgICAgICAgICAgIV8uaXNVbmRlZmluZWQodGhpcy5idXR0b25zW2luZGV4XS5sZXZlbCkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50QnV0dG9uLmxldmVsID49IHRoaXMuYnV0dG9uc1tpbmRleF0ubGV2ZWw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRCdXR0b25JbmRleCA9PSBpbmRleDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgVG9nZ2xlQnV0dG9uczogbmcuSUNvbXBvbmVudE9wdGlvbnMgPSB7XHJcbiAgICAgICAgYmluZGluZ3M6IFRvZ2dsZUJ1dHRvbnNCaW5kaW5ncyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3RvZ2dsZV9idXR0b25zL3RvZ2dsZV9idXR0b25zLmh0bWwnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFRvZ2dsZUJ1dHRvbnNDb250cm9sbGVyXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcFRvZ2dsZUJ1dHRvbnMnLCBbJ3BpcEJ1dHRvbnMuVGVtcGxhdGVzJ10pXHJcbiAgICAgICAgLmNvbXBvbmVudCgncGlwVG9nZ2xlQnV0dG9ucycsIFRvZ2dsZUJ1dHRvbnMpO1xyXG5cclxufSkoKTsiLCIoZnVuY3Rpb24obW9kdWxlKSB7XG50cnkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQnV0dG9ucy5UZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcEJ1dHRvbnMuVGVtcGxhdGVzJywgW10pO1xufVxubW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd0b2dnbGVfYnV0dG9ucy90b2dnbGVfYnV0dG9ucy5odG1sJyxcbiAgICAnPGRpdiBjbGFzcz1cInBpcC10b2dnbGUtYnV0dG9ucyBsYXlvdXQtcm93IHt7JGN0cmwuY2xhc3N9fVwiIFxcbicgK1xuICAgICcgICAgIHBpcC1zZWxlY3RlZD1cIiRjdHJsLmJ1ZkJ1dHRvbkluZGV4XCIgXFxuJyArXG4gICAgJyAgICAgcGlwLWVudGVyLXNwYWNlLXByZXNzPVwiJGN0cmwuZW50ZXJTcGFjZVByZXNzKCRldmVudClcIlxcbicgK1xuICAgICcgICAgIG5nLWlmPVwiISRjdHJsLnBpcE1lZGlhKFxcJ3hzXFwnKSB8fCAkY3RybC5vbmx5VG9nZ2xlXCI+XFxuJyArXG4gICAgJyAgICA8bWQtYnV0dG9uIHRhYmluZGV4PVwiLTFcIiBuZy1yZXBlYXQ9XCJidXR0b24gaW4gJGN0cmwuYnV0dG9uc1wiXFxuJyArXG4gICAgJyAgICAgICAgICAgICAgIG5nLWNsYXNzPVwie1xcJ21kLWFjY2VudCBtZC1yYWlzZWQgc2VsZWN0ZWQgY29sb3ItYWNjZW50LWJnXFwnIDogJGN0cmwuaGlnaGxpZ2h0QnV0dG9uKCRpbmRleCl9XCJcXG4nICtcbiAgICAnICAgICAgICAgICAgICAgbmctYXR0ci1zdHlsZT1cInt7IFxcJ2JhY2tncm91bmQtY29sb3I6XFwnICsgKCRjdHJsLmhpZ2hsaWdodEJ1dHRvbigkaW5kZXgpID8gYnV0dG9uLmJhY2tncm91bmRDb2xvciA6IFxcJ1xcJykgKyBcXCchaW1wb3J0YW50XFwnIH19XCJcXG4nICtcbiAgICAnICAgICAgICAgICAgICAgY2xhc3M9XCJwaXAtc2VsZWN0YWJsZSBwaXAtY2hpcC1idXR0b24gZmxleFwiIG5nLWNsaWNrPVwiJGN0cmwuYnV0dG9uU2VsZWN0ZWQoJGluZGV4LCAkZXZlbnQpXCJcXG4nICtcbiAgICAnICAgICAgICAgICAgICAgbmctZGlzYWJsZWQ9XCJidXR0b24uZGlzYWJsZWQgfHwgJGN0cmwuZGlzYWJsZWRcIj5cXG4nICtcbiAgICAnICAgICAgICB7e2J1dHRvbi5uYW1lIHx8IGJ1dHRvbi50aXRsZSB8IHRyYW5zbGF0ZX19XFxuJyArXG4gICAgJyAgICAgICAgPHNwYW4gbmctaWY9XCJidXR0b24uY2hlY2tlZCB8fCBidXR0b24uY29tcGxldGUgfHwgYnV0dG9uLmZpbGxlZFwiIGNsYXNzPVwicGlwLXRhZ2dlZFwiPio8L3NwYW4+XFxuJyArXG4gICAgJyAgICA8L21kLWJ1dHRvbj5cXG4nICtcbiAgICAnPC9kaXY+XFxuJyArXG4gICAgJ1xcbicgK1xuICAgICc8bWQtaW5wdXQtY29udGFpbmVyIGNsYXNzPVwibWQtYmxvY2tcIiBuZy1pZj1cIiRjdHJsLnBpcE1lZGlhKFxcJ3hzXFwnKSAmJiAhJGN0cmwub25seVRvZ2dsZVwiPlxcbicgK1xuICAgICcgICAgPG1kLXNlbGVjdCBuZy1tb2RlbD1cIiRjdHJsLmN1cnJlbnRCdXR0b25JbmRleFwiIG5nLWRpc2FibGVkPVwiJGN0cmwuZGlzYWJsZWRcIiBhcmlhLWxhYmVsPVwiRFJPUERPV05cIiBcXG4nICtcbiAgICAnICAgICAgICAgICAgICBtZC1vbi1jbG9zZT1cIiRjdHJsLmJ1dHRvblNlbGVjdGVkKCRjdHJsLmN1cnJlbnRCdXR0b25JbmRleClcIj5cXG4nICtcbiAgICAnICAgICAgICA8bWQtb3B0aW9uIG5nLXJlcGVhdD1cImFjdGlvbiBpbiAkY3RybC5idXR0b25zXCIgdmFsdWU9XCJ7eyA6OiRpbmRleCB9fVwiPlxcbicgK1xuICAgICcgICAgICAgICAgICB7eyAoYWN0aW9uLnRpdGxlIHx8IGFjdGlvbi5uYW1lKSB8IHRyYW5zbGF0ZSB9fVxcbicgK1xuICAgICcgICAgICAgICAgICA8c3BhbiBuZy1pZj1cImFjdGlvbi5jaGVja2VkIHx8IGFjdGlvbi5jb21wbGV0ZSB8fCBhY3Rpb24uZmlsbGVkXCIgY2xhc3M9XCJwaXAtdGFnZ2VkXCI+Kjwvc3Bhbj5cXG4nICtcbiAgICAnICAgICAgICA8L21kLW9wdGlvbj5cXG4nICtcbiAgICAnICAgIDwvbWQtc2VsZWN0PlxcbicgK1xuICAgICc8L21kLWlucHV0LWNvbnRhaW5lcj5cXG4nICtcbiAgICAnJyk7XG59XSk7XG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1waXAtd2VidWktYnV0dG9ucy1odG1sLmpzLm1hcFxuIl19
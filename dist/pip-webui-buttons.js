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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYnV0dG9ucy50cyIsInNyYy9kZXBlbmRlbmNpZXMvdHJhbnNsYXRlLnRzIiwic3JjL2ZhYnMvZmFiX3Rvb2x0aXBfdmlzaWJpbGl0eS50cyIsInNyYy9yZWZyZXNoX2J1dHRvbi9yZWZyZXNoX2J1dHRvbi50cyIsInNyYy90b2dnbGVfYnV0dG9ucy90b2dnbGVfYnV0dG9ucy50cyIsInRlbXAvcGlwLXdlYnVpLWJ1dHRvbnMtaHRtbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0VBLENBQUM7SUFDRyxZQUFZLENBQUM7SUFFYixPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRTtRQUN6QixrQkFBa0I7UUFDbEIsa0JBQWtCO1FBQ2xCLHlCQUF5QjtLQUM1QixDQUFDLENBQUM7QUFFUCxDQUFDLENBQUMsRUFBRSxDQUFDOztBQ1RMLENBQUM7SUFDRyxZQUFZLENBQUM7SUFFYiw2QkFBNkIsU0FBbUM7UUFDNUQsSUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUUxRixNQUFNLENBQUMsVUFBUyxHQUFXO1lBQ3ZCLE1BQU0sQ0FBQyxZQUFZLEdBQUksWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDdkUsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQUVELE9BQU8sQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQUUsRUFBRSxDQUFDO1NBQ3JDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztBQUVsRCxDQUFDLENBQUMsRUFBRSxDQUFDOztBQ2RMLENBQUM7SUFDRyxZQUFZLENBQUM7SUFFYjtRQUtJLHdDQUNJLFFBQWEsRUFDYixNQUEyQixFQUMzQixNQUFz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QUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUU1QyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUM7WUFDakUsQ0FBQztZQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLElBQUksS0FBSyxDQUFDO1FBQzVDLENBQUM7UUFDTCw4QkFBQztJQUFELENBdkZBLEFBdUZDLElBQUE7SUFFRCxJQUFNLGFBQWEsR0FBeUI7UUFDeEMsUUFBUSxFQUFFLHFCQUFxQjtRQUMvQixXQUFXLEVBQUUsb0NBQW9DO1FBQ2pELFVBQVUsRUFBRSx1QkFBdUI7S0FDdEMsQ0FBQTtJQUVELE9BQU87U0FDRixNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1NBQ3BELFNBQVMsQ0FBQyxrQkFBa0IsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUV0RCxDQUFDLENBQUMsRUFBRSxDQUFDOztBQ3BKTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCLvu78vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdwaXBCdXR0b25zJywgW1xyXG4gICAgICAgICdwaXBUb2dnbGVCdXR0b25zJyxcclxuICAgICAgICAncGlwUmVmcmVzaEJ1dHRvbicsXHJcbiAgICAgICAgJ3BpcEZhYlRvb2x0aXBWaXNpYmlsaXR5J1xyXG4gICAgXSk7XHJcblxyXG59KSgpO1xyXG5cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBmdW5jdGlvbiBUb2dnbGVCdXR0b25zRmlsdGVyKCRpbmplY3RvcjogbmcuYXV0by5JSW5qZWN0b3JTZXJ2aWNlKSB7XHJcbiAgICAgICAgY29uc3QgcGlwVHJhbnNsYXRlID0gJGluamVjdG9yLmhhcygncGlwVHJhbnNsYXRlJykgPyAkaW5qZWN0b3IuZ2V0KCdwaXBUcmFuc2xhdGUnKSA6IG51bGw7XHJcblxyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbihrZXk6IHN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gcGlwVHJhbnNsYXRlICA/IHBpcFRyYW5zbGF0ZVsndHJhbnNsYXRlJ10oa2V5KSB8fCBrZXkgOiBrZXk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdwaXBCdXR0b25zLlRyYW5zbGF0ZScsIFtdKVxyXG4gICAgICAgIC5maWx0ZXIoJ3RyYW5zbGF0ZScsIFRvZ2dsZUJ1dHRvbnNGaWx0ZXIpO1xyXG5cclxufSkoKTtcclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBjbGFzcyBGYWJUb29sdGlwVmlzaWJpbGl0eUNvbnRyb2xsZXIge1xyXG4gICAgICAgIHByaXZhdGUgX2VsZW1lbnQ7XHJcbiAgICAgICAgcHJpdmF0ZSBfc2NvcGU6IGFuZ3VsYXIuSVNjb3BlO1xyXG4gICAgICAgIHByaXZhdGUgX3RpbWVvdXQ6IG5nLklUaW1lb3V0U2VydmljZTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgICAgICRlbGVtZW50OiBhbnksXHJcbiAgICAgICAgICAgICRhdHRyczogYW5ndWxhci5JQXR0cmlidXRlcyxcclxuICAgICAgICAgICAgJHNjb3BlOiBhbmd1bGFyLklTY29wZSxcclxuICAgICAgICAgICAgJHRpbWVvdXQ6IG5nLklUaW1lb3V0U2VydmljZSxcclxuICAgICAgICAgICAgJHBhcnNlXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIFwibmdJbmplY3RcIjtcclxuICAgICAgICAgICAgbGV0IHRyaWdHZXR0ZXIgPSAkcGFyc2UoJGF0dHJzWydwaXBGYWJUb29sdGlwVmlzaWJpbGl0eSddKSxcclxuICAgICAgICAgICAgICAgIHNob3dHZXR0ZXIgPSAkcGFyc2UoJGF0dHJzWydwaXBGYWJTaG93VG9vbHRpcCddKSxcclxuICAgICAgICAgICAgICAgIHNob3dTZXR0ZXIgPSBzaG93R2V0dGVyLmFzc2lnbjtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2godHJpZ0dldHRlciwgKGlzT3BlbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFfLmlzRnVuY3Rpb24oc2hvd1NldHRlcikpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNPcGVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93U2V0dGVyKCRzY29wZSwgaXNPcGVuKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCA2MDApO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzaG93U2V0dGVyKCRzY29wZSwgaXNPcGVuKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBwaXBGYWJUb29sdGlwVmlzaWJpbGl0eSgkcGFyc2UsICR0aW1lb3V0KSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICAgICAgc2NvcGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBGYWJUb29sdGlwVmlzaWJpbGl0eUNvbnRyb2xsZXJcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdwaXBGYWJUb29sdGlwVmlzaWJpbGl0eScsIFtdKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3BpcEZhYlRvb2x0aXBWaXNpYmlsaXR5JywgcGlwRmFiVG9vbHRpcFZpc2liaWxpdHkpO1xyXG5cclxufSkoKTsiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGludGVyZmFjZSBJUmVmcmVzaEJ1dHRvbkJpbmRpbmdzIHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcblxyXG4gICAgICAgIHRleHQ6IGFueSxcclxuICAgICAgICAgICAgdmlzaWJsZTogYW55LFxyXG4gICAgICAgICAgICBvblJlZnJlc2g6IGFueVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IFJlZnJlc2hCdXR0b25CaW5kaW5nczogSVJlZnJlc2hCdXR0b25CaW5kaW5ncyA9IHtcclxuICAgICAgICB0ZXh0OiAnPHBpcFRleHQnLFxyXG4gICAgICAgIHZpc2libGU6ICc8cGlwVmlzaWJsZScsXHJcbiAgICAgICAgb25SZWZyZXNoOiAnJj9waXBSZWZyZXNoJ1xyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIFJlZnJlc2hCdXR0b25DaGFuZ2VzIGltcGxlbWVudHMgbmcuSU9uQ2hhbmdlc09iamVjdCwgSVJlZnJlc2hCdXR0b25CaW5kaW5ncyB7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogbmcuSUNoYW5nZXNPYmplY3QgPCBhbnkgPiA7XHJcbiAgICAgICAgLy8gTm90IG9uZSB3YXkgYmluZGluZ3NcclxuICAgICAgICBvblJlZnJlc2g6IG5nLklDaGFuZ2VzT2JqZWN0IDwgKHtcclxuICAgICAgICAgICAgJGV2ZW50OiBhbnlcclxuICAgICAgICB9KSA9PiBuZy5JUHJvbWlzZSA8IGFueSA+PiA7XHJcbiAgICAgICAgLy8gT25lIHdheSBiaW5kaW5nc1xyXG4gICAgICAgIHRleHQ6IG5nLklDaGFuZ2VzT2JqZWN0IDwgc3RyaW5nID4gO1xyXG4gICAgICAgIHZpc2libGU6IG5nLklDaGFuZ2VzT2JqZWN0IDwgYm9vbGVhbiA+IDtcclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBSZWZyZXNoQnV0dG9uQ29udHJvbGxlciBpbXBsZW1lbnRzIElSZWZyZXNoQnV0dG9uQmluZGluZ3Mge1xyXG5cclxuICAgICAgICBwcml2YXRlIF90ZXh0RWxlbWVudDogYW55O1xyXG4gICAgICAgIHByaXZhdGUgX2J1dHRvbkVsZW1lbnQ6IGFueTtcclxuICAgICAgICBwcml2YXRlIF93aWR0aDogbnVtYmVyO1xyXG5cclxuICAgICAgICBwdWJsaWMgdGV4dDogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyB2aXNpYmxlOiBib29sZWFuO1xyXG4gICAgICAgIHB1YmxpYyBvblJlZnJlc2g6IChwYXJhbToge1xyXG4gICAgICAgICAgICAkZXZlbnQ6IG5nLklBbmd1bGFyRXZlbnRcclxuICAgICAgICB9KSA9PiBuZy5JUHJvbWlzZSA8IGFueSA+IDtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgICAgIHByaXZhdGUgJHNjb3BlOiBuZy5JU2NvcGUsXHJcbiAgICAgICAgICAgIHByaXZhdGUgJGVsZW1lbnQ6IGFueSxcclxuICAgICAgICAgICAgcHJpdmF0ZSAkYXR0cnM6IG5nLklBdHRyaWJ1dGVzXHJcbiAgICAgICAgKSB7fVxyXG5cclxuICAgICAgICBwdWJsaWMgJHBvc3RMaW5rKCkge1xyXG4gICAgICAgICAgICB0aGlzLl9idXR0b25FbGVtZW50ID0gdGhpcy4kZWxlbWVudC5jaGlsZHJlbignLm1kLWJ1dHRvbicpO1xyXG4gICAgICAgICAgICB0aGlzLl90ZXh0RWxlbWVudCA9IHRoaXMuX2J1dHRvbkVsZW1lbnQuY2hpbGRyZW4oJy5waXAtcmVmcmVzaC10ZXh0Jyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNob3coKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyAkb25DaGFuZ2VzKGNoYW5nZXM6IFJlZnJlc2hCdXR0b25DaGFuZ2VzKSB7XHJcbiAgICAgICAgICAgIGlmIChjaGFuZ2VzLnZpc2libGUuY3VycmVudFZhbHVlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHQgPSBjaGFuZ2VzLnRleHQuY3VycmVudFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIG9uQ2xpY2soJGV2ZW50KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uUmVmcmVzaCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vblJlZnJlc2goe1xyXG4gICAgICAgICAgICAgICAgICAgICRldmVudDogJGV2ZW50XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzaG93KCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fdGV4dEVsZW1lbnQgPT09IHVuZGVmaW5lZCB8fCB0aGlzLl9idXR0b25FbGVtZW50ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBTZXQgbmV3IHRleHRcclxuICAgICAgICAgICAgdGhpcy5fdGV4dEVsZW1lbnQudGV4dCh0aGlzLnRleHQpO1xyXG4gICAgICAgICAgICAvLyBTaG93IGJ1dHRvblxyXG4gICAgICAgICAgICB0aGlzLl9idXR0b25FbGVtZW50LnNob3coKTtcclxuICAgICAgICAgICAgLy8gQWRqdXN0IHBvc2l0aW9uXHJcbiAgICAgICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5fYnV0dG9uRWxlbWVudC53aWR0aCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9idXR0b25FbGVtZW50LmNzcygnbWFyZ2luLWxlZnQnLCAnLScgKyB3aWR0aCAvIDIgKyAncHgnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgaGlkZSgpIHtcclxuICAgICAgICAgICAgdGhpcy5fYnV0dG9uRWxlbWVudC5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBjb25zdCBSZWZyZXNoQnV0dG9uQ29tcG9uZW50OiBuZy5JQ29tcG9uZW50T3B0aW9ucyA9IHtcclxuICAgICAgICBiaW5kaW5nczogUmVmcmVzaEJ1dHRvbkJpbmRpbmdzLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFJlZnJlc2hCdXR0b25Db250cm9sbGVyLFxyXG4gICAgICAgIHRlbXBsYXRlOiAnPG1kLWJ1dHRvbiBjbGFzcz1cInBpcC1yZWZyZXNoLWJ1dHRvblwiIHRhYmluZGV4PVwiLTFcIiBuZy1jbGljaz1cIiRjdHJsLm9uQ2xpY2soJGV2ZW50KVwiIGFyaWEtbGFiZWw9XCJSRUZSRVNIXCI+JyArXHJcbiAgICAgICAgICAgICc8bWQtaWNvbiBtZC1zdmctaWNvbj1cImljb25zOnJlZnJlc2hcIj48L21kLWljb24+JyArXHJcbiAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cInBpcC1yZWZyZXNoLXRleHRcIj48L3NwYW4+JyArXHJcbiAgICAgICAgICAgICc8L21kLWJ1dHRvbj4nXHJcbiAgICB9O1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdwaXBSZWZyZXNoQnV0dG9uJywgWyduZ01hdGVyaWFsJ10pXHJcbiAgICAgICAgLmNvbXBvbmVudCgncGlwUmVmcmVzaEJ1dHRvbicsIFJlZnJlc2hCdXR0b25Db21wb25lbnQpO1xyXG5cclxufSkoKTsiLCIvLyAvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGNsYXNzIFRvZ2dsZUJ1dHRvbiB7XHJcbiAgICAgICAgaWQ6IGFueTtcclxuICAgICAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgZGlzYWJsZWQ6IGJvb2xlYW47XHJcbiAgICAgICAgbGV2ZWw6IG51bWJlcjtcclxuICAgICAgICBkaXNlbGVjdGFibGU6IGJvb2xlYW47XHJcbiAgICAgICAgZmlsbGVkOiBib29sZWFuO1xyXG4gICAgfVxyXG5cclxuICAgIGludGVyZmFjZSBJVG9nZ2xlQnV0dG9uc0JpbmRpbmdzIHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcblxyXG4gICAgICAgIG5nRGlzYWJsZWQ6IGFueSxcclxuICAgICAgICAgICAgYnV0dG9uczogYW55LFxyXG4gICAgICAgICAgICBjdXJyZW50QnV0dG9uVmFsdWU6IGFueSxcclxuICAgICAgICAgICAgY3VycmVudEJ1dHRvbjogYW55LFxyXG4gICAgICAgICAgICBtdWx0aXNlbGVjdDogYW55LFxyXG4gICAgICAgICAgICBjaGFuZ2U6IGFueSxcclxuICAgICAgICAgICAgb25seVRvZ2dsZTogYW55XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgVG9nZ2xlQnV0dG9uc0JpbmRpbmdzOiBJVG9nZ2xlQnV0dG9uc0JpbmRpbmdzID0ge1xyXG4gICAgICAgIG5nRGlzYWJsZWQ6ICc8PycsXHJcbiAgICAgICAgYnV0dG9uczogJzxwaXBCdXR0b25zJyxcclxuICAgICAgICBjdXJyZW50QnV0dG9uVmFsdWU6ICc9bmdNb2RlbCcsXHJcbiAgICAgICAgY3VycmVudEJ1dHRvbjogJz0/cGlwQnV0dG9uT2JqZWN0JyxcclxuICAgICAgICBtdWx0aXNlbGVjdDogJzw/cGlwTXVsdGlzZWxlY3QnLFxyXG4gICAgICAgIGNoYW5nZTogJyZuZ0NoYW5nZScsXHJcbiAgICAgICAgb25seVRvZ2dsZTogJzw/cGlwT25seVRvZ2dsZSdcclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBUb2dnbGVCdXR0b25zQ2hhbmdlcyBpbXBsZW1lbnRzIG5nLklPbkNoYW5nZXNPYmplY3QsIElUb2dnbGVCdXR0b25zQmluZGluZ3Mge1xyXG4gICAgICAgIFtrZXk6IHN0cmluZ106IG5nLklDaGFuZ2VzT2JqZWN0IDwgYW55ID4gO1xyXG4gICAgICAgIC8vIE5vdCBvbmUgd2F5IGJpbmRpbmdzXHJcbiAgICAgICAgY3VycmVudEJ1dHRvblZhbHVlOiBhbnk7XHJcbiAgICAgICAgY3VycmVudEJ1dHRvbjogYW55O1xyXG4gICAgICAgIGNoYW5nZTogbmcuSUNoYW5nZXNPYmplY3QgPCAoKSA9PiBuZy5JUHJvbWlzZSA8IHZvaWQgPj4gO1xyXG4gICAgICAgIC8vIE9uZSB3YXkgYmluZGluZ3NcclxuICAgICAgICBuZ0Rpc2FibGVkOiBuZy5JQ2hhbmdlc09iamVjdCA8IGJvb2xlYW4gPiA7XHJcbiAgICAgICAgYnV0dG9uczogbmcuSUNoYW5nZXNPYmplY3QgPCBUb2dnbGVCdXR0b25bXSA+IDtcclxuICAgICAgICBtdWx0aXNlbGVjdDogbmcuSUNoYW5nZXNPYmplY3QgPCBib29sZWFuID4gO1xyXG4gICAgICAgIG9ubHlUb2dnbGU6IG5nLklDaGFuZ2VzT2JqZWN0IDwgYm9vbGVhbiA+IDtcclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBUb2dnbGVCdXR0b25zQ29udHJvbGxlciBpbXBsZW1lbnRzIElUb2dnbGVCdXR0b25zQmluZGluZ3Mge1xyXG4gICAgICAgIGxlbmdodDogbnVtYmVyO1xyXG5cclxuICAgICAgICBwdWJsaWMgbmdEaXNhYmxlZDogYm9vbGVhbjtcclxuICAgICAgICBwdWJsaWMgY2xhc3M6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMgbXVsdGlzZWxlY3Q6IGJvb2xlYW47XHJcbiAgICAgICAgcHVibGljIGJ1dHRvbnM6IFRvZ2dsZUJ1dHRvbltdO1xyXG4gICAgICAgIHB1YmxpYyBkaXNhYmxlZDogYm9vbGVhbjtcclxuICAgICAgICBwdWJsaWMgY3VycmVudEJ1dHRvblZhbHVlOiBhbnk7XHJcbiAgICAgICAgcHVibGljIGN1cnJlbnRCdXR0b25JbmRleDogbnVtYmVyO1xyXG4gICAgICAgIHB1YmxpYyBjdXJyZW50QnV0dG9uOiBhbnk7XHJcbiAgICAgICAgcHVibGljIGNoYW5nZTogKCkgPT4gbmcuSVByb21pc2UgPCBhbnkgPiA7XHJcbiAgICAgICAgcHVibGljIG9ubHlUb2dnbGU6IGJvb2xlYW47XHJcbiAgICAgICAgcHVibGljIHBpcE1lZGlhOiBhbnk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICBwcml2YXRlICRlbGVtZW50OiBhbnksXHJcbiAgICAgICAgICAgIHByaXZhdGUgJGF0dHJzOiBhbmd1bGFyLklBdHRyaWJ1dGVzLFxyXG4gICAgICAgICAgICBwcml2YXRlICRzY29wZTogYW5ndWxhci5JU2NvcGUsXHJcbiAgICAgICAgICAgIHByaXZhdGUgJHRpbWVvdXQ6IG5nLklUaW1lb3V0U2VydmljZSxcclxuICAgICAgICAgICAgJGluamVjdG9yOiBuZy5hdXRvLklJbmplY3RvclNlcnZpY2VcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgXCJuZ0luamVjdFwiO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5waXBNZWRpYSA9ICRpbmplY3Rvci5oYXMoJ3BpcE1lZGlhJykgPyAkaW5qZWN0b3IuZ2V0KCdwaXBNZWRpYScpIDogbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5jbGFzcyA9ICRhdHRyc1snY2xhc3MnXSB8fCAnJztcclxuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBfLmluZGV4T2YodGhpcy5idXR0b25zLCBfLmZpbmQodGhpcy5idXR0b25zLCB7XHJcbiAgICAgICAgICAgICAgICBpZDogdGhpcy5jdXJyZW50QnV0dG9uVmFsdWVcclxuICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b25JbmRleCA9IGluZGV4IDwgMCA/IDAgOiBpbmRleDtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50QnV0dG9uID0gdGhpcy5idXR0b25zLmxlbmd0aCA+IDAgPyB0aGlzLmJ1dHRvbnNbdGhpcy5jdXJyZW50QnV0dG9uSW5kZXhdIDogdGhpcy5jdXJyZW50QnV0dG9uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljICRvbkNoYW5nZXMoY2hhbmdlczogVG9nZ2xlQnV0dG9uc0NoYW5nZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5tdWx0aXNlbGVjdCA9IGNoYW5nZXMubXVsdGlzZWxlY3QgPyBjaGFuZ2VzLm11bHRpc2VsZWN0LmN1cnJlbnRWYWx1ZSA6IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmRpc2FibGVkID0gY2hhbmdlcy5uZ0Rpc2FibGVkID8gY2hhbmdlcy5uZ0Rpc2FibGVkLmN1cnJlbnRWYWx1ZSA6IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLm9ubHlUb2dnbGUgPSBjaGFuZ2VzLm9ubHlUb2dnbGUgPyBjaGFuZ2VzLm9ubHlUb2dnbGUuY3VycmVudFZhbHVlIDogZmFsc2U7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbnMgPSAhY2hhbmdlcy5idXR0b25zIHx8IF8uaXNBcnJheShjaGFuZ2VzLmJ1dHRvbnMuY3VycmVudFZhbHVlKSAmJiBjaGFuZ2VzLmJ1dHRvbnMuY3VycmVudFZhbHVlLmxlbmd0aCA9PT0gMCA/IFtdIDogY2hhbmdlcy5idXR0b25zLmN1cnJlbnRWYWx1ZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gXy5pbmRleE9mKHRoaXMuYnV0dG9ucywgXy5maW5kKHRoaXMuYnV0dG9ucywge1xyXG4gICAgICAgICAgICAgICAgaWQ6IHRoaXMuY3VycmVudEJ1dHRvblZhbHVlXHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50QnV0dG9uSW5kZXggPSBpbmRleCA8IDAgPyAwIDogaW5kZXg7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbiA9IHRoaXMuYnV0dG9ucy5sZW5ndGggPiAwID8gdGhpcy5idXR0b25zW3RoaXMuY3VycmVudEJ1dHRvbkluZGV4XSA6IHRoaXMuY3VycmVudEJ1dHRvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyAkcG9zdExpbmsoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJGVsZW1lbnRcclxuICAgICAgICAgICAgICAgIC5vbignZm9jdXNpbicsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRlbGVtZW50LmFkZENsYXNzKCdmb2N1c2VkLWNvbnRhaW5lcicpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5vbignZm9jdXNvdXQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5yZW1vdmVDbGFzcygnZm9jdXNlZC1jb250YWluZXInKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGJ1dHRvblNlbGVjdGVkKGluZGV4KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbkluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbiA9IHRoaXMuYnV0dG9uc1t0aGlzLmN1cnJlbnRCdXR0b25JbmRleF07XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEJ1dHRvblZhbHVlID0gdGhpcy5jdXJyZW50QnV0dG9uLmlkIHx8IGluZGV4O1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaGFuZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBlbnRlclNwYWNlUHJlc3MoZXZlbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25TZWxlY3RlZChldmVudC5pbmRleCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgaGlnaGxpZ2h0QnV0dG9uKGluZGV4KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm11bHRpc2VsZWN0ICYmXHJcbiAgICAgICAgICAgICAgICAhXy5pc1VuZGVmaW5lZCh0aGlzLmN1cnJlbnRCdXR0b24ubGV2ZWwpICYmXHJcbiAgICAgICAgICAgICAgICAhXy5pc1VuZGVmaW5lZCh0aGlzLmJ1dHRvbnNbaW5kZXhdLmxldmVsKSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRCdXR0b24ubGV2ZWwgPj0gdGhpcy5idXR0b25zW2luZGV4XS5sZXZlbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudEJ1dHRvbkluZGV4ID09IGluZGV4O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBUb2dnbGVCdXR0b25zOiBuZy5JQ29tcG9uZW50T3B0aW9ucyA9IHtcclxuICAgICAgICBiaW5kaW5nczogVG9nZ2xlQnV0dG9uc0JpbmRpbmdzLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAndG9nZ2xlX2J1dHRvbnMvdG9nZ2xlX2J1dHRvbnMuaHRtbCcsXHJcbiAgICAgICAgY29udHJvbGxlcjogVG9nZ2xlQnV0dG9uc0NvbnRyb2xsZXJcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncGlwVG9nZ2xlQnV0dG9ucycsIFsncGlwQnV0dG9ucy5UZW1wbGF0ZXMnXSlcclxuICAgICAgICAuY29tcG9uZW50KCdwaXBUb2dnbGVCdXR0b25zJywgVG9nZ2xlQnV0dG9ucyk7XHJcblxyXG59KSgpOyIsIihmdW5jdGlvbihtb2R1bGUpIHtcbnRyeSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBCdXR0b25zLlRlbXBsYXRlcycpO1xufSBjYXRjaCAoZSkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQnV0dG9ucy5UZW1wbGF0ZXMnLCBbXSk7XG59XG5tb2R1bGUucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAkdGVtcGxhdGVDYWNoZS5wdXQoJ3RvZ2dsZV9idXR0b25zL3RvZ2dsZV9idXR0b25zLmh0bWwnLFxuICAgICc8ZGl2IGNsYXNzPVwicGlwLXRvZ2dsZS1idXR0b25zIGxheW91dC1yb3cge3skY3RybC5jbGFzc319XCIgXFxuJyArXG4gICAgJyAgICAgcGlwLXNlbGVjdGVkPVwiJGN0cmwuYnVmQnV0dG9uSW5kZXhcIiBcXG4nICtcbiAgICAnICAgICBwaXAtZW50ZXItc3BhY2UtcHJlc3M9XCIkY3RybC5lbnRlclNwYWNlUHJlc3MoJGV2ZW50KVwiXFxuJyArXG4gICAgJyAgICAgbmctaWY9XCIhJGN0cmwucGlwTWVkaWEoXFwneHNcXCcpIHx8ICRjdHJsLm9ubHlUb2dnbGVcIj5cXG4nICtcbiAgICAnICAgIDxtZC1idXR0b24gdGFiaW5kZXg9XCItMVwiIG5nLXJlcGVhdD1cImJ1dHRvbiBpbiAkY3RybC5idXR0b25zXCJcXG4nICtcbiAgICAnICAgICAgICAgICAgICAgbmctY2xhc3M9XCJ7XFwnbWQtYWNjZW50IG1kLXJhaXNlZCBzZWxlY3RlZCBjb2xvci1hY2NlbnQtYmdcXCcgOiAkY3RybC5oaWdobGlnaHRCdXR0b24oJGluZGV4KX1cIlxcbicgK1xuICAgICcgICAgICAgICAgICAgICBuZy1hdHRyLXN0eWxlPVwie3sgXFwnYmFja2dyb3VuZC1jb2xvcjpcXCcgKyAoJGN0cmwuaGlnaGxpZ2h0QnV0dG9uKCRpbmRleCkgPyBidXR0b24uYmFja2dyb3VuZENvbG9yIDogXFwnXFwnKSArIFxcJyFpbXBvcnRhbnRcXCcgfX1cIlxcbicgK1xuICAgICcgICAgICAgICAgICAgICBjbGFzcz1cInBpcC1zZWxlY3RhYmxlIHBpcC1jaGlwLWJ1dHRvbiBmbGV4XCIgbmctY2xpY2s9XCIkY3RybC5idXR0b25TZWxlY3RlZCgkaW5kZXgsICRldmVudClcIlxcbicgK1xuICAgICcgICAgICAgICAgICAgICBuZy1kaXNhYmxlZD1cImJ1dHRvbi5kaXNhYmxlZCB8fCAkY3RybC5kaXNhYmxlZFwiPlxcbicgK1xuICAgICcgICAgICAgIHt7YnV0dG9uLm5hbWUgfHwgYnV0dG9uLnRpdGxlIHwgdHJhbnNsYXRlfX1cXG4nICtcbiAgICAnICAgICAgICA8c3BhbiBuZy1pZj1cImJ1dHRvbi5jaGVja2VkIHx8IGJ1dHRvbi5jb21wbGV0ZSB8fCBidXR0b24uZmlsbGVkXCIgY2xhc3M9XCJwaXAtdGFnZ2VkXCI+Kjwvc3Bhbj5cXG4nICtcbiAgICAnICAgIDwvbWQtYnV0dG9uPlxcbicgK1xuICAgICc8L2Rpdj5cXG4nICtcbiAgICAnXFxuJyArXG4gICAgJzxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIG5nLWlmPVwiJGN0cmwucGlwTWVkaWEoXFwneHNcXCcpICYmICEkY3RybC5vbmx5VG9nZ2xlXCI+XFxuJyArXG4gICAgJyAgICA8bWQtc2VsZWN0IG5nLW1vZGVsPVwiJGN0cmwuY3VycmVudEJ1dHRvbkluZGV4XCIgbmctZGlzYWJsZWQ9XCIkY3RybC5kaXNhYmxlZFwiIGFyaWEtbGFiZWw9XCJEUk9QRE9XTlwiIFxcbicgK1xuICAgICcgICAgICAgICAgICAgIG1kLW9uLWNsb3NlPVwiJGN0cmwuYnV0dG9uU2VsZWN0ZWQoJGN0cmwuY3VycmVudEJ1dHRvbkluZGV4KVwiPlxcbicgK1xuICAgICcgICAgICAgIDxtZC1vcHRpb24gbmctcmVwZWF0PVwiYWN0aW9uIGluICRjdHJsLmJ1dHRvbnNcIiB2YWx1ZT1cInt7IDo6JGluZGV4IH19XCI+XFxuJyArXG4gICAgJyAgICAgICAgICAgIHt7IChhY3Rpb24udGl0bGUgfHwgYWN0aW9uLm5hbWUpIHwgdHJhbnNsYXRlIH19XFxuJyArXG4gICAgJyAgICAgICAgICAgIDxzcGFuIG5nLWlmPVwiYWN0aW9uLmNoZWNrZWQgfHwgYWN0aW9uLmNvbXBsZXRlIHx8IGFjdGlvbi5maWxsZWRcIiBjbGFzcz1cInBpcC10YWdnZWRcIj4qPC9zcGFuPlxcbicgK1xuICAgICcgICAgICAgIDwvbWQtb3B0aW9uPlxcbicgK1xuICAgICcgICAgPC9tZC1zZWxlY3Q+XFxuJyArXG4gICAgJzwvbWQtaW5wdXQtY29udGFpbmVyPlxcbicgK1xuICAgICcnKTtcbn1dKTtcbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBpcC13ZWJ1aS1idXR0b25zLWh0bWwuanMubWFwXG4iXX0=
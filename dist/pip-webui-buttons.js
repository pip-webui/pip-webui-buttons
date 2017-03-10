(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.pip || (g.pip = {})).buttons = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
angular.module('pipButtons', [
    'pipToggleButtons',
    'pipRefreshButton',
    'pipFabTooltipVisibility'
]);
},{}],2:[function(require,module,exports){
{
    ToggleButtonsFilter.$inject = ['$injector'];
    function ToggleButtonsFilter($injector) {
        var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;
        return function (key) {
            return pipTranslate ? pipTranslate['translate'](key) || key : key;
        };
    }
    angular.module('pipButtons.Translate', [])
        .filter('translate', ToggleButtonsFilter);
}
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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
    angular.module('pipRefreshButton', ['ngMaterial'])
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
        templateUrl: 'toggle_buttons/toggle_buttons.html',
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYnV0dG9ucy50cyIsInNyYy9kZXBlbmRlbmNpZXMvdHJhbnNsYXRlLnRzIiwic3JjL2ZhYnMvZmFiX3Rvb2x0aXBfdmlzaWJpbGl0eS50cyIsInNyYy9yZWZyZXNoX2J1dHRvbi9yZWZyZXNoX2J1dHRvbi50cyIsInNyYy90b2dnbGVfYnV0dG9ucy90b2dnbGVfYnV0dG9ucy50cyIsInRlbXAvcGlwLXdlYnVpLWJ1dHRvbnMtaHRtbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0NBLE9BQU8sQ0FBQyxNQUFNLENBQUMsWUFBWSxFQUFFO0lBQ3pCLGtCQUFrQjtJQUNsQixrQkFBa0I7SUFDbEIseUJBQXlCO0NBQzVCLENBQUMsQ0FBQzs7QUNISCxDQUFDO0lBQ0csNkJBQTZCLFNBQW1DO1FBQzVELElBQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFMUYsTUFBTSxDQUFDLFVBQVUsR0FBVztZQUN4QixNQUFNLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ3RFLENBQUMsQ0FBQTtJQUNMLENBQUM7SUFFRCxPQUFPLENBQUMsTUFBTSxDQUFDLHNCQUFzQixFQUFFLEVBQUUsQ0FBQztTQUNyQyxNQUFNLENBQUMsV0FBVyxFQUFFLG1CQUFtQixDQUFDLENBQUM7QUFDbEQsQ0FBQzs7QUNYRCxDQUFDO0lBQ0c7UUFLSSwwQ0FDSSxRQUFhLEVBQ2IsTUFBMkIsRUFDM0IsTUFBc0IsRUFDdEIsUUFBNEIsRUFDNUIsTUFBTTtZQUVOLFVBQVUsQ0FBQztZQUNYLElBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMseUJBQXlCLENBQUMsQ0FB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SSxDQUFDLGtCQUFrQixJQUFJLEtBQUssQ0FBQztRQUM1QyxDQUFDO1FBQ0wsOEJBQUM7SUFBRCxDQXZGQSxBQXVGQyxJQUFBO0lBRUQsSUFBTSxhQUFhLEdBQXlCO1FBQ3hDLFFBQVEsRUFBRSxxQkFBcUI7UUFDL0IsV0FBVyxFQUFFLG9DQUFvQztRQUNqRCxVQUFVLEVBQUUsdUJBQXVCO0tBQ3RDLENBQUE7SUFFRCxPQUFPO1NBQ0YsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUMsc0JBQXNCLENBQUMsQ0FBQztTQUNwRCxTQUFTLENBQUMsa0JBQWtCLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDdEQsQ0FBQzs7QUNqSkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwi77u/Ly8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5hbmd1bGFyLm1vZHVsZSgncGlwQnV0dG9ucycsIFtcclxuICAgICdwaXBUb2dnbGVCdXR0b25zJyxcclxuICAgICdwaXBSZWZyZXNoQnV0dG9uJyxcclxuICAgICdwaXBGYWJUb29sdGlwVmlzaWJpbGl0eSdcclxuXSk7IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxue1xyXG4gICAgZnVuY3Rpb24gVG9nZ2xlQnV0dG9uc0ZpbHRlcigkaW5qZWN0b3I6IG5nLmF1dG8uSUluamVjdG9yU2VydmljZSkge1xyXG4gICAgICAgIGNvbnN0IHBpcFRyYW5zbGF0ZSA9ICRpbmplY3Rvci5oYXMoJ3BpcFRyYW5zbGF0ZScpID8gJGluamVjdG9yLmdldCgncGlwVHJhbnNsYXRlJykgOiBudWxsO1xyXG5cclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGtleTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwaXBUcmFuc2xhdGUgPyBwaXBUcmFuc2xhdGVbJ3RyYW5zbGF0ZSddKGtleSkgfHwga2V5IDoga2V5O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgncGlwQnV0dG9ucy5UcmFuc2xhdGUnLCBbXSlcclxuICAgICAgICAuZmlsdGVyKCd0cmFuc2xhdGUnLCBUb2dnbGVCdXR0b25zRmlsdGVyKTtcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbntcclxuICAgIGNsYXNzIEZhYlRvb2x0aXBWaXNpYmlsaXR5Q29udHJvbGxlciB7XHJcbiAgICAgICAgcHJpdmF0ZSBfZWxlbWVudDtcclxuICAgICAgICBwcml2YXRlIF9zY29wZTogYW5ndWxhci5JU2NvcGU7XHJcbiAgICAgICAgcHJpdmF0ZSBfdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgJGVsZW1lbnQ6IGFueSxcclxuICAgICAgICAgICAgJGF0dHJzOiBhbmd1bGFyLklBdHRyaWJ1dGVzLFxyXG4gICAgICAgICAgICAkc2NvcGU6IGFuZ3VsYXIuSVNjb3BlLFxyXG4gICAgICAgICAgICAkdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlLFxyXG4gICAgICAgICAgICAkcGFyc2VcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgXCJuZ0luamVjdFwiO1xyXG4gICAgICAgICAgICBsZXQgdHJpZ0dldHRlciA9ICRwYXJzZSgkYXR0cnNbJ3BpcEZhYlRvb2x0aXBWaXNpYmlsaXR5J10pLFxyXG4gICAgICAgICAgICAgICAgc2hvd0dldHRlciA9ICRwYXJzZSgkYXR0cnNbJ3BpcEZhYlNob3dUb29sdGlwJ10pLFxyXG4gICAgICAgICAgICAgICAgc2hvd1NldHRlciA9IHNob3dHZXR0ZXIuYXNzaWduO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLiR3YXRjaCh0cmlnR2V0dGVyLCAoaXNPcGVuKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIV8uaXNGdW5jdGlvbihzaG93U2V0dGVyKSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpc09wZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAkdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dTZXR0ZXIoJHNjb3BlLCBpc09wZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDYwMCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNob3dTZXR0ZXIoJHNjb3BlLCBpc09wZW4pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIHBpcEZhYlRvb2x0aXBWaXNpYmlsaXR5KCRwYXJzZSwgJHRpbWVvdXQpOiBuZy5JRGlyZWN0aXZlIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgICAgICBzY29wZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IEZhYlRvb2x0aXBWaXNpYmlsaXR5Q29udHJvbGxlclxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcEZhYlRvb2x0aXBWaXNpYmlsaXR5JywgW10pXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgncGlwRmFiVG9vbHRpcFZpc2liaWxpdHknLCBwaXBGYWJUb29sdGlwVmlzaWJpbGl0eSk7XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG57XHJcbiAgICBpbnRlcmZhY2UgSVJlZnJlc2hCdXR0b25CaW5kaW5ncyB7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogYW55O1xyXG5cclxuICAgICAgICB0ZXh0OiBhbnk7XHJcbiAgICAgICAgdmlzaWJsZTogYW55O1xyXG4gICAgICAgIG9uUmVmcmVzaDogYW55XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgUmVmcmVzaEJ1dHRvbkJpbmRpbmdzOiBJUmVmcmVzaEJ1dHRvbkJpbmRpbmdzID0ge1xyXG4gICAgICAgIHRleHQ6ICc8cGlwVGV4dCcsXHJcbiAgICAgICAgdmlzaWJsZTogJzxwaXBWaXNpYmxlJyxcclxuICAgICAgICBvblJlZnJlc2g6ICcmP3BpcFJlZnJlc2gnXHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgUmVmcmVzaEJ1dHRvbkNoYW5nZXMgaW1wbGVtZW50cyBuZy5JT25DaGFuZ2VzT2JqZWN0LCBJUmVmcmVzaEJ1dHRvbkJpbmRpbmdzIHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBuZy5JQ2hhbmdlc09iamVjdCA8IGFueSA+IDtcclxuICAgICAgICAvLyBOb3Qgb25lIHdheSBiaW5kaW5nc1xyXG4gICAgICAgIG9uUmVmcmVzaDogbmcuSUNoYW5nZXNPYmplY3QgPCAoe1xyXG4gICAgICAgICAgICAkZXZlbnQ6IGFueVxyXG4gICAgICAgIH0pID0+IG5nLklQcm9taXNlIDwgYW55ID4+IDtcclxuICAgICAgICAvLyBPbmUgd2F5IGJpbmRpbmdzXHJcbiAgICAgICAgdGV4dDogbmcuSUNoYW5nZXNPYmplY3QgPCBzdHJpbmcgPiA7XHJcbiAgICAgICAgdmlzaWJsZTogbmcuSUNoYW5nZXNPYmplY3QgPCBib29sZWFuID4gO1xyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIFJlZnJlc2hCdXR0b25Db250cm9sbGVyIGltcGxlbWVudHMgSVJlZnJlc2hCdXR0b25CaW5kaW5ncyB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX3RleHRFbGVtZW50OiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSBfYnV0dG9uRWxlbWVudDogYW55O1xyXG4gICAgICAgIHByaXZhdGUgX3dpZHRoOiBudW1iZXI7XHJcblxyXG4gICAgICAgIHB1YmxpYyB0ZXh0OiBzdHJpbmc7XHJcbiAgICAgICAgcHVibGljIHZpc2libGU6IGJvb2xlYW47XHJcbiAgICAgICAgcHVibGljIG9uUmVmcmVzaDogKHBhcmFtOiB7XHJcbiAgICAgICAgICAgICRldmVudDogbmcuSUFuZ3VsYXJFdmVudFxyXG4gICAgICAgIH0pID0+IG5nLklQcm9taXNlIDwgYW55ID4gO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgcHJpdmF0ZSAkc2NvcGU6IG5nLklTY29wZSxcclxuICAgICAgICAgICAgcHJpdmF0ZSAkZWxlbWVudDogYW55LFxyXG4gICAgICAgICAgICBwcml2YXRlICRhdHRyczogbmcuSUF0dHJpYnV0ZXNcclxuICAgICAgICApIHt9XHJcblxyXG4gICAgICAgIHB1YmxpYyAkcG9zdExpbmsoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2J1dHRvbkVsZW1lbnQgPSB0aGlzLiRlbGVtZW50LmNoaWxkcmVuKCcubWQtYnV0dG9uJyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3RleHRFbGVtZW50ID0gdGhpcy5fYnV0dG9uRWxlbWVudC5jaGlsZHJlbignLnBpcC1yZWZyZXNoLXRleHQnKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2hvdygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljICRvbkNoYW5nZXMoY2hhbmdlczogUmVmcmVzaEJ1dHRvbkNoYW5nZXMpIHtcclxuICAgICAgICAgICAgaWYgKGNoYW5nZXMudmlzaWJsZS5jdXJyZW50VmFsdWUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dCA9IGNoYW5nZXMudGV4dC5jdXJyZW50VmFsdWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3coKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgb25DbGljaygkZXZlbnQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub25SZWZyZXNoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uUmVmcmVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgJGV2ZW50OiAkZXZlbnRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHNob3coKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl90ZXh0RWxlbWVudCA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuX2J1dHRvbkVsZW1lbnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIFNldCBuZXcgdGV4dFxyXG4gICAgICAgICAgICB0aGlzLl90ZXh0RWxlbWVudC50ZXh0KHRoaXMudGV4dCk7XHJcbiAgICAgICAgICAgIC8vIFNob3cgYnV0dG9uXHJcbiAgICAgICAgICAgIHRoaXMuX2J1dHRvbkVsZW1lbnQuc2hvdygpO1xyXG4gICAgICAgICAgICAvLyBBZGp1c3QgcG9zaXRpb25cclxuICAgICAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLl9idXR0b25FbGVtZW50LndpZHRoKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2J1dHRvbkVsZW1lbnQuY3NzKCdtYXJnaW4tbGVmdCcsICctJyArIHdpZHRoIC8gMiArICdweCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBoaWRlKCkge1xyXG4gICAgICAgICAgICB0aGlzLl9idXR0b25FbGVtZW50LmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGNvbnN0IFJlZnJlc2hCdXR0b25Db21wb25lbnQ6IG5nLklDb21wb25lbnRPcHRpb25zID0ge1xyXG4gICAgICAgIGJpbmRpbmdzOiBSZWZyZXNoQnV0dG9uQmluZGluZ3MsXHJcbiAgICAgICAgY29udHJvbGxlcjogUmVmcmVzaEJ1dHRvbkNvbnRyb2xsZXIsXHJcbiAgICAgICAgdGVtcGxhdGU6ICc8bWQtYnV0dG9uIGNsYXNzPVwicGlwLXJlZnJlc2gtYnV0dG9uXCIgdGFiaW5kZXg9XCItMVwiIG5nLWNsaWNrPVwiJGN0cmwub25DbGljaygkZXZlbnQpXCIgYXJpYS1sYWJlbD1cIlJFRlJFU0hcIj4nICtcclxuICAgICAgICAgICAgJzxtZC1pY29uIG1kLXN2Zy1pY29uPVwiaWNvbnM6cmVmcmVzaFwiPjwvbWQtaWNvbj4nICtcclxuICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwicGlwLXJlZnJlc2gtdGV4dFwiPjwvc3Bhbj4nICtcclxuICAgICAgICAgICAgJzwvbWQtYnV0dG9uPidcclxuICAgIH07XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ3BpcFJlZnJlc2hCdXR0b24nLCBbJ25nTWF0ZXJpYWwnXSlcclxuICAgICAgICAuY29tcG9uZW50KCdwaXBSZWZyZXNoQnV0dG9uJywgUmVmcmVzaEJ1dHRvbkNvbXBvbmVudCk7XHJcbn0iLCIvLyAvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG57XHJcbiAgICBjbGFzcyBUb2dnbGVCdXR0b24ge1xyXG4gICAgICAgIGlkOiBhbnk7XHJcbiAgICAgICAgbmFtZTogc3RyaW5nO1xyXG4gICAgICAgIGRpc2FibGVkOiBib29sZWFuO1xyXG4gICAgICAgIGxldmVsOiBudW1iZXI7XHJcbiAgICAgICAgZGlzZWxlY3RhYmxlOiBib29sZWFuO1xyXG4gICAgICAgIGZpbGxlZDogYm9vbGVhbjtcclxuICAgIH1cclxuXHJcbiAgICBpbnRlcmZhY2UgSVRvZ2dsZUJ1dHRvbnNCaW5kaW5ncyB7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogYW55O1xyXG5cclxuICAgICAgICBuZ0Rpc2FibGVkOiBhbnk7XHJcbiAgICAgICAgYnV0dG9uczogYW55O1xyXG4gICAgICAgIGN1cnJlbnRCdXR0b25WYWx1ZTogYW55O1xyXG4gICAgICAgIGN1cnJlbnRCdXR0b246IGFueTtcclxuICAgICAgICBtdWx0aXNlbGVjdDogYW55O1xyXG4gICAgICAgIGNoYW5nZTogYW55O1xyXG4gICAgICAgIG9ubHlUb2dnbGU6IGFueVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IFRvZ2dsZUJ1dHRvbnNCaW5kaW5nczogSVRvZ2dsZUJ1dHRvbnNCaW5kaW5ncyA9IHtcclxuICAgICAgICBuZ0Rpc2FibGVkOiAnPD8nLFxyXG4gICAgICAgIGJ1dHRvbnM6ICc8cGlwQnV0dG9ucycsXHJcbiAgICAgICAgY3VycmVudEJ1dHRvblZhbHVlOiAnPW5nTW9kZWwnLFxyXG4gICAgICAgIGN1cnJlbnRCdXR0b246ICc9P3BpcEJ1dHRvbk9iamVjdCcsXHJcbiAgICAgICAgbXVsdGlzZWxlY3Q6ICc8P3BpcE11bHRpc2VsZWN0JyxcclxuICAgICAgICBjaGFuZ2U6ICcmbmdDaGFuZ2UnLFxyXG4gICAgICAgIG9ubHlUb2dnbGU6ICc8P3BpcE9ubHlUb2dnbGUnXHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgVG9nZ2xlQnV0dG9uc0NoYW5nZXMgaW1wbGVtZW50cyBuZy5JT25DaGFuZ2VzT2JqZWN0LCBJVG9nZ2xlQnV0dG9uc0JpbmRpbmdzIHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBuZy5JQ2hhbmdlc09iamVjdCA8IGFueSA+IDtcclxuICAgICAgICAvLyBOb3Qgb25lIHdheSBiaW5kaW5nc1xyXG4gICAgICAgIGN1cnJlbnRCdXR0b25WYWx1ZTogYW55O1xyXG4gICAgICAgIGN1cnJlbnRCdXR0b246IGFueTtcclxuICAgICAgICBjaGFuZ2U6IG5nLklDaGFuZ2VzT2JqZWN0IDwgKCkgPT4gbmcuSVByb21pc2UgPCB2b2lkID4+IDtcclxuICAgICAgICAvLyBPbmUgd2F5IGJpbmRpbmdzXHJcbiAgICAgICAgbmdEaXNhYmxlZDogbmcuSUNoYW5nZXNPYmplY3QgPCBib29sZWFuID4gO1xyXG4gICAgICAgIGJ1dHRvbnM6IG5nLklDaGFuZ2VzT2JqZWN0IDwgVG9nZ2xlQnV0dG9uW10gPiA7XHJcbiAgICAgICAgbXVsdGlzZWxlY3Q6IG5nLklDaGFuZ2VzT2JqZWN0IDwgYm9vbGVhbiA+IDtcclxuICAgICAgICBvbmx5VG9nZ2xlOiBuZy5JQ2hhbmdlc09iamVjdCA8IGJvb2xlYW4gPiA7XHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgVG9nZ2xlQnV0dG9uc0NvbnRyb2xsZXIgaW1wbGVtZW50cyBJVG9nZ2xlQnV0dG9uc0JpbmRpbmdzIHtcclxuICAgICAgICBsZW5naHQ6IG51bWJlcjtcclxuXHJcbiAgICAgICAgcHVibGljIG5nRGlzYWJsZWQ6IGJvb2xlYW47XHJcbiAgICAgICAgcHVibGljIGNsYXNzOiBzdHJpbmc7XHJcbiAgICAgICAgcHVibGljIG11bHRpc2VsZWN0OiBib29sZWFuO1xyXG4gICAgICAgIHB1YmxpYyBidXR0b25zOiBUb2dnbGVCdXR0b25bXTtcclxuICAgICAgICBwdWJsaWMgZGlzYWJsZWQ6IGJvb2xlYW47XHJcbiAgICAgICAgcHVibGljIGN1cnJlbnRCdXR0b25WYWx1ZTogYW55O1xyXG4gICAgICAgIHB1YmxpYyBjdXJyZW50QnV0dG9uSW5kZXg6IG51bWJlcjtcclxuICAgICAgICBwdWJsaWMgY3VycmVudEJ1dHRvbjogYW55O1xyXG4gICAgICAgIHB1YmxpYyBjaGFuZ2U6ICgpID0+IG5nLklQcm9taXNlIDwgYW55ID4gO1xyXG4gICAgICAgIHB1YmxpYyBvbmx5VG9nZ2xlOiBib29sZWFuO1xyXG4gICAgICAgIHB1YmxpYyBwaXBNZWRpYTogYW55O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgcHJpdmF0ZSAkZWxlbWVudDogYW55LFxyXG4gICAgICAgICAgICBwcml2YXRlICRhdHRyczogYW5ndWxhci5JQXR0cmlidXRlcyxcclxuICAgICAgICAgICAgcHJpdmF0ZSAkc2NvcGU6IGFuZ3VsYXIuSVNjb3BlLFxyXG4gICAgICAgICAgICBwcml2YXRlICR0aW1lb3V0OiBuZy5JVGltZW91dFNlcnZpY2UsXHJcbiAgICAgICAgICAgICRpbmplY3RvcjogbmcuYXV0by5JSW5qZWN0b3JTZXJ2aWNlXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIFwibmdJbmplY3RcIjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucGlwTWVkaWEgPSAkaW5qZWN0b3IuaGFzKCdwaXBNZWRpYScpID8gJGluamVjdG9yLmdldCgncGlwTWVkaWEnKSA6IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3MgPSAkYXR0cnNbJ2NsYXNzJ10gfHwgJyc7XHJcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gXy5pbmRleE9mKHRoaXMuYnV0dG9ucywgXy5maW5kKHRoaXMuYnV0dG9ucywge1xyXG4gICAgICAgICAgICAgICAgaWQ6IHRoaXMuY3VycmVudEJ1dHRvblZhbHVlXHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50QnV0dG9uSW5kZXggPSBpbmRleCA8IDAgPyAwIDogaW5kZXg7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbiA9IHRoaXMuYnV0dG9ucy5sZW5ndGggPiAwID8gdGhpcy5idXR0b25zW3RoaXMuY3VycmVudEJ1dHRvbkluZGV4XSA6IHRoaXMuY3VycmVudEJ1dHRvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyAkb25DaGFuZ2VzKGNoYW5nZXM6IFRvZ2dsZUJ1dHRvbnNDaGFuZ2VzKSB7XHJcbiAgICAgICAgICAgIHRoaXMubXVsdGlzZWxlY3QgPSBjaGFuZ2VzLm11bHRpc2VsZWN0ID8gY2hhbmdlcy5tdWx0aXNlbGVjdC5jdXJyZW50VmFsdWUgOiBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5kaXNhYmxlZCA9IGNoYW5nZXMubmdEaXNhYmxlZCA/IGNoYW5nZXMubmdEaXNhYmxlZC5jdXJyZW50VmFsdWUgOiBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5vbmx5VG9nZ2xlID0gY2hhbmdlcy5vbmx5VG9nZ2xlID8gY2hhbmdlcy5vbmx5VG9nZ2xlLmN1cnJlbnRWYWx1ZSA6IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5idXR0b25zID0gIWNoYW5nZXMuYnV0dG9ucyB8fCBfLmlzQXJyYXkoY2hhbmdlcy5idXR0b25zLmN1cnJlbnRWYWx1ZSkgJiYgY2hhbmdlcy5idXR0b25zLmN1cnJlbnRWYWx1ZS5sZW5ndGggPT09IDAgPyBbXSA6IGNoYW5nZXMuYnV0dG9ucy5jdXJyZW50VmFsdWU7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IF8uaW5kZXhPZih0aGlzLmJ1dHRvbnMsIF8uZmluZCh0aGlzLmJ1dHRvbnMsIHtcclxuICAgICAgICAgICAgICAgIGlkOiB0aGlzLmN1cnJlbnRCdXR0b25WYWx1ZVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbkluZGV4ID0gaW5kZXggPCAwID8gMCA6IGluZGV4O1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b24gPSB0aGlzLmJ1dHRvbnMubGVuZ3RoID4gMCA/IHRoaXMuYnV0dG9uc1t0aGlzLmN1cnJlbnRCdXR0b25JbmRleF0gOiB0aGlzLmN1cnJlbnRCdXR0b247XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgJHBvc3RMaW5rKCkge1xyXG4gICAgICAgICAgICB0aGlzLiRlbGVtZW50XHJcbiAgICAgICAgICAgICAgICAub24oJ2ZvY3VzaW4nLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcygnZm9jdXNlZC1jb250YWluZXInKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAub24oJ2ZvY3Vzb3V0JywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2ZvY3VzZWQtY29udGFpbmVyJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBidXR0b25TZWxlY3RlZChpbmRleCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b25JbmRleCA9IGluZGV4O1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b24gPSB0aGlzLmJ1dHRvbnNbdGhpcy5jdXJyZW50QnV0dG9uSW5kZXhdO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b25WYWx1ZSA9IHRoaXMuY3VycmVudEJ1dHRvbi5pZCB8fCBpbmRleDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuJHRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hhbmdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2UoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZW50ZXJTcGFjZVByZXNzKGV2ZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uU2VsZWN0ZWQoZXZlbnQuaW5kZXgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGhpZ2hsaWdodEJ1dHRvbihpbmRleCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tdWx0aXNlbGVjdCAmJlxyXG4gICAgICAgICAgICAgICAgIV8uaXNVbmRlZmluZWQodGhpcy5jdXJyZW50QnV0dG9uLmxldmVsKSAmJlxyXG4gICAgICAgICAgICAgICAgIV8uaXNVbmRlZmluZWQodGhpcy5idXR0b25zW2luZGV4XS5sZXZlbCkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50QnV0dG9uLmxldmVsID49IHRoaXMuYnV0dG9uc1tpbmRleF0ubGV2ZWw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRCdXR0b25JbmRleCA9PSBpbmRleDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgVG9nZ2xlQnV0dG9uczogbmcuSUNvbXBvbmVudE9wdGlvbnMgPSB7XHJcbiAgICAgICAgYmluZGluZ3M6IFRvZ2dsZUJ1dHRvbnNCaW5kaW5ncyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3RvZ2dsZV9idXR0b25zL3RvZ2dsZV9idXR0b25zLmh0bWwnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFRvZ2dsZUJ1dHRvbnNDb250cm9sbGVyXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcFRvZ2dsZUJ1dHRvbnMnLCBbJ3BpcEJ1dHRvbnMuVGVtcGxhdGVzJ10pXHJcbiAgICAgICAgLmNvbXBvbmVudCgncGlwVG9nZ2xlQnV0dG9ucycsIFRvZ2dsZUJ1dHRvbnMpO1xyXG59IiwiKGZ1bmN0aW9uKG1vZHVsZSkge1xudHJ5IHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcEJ1dHRvbnMuVGVtcGxhdGVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBCdXR0b25zLlRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgndG9nZ2xlX2J1dHRvbnMvdG9nZ2xlX2J1dHRvbnMuaHRtbCcsXG4gICAgJzxkaXYgY2xhc3M9XCJwaXAtdG9nZ2xlLWJ1dHRvbnMgbGF5b3V0LXJvdyB7eyRjdHJsLmNsYXNzfX1cIiBcXG4nICtcbiAgICAnICAgICBwaXAtc2VsZWN0ZWQ9XCIkY3RybC5idWZCdXR0b25JbmRleFwiIFxcbicgK1xuICAgICcgICAgIHBpcC1lbnRlci1zcGFjZS1wcmVzcz1cIiRjdHJsLmVudGVyU3BhY2VQcmVzcygkZXZlbnQpXCJcXG4nICtcbiAgICAnICAgICBuZy1pZj1cIiEkY3RybC5waXBNZWRpYShcXCd4c1xcJykgfHwgJGN0cmwub25seVRvZ2dsZVwiPlxcbicgK1xuICAgICcgICAgPG1kLWJ1dHRvbiB0YWJpbmRleD1cIi0xXCIgbmctcmVwZWF0PVwiYnV0dG9uIGluICRjdHJsLmJ1dHRvbnNcIlxcbicgK1xuICAgICcgICAgICAgICAgICAgICBuZy1jbGFzcz1cIntcXCdtZC1hY2NlbnQgbWQtcmFpc2VkIHNlbGVjdGVkIGNvbG9yLWFjY2VudC1iZ1xcJyA6ICRjdHJsLmhpZ2hsaWdodEJ1dHRvbigkaW5kZXgpfVwiXFxuJyArXG4gICAgJyAgICAgICAgICAgICAgIG5nLWF0dHItc3R5bGU9XCJ7eyBcXCdiYWNrZ3JvdW5kLWNvbG9yOlxcJyArICgkY3RybC5oaWdobGlnaHRCdXR0b24oJGluZGV4KSA/IGJ1dHRvbi5iYWNrZ3JvdW5kQ29sb3IgOiBcXCdcXCcpICsgXFwnIWltcG9ydGFudFxcJyB9fVwiXFxuJyArXG4gICAgJyAgICAgICAgICAgICAgIGNsYXNzPVwicGlwLXNlbGVjdGFibGUgcGlwLWNoaXAtYnV0dG9uIGZsZXhcIiBuZy1jbGljaz1cIiRjdHJsLmJ1dHRvblNlbGVjdGVkKCRpbmRleCwgJGV2ZW50KVwiXFxuJyArXG4gICAgJyAgICAgICAgICAgICAgIG5nLWRpc2FibGVkPVwiYnV0dG9uLmRpc2FibGVkIHx8ICRjdHJsLmRpc2FibGVkXCI+XFxuJyArXG4gICAgJyAgICAgICAge3tidXR0b24ubmFtZSB8fCBidXR0b24udGl0bGUgfCB0cmFuc2xhdGV9fVxcbicgK1xuICAgICcgICAgICAgIDxzcGFuIG5nLWlmPVwiYnV0dG9uLmNoZWNrZWQgfHwgYnV0dG9uLmNvbXBsZXRlIHx8IGJ1dHRvbi5maWxsZWRcIiBjbGFzcz1cInBpcC10YWdnZWRcIj4qPC9zcGFuPlxcbicgK1xuICAgICcgICAgPC9tZC1idXR0b24+XFxuJyArXG4gICAgJzwvZGl2PlxcbicgK1xuICAgICdcXG4nICtcbiAgICAnPG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCIgbmctaWY9XCIkY3RybC5waXBNZWRpYShcXCd4c1xcJykgJiYgISRjdHJsLm9ubHlUb2dnbGVcIj5cXG4nICtcbiAgICAnICAgIDxtZC1zZWxlY3QgbmctbW9kZWw9XCIkY3RybC5jdXJyZW50QnV0dG9uSW5kZXhcIiBuZy1kaXNhYmxlZD1cIiRjdHJsLmRpc2FibGVkXCIgYXJpYS1sYWJlbD1cIkRST1BET1dOXCIgXFxuJyArXG4gICAgJyAgICAgICAgICAgICAgbWQtb24tY2xvc2U9XCIkY3RybC5idXR0b25TZWxlY3RlZCgkY3RybC5jdXJyZW50QnV0dG9uSW5kZXgpXCI+XFxuJyArXG4gICAgJyAgICAgICAgPG1kLW9wdGlvbiBuZy1yZXBlYXQ9XCJhY3Rpb24gaW4gJGN0cmwuYnV0dG9uc1wiIHZhbHVlPVwie3sgOjokaW5kZXggfX1cIj5cXG4nICtcbiAgICAnICAgICAgICAgICAge3sgKGFjdGlvbi50aXRsZSB8fCBhY3Rpb24ubmFtZSkgfCB0cmFuc2xhdGUgfX1cXG4nICtcbiAgICAnICAgICAgICAgICAgPHNwYW4gbmctaWY9XCJhY3Rpb24uY2hlY2tlZCB8fCBhY3Rpb24uY29tcGxldGUgfHwgYWN0aW9uLmZpbGxlZFwiIGNsYXNzPVwicGlwLXRhZ2dlZFwiPio8L3NwYW4+XFxuJyArXG4gICAgJyAgICAgICAgPC9tZC1vcHRpb24+XFxuJyArXG4gICAgJyAgICA8L21kLXNlbGVjdD5cXG4nICtcbiAgICAnPC9tZC1pbnB1dC1jb250YWluZXI+XFxuJyArXG4gICAgJycpO1xufV0pO1xufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGlwLXdlYnVpLWJ1dHRvbnMtaHRtbC5qcy5tYXBcbiJdfQ==
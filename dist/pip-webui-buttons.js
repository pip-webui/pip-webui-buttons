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
            this.onRefresh({ $event: $event });
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
(function () {
    'use strict';
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
    ToggleButtonsController.$inject = ['$element', '$attrs', '$scope', '$timeout'];
    function ToggleButtonsController($element, $attrs, $scope, $timeout) {
        "ngInject";
        this.$element = $element;
        this.$attrs = $attrs;
        this.$scope = $scope;
        this.$timeout = $timeout;
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
        this.buttons = !changes.buttons || _.isArray(changes.buttons.currentValue) && changes.buttons.currentValue.length === 0 ?
            [] : changes.buttons.currentValue;
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
(function () {
    'use strict';
    var ToggleButtons = {
        bindings: ToggleButtonsBindings,
        templateUrl: 'toggle_buttons/toggle_buttons.html',
        controller: ToggleButtonsController,
        controllerAs: 'toggle'
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
    '<div class="pip-toggle-buttons layout-row {{toggle.class}}" pip-selected="toggle.bufButtonIndex" pip-enter-space-press="toggle.enterSpacePress($event)" ng-if="!toggle.$mdMedia(\'xs\') || toggle.onlyToggle"><md-button tabindex="-1" ng-repeat="button in toggle.buttons" ng-class="{\'md-accent md-raised selected color-accent-bg\' : toggle.highlightButton($index)}" ng-attr-style="{{ \'background-color:\' + (toggle.highlightButton($index) ? button.backgroundColor : \'\') + \'!important\' }}" class="pip-selectable pip-chip-button flex" ng-click="toggle.buttonSelected($index, $event)" ng-disabled="button.disabled || toggle.ngDisabled">{{button.name || button.title | translate}} <span ng-if="button.checked || button.complete || button.filled" class="pip-tagged">*</span></md-button></div><md-input-container class="md-block" ng-if="toggle.$mdMedia(\'xs\') && !toggle.onlyToggle"><md-select ng-model="toggle.currentButtonIndex" ng-disabled="toggle.ngDisabled" aria-label="DROPDOWN" md-on-close="toggle.buttonSelected(toggle.currentButtonIndex)"><md-option ng-repeat="action in toggle.buttons" value="{{ ::$index }}">{{ (action.title || action.name) | translate }} <span ng-if="action.checked || action.complete || action.filled" class="pip-tagged">*</span></md-option></md-select></md-input-container>');
}]);
})();



},{}]},{},[6,1,2,3,4,5])(6)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYnV0dG9ucy50cyIsInNyYy9kZXBlbmRlbmNpZXMvdHJhbnNsYXRlLnRzIiwic3JjL2ZhYnMvZmFiX3Rvb2x0aXBfdmlzaWJpbGl0eS50cyIsInNyYy9yZWZyZXNoX2J1dHRvbi9yZWZyZXNoX2J1dHRvbi50cyIsInNyYy90b2dnbGVfYnV0dG9ucy90b2dnbGVfYnV0dG9ucy50cyIsInRlbXAvcGlwLXdlYnVpLWJ1dHRvbnMtaHRtbC5taW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNFQSxDQUFDO0lBQ0csWUFBWSxDQUFDO0lBRWIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7UUFDekIsa0JBQWtCO1FBQ2xCLGtCQUFrQjtRQUNsQix5QkFBeUI7S0FDNUIsQ0FBQyxDQUFDO0FBRVAsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7QUNUTCxDQUFDO0lBQ0csWUFBWSxDQUFDO0lBRWIsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUU1RCxVQUFVLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxVQUFVLFNBQVM7UUFDOUMsSUFBSSxZQUFZLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUM7Y0FDMUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFM0MsTUFBTSxDQUFDLFVBQVUsR0FBRztZQUNoQixNQUFNLENBQUMsWUFBWSxHQUFJLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNwRSxDQUFDLENBQUE7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUVQLENBQUMsQ0FBQyxFQUFFLENBQUM7O0FDZEw7SUFLSSx3Q0FDSSxRQUFhLEVBQ2IsTUFBMkIsRUFDM0IsTUFBc0IsRUFDdEIsUUFB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LElBQUksS0FBSyxDQUFDO0lBQzVDLENBQUM7SUFDTCw4QkFBQztBQUFELENBcEZBLEFBb0ZDLElBQUE7QUFFRCxDQUFDO0lBQ0csWUFBWSxDQUFDO0lBRWIsSUFBTSxhQUFhLEdBQUc7UUFDbEIsUUFBUSxFQUFFLHFCQUFxQjtRQUMvQixXQUFXLEVBQUUsb0NBQW9DO1FBQ2pELFVBQVUsRUFBRSx1QkFBdUI7UUFDbkMsWUFBWSxFQUFFLFFBQVE7S0FDekIsQ0FBQTtJQUVELE9BQU87U0FDRixNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1NBQ3BELFNBQVMsQ0FBQyxrQkFBa0IsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUV0RCxDQUFDLENBQUMsRUFBRSxDQUFDOztBQ2xKTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIu+7vy8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ3BpcEJ1dHRvbnMnLCBbXHJcbiAgICAgICAgJ3BpcFRvZ2dsZUJ1dHRvbnMnLFxyXG4gICAgICAgICdwaXBSZWZyZXNoQnV0dG9uJyxcclxuICAgICAgICAncGlwRmFiVG9vbHRpcFZpc2liaWxpdHknXHJcbiAgICBdKTtcclxuXHJcbn0pKCk7XHJcblxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciB0aGlzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcEJ1dHRvbnMuVHJhbnNsYXRlJywgW10pO1xyXG5cclxuICAgIHRoaXNNb2R1bGUuZmlsdGVyKCd0cmFuc2xhdGUnLCBmdW5jdGlvbiAoJGluamVjdG9yKSB7XHJcbiAgICAgICAgdmFyIHBpcFRyYW5zbGF0ZSA9ICRpbmplY3Rvci5oYXMoJ3BpcFRyYW5zbGF0ZScpIFxyXG4gICAgICAgICAgICA/ICRpbmplY3Rvci5nZXQoJ3BpcFRyYW5zbGF0ZScpIDogbnVsbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBpcFRyYW5zbGF0ZSAgPyBwaXBUcmFuc2xhdGUudHJhbnNsYXRlKGtleSkgfHwga2V5IDoga2V5O1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxufSkoKTtcclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuY2xhc3MgRmFiVG9vbHRpcFZpc2liaWxpdHlDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgX2VsZW1lbnQ7XHJcbiAgICBwcml2YXRlIF9zY29wZTogYW5ndWxhci5JU2NvcGU7XHJcbiAgICBwcml2YXRlIF90aW1lb3V0OiBuZy5JVGltZW91dFNlcnZpY2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgJGVsZW1lbnQ6IGFueSxcclxuICAgICAgICAkYXR0cnM6IGFuZ3VsYXIuSUF0dHJpYnV0ZXMsXHJcbiAgICAgICAgJHNjb3BlOiBhbmd1bGFyLklTY29wZSxcclxuICAgICAgICAkdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlLFxyXG4gICAgICAgICRwYXJzZVxyXG4gICAgKSB7XHJcbiAgICAgICAgXCJuZ0luamVjdFwiO1xyXG4gICAgICAgIGxldCB0cmlnR2V0dGVyID0gJHBhcnNlKCRhdHRyc1sncGlwRmFiVG9vbHRpcFZpc2liaWxpdHknXSksXHJcbiAgICAgICAgICAgIHNob3dHZXR0ZXIgPSAkcGFyc2UoJGF0dHJzWydwaXBGYWJTaG93VG9vbHRpcCddKSxcclxuICAgICAgICAgICAgc2hvd1NldHRlciA9IHNob3dHZXR0ZXIuYXNzaWduO1xyXG5cclxuICAgICAgICAkc2NvcGUuJHdhdGNoKHRyaWdHZXR0ZXIsIChpc09wZW4pID0+IHtcclxuICAgICAgICAgICAgaWYgKCFfLmlzRnVuY3Rpb24oc2hvd1NldHRlcikpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGlmIChpc09wZW4pIHtcclxuICAgICAgICAgICAgICAgICR0aW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzaG93U2V0dGVyKCRzY29wZSwgaXNPcGVuKTtcclxuICAgICAgICAgICAgICAgIH0sIDYwMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzaG93U2V0dGVyKCRzY29wZSwgaXNPcGVuKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG4oKCkgPT4ge1xyXG4gICAgZnVuY3Rpb24gcGlwRmFiVG9vbHRpcFZpc2liaWxpdHkoJHBhcnNlLCAkdGltZW91dCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICAgICAgICAgIHNjb3BlOiBmYWxzZSxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogRmFiVG9vbHRpcFZpc2liaWxpdHlDb250cm9sbGVyXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncGlwRmFiVG9vbHRpcFZpc2liaWxpdHknLCBbXSlcclxuICAgICAgICAuZGlyZWN0aXZlKCdwaXBGYWJUb29sdGlwVmlzaWJpbGl0eScsIHBpcEZhYlRvb2x0aXBWaXNpYmlsaXR5KTtcclxuXHJcbn0pKCk7IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuaW50ZXJmYWNlIElSZWZyZXNoQnV0dG9uQmluZGluZ3Mge1xyXG4gICAgW2tleTogc3RyaW5nXTogYW55O1xyXG5cclxuICAgIHRleHQ6IGFueSxcclxuICAgIHZpc2libGU6IGFueSxcclxuICAgIG9uUmVmcmVzaDogYW55XHJcbn1cclxuXHJcbmNvbnN0IFJlZnJlc2hCdXR0b25CaW5kaW5nczogSVJlZnJlc2hCdXR0b25CaW5kaW5ncyA9IHtcclxuICAgIHRleHQ6ICc8cGlwVGV4dCcsXHJcbiAgICB2aXNpYmxlOiAnPHBpcFZpc2libGUnLFxyXG4gICAgb25SZWZyZXNoOiAnJj9waXBSZWZyZXNoJ1xyXG59XHJcblxyXG5jbGFzcyBSZWZyZXNoQnV0dG9uQ2hhbmdlcyBpbXBsZW1lbnRzIG5nLklPbkNoYW5nZXNPYmplY3QsIElSZWZyZXNoQnV0dG9uQmluZGluZ3Mge1xyXG4gICAgW2tleTogc3RyaW5nXTogbmcuSUNoYW5nZXNPYmplY3Q8YW55PjtcclxuICAgIC8vIE5vdCBvbmUgd2F5IGJpbmRpbmdzXHJcbiAgICBvblJlZnJlc2g6IG5nLklDaGFuZ2VzT2JqZWN0PCh7JGV2ZW50OiBhbnl9KSA9PiBuZy5JUHJvbWlzZTxhbnk+PjtcclxuICAgIC8vIE9uZSB3YXkgYmluZGluZ3NcclxuICAgIHRleHQ6IG5nLklDaGFuZ2VzT2JqZWN0PHN0cmluZz47XHJcbiAgICB2aXNpYmxlOiBuZy5JQ2hhbmdlc09iamVjdDxib29sZWFuPjtcclxufVxyXG5cclxuY2xhc3MgUmVmcmVzaEJ1dHRvbkNvbnRyb2xsZXIgaW1wbGVtZW50cyBJUmVmcmVzaEJ1dHRvbkJpbmRpbmdzIHtcclxuXHJcbiAgICBwcml2YXRlIF90ZXh0RWxlbWVudDogYW55O1xyXG4gICAgcHJpdmF0ZSBfYnV0dG9uRWxlbWVudDogYW55O1xyXG4gICAgcHJpdmF0ZSBfd2lkdGg6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgdGV4dDogc3RyaW5nO1xyXG4gICAgcHVibGljIHZpc2libGU6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgb25SZWZyZXNoOiAocGFyYW06IHskZXZlbnQ6IG5nLklBbmd1bGFyRXZlbnR9KSA9PiBuZy5JUHJvbWlzZTxhbnk+O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgJHNjb3BlOiBuZy5JU2NvcGUsXHJcbiAgICAgICAgcHJpdmF0ZSAkZWxlbWVudDogYW55LFxyXG4gICAgICAgIHByaXZhdGUgJGF0dHJzOiBuZy5JQXR0cmlidXRlc1xyXG4gICAgKSB7IH1cclxuXHJcbiAgICBwdWJsaWMgJHBvc3RMaW5rKCkge1xyXG4gICAgICAgIHRoaXMuX2J1dHRvbkVsZW1lbnQgPSB0aGlzLiRlbGVtZW50LmNoaWxkcmVuKCcubWQtYnV0dG9uJyk7XHJcbiAgICAgICAgdGhpcy5fdGV4dEVsZW1lbnQgPSB0aGlzLl9idXR0b25FbGVtZW50LmNoaWxkcmVuKCcucGlwLXJlZnJlc2gtdGV4dCcpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2hvdygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyAkb25DaGFuZ2VzKGNoYW5nZXM6IFJlZnJlc2hCdXR0b25DaGFuZ2VzKSB7XHJcbiAgICAgICAgaWYgKGNoYW5nZXMudmlzaWJsZS5jdXJyZW50VmFsdWUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgdGhpcy50ZXh0ID0gY2hhbmdlcy50ZXh0LmN1cnJlbnRWYWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkNsaWNrKCRldmVudCkge1xyXG4gICAgICAgIGlmICh0aGlzLm9uUmVmcmVzaCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uUmVmcmVzaCh7JGV2ZW50OiAkZXZlbnR9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzaG93KCkge1xyXG4gICAgICAgIGlmICh0aGlzLl90ZXh0RWxlbWVudCA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuX2J1dHRvbkVsZW1lbnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFNldCBuZXcgdGV4dFxyXG4gICAgICAgIHRoaXMuX3RleHRFbGVtZW50LnRleHQodGhpcy50ZXh0KTtcclxuICAgICAgICAvLyBTaG93IGJ1dHRvblxyXG4gICAgICAgIHRoaXMuX2J1dHRvbkVsZW1lbnQuc2hvdygpO1xyXG4gICAgICAgIC8vIEFkanVzdCBwb3NpdGlvblxyXG4gICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5fYnV0dG9uRWxlbWVudC53aWR0aCgpO1xyXG4gICAgICAgIHRoaXMuX2J1dHRvbkVsZW1lbnQuY3NzKCdtYXJnaW4tbGVmdCcsICctJyArIHdpZHRoIC8gMiArICdweCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGlkZSgpIHtcclxuICAgICAgICB0aGlzLl9idXR0b25FbGVtZW50LmhpZGUoKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgY29uc3QgUmVmcmVzaEJ1dHRvbkNvbXBvbmVudCA9IHtcclxuICAgICAgICBiaW5kaW5nczogUmVmcmVzaEJ1dHRvbkJpbmRpbmdzLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFJlZnJlc2hCdXR0b25Db250cm9sbGVyLFxyXG4gICAgICAgIHRlbXBsYXRlOiAnPG1kLWJ1dHRvbiBjbGFzcz1cInBpcC1yZWZyZXNoLWJ1dHRvblwiIHRhYmluZGV4PVwiLTFcIiBuZy1jbGljaz1cIiRjdHJsLm9uQ2xpY2soJGV2ZW50KVwiIGFyaWEtbGFiZWw9XCJSRUZSRVNIXCI+JyArXHJcbiAgICAgICAgICAgICc8bWQtaWNvbiBtZC1zdmctaWNvbj1cImljb25zOnJlZnJlc2hcIj48L21kLWljb24+JyArXHJcbiAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cInBpcC1yZWZyZXNoLXRleHRcIj48L3NwYW4+JyArXHJcbiAgICAgICAgICAgICc8L21kLWJ1dHRvbj4nXHJcbiAgICB9O1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdwaXBSZWZyZXNoQnV0dG9uJywgWyduZ01hdGVyaWFsJ10pXHJcbiAgICAgICAgLmNvbXBvbmVudCgncGlwUmVmcmVzaEJ1dHRvbicsIFJlZnJlc2hCdXR0b25Db21wb25lbnQpO1xyXG5cclxufSkoKTsiLCIvLyAvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG5jbGFzcyBUb2dnbGVCdXR0b24ge1xyXG4gICAgaWQ6IGFueTtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGRpc2FibGVkOiBib29sZWFuO1xyXG4gICAgbGV2ZWw6IG51bWJlcjtcclxuICAgIGRpc2VsZWN0YWJsZTogYm9vbGVhbjtcclxuICAgIGZpbGxlZDogYm9vbGVhbjtcclxufVxyXG5cclxuaW50ZXJmYWNlIElUb2dnbGVCdXR0b25zQmluZGluZ3Mge1xyXG4gICAgW2tleTogc3RyaW5nXTogYW55O1xyXG5cclxuICAgIG5nRGlzYWJsZWQ6IGFueSxcclxuICAgIGJ1dHRvbnM6IGFueSxcclxuICAgIGN1cnJlbnRCdXR0b25WYWx1ZTogYW55LFxyXG4gICAgY3VycmVudEJ1dHRvbjogYW55LFxyXG4gICAgbXVsdGlzZWxlY3Q6IGFueSxcclxuICAgIGNoYW5nZTogYW55LFxyXG4gICAgb25seVRvZ2dsZTogYW55XHJcbn1cclxuXHJcbmNvbnN0IFRvZ2dsZUJ1dHRvbnNCaW5kaW5nczogSVRvZ2dsZUJ1dHRvbnNCaW5kaW5ncyA9IHtcclxuICAgIG5nRGlzYWJsZWQ6ICc8PycsXHJcbiAgICBidXR0b25zOiAnPHBpcEJ1dHRvbnMnLFxyXG4gICAgY3VycmVudEJ1dHRvblZhbHVlOiAnPW5nTW9kZWwnLFxyXG4gICAgY3VycmVudEJ1dHRvbjogJz0/cGlwQnV0dG9uT2JqZWN0JyxcclxuICAgIG11bHRpc2VsZWN0OiAnPD9waXBNdWx0aXNlbGVjdCcsXHJcbiAgICBjaGFuZ2U6ICcmbmdDaGFuZ2UnLFxyXG4gICAgb25seVRvZ2dsZTogJzw/cGlwT25seVRvZ2dsZSdcclxufVxyXG5cclxuY2xhc3MgVG9nZ2xlQnV0dG9uc0NoYW5nZXMgaW1wbGVtZW50cyBuZy5JT25DaGFuZ2VzT2JqZWN0LCBJVG9nZ2xlQnV0dG9uc0JpbmRpbmdzIHtcclxuICAgIFtrZXk6IHN0cmluZ106IG5nLklDaGFuZ2VzT2JqZWN0PGFueT47XHJcbiAgICBcclxuICAgIGN1cnJlbnRCdXR0b25WYWx1ZTogYW55O1xyXG4gICAgY3VycmVudEJ1dHRvbjogYW55O1xyXG4gICAgY2hhbmdlOiBuZy5JQ2hhbmdlc09iamVjdDwoKSA9PiBuZy5JUHJvbWlzZTx2b2lkPj47XHJcblxyXG4gICAgbmdEaXNhYmxlZDogbmcuSUNoYW5nZXNPYmplY3Q8Ym9vbGVhbj47XHJcbiAgICBidXR0b25zOiBuZy5JQ2hhbmdlc09iamVjdDxUb2dnbGVCdXR0b25bXT47XHJcbiAgICBtdWx0aXNlbGVjdDogbmcuSUNoYW5nZXNPYmplY3Q8Ym9vbGVhbj47XHJcbiAgICBvbmx5VG9nZ2xlOiBuZy5JQ2hhbmdlc09iamVjdDxib29sZWFuPjtcclxufVxyXG5cclxuY2xhc3MgVG9nZ2xlQnV0dG9uc0NvbnRyb2xsZXIgaW1wbGVtZW50cyBJVG9nZ2xlQnV0dG9uc0JpbmRpbmdzIHtcclxuXHJcbiAgICBwdWJsaWMgbmdEaXNhYmxlZDogYm9vbGVhbjtcclxuICAgIHB1YmxpYyBjbGFzczogc3RyaW5nO1xyXG4gICAgcHVibGljIG11bHRpc2VsZWN0OiBib29sZWFuO1xyXG4gICAgcHVibGljIGJ1dHRvbnM6IFRvZ2dsZUJ1dHRvbltdO1xyXG4gICAgcHVibGljIGRpc2FibGVkOiBib29sZWFuO1xyXG4gICAgcHVibGljIGN1cnJlbnRCdXR0b25WYWx1ZTogYW55O1xyXG4gICAgcHVibGljIGN1cnJlbnRCdXR0b25JbmRleDogbnVtYmVyO1xyXG4gICAgcHVibGljIGN1cnJlbnRCdXR0b246IGFueTtcclxuICAgIHB1YmxpYyBjaGFuZ2U6ICgpID0+IG5nLklQcm9taXNlPGFueT47XHJcbiAgICBwdWJsaWMgb25seVRvZ2dsZTogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlICRlbGVtZW50OiBhbnksXHJcbiAgICAgICAgcHJpdmF0ZSAkYXR0cnM6IGFuZ3VsYXIuSUF0dHJpYnV0ZXMsXHJcbiAgICAgICAgcHJpdmF0ZSAkc2NvcGU6IGFuZ3VsYXIuSVNjb3BlLFxyXG4gICAgICAgIHByaXZhdGUgJHRpbWVvdXQ6IG5nLklUaW1lb3V0U2VydmljZVxyXG4gICAgKSB7XHJcbiAgICAgICAgXCJuZ0luamVjdFwiO1xyXG5cclxuICAgICAgICB0aGlzLmNsYXNzID0gJGF0dHJzWydjbGFzcyddIHx8ICcnO1xyXG4gICAgICAgIGxldCBpbmRleCA9IF8uaW5kZXhPZih0aGlzLmJ1dHRvbnMsIF8uZmluZCh0aGlzLmJ1dHRvbnMsIHtcclxuICAgICAgICAgICAgaWQ6IHRoaXMuY3VycmVudEJ1dHRvblZhbHVlXHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbkluZGV4ID0gaW5kZXggPCAwID8gMCA6IGluZGV4O1xyXG4gICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbiA9IHRoaXMuYnV0dG9ucy5sZW5ndGggPiAwID8gdGhpcy5idXR0b25zW3RoaXMuY3VycmVudEJ1dHRvbkluZGV4XSA6IHRoaXMuY3VycmVudEJ1dHRvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgJG9uQ2hhbmdlcyhjaGFuZ2VzOiBUb2dnbGVCdXR0b25zQ2hhbmdlcykge1xyXG4gICAgICAgIHRoaXMubXVsdGlzZWxlY3QgPSBjaGFuZ2VzLm11bHRpc2VsZWN0ID8gY2hhbmdlcy5tdWx0aXNlbGVjdC5jdXJyZW50VmFsdWUgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmRpc2FibGVkID0gY2hhbmdlcy5uZ0Rpc2FibGVkID8gY2hhbmdlcy5uZ0Rpc2FibGVkLmN1cnJlbnRWYWx1ZSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMub25seVRvZ2dsZSA9IGNoYW5nZXMub25seVRvZ2dsZSA/IGNoYW5nZXMub25seVRvZ2dsZS5jdXJyZW50VmFsdWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5idXR0b25zID0gIWNoYW5nZXMuYnV0dG9ucyB8fCBfLmlzQXJyYXkoY2hhbmdlcy5idXR0b25zLmN1cnJlbnRWYWx1ZSkgJiYgY2hhbmdlcy5idXR0b25zLmN1cnJlbnRWYWx1ZS5sZW5ndGggPT09IDAgPyBcclxuICAgICAgICAgICAgW10gOiBjaGFuZ2VzLmJ1dHRvbnMuY3VycmVudFZhbHVlO1xyXG5cclxuICAgICAgICBsZXQgaW5kZXggPSBfLmluZGV4T2YodGhpcy5idXR0b25zLCBfLmZpbmQodGhpcy5idXR0b25zLCB7XHJcbiAgICAgICAgICAgIGlkOiB0aGlzLmN1cnJlbnRCdXR0b25WYWx1ZVxyXG4gICAgICAgIH0pKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b25JbmRleCA9IGluZGV4IDwgMCA/IDAgOiBpbmRleDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b24gPSB0aGlzLmJ1dHRvbnMubGVuZ3RoID4gMCA/IHRoaXMuYnV0dG9uc1t0aGlzLmN1cnJlbnRCdXR0b25JbmRleF0gOiB0aGlzLmN1cnJlbnRCdXR0b247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICRwb3N0TGluaygpIHtcclxuICAgICAgICB0aGlzLiRlbGVtZW50XHJcbiAgICAgICAgICAgIC5vbignZm9jdXNpbicsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MoJ2ZvY3VzZWQtY29udGFpbmVyJyk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbignZm9jdXNvdXQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKCdmb2N1c2VkLWNvbnRhaW5lcicpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYnV0dG9uU2VsZWN0ZWQoaW5kZXgpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b25JbmRleCA9IGluZGV4O1xyXG4gICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbiA9IHRoaXMuYnV0dG9uc1t0aGlzLmN1cnJlbnRCdXR0b25JbmRleF07XHJcbiAgICAgICAgdGhpcy5jdXJyZW50QnV0dG9uVmFsdWUgPSB0aGlzLmN1cnJlbnRCdXR0b24uaWQgfHwgaW5kZXg7XHJcblxyXG4gICAgICAgIHRoaXMuJHRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGFuZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW50ZXJTcGFjZVByZXNzKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5idXR0b25TZWxlY3RlZChldmVudC5pbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhpZ2hsaWdodEJ1dHRvbihpbmRleCkge1xyXG4gICAgICAgIGlmICh0aGlzLm11bHRpc2VsZWN0ICYmXHJcbiAgICAgICAgICAgICFfLmlzVW5kZWZpbmVkKHRoaXMuY3VycmVudEJ1dHRvbi5sZXZlbCkgJiZcclxuICAgICAgICAgICAgIV8uaXNVbmRlZmluZWQodGhpcy5idXR0b25zW2luZGV4XS5sZXZlbCkpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRCdXR0b24ubGV2ZWwgPj0gdGhpcy5idXR0b25zW2luZGV4XS5sZXZlbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRCdXR0b25JbmRleCA9PSBpbmRleDtcclxuICAgIH1cclxufVxyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBjb25zdCBUb2dnbGVCdXR0b25zID0ge1xyXG4gICAgICAgIGJpbmRpbmdzOiBUb2dnbGVCdXR0b25zQmluZGluZ3MsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd0b2dnbGVfYnV0dG9ucy90b2dnbGVfYnV0dG9ucy5odG1sJyxcclxuICAgICAgICBjb250cm9sbGVyOiBUb2dnbGVCdXR0b25zQ29udHJvbGxlcixcclxuICAgICAgICBjb250cm9sbGVyQXM6ICd0b2dnbGUnXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcFRvZ2dsZUJ1dHRvbnMnLCBbJ3BpcEJ1dHRvbnMuVGVtcGxhdGVzJ10pXHJcbiAgICAgICAgLmNvbXBvbmVudCgncGlwVG9nZ2xlQnV0dG9ucycsIFRvZ2dsZUJ1dHRvbnMpO1xyXG4gICAgXHJcbn0pKCk7IiwiKGZ1bmN0aW9uKG1vZHVsZSkge1xudHJ5IHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcEJ1dHRvbnMuVGVtcGxhdGVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBCdXR0b25zLlRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgndG9nZ2xlX2J1dHRvbnMvdG9nZ2xlX2J1dHRvbnMuaHRtbCcsXG4gICAgJzxkaXYgY2xhc3M9XCJwaXAtdG9nZ2xlLWJ1dHRvbnMgbGF5b3V0LXJvdyB7e3RvZ2dsZS5jbGFzc319XCIgcGlwLXNlbGVjdGVkPVwidG9nZ2xlLmJ1ZkJ1dHRvbkluZGV4XCIgcGlwLWVudGVyLXNwYWNlLXByZXNzPVwidG9nZ2xlLmVudGVyU3BhY2VQcmVzcygkZXZlbnQpXCIgbmctaWY9XCIhdG9nZ2xlLiRtZE1lZGlhKFxcJ3hzXFwnKSB8fCB0b2dnbGUub25seVRvZ2dsZVwiPjxtZC1idXR0b24gdGFiaW5kZXg9XCItMVwiIG5nLXJlcGVhdD1cImJ1dHRvbiBpbiB0b2dnbGUuYnV0dG9uc1wiIG5nLWNsYXNzPVwie1xcJ21kLWFjY2VudCBtZC1yYWlzZWQgc2VsZWN0ZWQgY29sb3ItYWNjZW50LWJnXFwnIDogdG9nZ2xlLmhpZ2hsaWdodEJ1dHRvbigkaW5kZXgpfVwiIG5nLWF0dHItc3R5bGU9XCJ7eyBcXCdiYWNrZ3JvdW5kLWNvbG9yOlxcJyArICh0b2dnbGUuaGlnaGxpZ2h0QnV0dG9uKCRpbmRleCkgPyBidXR0b24uYmFja2dyb3VuZENvbG9yIDogXFwnXFwnKSArIFxcJyFpbXBvcnRhbnRcXCcgfX1cIiBjbGFzcz1cInBpcC1zZWxlY3RhYmxlIHBpcC1jaGlwLWJ1dHRvbiBmbGV4XCIgbmctY2xpY2s9XCJ0b2dnbGUuYnV0dG9uU2VsZWN0ZWQoJGluZGV4LCAkZXZlbnQpXCIgbmctZGlzYWJsZWQ9XCJidXR0b24uZGlzYWJsZWQgfHwgdG9nZ2xlLm5nRGlzYWJsZWRcIj57e2J1dHRvbi5uYW1lIHx8IGJ1dHRvbi50aXRsZSB8IHRyYW5zbGF0ZX19IDxzcGFuIG5nLWlmPVwiYnV0dG9uLmNoZWNrZWQgfHwgYnV0dG9uLmNvbXBsZXRlIHx8IGJ1dHRvbi5maWxsZWRcIiBjbGFzcz1cInBpcC10YWdnZWRcIj4qPC9zcGFuPjwvbWQtYnV0dG9uPjwvZGl2PjxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIG5nLWlmPVwidG9nZ2xlLiRtZE1lZGlhKFxcJ3hzXFwnKSAmJiAhdG9nZ2xlLm9ubHlUb2dnbGVcIj48bWQtc2VsZWN0IG5nLW1vZGVsPVwidG9nZ2xlLmN1cnJlbnRCdXR0b25JbmRleFwiIG5nLWRpc2FibGVkPVwidG9nZ2xlLm5nRGlzYWJsZWRcIiBhcmlhLWxhYmVsPVwiRFJPUERPV05cIiBtZC1vbi1jbG9zZT1cInRvZ2dsZS5idXR0b25TZWxlY3RlZCh0b2dnbGUuY3VycmVudEJ1dHRvbkluZGV4KVwiPjxtZC1vcHRpb24gbmctcmVwZWF0PVwiYWN0aW9uIGluIHRvZ2dsZS5idXR0b25zXCIgdmFsdWU9XCJ7eyA6OiRpbmRleCB9fVwiPnt7IChhY3Rpb24udGl0bGUgfHwgYWN0aW9uLm5hbWUpIHwgdHJhbnNsYXRlIH19IDxzcGFuIG5nLWlmPVwiYWN0aW9uLmNoZWNrZWQgfHwgYWN0aW9uLmNvbXBsZXRlIHx8IGFjdGlvbi5maWxsZWRcIiBjbGFzcz1cInBpcC10YWdnZWRcIj4qPC9zcGFuPjwvbWQtb3B0aW9uPjwvbWQtc2VsZWN0PjwvbWQtaW5wdXQtY29udGFpbmVyPicpO1xufV0pO1xufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGlwLXdlYnVpLWJ1dHRvbnMtaHRtbC5taW4uanMubWFwXG4iXX0=
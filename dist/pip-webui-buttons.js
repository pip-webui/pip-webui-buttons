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
    '<div class="pip-toggle-buttons layout-row {{$ctrl.class}}" pip-selected="$ctrl.bufButtonIndex" pip-enter-space-press="$ctrl.enterSpacePress($event)" ng-if="!$ctrl.pipMedia(\'xs\') || $ctrl.onlyToggle"><md-button tabindex="-1" ng-repeat="button in $ctrl.buttons" ng-class="{\'md-accent md-raised selected color-accent-bg\' : $ctrl.highlightButton($index)}" ng-attr-style="{{ \'background-color:\' + ($ctrl.highlightButton($index) ? button.backgroundColor : \'\') + \'!important\' }}" class="pip-selectable pip-chip-button flex" ng-click="$ctrl.buttonSelected($index, $event)" ng-disabled="button.disabled || $ctrl.disabled">{{button.name || button.title | translate}} <span ng-if="button.checked || button.complete || button.filled" class="pip-tagged">*</span></md-button></div><md-input-container class="md-block" ng-if="$ctrl.pipMedia(\'xs\') && !$ctrl.onlyToggle"><md-select ng-model="$ctrl.currentButtonIndex" ng-disabled="$ctrl.disabled" aria-label="DROPDOWN" md-on-close="$ctrl.buttonSelected($ctrl.currentButtonIndex)"><md-option ng-repeat="action in $ctrl.buttons" value="{{ ::$index }}">{{ (action.title || action.name) | translate }} <span ng-if="action.checked || action.complete || action.filled" class="pip-tagged">*</span></md-option></md-select></md-input-container>');
}]);
})();



},{}]},{},[6,1,2,3,4,5])(6)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYnV0dG9ucy50cyIsInNyYy9kZXBlbmRlbmNpZXMvdHJhbnNsYXRlLnRzIiwic3JjL2ZhYnMvZmFiX3Rvb2x0aXBfdmlzaWJpbGl0eS50cyIsInNyYy9yZWZyZXNoX2J1dHRvbi9yZWZyZXNoX2J1dHRvbi50cyIsInNyYy90b2dnbGVfYnV0dG9ucy90b2dnbGVfYnV0dG9ucy50cyIsInRlbXAvcGlwLXdlYnVpLWJ1dHRvbnMtaHRtbC5taW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNFQSxDQUFDO0lBQ0csWUFBWSxDQUFDO0lBRWIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7UUFDekIsa0JBQWtCO1FBQ2xCLGtCQUFrQjtRQUNsQix5QkFBeUI7S0FDNUIsQ0FBQyxDQUFDO0FBRVAsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7QUNUTCxDQUFDO0lBQ0csWUFBWSxDQUFDO0lBRWIsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUU1RCxVQUFVLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxVQUFVLFNBQVM7UUFDOUMsSUFBSSxZQUFZLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUM7Y0FDMUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFM0MsTUFBTSxDQUFDLFVBQVUsR0FBRztZQUNoQixNQUFNLENBQUMsWUFBWSxHQUFJLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNwRSxDQUFDLENBQUE7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUVQLENBQUMsQ0FBQyxFQUFFLENBQUM7O0FDZEw7SUFLSSx3Q0FDSSxRQUFhLEVBQ2IsTUFBMkIsRUFDM0IsTUFBc0IsRUFDdEIsUUFB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LElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ2pFLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixJQUFJLEtBQUssQ0FBQztJQUM1QyxDQUFDO0lBQ0wsOEJBQUM7QUFBRCxDQXhGQSxBQXdGQyxJQUFBO0FBRUQsQ0FBQztJQUNHLFlBQVksQ0FBQztJQXVCYixJQUFNLGFBQWEsR0FBeUI7UUFDeEMsUUFBUSxFQUFFLHFCQUFxQjtRQUMvQixXQUFXLEVBQUUsb0NBQW9DO1FBQ2pELFVBQVUsRUFBRSx1QkFBdUI7S0FDdEMsQ0FBQTtJQUVELE9BQU87U0FDRixNQUFNLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1NBQ3BELFNBQVMsQ0FBQyxrQkFBa0IsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUV0RCxDQUFDLENBQUMsRUFBRSxDQUFDOztBQzFLTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIu+7vy8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ3BpcEJ1dHRvbnMnLCBbXHJcbiAgICAgICAgJ3BpcFRvZ2dsZUJ1dHRvbnMnLFxyXG4gICAgICAgICdwaXBSZWZyZXNoQnV0dG9uJyxcclxuICAgICAgICAncGlwRmFiVG9vbHRpcFZpc2liaWxpdHknXHJcbiAgICBdKTtcclxuXHJcbn0pKCk7XHJcblxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciB0aGlzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcEJ1dHRvbnMuVHJhbnNsYXRlJywgW10pO1xyXG5cclxuICAgIHRoaXNNb2R1bGUuZmlsdGVyKCd0cmFuc2xhdGUnLCBmdW5jdGlvbiAoJGluamVjdG9yKSB7XHJcbiAgICAgICAgdmFyIHBpcFRyYW5zbGF0ZSA9ICRpbmplY3Rvci5oYXMoJ3BpcFRyYW5zbGF0ZScpIFxyXG4gICAgICAgICAgICA/ICRpbmplY3Rvci5nZXQoJ3BpcFRyYW5zbGF0ZScpIDogbnVsbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBpcFRyYW5zbGF0ZSAgPyBwaXBUcmFuc2xhdGUudHJhbnNsYXRlKGtleSkgfHwga2V5IDoga2V5O1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxufSkoKTtcclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuY2xhc3MgRmFiVG9vbHRpcFZpc2liaWxpdHlDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgX2VsZW1lbnQ7XHJcbiAgICBwcml2YXRlIF9zY29wZTogYW5ndWxhci5JU2NvcGU7XHJcbiAgICBwcml2YXRlIF90aW1lb3V0OiBuZy5JVGltZW91dFNlcnZpY2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgJGVsZW1lbnQ6IGFueSxcclxuICAgICAgICAkYXR0cnM6IGFuZ3VsYXIuSUF0dHJpYnV0ZXMsXHJcbiAgICAgICAgJHNjb3BlOiBhbmd1bGFyLklTY29wZSxcclxuICAgICAgICAkdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlLFxyXG4gICAgICAgICRwYXJzZVxyXG4gICAgKSB7XHJcbiAgICAgICAgXCJuZ0luamVjdFwiO1xyXG4gICAgICAgIGxldCB0cmlnR2V0dGVyID0gJHBhcnNlKCRhdHRyc1sncGlwRmFiVG9vbHRpcFZpc2liaWxpdHknXSksXHJcbiAgICAgICAgICAgIHNob3dHZXR0ZXIgPSAkcGFyc2UoJGF0dHJzWydwaXBGYWJTaG93VG9vbHRpcCddKSxcclxuICAgICAgICAgICAgc2hvd1NldHRlciA9IHNob3dHZXR0ZXIuYXNzaWduO1xyXG5cclxuICAgICAgICAkc2NvcGUuJHdhdGNoKHRyaWdHZXR0ZXIsIChpc09wZW4pID0+IHtcclxuICAgICAgICAgICAgaWYgKCFfLmlzRnVuY3Rpb24oc2hvd1NldHRlcikpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGlmIChpc09wZW4pIHtcclxuICAgICAgICAgICAgICAgICR0aW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzaG93U2V0dGVyKCRzY29wZSwgaXNPcGVuKTtcclxuICAgICAgICAgICAgICAgIH0sIDYwMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzaG93U2V0dGVyKCRzY29wZSwgaXNPcGVuKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG4oKCkgPT4ge1xyXG4gICAgZnVuY3Rpb24gcGlwRmFiVG9vbHRpcFZpc2liaWxpdHkoJHBhcnNlLCAkdGltZW91dCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsXHJcbiAgICAgICAgICAgIHNjb3BlOiBmYWxzZSxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogRmFiVG9vbHRpcFZpc2liaWxpdHlDb250cm9sbGVyXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncGlwRmFiVG9vbHRpcFZpc2liaWxpdHknLCBbXSlcclxuICAgICAgICAuZGlyZWN0aXZlKCdwaXBGYWJUb29sdGlwVmlzaWJpbGl0eScsIHBpcEZhYlRvb2x0aXBWaXNpYmlsaXR5KTtcclxuXHJcbn0pKCk7IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuaW50ZXJmYWNlIElSZWZyZXNoQnV0dG9uQmluZGluZ3Mge1xyXG4gICAgW2tleTogc3RyaW5nXTogYW55O1xyXG5cclxuICAgIHRleHQ6IGFueSxcclxuICAgIHZpc2libGU6IGFueSxcclxuICAgIG9uUmVmcmVzaDogYW55XHJcbn1cclxuXHJcbmNvbnN0IFJlZnJlc2hCdXR0b25CaW5kaW5nczogSVJlZnJlc2hCdXR0b25CaW5kaW5ncyA9IHtcclxuICAgIHRleHQ6ICc8cGlwVGV4dCcsXHJcbiAgICB2aXNpYmxlOiAnPHBpcFZpc2libGUnLFxyXG4gICAgb25SZWZyZXNoOiAnJj9waXBSZWZyZXNoJ1xyXG59XHJcblxyXG5jbGFzcyBSZWZyZXNoQnV0dG9uQ2hhbmdlcyBpbXBsZW1lbnRzIG5nLklPbkNoYW5nZXNPYmplY3QsIElSZWZyZXNoQnV0dG9uQmluZGluZ3Mge1xyXG4gICAgW2tleTogc3RyaW5nXTogbmcuSUNoYW5nZXNPYmplY3Q8YW55PjtcclxuICAgIC8vIE5vdCBvbmUgd2F5IGJpbmRpbmdzXHJcbiAgICBvblJlZnJlc2g6IG5nLklDaGFuZ2VzT2JqZWN0PCh7JGV2ZW50OiBhbnl9KSA9PiBuZy5JUHJvbWlzZTxhbnk+PjtcclxuICAgIC8vIE9uZSB3YXkgYmluZGluZ3NcclxuICAgIHRleHQ6IG5nLklDaGFuZ2VzT2JqZWN0PHN0cmluZz47XHJcbiAgICB2aXNpYmxlOiBuZy5JQ2hhbmdlc09iamVjdDxib29sZWFuPjtcclxufVxyXG5cclxuY2xhc3MgUmVmcmVzaEJ1dHRvbkNvbnRyb2xsZXIgaW1wbGVtZW50cyBJUmVmcmVzaEJ1dHRvbkJpbmRpbmdzIHtcclxuXHJcbiAgICBwcml2YXRlIF90ZXh0RWxlbWVudDogYW55O1xyXG4gICAgcHJpdmF0ZSBfYnV0dG9uRWxlbWVudDogYW55O1xyXG4gICAgcHJpdmF0ZSBfd2lkdGg6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgdGV4dDogc3RyaW5nO1xyXG4gICAgcHVibGljIHZpc2libGU6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgb25SZWZyZXNoOiAocGFyYW06IHskZXZlbnQ6IG5nLklBbmd1bGFyRXZlbnR9KSA9PiBuZy5JUHJvbWlzZTxhbnk+O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgJHNjb3BlOiBuZy5JU2NvcGUsXHJcbiAgICAgICAgcHJpdmF0ZSAkZWxlbWVudDogYW55LFxyXG4gICAgICAgIHByaXZhdGUgJGF0dHJzOiBuZy5JQXR0cmlidXRlc1xyXG4gICAgKSB7IH1cclxuXHJcbiAgICBwdWJsaWMgJHBvc3RMaW5rKCkge1xyXG4gICAgICAgIHRoaXMuX2J1dHRvbkVsZW1lbnQgPSB0aGlzLiRlbGVtZW50LmNoaWxkcmVuKCcubWQtYnV0dG9uJyk7XHJcbiAgICAgICAgdGhpcy5fdGV4dEVsZW1lbnQgPSB0aGlzLl9idXR0b25FbGVtZW50LmNoaWxkcmVuKCcucGlwLXJlZnJlc2gtdGV4dCcpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2hvdygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyAkb25DaGFuZ2VzKGNoYW5nZXM6IFJlZnJlc2hCdXR0b25DaGFuZ2VzKSB7XHJcbiAgICAgICAgaWYgKGNoYW5nZXMudmlzaWJsZS5jdXJyZW50VmFsdWUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgdGhpcy50ZXh0ID0gY2hhbmdlcy50ZXh0LmN1cnJlbnRWYWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkNsaWNrKCRldmVudCkge1xyXG4gICAgICAgIGlmICh0aGlzLm9uUmVmcmVzaCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uUmVmcmVzaCh7JGV2ZW50OiAkZXZlbnR9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzaG93KCkge1xyXG4gICAgICAgIGlmICh0aGlzLl90ZXh0RWxlbWVudCA9PT0gdW5kZWZpbmVkIHx8IHRoaXMuX2J1dHRvbkVsZW1lbnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFNldCBuZXcgdGV4dFxyXG4gICAgICAgIHRoaXMuX3RleHRFbGVtZW50LnRleHQodGhpcy50ZXh0KTtcclxuICAgICAgICAvLyBTaG93IGJ1dHRvblxyXG4gICAgICAgIHRoaXMuX2J1dHRvbkVsZW1lbnQuc2hvdygpO1xyXG4gICAgICAgIC8vIEFkanVzdCBwb3NpdGlvblxyXG4gICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5fYnV0dG9uRWxlbWVudC53aWR0aCgpO1xyXG4gICAgICAgIHRoaXMuX2J1dHRvbkVsZW1lbnQuY3NzKCdtYXJnaW4tbGVmdCcsICctJyArIHdpZHRoIC8gMiArICdweCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGlkZSgpIHtcclxuICAgICAgICB0aGlzLl9idXR0b25FbGVtZW50LmhpZGUoKTtcclxuICAgIH1cclxufVxyXG5cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgY29uc3QgUmVmcmVzaEJ1dHRvbkNvbXBvbmVudCA9IHtcclxuICAgICAgICBiaW5kaW5nczogUmVmcmVzaEJ1dHRvbkJpbmRpbmdzLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFJlZnJlc2hCdXR0b25Db250cm9sbGVyLFxyXG4gICAgICAgIHRlbXBsYXRlOiAnPG1kLWJ1dHRvbiBjbGFzcz1cInBpcC1yZWZyZXNoLWJ1dHRvblwiIHRhYmluZGV4PVwiLTFcIiBuZy1jbGljaz1cIiRjdHJsLm9uQ2xpY2soJGV2ZW50KVwiIGFyaWEtbGFiZWw9XCJSRUZSRVNIXCI+JyArXHJcbiAgICAgICAgICAgICc8bWQtaWNvbiBtZC1zdmctaWNvbj1cImljb25zOnJlZnJlc2hcIj48L21kLWljb24+JyArXHJcbiAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cInBpcC1yZWZyZXNoLXRleHRcIj48L3NwYW4+JyArXHJcbiAgICAgICAgICAgICc8L21kLWJ1dHRvbj4nXHJcbiAgICB9O1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdwaXBSZWZyZXNoQnV0dG9uJywgWyduZ01hdGVyaWFsJ10pXHJcbiAgICAgICAgLmNvbXBvbmVudCgncGlwUmVmcmVzaEJ1dHRvbicsIFJlZnJlc2hCdXR0b25Db21wb25lbnQpO1xyXG5cclxufSkoKTsiLCIvLyAvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG5jbGFzcyBUb2dnbGVCdXR0b24ge1xyXG4gICAgaWQ6IGFueTtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGRpc2FibGVkOiBib29sZWFuO1xyXG4gICAgbGV2ZWw6IG51bWJlcjtcclxuICAgIGRpc2VsZWN0YWJsZTogYm9vbGVhbjtcclxuICAgIGZpbGxlZDogYm9vbGVhbjtcclxufVxyXG5cclxuaW50ZXJmYWNlIElUb2dnbGVCdXR0b25zQmluZGluZ3Mge1xyXG4gICAgW2tleTogc3RyaW5nXTogYW55O1xyXG5cclxuICAgIG5nRGlzYWJsZWQ6IGFueSxcclxuICAgIGJ1dHRvbnM6IGFueSxcclxuICAgIGN1cnJlbnRCdXR0b25WYWx1ZTogYW55LFxyXG4gICAgY3VycmVudEJ1dHRvbjogYW55LFxyXG4gICAgbXVsdGlzZWxlY3Q6IGFueSxcclxuICAgIGNoYW5nZTogYW55LFxyXG4gICAgb25seVRvZ2dsZTogYW55XHJcbn1cclxuXHJcbmNvbnN0IFRvZ2dsZUJ1dHRvbnNCaW5kaW5nczogSVRvZ2dsZUJ1dHRvbnNCaW5kaW5ncyA9IHtcclxuICAgIG5nRGlzYWJsZWQ6ICc8PycsXHJcbiAgICBidXR0b25zOiAnPHBpcEJ1dHRvbnMnLFxyXG4gICAgY3VycmVudEJ1dHRvblZhbHVlOiAnPW5nTW9kZWwnLFxyXG4gICAgY3VycmVudEJ1dHRvbjogJz0/cGlwQnV0dG9uT2JqZWN0JyxcclxuICAgIG11bHRpc2VsZWN0OiAnPD9waXBNdWx0aXNlbGVjdCcsXHJcbiAgICBjaGFuZ2U6ICcmbmdDaGFuZ2UnLFxyXG4gICAgb25seVRvZ2dsZTogJzw/cGlwT25seVRvZ2dsZSdcclxufVxyXG5cclxuY2xhc3MgVG9nZ2xlQnV0dG9uc0NoYW5nZXMgaW1wbGVtZW50cyBuZy5JT25DaGFuZ2VzT2JqZWN0LCBJVG9nZ2xlQnV0dG9uc0JpbmRpbmdzIHtcclxuICAgIFtrZXk6IHN0cmluZ106IG5nLklDaGFuZ2VzT2JqZWN0PGFueT47XHJcbiAgICAvLyBOb3Qgb25lIHdheSBiaW5kaW5nc1xyXG4gICAgY3VycmVudEJ1dHRvblZhbHVlOiBhbnk7XHJcbiAgICBjdXJyZW50QnV0dG9uOiBhbnk7XHJcbiAgICBjaGFuZ2U6IG5nLklDaGFuZ2VzT2JqZWN0PCgpID0+IG5nLklQcm9taXNlPHZvaWQ+PjtcclxuICAgIC8vIE9uZSB3YXkgYmluZGluZ3NcclxuICAgIG5nRGlzYWJsZWQ6IG5nLklDaGFuZ2VzT2JqZWN0PGJvb2xlYW4+O1xyXG4gICAgYnV0dG9uczogbmcuSUNoYW5nZXNPYmplY3Q8VG9nZ2xlQnV0dG9uW10+O1xyXG4gICAgbXVsdGlzZWxlY3Q6IG5nLklDaGFuZ2VzT2JqZWN0PGJvb2xlYW4+O1xyXG4gICAgb25seVRvZ2dsZTogbmcuSUNoYW5nZXNPYmplY3Q8Ym9vbGVhbj47XHJcbn1cclxuXHJcbmNsYXNzIFRvZ2dsZUJ1dHRvbnNDb250cm9sbGVyIGltcGxlbWVudHMgSVRvZ2dsZUJ1dHRvbnNCaW5kaW5ncyB7XHJcbiAgICBsZW5naHQ6IG51bWJlcjtcclxuXHJcbiAgICBwdWJsaWMgbmdEaXNhYmxlZDogYm9vbGVhbjtcclxuICAgIHB1YmxpYyBjbGFzczogc3RyaW5nO1xyXG4gICAgcHVibGljIG11bHRpc2VsZWN0OiBib29sZWFuO1xyXG4gICAgcHVibGljIGJ1dHRvbnM6IFRvZ2dsZUJ1dHRvbltdO1xyXG4gICAgcHVibGljIGRpc2FibGVkOiBib29sZWFuO1xyXG4gICAgcHVibGljIGN1cnJlbnRCdXR0b25WYWx1ZTogYW55O1xyXG4gICAgcHVibGljIGN1cnJlbnRCdXR0b25JbmRleDogbnVtYmVyO1xyXG4gICAgcHVibGljIGN1cnJlbnRCdXR0b246IGFueTtcclxuICAgIHB1YmxpYyBjaGFuZ2U6ICgpID0+IG5nLklQcm9taXNlPGFueT47XHJcbiAgICBwdWJsaWMgb25seVRvZ2dsZTogYm9vbGVhbjtcclxuICAgIHB1YmxpYyBwaXBNZWRpYTogYW55O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgJGVsZW1lbnQ6IGFueSxcclxuICAgICAgICBwcml2YXRlICRhdHRyczogYW5ndWxhci5JQXR0cmlidXRlcyxcclxuICAgICAgICBwcml2YXRlICRzY29wZTogYW5ndWxhci5JU2NvcGUsXHJcbiAgICAgICAgcHJpdmF0ZSAkdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlLFxyXG4gICAgICAgICRpbmplY3RvcjogbmcuYXV0by5JSW5qZWN0b3JTZXJ2aWNlXHJcbiAgICApIHtcclxuICAgICAgICBcIm5nSW5qZWN0XCI7XHJcblxyXG4gICAgICAgIHRoaXMucGlwTWVkaWEgPSAkaW5qZWN0b3IuaGFzKCdwaXBNZWRpYScpID8gJGluamVjdG9yLmdldCgncGlwTWVkaWEnKSA6IG51bGw7XHJcbiAgICAgICAgdGhpcy5jbGFzcyA9ICRhdHRyc1snY2xhc3MnXSB8fCAnJztcclxuICAgICAgICBjb25zdCBpbmRleCA9IF8uaW5kZXhPZih0aGlzLmJ1dHRvbnMsIF8uZmluZCh0aGlzLmJ1dHRvbnMsIHtcclxuICAgICAgICAgICAgaWQ6IHRoaXMuY3VycmVudEJ1dHRvblZhbHVlXHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbkluZGV4ID0gaW5kZXggPCAwID8gMCA6IGluZGV4O1xyXG4gICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbiA9IHRoaXMuYnV0dG9ucy5sZW5ndGggPiAwID8gdGhpcy5idXR0b25zW3RoaXMuY3VycmVudEJ1dHRvbkluZGV4XSA6IHRoaXMuY3VycmVudEJ1dHRvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgJG9uQ2hhbmdlcyhjaGFuZ2VzOiBUb2dnbGVCdXR0b25zQ2hhbmdlcykge1xyXG4gICAgICAgIHRoaXMubXVsdGlzZWxlY3QgPSBjaGFuZ2VzLm11bHRpc2VsZWN0ID8gY2hhbmdlcy5tdWx0aXNlbGVjdC5jdXJyZW50VmFsdWUgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLmRpc2FibGVkID0gY2hhbmdlcy5uZ0Rpc2FibGVkID8gY2hhbmdlcy5uZ0Rpc2FibGVkLmN1cnJlbnRWYWx1ZSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMub25seVRvZ2dsZSA9IGNoYW5nZXMub25seVRvZ2dsZSA/IGNoYW5nZXMub25seVRvZ2dsZS5jdXJyZW50VmFsdWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5idXR0b25zID0gIWNoYW5nZXMuYnV0dG9ucyB8fCBfLmlzQXJyYXkoY2hhbmdlcy5idXR0b25zLmN1cnJlbnRWYWx1ZSkgJiYgY2hhbmdlcy5idXR0b25zLmN1cnJlbnRWYWx1ZS5sZW5ndGggPT09IDAgPyBcclxuICAgICAgICAgICAgW10gOiBjaGFuZ2VzLmJ1dHRvbnMuY3VycmVudFZhbHVlO1xyXG5cclxuICAgICAgICBjb25zdCBpbmRleCA9IF8uaW5kZXhPZih0aGlzLmJ1dHRvbnMsIF8uZmluZCh0aGlzLmJ1dHRvbnMsIHtcclxuICAgICAgICAgICAgaWQ6IHRoaXMuY3VycmVudEJ1dHRvblZhbHVlXHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbkluZGV4ID0gaW5kZXggPCAwID8gMCA6IGluZGV4O1xyXG4gICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbiA9IHRoaXMuYnV0dG9ucy5sZW5ndGggPiAwID8gdGhpcy5idXR0b25zW3RoaXMuY3VycmVudEJ1dHRvbkluZGV4XSA6IHRoaXMuY3VycmVudEJ1dHRvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgJHBvc3RMaW5rKCkge1xyXG4gICAgICAgIHRoaXMuJGVsZW1lbnRcclxuICAgICAgICAgICAgLm9uKCdmb2N1c2luJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcygnZm9jdXNlZC1jb250YWluZXInKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm9uKCdmb2N1c291dCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2ZvY3VzZWQtY29udGFpbmVyJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBidXR0b25TZWxlY3RlZChpbmRleCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbkluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50QnV0dG9uID0gdGhpcy5idXR0b25zW3RoaXMuY3VycmVudEJ1dHRvbkluZGV4XTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b25WYWx1ZSA9IHRoaXMuY3VycmVudEJ1dHRvbi5pZCB8fCBpbmRleDtcclxuXHJcbiAgICAgICAgdGhpcy4kdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbnRlclNwYWNlUHJlc3MoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLmJ1dHRvblNlbGVjdGVkKGV2ZW50LmluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGlnaGxpZ2h0QnV0dG9uKGluZGV4KSB7XHJcbiAgICAgICAgaWYgKHRoaXMubXVsdGlzZWxlY3QgJiZcclxuICAgICAgICAgICAgIV8uaXNVbmRlZmluZWQodGhpcy5jdXJyZW50QnV0dG9uLmxldmVsKSAmJlxyXG4gICAgICAgICAgICAhXy5pc1VuZGVmaW5lZCh0aGlzLmJ1dHRvbnNbaW5kZXhdLmxldmVsKSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudEJ1dHRvbi5sZXZlbCA+PSB0aGlzLmJ1dHRvbnNbaW5kZXhdLmxldmVsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudEJ1dHRvbkluZGV4ID09IGluZGV4O1xyXG4gICAgfVxyXG59XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIC8vIFdlIGNhbiB1c2UgdGhpcyB2YXJpYW50LCB3aGljaCByZXF1aXJlcyBsZXNzIG1lbW9yeSBhbGxvY2F0aW9uXHJcbiAgICAvKmNvbnN0IFRvZ2dsZUJ1dHRvbnMgPSB7XHJcbiAgICAgICAgYmluZGluZ3M6IFRvZ2dsZUJ1dHRvbnNCaW5kaW5ncyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3RvZ2dsZV9idXR0b25zL3RvZ2dsZV9idXR0b25zLmh0bWwnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFRvZ2dsZUJ1dHRvbnNDb250cm9sbGVyLFxyXG4gICAgfSovXHJcblxyXG4gICAgLy8gT3IgdGhpcyB2YXJpYW50LCB3aGljaCBzYWZlclxyXG4gICAgLypjbGFzcyBUb2dnbGVCdXR0b25zIGltcGxlbWVudHMgbmcuSUNvbXBvbmVudE9wdGlvbnMge1xyXG4gICAgICAgIHB1YmxpYyBiaW5kaW5nczogSVRvZ2dsZUJ1dHRvbnNCaW5kaW5ncztcclxuICAgICAgICBwdWJsaWMgY29udHJvbGxlcjogbmcuSW5qZWN0YWJsZTxuZy5JQ29udHJvbGxlckNvbnN0cnVjdG9yPjtcclxuICAgICAgICBwdWJsaWMgdGVtcGxhdGVVcmw6IHN0cmluZztcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYmluZGluZ3MgPSBUb2dnbGVCdXR0b25zQmluZGluZ3M7XHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbGxlciA9IFRvZ2dsZUJ1dHRvbnNDb250cm9sbGVyO1xyXG4gICAgICAgICAgICB0aGlzLnRlbXBsYXRlVXJsID0gJ3RvZ2dsZV9idXR0b25zL3RvZ2dsZV9idXR0b25zLmh0bWwnO1xyXG4gICAgICAgIH1cclxuICAgIH0qL1xyXG5cclxuICAgIC8vIE9yLCBJIHRoaW5rLCB0aGlzIHZhcmlhbnQuIFRoaXMgb25lIGlzIHNhZmUgYmVjYXVzZSB3ZSd2ZSBzcGVjaWZpZWQgaW50ZXJmYWNlIGFuZCByZXF1aXJlcyBsZXNzIG1lbW9yeSBhbGxvY2F0aW9uIGJlY2F1c2Ugd2UgdXNlIGNvbnN0YW50XHJcbiAgICBjb25zdCBUb2dnbGVCdXR0b25zOiBuZy5JQ29tcG9uZW50T3B0aW9ucyA9IHtcclxuICAgICAgICBiaW5kaW5nczogVG9nZ2xlQnV0dG9uc0JpbmRpbmdzLFxyXG4gICAgICAgIHRlbXBsYXRlVXJsOiAndG9nZ2xlX2J1dHRvbnMvdG9nZ2xlX2J1dHRvbnMuaHRtbCcsXHJcbiAgICAgICAgY29udHJvbGxlcjogVG9nZ2xlQnV0dG9uc0NvbnRyb2xsZXIsXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcFRvZ2dsZUJ1dHRvbnMnLCBbJ3BpcEJ1dHRvbnMuVGVtcGxhdGVzJ10pXHJcbiAgICAgICAgLmNvbXBvbmVudCgncGlwVG9nZ2xlQnV0dG9ucycsIFRvZ2dsZUJ1dHRvbnMpO1xyXG4gICAgXHJcbn0pKCk7IiwiKGZ1bmN0aW9uKG1vZHVsZSkge1xudHJ5IHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcEJ1dHRvbnMuVGVtcGxhdGVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBCdXR0b25zLlRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgndG9nZ2xlX2J1dHRvbnMvdG9nZ2xlX2J1dHRvbnMuaHRtbCcsXG4gICAgJzxkaXYgY2xhc3M9XCJwaXAtdG9nZ2xlLWJ1dHRvbnMgbGF5b3V0LXJvdyB7eyRjdHJsLmNsYXNzfX1cIiBwaXAtc2VsZWN0ZWQ9XCIkY3RybC5idWZCdXR0b25JbmRleFwiIHBpcC1lbnRlci1zcGFjZS1wcmVzcz1cIiRjdHJsLmVudGVyU3BhY2VQcmVzcygkZXZlbnQpXCIgbmctaWY9XCIhJGN0cmwucGlwTWVkaWEoXFwneHNcXCcpIHx8ICRjdHJsLm9ubHlUb2dnbGVcIj48bWQtYnV0dG9uIHRhYmluZGV4PVwiLTFcIiBuZy1yZXBlYXQ9XCJidXR0b24gaW4gJGN0cmwuYnV0dG9uc1wiIG5nLWNsYXNzPVwie1xcJ21kLWFjY2VudCBtZC1yYWlzZWQgc2VsZWN0ZWQgY29sb3ItYWNjZW50LWJnXFwnIDogJGN0cmwuaGlnaGxpZ2h0QnV0dG9uKCRpbmRleCl9XCIgbmctYXR0ci1zdHlsZT1cInt7IFxcJ2JhY2tncm91bmQtY29sb3I6XFwnICsgKCRjdHJsLmhpZ2hsaWdodEJ1dHRvbigkaW5kZXgpID8gYnV0dG9uLmJhY2tncm91bmRDb2xvciA6IFxcJ1xcJykgKyBcXCchaW1wb3J0YW50XFwnIH19XCIgY2xhc3M9XCJwaXAtc2VsZWN0YWJsZSBwaXAtY2hpcC1idXR0b24gZmxleFwiIG5nLWNsaWNrPVwiJGN0cmwuYnV0dG9uU2VsZWN0ZWQoJGluZGV4LCAkZXZlbnQpXCIgbmctZGlzYWJsZWQ9XCJidXR0b24uZGlzYWJsZWQgfHwgJGN0cmwuZGlzYWJsZWRcIj57e2J1dHRvbi5uYW1lIHx8IGJ1dHRvbi50aXRsZSB8IHRyYW5zbGF0ZX19IDxzcGFuIG5nLWlmPVwiYnV0dG9uLmNoZWNrZWQgfHwgYnV0dG9uLmNvbXBsZXRlIHx8IGJ1dHRvbi5maWxsZWRcIiBjbGFzcz1cInBpcC10YWdnZWRcIj4qPC9zcGFuPjwvbWQtYnV0dG9uPjwvZGl2PjxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIG5nLWlmPVwiJGN0cmwucGlwTWVkaWEoXFwneHNcXCcpICYmICEkY3RybC5vbmx5VG9nZ2xlXCI+PG1kLXNlbGVjdCBuZy1tb2RlbD1cIiRjdHJsLmN1cnJlbnRCdXR0b25JbmRleFwiIG5nLWRpc2FibGVkPVwiJGN0cmwuZGlzYWJsZWRcIiBhcmlhLWxhYmVsPVwiRFJPUERPV05cIiBtZC1vbi1jbG9zZT1cIiRjdHJsLmJ1dHRvblNlbGVjdGVkKCRjdHJsLmN1cnJlbnRCdXR0b25JbmRleClcIj48bWQtb3B0aW9uIG5nLXJlcGVhdD1cImFjdGlvbiBpbiAkY3RybC5idXR0b25zXCIgdmFsdWU9XCJ7eyA6OiRpbmRleCB9fVwiPnt7IChhY3Rpb24udGl0bGUgfHwgYWN0aW9uLm5hbWUpIHwgdHJhbnNsYXRlIH19IDxzcGFuIG5nLWlmPVwiYWN0aW9uLmNoZWNrZWQgfHwgYWN0aW9uLmNvbXBsZXRlIHx8IGFjdGlvbi5maWxsZWRcIiBjbGFzcz1cInBpcC10YWdnZWRcIj4qPC9zcGFuPjwvbWQtb3B0aW9uPjwvbWQtc2VsZWN0PjwvbWQtaW5wdXQtY29udGFpbmVyPicpO1xufV0pO1xufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGlwLXdlYnVpLWJ1dHRvbnMtaHRtbC5taW4uanMubWFwXG4iXX0=
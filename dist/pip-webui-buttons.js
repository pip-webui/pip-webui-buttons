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
    '<div class="pip-toggle-buttons layout-row {{toggle.class}}" pip-selected="toggle.bufButtonIndex" pip-enter-space-press="toggle.enterSpacePress($event)" ng-if="!toggle.pipMedia(\'xs\') || toggle.onlyToggle"><md-button tabindex="-1" ng-repeat="button in toggle.buttons" ng-class="{\'md-accent md-raised selected color-accent-bg\' : toggle.highlightButton($index)}" ng-attr-style="{{ \'background-color:\' + (toggle.highlightButton($index) ? button.backgroundColor : \'\') + \'!important\' }}" class="pip-selectable pip-chip-button flex" ng-click="toggle.buttonSelected($index, $event)" ng-disabled="button.disabled || toggle.disabled">{{button.name || button.title | translate}} <span ng-if="button.checked || button.complete || button.filled" class="pip-tagged">*</span></md-button></div><md-input-container class="md-block" ng-if="toggle.pipMedia(\'xs\') && !toggle.onlyToggle"><md-select ng-model="toggle.currentButtonIndex" ng-disabled="toggle.disabled" aria-label="DROPDOWN" md-on-close="toggle.buttonSelected(toggle.currentButtonIndex)"><md-option ng-repeat="action in toggle.buttons" value="{{ ::$index }}">{{ (action.title || action.name) | translate }} <span ng-if="action.checked || action.complete || action.filled" class="pip-tagged">*</span></md-option></md-select></md-input-container>');
}]);
})();



},{}]},{},[6,1,2,3,4,5])(6)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYnV0dG9ucy50cyIsInNyYy9kZXBlbmRlbmNpZXMvdHJhbnNsYXRlLnRzIiwic3JjL2ZhYnMvZmFiX3Rvb2x0aXBfdmlzaWJpbGl0eS50cyIsInNyYy9yZWZyZXNoX2J1dHRvbi9yZWZyZXNoX2J1dHRvbi50cyIsInNyYy90b2dnbGVfYnV0dG9ucy90b2dnbGVfYnV0dG9ucy50cyIsInRlbXAvcGlwLXdlYnVpLWJ1dHRvbnMtaHRtbC5taW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNFQSxDQUFDO0lBQ0csWUFBWSxDQUFDO0lBRWIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7UUFDekIsa0JBQWtCO1FBQ2xCLGtCQUFrQjtRQUNsQix5QkFBeUI7S0FDNUIsQ0FBQyxDQUFDO0FBRVAsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7QUNUTCxDQUFDO0lBQ0csWUFBWSxDQUFDO0lBRWIsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUU1RCxVQUFVLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxVQUFVLFNBQVM7UUFDOUMsSUFBSSxZQUFZLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUM7Y0FDMUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFM0MsTUFBTSxDQUFDLFVBQVUsR0FBRztZQUNoQixNQUFNLENBQUMsWUFBWSxHQUFJLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNwRSxDQUFDLENBQUE7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUVQLENBQUMsQ0FBQyxFQUFFLENBQUM7O0FDZEw7SUFLSSx3Q0FDSSxRQUFhLEVBQ2IsTUFBMkIsRUFDM0IsTUFBc0IsRUFDdEIsUUFB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LElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQ2pFLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixJQUFJLEtBQUssQ0FBQztJQUM1QyxDQUFDO0lBQ0wsOEJBQUM7QUFBRCxDQXZGQSxBQXVGQyxJQUFBO0FBRUQsQ0FBQztJQUNHLFlBQVksQ0FBQztJQUViLElBQU0sYUFBYSxHQUFHO1FBQ2xCLFFBQVEsRUFBRSxxQkFBcUI7UUFDL0IsV0FBVyxFQUFFLG9DQUFvQztRQUNqRCxVQUFVLEVBQUUsdUJBQXVCO1FBQ25DLFlBQVksRUFBRSxRQUFRO0tBQ3pCLENBQUE7SUFFRCxPQUFPO1NBQ0YsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUMsc0JBQXNCLENBQUMsQ0FBQztTQUNwRCxTQUFTLENBQUMsa0JBQWtCLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFFdEQsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7QUNySkw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCLvu78vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdwaXBCdXR0b25zJywgW1xyXG4gICAgICAgICdwaXBUb2dnbGVCdXR0b25zJyxcclxuICAgICAgICAncGlwUmVmcmVzaEJ1dHRvbicsXHJcbiAgICAgICAgJ3BpcEZhYlRvb2x0aXBWaXNpYmlsaXR5J1xyXG4gICAgXSk7XHJcblxyXG59KSgpO1xyXG5cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgdGhpc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBCdXR0b25zLlRyYW5zbGF0ZScsIFtdKTtcclxuXHJcbiAgICB0aGlzTW9kdWxlLmZpbHRlcigndHJhbnNsYXRlJywgZnVuY3Rpb24gKCRpbmplY3Rvcikge1xyXG4gICAgICAgIHZhciBwaXBUcmFuc2xhdGUgPSAkaW5qZWN0b3IuaGFzKCdwaXBUcmFuc2xhdGUnKSBcclxuICAgICAgICAgICAgPyAkaW5qZWN0b3IuZ2V0KCdwaXBUcmFuc2xhdGUnKSA6IG51bGw7XHJcblxyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwaXBUcmFuc2xhdGUgID8gcGlwVHJhbnNsYXRlLnRyYW5zbGF0ZShrZXkpIHx8IGtleSA6IGtleTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbn0pKCk7XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbmNsYXNzIEZhYlRvb2x0aXBWaXNpYmlsaXR5Q29udHJvbGxlciB7XHJcbiAgICBwcml2YXRlIF9lbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBfc2NvcGU6IGFuZ3VsYXIuSVNjb3BlO1xyXG4gICAgcHJpdmF0ZSBfdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICRlbGVtZW50OiBhbnksXHJcbiAgICAgICAgJGF0dHJzOiBhbmd1bGFyLklBdHRyaWJ1dGVzLFxyXG4gICAgICAgICRzY29wZTogYW5ndWxhci5JU2NvcGUsXHJcbiAgICAgICAgJHRpbWVvdXQ6IG5nLklUaW1lb3V0U2VydmljZSxcclxuICAgICAgICAkcGFyc2VcclxuICAgICkge1xyXG4gICAgICAgIFwibmdJbmplY3RcIjtcclxuICAgICAgICBsZXQgdHJpZ0dldHRlciA9ICRwYXJzZSgkYXR0cnNbJ3BpcEZhYlRvb2x0aXBWaXNpYmlsaXR5J10pLFxyXG4gICAgICAgICAgICBzaG93R2V0dGVyID0gJHBhcnNlKCRhdHRyc1sncGlwRmFiU2hvd1Rvb2x0aXAnXSksXHJcbiAgICAgICAgICAgIHNob3dTZXR0ZXIgPSBzaG93R2V0dGVyLmFzc2lnbjtcclxuXHJcbiAgICAgICAgJHNjb3BlLiR3YXRjaCh0cmlnR2V0dGVyLCAoaXNPcGVuKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghXy5pc0Z1bmN0aW9uKHNob3dTZXR0ZXIpKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBpZiAoaXNPcGVuKSB7XHJcbiAgICAgICAgICAgICAgICAkdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd1NldHRlcigkc2NvcGUsIGlzT3Blbik7XHJcbiAgICAgICAgICAgICAgICB9LCA2MDApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2hvd1NldHRlcigkc2NvcGUsIGlzT3Blbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuKCgpID0+IHtcclxuICAgIGZ1bmN0aW9uIHBpcEZhYlRvb2x0aXBWaXNpYmlsaXR5KCRwYXJzZSwgJHRpbWVvdXQpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgICAgICBzY29wZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IEZhYlRvb2x0aXBWaXNpYmlsaXR5Q29udHJvbGxlclxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcEZhYlRvb2x0aXBWaXNpYmlsaXR5JywgW10pXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgncGlwRmFiVG9vbHRpcFZpc2liaWxpdHknLCBwaXBGYWJUb29sdGlwVmlzaWJpbGl0eSk7XHJcblxyXG59KSgpOyIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbmludGVyZmFjZSBJUmVmcmVzaEJ1dHRvbkJpbmRpbmdzIHtcclxuICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxuXHJcbiAgICB0ZXh0OiBhbnksXHJcbiAgICB2aXNpYmxlOiBhbnksXHJcbiAgICBvblJlZnJlc2g6IGFueVxyXG59XHJcblxyXG5jb25zdCBSZWZyZXNoQnV0dG9uQmluZGluZ3M6IElSZWZyZXNoQnV0dG9uQmluZGluZ3MgPSB7XHJcbiAgICB0ZXh0OiAnPHBpcFRleHQnLFxyXG4gICAgdmlzaWJsZTogJzxwaXBWaXNpYmxlJyxcclxuICAgIG9uUmVmcmVzaDogJyY/cGlwUmVmcmVzaCdcclxufVxyXG5cclxuY2xhc3MgUmVmcmVzaEJ1dHRvbkNoYW5nZXMgaW1wbGVtZW50cyBuZy5JT25DaGFuZ2VzT2JqZWN0LCBJUmVmcmVzaEJ1dHRvbkJpbmRpbmdzIHtcclxuICAgIFtrZXk6IHN0cmluZ106IG5nLklDaGFuZ2VzT2JqZWN0PGFueT47XHJcbiAgICAvLyBOb3Qgb25lIHdheSBiaW5kaW5nc1xyXG4gICAgb25SZWZyZXNoOiBuZy5JQ2hhbmdlc09iamVjdDwoeyRldmVudDogYW55fSkgPT4gbmcuSVByb21pc2U8YW55Pj47XHJcbiAgICAvLyBPbmUgd2F5IGJpbmRpbmdzXHJcbiAgICB0ZXh0OiBuZy5JQ2hhbmdlc09iamVjdDxzdHJpbmc+O1xyXG4gICAgdmlzaWJsZTogbmcuSUNoYW5nZXNPYmplY3Q8Ym9vbGVhbj47XHJcbn1cclxuXHJcbmNsYXNzIFJlZnJlc2hCdXR0b25Db250cm9sbGVyIGltcGxlbWVudHMgSVJlZnJlc2hCdXR0b25CaW5kaW5ncyB7XHJcblxyXG4gICAgcHJpdmF0ZSBfdGV4dEVsZW1lbnQ6IGFueTtcclxuICAgIHByaXZhdGUgX2J1dHRvbkVsZW1lbnQ6IGFueTtcclxuICAgIHByaXZhdGUgX3dpZHRoOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIHRleHQ6IHN0cmluZztcclxuICAgIHB1YmxpYyB2aXNpYmxlOiBib29sZWFuO1xyXG4gICAgcHVibGljIG9uUmVmcmVzaDogKHBhcmFtOiB7JGV2ZW50OiBuZy5JQW5ndWxhckV2ZW50fSkgPT4gbmcuSVByb21pc2U8YW55PjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlICRzY29wZTogbmcuSVNjb3BlLFxyXG4gICAgICAgIHByaXZhdGUgJGVsZW1lbnQ6IGFueSxcclxuICAgICAgICBwcml2YXRlICRhdHRyczogbmcuSUF0dHJpYnV0ZXNcclxuICAgICkgeyB9XHJcblxyXG4gICAgcHVibGljICRwb3N0TGluaygpIHtcclxuICAgICAgICB0aGlzLl9idXR0b25FbGVtZW50ID0gdGhpcy4kZWxlbWVudC5jaGlsZHJlbignLm1kLWJ1dHRvbicpO1xyXG4gICAgICAgIHRoaXMuX3RleHRFbGVtZW50ID0gdGhpcy5fYnV0dG9uRWxlbWVudC5jaGlsZHJlbignLnBpcC1yZWZyZXNoLXRleHQnKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnNob3coKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgJG9uQ2hhbmdlcyhjaGFuZ2VzOiBSZWZyZXNoQnV0dG9uQ2hhbmdlcykge1xyXG4gICAgICAgIGlmIChjaGFuZ2VzLnZpc2libGUuY3VycmVudFZhbHVlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dCA9IGNoYW5nZXMudGV4dC5jdXJyZW50VmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvdygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25DbGljaygkZXZlbnQpIHtcclxuICAgICAgICBpZiAodGhpcy5vblJlZnJlc2gpIHtcclxuICAgICAgICAgICAgdGhpcy5vblJlZnJlc2goeyRldmVudDogJGV2ZW50fSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2hvdygpIHtcclxuICAgICAgICBpZiAodGhpcy5fdGV4dEVsZW1lbnQgPT09IHVuZGVmaW5lZCB8fCB0aGlzLl9idXR0b25FbGVtZW50ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBTZXQgbmV3IHRleHRcclxuICAgICAgICB0aGlzLl90ZXh0RWxlbWVudC50ZXh0KHRoaXMudGV4dCk7XHJcbiAgICAgICAgLy8gU2hvdyBidXR0b25cclxuICAgICAgICB0aGlzLl9idXR0b25FbGVtZW50LnNob3coKTtcclxuICAgICAgICAvLyBBZGp1c3QgcG9zaXRpb25cclxuICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuX2J1dHRvbkVsZW1lbnQud2lkdGgoKTtcclxuICAgICAgICB0aGlzLl9idXR0b25FbGVtZW50LmNzcygnbWFyZ2luLWxlZnQnLCAnLScgKyB3aWR0aCAvIDIgKyAncHgnKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhpZGUoKSB7XHJcbiAgICAgICAgdGhpcy5fYnV0dG9uRWxlbWVudC5oaWRlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGNvbnN0IFJlZnJlc2hCdXR0b25Db21wb25lbnQgPSB7XHJcbiAgICAgICAgYmluZGluZ3M6IFJlZnJlc2hCdXR0b25CaW5kaW5ncyxcclxuICAgICAgICBjb250cm9sbGVyOiBSZWZyZXNoQnV0dG9uQ29udHJvbGxlcixcclxuICAgICAgICB0ZW1wbGF0ZTogJzxtZC1idXR0b24gY2xhc3M9XCJwaXAtcmVmcmVzaC1idXR0b25cIiB0YWJpbmRleD1cIi0xXCIgbmctY2xpY2s9XCIkY3RybC5vbkNsaWNrKCRldmVudClcIiBhcmlhLWxhYmVsPVwiUkVGUkVTSFwiPicgK1xyXG4gICAgICAgICAgICAnPG1kLWljb24gbWQtc3ZnLWljb249XCJpY29uczpyZWZyZXNoXCI+PC9tZC1pY29uPicgK1xyXG4gICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJwaXAtcmVmcmVzaC10ZXh0XCI+PC9zcGFuPicgK1xyXG4gICAgICAgICAgICAnPC9tZC1idXR0b24+J1xyXG4gICAgfTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgncGlwUmVmcmVzaEJ1dHRvbicsIFsnbmdNYXRlcmlhbCddKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ3BpcFJlZnJlc2hCdXR0b24nLCBSZWZyZXNoQnV0dG9uQ29tcG9uZW50KTtcclxuXHJcbn0pKCk7IiwiLy8gLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuY2xhc3MgVG9nZ2xlQnV0dG9uIHtcclxuICAgIGlkOiBhbnk7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBkaXNhYmxlZDogYm9vbGVhbjtcclxuICAgIGxldmVsOiBudW1iZXI7XHJcbiAgICBkaXNlbGVjdGFibGU6IGJvb2xlYW47XHJcbiAgICBmaWxsZWQ6IGJvb2xlYW47XHJcbn1cclxuXHJcbmludGVyZmFjZSBJVG9nZ2xlQnV0dG9uc0JpbmRpbmdzIHtcclxuICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxuXHJcbiAgICBuZ0Rpc2FibGVkOiBhbnksXHJcbiAgICBidXR0b25zOiBhbnksXHJcbiAgICBjdXJyZW50QnV0dG9uVmFsdWU6IGFueSxcclxuICAgIGN1cnJlbnRCdXR0b246IGFueSxcclxuICAgIG11bHRpc2VsZWN0OiBhbnksXHJcbiAgICBjaGFuZ2U6IGFueSxcclxuICAgIG9ubHlUb2dnbGU6IGFueVxyXG59XHJcblxyXG5jb25zdCBUb2dnbGVCdXR0b25zQmluZGluZ3M6IElUb2dnbGVCdXR0b25zQmluZGluZ3MgPSB7XHJcbiAgICBuZ0Rpc2FibGVkOiAnPD8nLFxyXG4gICAgYnV0dG9uczogJzxwaXBCdXR0b25zJyxcclxuICAgIGN1cnJlbnRCdXR0b25WYWx1ZTogJz1uZ01vZGVsJyxcclxuICAgIGN1cnJlbnRCdXR0b246ICc9P3BpcEJ1dHRvbk9iamVjdCcsXHJcbiAgICBtdWx0aXNlbGVjdDogJzw/cGlwTXVsdGlzZWxlY3QnLFxyXG4gICAgY2hhbmdlOiAnJm5nQ2hhbmdlJyxcclxuICAgIG9ubHlUb2dnbGU6ICc8P3BpcE9ubHlUb2dnbGUnXHJcbn1cclxuXHJcbmNsYXNzIFRvZ2dsZUJ1dHRvbnNDaGFuZ2VzIGltcGxlbWVudHMgbmcuSU9uQ2hhbmdlc09iamVjdCwgSVRvZ2dsZUJ1dHRvbnNCaW5kaW5ncyB7XHJcbiAgICBba2V5OiBzdHJpbmddOiBuZy5JQ2hhbmdlc09iamVjdDxhbnk+O1xyXG4gICAgXHJcbiAgICBjdXJyZW50QnV0dG9uVmFsdWU6IGFueTtcclxuICAgIGN1cnJlbnRCdXR0b246IGFueTtcclxuICAgIGNoYW5nZTogbmcuSUNoYW5nZXNPYmplY3Q8KCkgPT4gbmcuSVByb21pc2U8dm9pZD4+O1xyXG5cclxuICAgIG5nRGlzYWJsZWQ6IG5nLklDaGFuZ2VzT2JqZWN0PGJvb2xlYW4+O1xyXG4gICAgYnV0dG9uczogbmcuSUNoYW5nZXNPYmplY3Q8VG9nZ2xlQnV0dG9uW10+O1xyXG4gICAgbXVsdGlzZWxlY3Q6IG5nLklDaGFuZ2VzT2JqZWN0PGJvb2xlYW4+O1xyXG4gICAgb25seVRvZ2dsZTogbmcuSUNoYW5nZXNPYmplY3Q8Ym9vbGVhbj47XHJcbn1cclxuXHJcbmNsYXNzIFRvZ2dsZUJ1dHRvbnNDb250cm9sbGVyIGltcGxlbWVudHMgSVRvZ2dsZUJ1dHRvbnNCaW5kaW5ncyB7XHJcblxyXG4gICAgcHVibGljIG5nRGlzYWJsZWQ6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgY2xhc3M6IHN0cmluZztcclxuICAgIHB1YmxpYyBtdWx0aXNlbGVjdDogYm9vbGVhbjtcclxuICAgIHB1YmxpYyBidXR0b25zOiBUb2dnbGVCdXR0b25bXTtcclxuICAgIHB1YmxpYyBkaXNhYmxlZDogYm9vbGVhbjtcclxuICAgIHB1YmxpYyBjdXJyZW50QnV0dG9uVmFsdWU6IGFueTtcclxuICAgIHB1YmxpYyBjdXJyZW50QnV0dG9uSW5kZXg6IG51bWJlcjtcclxuICAgIHB1YmxpYyBjdXJyZW50QnV0dG9uOiBhbnk7XHJcbiAgICBwdWJsaWMgY2hhbmdlOiAoKSA9PiBuZy5JUHJvbWlzZTxhbnk+O1xyXG4gICAgcHVibGljIG9ubHlUb2dnbGU6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgcGlwTWVkaWE6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlICRlbGVtZW50OiBhbnksXHJcbiAgICAgICAgcHJpdmF0ZSAkYXR0cnM6IGFuZ3VsYXIuSUF0dHJpYnV0ZXMsXHJcbiAgICAgICAgcHJpdmF0ZSAkc2NvcGU6IGFuZ3VsYXIuSVNjb3BlLFxyXG4gICAgICAgIHByaXZhdGUgJHRpbWVvdXQ6IG5nLklUaW1lb3V0U2VydmljZSxcclxuICAgICAgICAkaW5qZWN0b3I6IG5nLmF1dG8uSUluamVjdG9yU2VydmljZVxyXG4gICAgKSB7XHJcbiAgICAgICAgXCJuZ0luamVjdFwiO1xyXG5cclxuICAgICAgICB0aGlzLnBpcE1lZGlhID0gJGluamVjdG9yLmhhcygncGlwTWVkaWEnKSA/ICRpbmplY3Rvci5nZXQoJ3BpcE1lZGlhJykgOiBudWxsO1xyXG4gICAgICAgIHRoaXMuY2xhc3MgPSAkYXR0cnNbJ2NsYXNzJ10gfHwgJyc7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gXy5pbmRleE9mKHRoaXMuYnV0dG9ucywgXy5maW5kKHRoaXMuYnV0dG9ucywge1xyXG4gICAgICAgICAgICBpZDogdGhpcy5jdXJyZW50QnV0dG9uVmFsdWVcclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50QnV0dG9uSW5kZXggPSBpbmRleCA8IDAgPyAwIDogaW5kZXg7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50QnV0dG9uID0gdGhpcy5idXR0b25zLmxlbmd0aCA+IDAgPyB0aGlzLmJ1dHRvbnNbdGhpcy5jdXJyZW50QnV0dG9uSW5kZXhdIDogdGhpcy5jdXJyZW50QnV0dG9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyAkb25DaGFuZ2VzKGNoYW5nZXM6IFRvZ2dsZUJ1dHRvbnNDaGFuZ2VzKSB7XHJcbiAgICAgICAgdGhpcy5tdWx0aXNlbGVjdCA9IGNoYW5nZXMubXVsdGlzZWxlY3QgPyBjaGFuZ2VzLm11bHRpc2VsZWN0LmN1cnJlbnRWYWx1ZSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSBjaGFuZ2VzLm5nRGlzYWJsZWQgPyBjaGFuZ2VzLm5nRGlzYWJsZWQuY3VycmVudFZhbHVlIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5vbmx5VG9nZ2xlID0gY2hhbmdlcy5vbmx5VG9nZ2xlID8gY2hhbmdlcy5vbmx5VG9nZ2xlLmN1cnJlbnRWYWx1ZSA6IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSAhY2hhbmdlcy5idXR0b25zIHx8IF8uaXNBcnJheShjaGFuZ2VzLmJ1dHRvbnMuY3VycmVudFZhbHVlKSAmJiBjaGFuZ2VzLmJ1dHRvbnMuY3VycmVudFZhbHVlLmxlbmd0aCA9PT0gMCA/IFxyXG4gICAgICAgICAgICBbXSA6IGNoYW5nZXMuYnV0dG9ucy5jdXJyZW50VmFsdWU7XHJcblxyXG4gICAgICAgIGxldCBpbmRleCA9IF8uaW5kZXhPZih0aGlzLmJ1dHRvbnMsIF8uZmluZCh0aGlzLmJ1dHRvbnMsIHtcclxuICAgICAgICAgICAgaWQ6IHRoaXMuY3VycmVudEJ1dHRvblZhbHVlXHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbkluZGV4ID0gaW5kZXggPCAwID8gMCA6IGluZGV4O1xyXG4gICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbiA9IHRoaXMuYnV0dG9ucy5sZW5ndGggPiAwID8gdGhpcy5idXR0b25zW3RoaXMuY3VycmVudEJ1dHRvbkluZGV4XSA6IHRoaXMuY3VycmVudEJ1dHRvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgJHBvc3RMaW5rKCkge1xyXG4gICAgICAgIHRoaXMuJGVsZW1lbnRcclxuICAgICAgICAgICAgLm9uKCdmb2N1c2luJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcygnZm9jdXNlZC1jb250YWluZXInKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm9uKCdmb2N1c291dCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2ZvY3VzZWQtY29udGFpbmVyJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBidXR0b25TZWxlY3RlZChpbmRleCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbkluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50QnV0dG9uID0gdGhpcy5idXR0b25zW3RoaXMuY3VycmVudEJ1dHRvbkluZGV4XTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b25WYWx1ZSA9IHRoaXMuY3VycmVudEJ1dHRvbi5pZCB8fCBpbmRleDtcclxuXHJcbiAgICAgICAgdGhpcy4kdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbnRlclNwYWNlUHJlc3MoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLmJ1dHRvblNlbGVjdGVkKGV2ZW50LmluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGlnaGxpZ2h0QnV0dG9uKGluZGV4KSB7XHJcbiAgICAgICAgaWYgKHRoaXMubXVsdGlzZWxlY3QgJiZcclxuICAgICAgICAgICAgIV8uaXNVbmRlZmluZWQodGhpcy5jdXJyZW50QnV0dG9uLmxldmVsKSAmJlxyXG4gICAgICAgICAgICAhXy5pc1VuZGVmaW5lZCh0aGlzLmJ1dHRvbnNbaW5kZXhdLmxldmVsKSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudEJ1dHRvbi5sZXZlbCA+PSB0aGlzLmJ1dHRvbnNbaW5kZXhdLmxldmVsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudEJ1dHRvbkluZGV4ID09IGluZGV4O1xyXG4gICAgfVxyXG59XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGNvbnN0IFRvZ2dsZUJ1dHRvbnMgPSB7XHJcbiAgICAgICAgYmluZGluZ3M6IFRvZ2dsZUJ1dHRvbnNCaW5kaW5ncyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3RvZ2dsZV9idXR0b25zL3RvZ2dsZV9idXR0b25zLmh0bWwnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFRvZ2dsZUJ1dHRvbnNDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3RvZ2dsZSdcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncGlwVG9nZ2xlQnV0dG9ucycsIFsncGlwQnV0dG9ucy5UZW1wbGF0ZXMnXSlcclxuICAgICAgICAuY29tcG9uZW50KCdwaXBUb2dnbGVCdXR0b25zJywgVG9nZ2xlQnV0dG9ucyk7XHJcbiAgICBcclxufSkoKTsiLCIoZnVuY3Rpb24obW9kdWxlKSB7XG50cnkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQnV0dG9ucy5UZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcEJ1dHRvbnMuVGVtcGxhdGVzJywgW10pO1xufVxubW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd0b2dnbGVfYnV0dG9ucy90b2dnbGVfYnV0dG9ucy5odG1sJyxcbiAgICAnPGRpdiBjbGFzcz1cInBpcC10b2dnbGUtYnV0dG9ucyBsYXlvdXQtcm93IHt7dG9nZ2xlLmNsYXNzfX1cIiBwaXAtc2VsZWN0ZWQ9XCJ0b2dnbGUuYnVmQnV0dG9uSW5kZXhcIiBwaXAtZW50ZXItc3BhY2UtcHJlc3M9XCJ0b2dnbGUuZW50ZXJTcGFjZVByZXNzKCRldmVudClcIiBuZy1pZj1cIiF0b2dnbGUucGlwTWVkaWEoXFwneHNcXCcpIHx8IHRvZ2dsZS5vbmx5VG9nZ2xlXCI+PG1kLWJ1dHRvbiB0YWJpbmRleD1cIi0xXCIgbmctcmVwZWF0PVwiYnV0dG9uIGluIHRvZ2dsZS5idXR0b25zXCIgbmctY2xhc3M9XCJ7XFwnbWQtYWNjZW50IG1kLXJhaXNlZCBzZWxlY3RlZCBjb2xvci1hY2NlbnQtYmdcXCcgOiB0b2dnbGUuaGlnaGxpZ2h0QnV0dG9uKCRpbmRleCl9XCIgbmctYXR0ci1zdHlsZT1cInt7IFxcJ2JhY2tncm91bmQtY29sb3I6XFwnICsgKHRvZ2dsZS5oaWdobGlnaHRCdXR0b24oJGluZGV4KSA/IGJ1dHRvbi5iYWNrZ3JvdW5kQ29sb3IgOiBcXCdcXCcpICsgXFwnIWltcG9ydGFudFxcJyB9fVwiIGNsYXNzPVwicGlwLXNlbGVjdGFibGUgcGlwLWNoaXAtYnV0dG9uIGZsZXhcIiBuZy1jbGljaz1cInRvZ2dsZS5idXR0b25TZWxlY3RlZCgkaW5kZXgsICRldmVudClcIiBuZy1kaXNhYmxlZD1cImJ1dHRvbi5kaXNhYmxlZCB8fCB0b2dnbGUuZGlzYWJsZWRcIj57e2J1dHRvbi5uYW1lIHx8IGJ1dHRvbi50aXRsZSB8IHRyYW5zbGF0ZX19IDxzcGFuIG5nLWlmPVwiYnV0dG9uLmNoZWNrZWQgfHwgYnV0dG9uLmNvbXBsZXRlIHx8IGJ1dHRvbi5maWxsZWRcIiBjbGFzcz1cInBpcC10YWdnZWRcIj4qPC9zcGFuPjwvbWQtYnV0dG9uPjwvZGl2PjxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIG5nLWlmPVwidG9nZ2xlLnBpcE1lZGlhKFxcJ3hzXFwnKSAmJiAhdG9nZ2xlLm9ubHlUb2dnbGVcIj48bWQtc2VsZWN0IG5nLW1vZGVsPVwidG9nZ2xlLmN1cnJlbnRCdXR0b25JbmRleFwiIG5nLWRpc2FibGVkPVwidG9nZ2xlLmRpc2FibGVkXCIgYXJpYS1sYWJlbD1cIkRST1BET1dOXCIgbWQtb24tY2xvc2U9XCJ0b2dnbGUuYnV0dG9uU2VsZWN0ZWQodG9nZ2xlLmN1cnJlbnRCdXR0b25JbmRleClcIj48bWQtb3B0aW9uIG5nLXJlcGVhdD1cImFjdGlvbiBpbiB0b2dnbGUuYnV0dG9uc1wiIHZhbHVlPVwie3sgOjokaW5kZXggfX1cIj57eyAoYWN0aW9uLnRpdGxlIHx8IGFjdGlvbi5uYW1lKSB8IHRyYW5zbGF0ZSB9fSA8c3BhbiBuZy1pZj1cImFjdGlvbi5jaGVja2VkIHx8IGFjdGlvbi5jb21wbGV0ZSB8fCBhY3Rpb24uZmlsbGVkXCIgY2xhc3M9XCJwaXAtdGFnZ2VkXCI+Kjwvc3Bhbj48L21kLW9wdGlvbj48L21kLXNlbGVjdD48L21kLWlucHV0LWNvbnRhaW5lcj4nKTtcbn1dKTtcbn0pKCk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBpcC13ZWJ1aS1idXR0b25zLWh0bWwubWluLmpzLm1hcFxuIl19
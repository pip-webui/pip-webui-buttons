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
        console.log('this.pipMedia', this.pipMedia);
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
    '<div class="pip-toggle-buttons layout-row {{toggle.class}}" pip-selected="toggle.bufButtonIndex" pip-enter-space-press="toggle.enterSpacePress($event)" ng-if="!toggle.pipMedia(\'xs\') || toggle.onlyToggle"><md-button tabindex="-1" ng-repeat="button in toggle.buttons" ng-class="{\'md-accent md-raised selected color-accent-bg\' : toggle.highlightButton($index)}" ng-attr-style="{{ \'background-color:\' + (toggle.highlightButton($index) ? button.backgroundColor : \'\') + \'!important\' }}" class="pip-selectable pip-chip-button flex" ng-click="toggle.buttonSelected($index, $event)" ng-disabled="button.disabled || toggle.ngDisabled">{{button.name || button.title | translate}} <span ng-if="button.checked || button.complete || button.filled" class="pip-tagged">*</span></md-button></div><md-input-container class="md-block" ng-if="toggle.pipMedia(\'xs\') && !toggle.onlyToggle"><md-select ng-model="toggle.currentButtonIndex" ng-disabled="toggle.ngDisabled" aria-label="DROPDOWN" md-on-close="toggle.buttonSelected(toggle.currentButtonIndex)"><md-option ng-repeat="action in toggle.buttons" value="{{ ::$index }}">{{ (action.title || action.name) | translate }} <span ng-if="action.checked || action.complete || action.filled" class="pip-tagged">*</span></md-option></md-select></md-input-container>');
}]);
})();



},{}]},{},[6,1,2,3,4,5])(6)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYnV0dG9ucy50cyIsInNyYy9kZXBlbmRlbmNpZXMvdHJhbnNsYXRlLnRzIiwic3JjL2ZhYnMvZmFiX3Rvb2x0aXBfdmlzaWJpbGl0eS50cyIsInNyYy9yZWZyZXNoX2J1dHRvbi9yZWZyZXNoX2J1dHRvbi50cyIsInNyYy90b2dnbGVfYnV0dG9ucy90b2dnbGVfYnV0dG9ucy50cyIsInRlbXAvcGlwLXdlYnVpLWJ1dHRvbnMtaHRtbC5taW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNFQSxDQUFDO0lBQ0csWUFBWSxDQUFDO0lBRWIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7UUFDekIsa0JBQWtCO1FBQ2xCLGtCQUFrQjtRQUNsQix5QkFBeUI7S0FDNUIsQ0FBQyxDQUFDO0FBRVAsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7QUNUTCxDQUFDO0lBQ0csWUFBWSxDQUFDO0lBRWIsSUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUU1RCxVQUFVLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxVQUFVLFNBQVM7UUFDOUMsSUFBSSxZQUFZLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUM7Y0FDMUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFM0MsTUFBTSxDQUFDLFVBQVUsR0FBRztZQUNoQixNQUFNLENBQUMsWUFBWSxHQUFJLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNwRSxDQUFDLENBQUE7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUVQLENBQUMsQ0FBQyxFQUFFLENBQUM7O0FDZEw7SUFLSSx3Q0FDSSxRQUFhLEVBQ2IsTUFBMkIsRUFDM0IsTUFBc0IsRUFDdEIsUUFB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LENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNqRSxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsSUFBSSxLQUFLLENBQUM7SUFDNUMsQ0FBQztJQUNMLDhCQUFDO0FBQUQsQ0F4RkEsQUF3RkMsSUFBQTtBQUVELENBQUM7SUFDRyxZQUFZLENBQUM7SUFFYixJQUFNLGFBQWEsR0FBRztRQUNsQixRQUFRLEVBQUUscUJBQXFCO1FBQy9CLFdBQVcsRUFBRSxvQ0FBb0M7UUFDakQsVUFBVSxFQUFFLHVCQUF1QjtRQUNuQyxZQUFZLEVBQUUsUUFBUTtLQUN6QixDQUFBO0lBRUQsT0FBTztTQUNGLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLHNCQUFzQixDQUFDLENBQUM7U0FDcEQsU0FBUyxDQUFDLGtCQUFrQixFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBRXRELENBQUMsQ0FBQyxFQUFFLENBQUM7O0FDdEpMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwi77u/Ly8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgncGlwQnV0dG9ucycsIFtcclxuICAgICAgICAncGlwVG9nZ2xlQnV0dG9ucycsXHJcbiAgICAgICAgJ3BpcFJlZnJlc2hCdXR0b24nLFxyXG4gICAgICAgICdwaXBGYWJUb29sdGlwVmlzaWJpbGl0eSdcclxuICAgIF0pO1xyXG5cclxufSkoKTtcclxuXHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHRoaXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQnV0dG9ucy5UcmFuc2xhdGUnLCBbXSk7XHJcblxyXG4gICAgdGhpc01vZHVsZS5maWx0ZXIoJ3RyYW5zbGF0ZScsIGZ1bmN0aW9uICgkaW5qZWN0b3IpIHtcclxuICAgICAgICB2YXIgcGlwVHJhbnNsYXRlID0gJGluamVjdG9yLmhhcygncGlwVHJhbnNsYXRlJykgXHJcbiAgICAgICAgICAgID8gJGluamVjdG9yLmdldCgncGlwVHJhbnNsYXRlJykgOiBudWxsO1xyXG5cclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcGlwVHJhbnNsYXRlICA/IHBpcFRyYW5zbGF0ZS50cmFuc2xhdGUoa2V5KSB8fCBrZXkgOiBrZXk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG59KSgpO1xyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG5jbGFzcyBGYWJUb29sdGlwVmlzaWJpbGl0eUNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBfZWxlbWVudDtcclxuICAgIHByaXZhdGUgX3Njb3BlOiBhbmd1bGFyLklTY29wZTtcclxuICAgIHByaXZhdGUgX3RpbWVvdXQ6IG5nLklUaW1lb3V0U2VydmljZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAkZWxlbWVudDogYW55LFxyXG4gICAgICAgICRhdHRyczogYW5ndWxhci5JQXR0cmlidXRlcyxcclxuICAgICAgICAkc2NvcGU6IGFuZ3VsYXIuSVNjb3BlLFxyXG4gICAgICAgICR0aW1lb3V0OiBuZy5JVGltZW91dFNlcnZpY2UsXHJcbiAgICAgICAgJHBhcnNlXHJcbiAgICApIHtcclxuICAgICAgICBcIm5nSW5qZWN0XCI7XHJcbiAgICAgICAgbGV0IHRyaWdHZXR0ZXIgPSAkcGFyc2UoJGF0dHJzWydwaXBGYWJUb29sdGlwVmlzaWJpbGl0eSddKSxcclxuICAgICAgICAgICAgc2hvd0dldHRlciA9ICRwYXJzZSgkYXR0cnNbJ3BpcEZhYlNob3dUb29sdGlwJ10pLFxyXG4gICAgICAgICAgICBzaG93U2V0dGVyID0gc2hvd0dldHRlci5hc3NpZ247XHJcblxyXG4gICAgICAgICRzY29wZS4kd2F0Y2godHJpZ0dldHRlciwgKGlzT3BlbikgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIV8uaXNGdW5jdGlvbihzaG93U2V0dGVyKSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgaWYgKGlzT3Blbikge1xyXG4gICAgICAgICAgICAgICAgJHRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNob3dTZXR0ZXIoJHNjb3BlLCBpc09wZW4pO1xyXG4gICAgICAgICAgICAgICAgfSwgNjAwKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNob3dTZXR0ZXIoJHNjb3BlLCBpc09wZW4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbigoKSA9PiB7XHJcbiAgICBmdW5jdGlvbiBwaXBGYWJUb29sdGlwVmlzaWJpbGl0eSgkcGFyc2UsICR0aW1lb3V0KSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcmVzdHJpY3Q6ICdBJyxcclxuICAgICAgICAgICAgc2NvcGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBGYWJUb29sdGlwVmlzaWJpbGl0eUNvbnRyb2xsZXJcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdwaXBGYWJUb29sdGlwVmlzaWJpbGl0eScsIFtdKVxyXG4gICAgICAgIC5kaXJlY3RpdmUoJ3BpcEZhYlRvb2x0aXBWaXNpYmlsaXR5JywgcGlwRmFiVG9vbHRpcFZpc2liaWxpdHkpO1xyXG5cclxufSkoKTsiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vdHlwaW5ncy90c2QuZC50c1wiIC8+XHJcblxyXG5pbnRlcmZhY2UgSVJlZnJlc2hCdXR0b25CaW5kaW5ncyB7XHJcbiAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcblxyXG4gICAgdGV4dDogYW55LFxyXG4gICAgdmlzaWJsZTogYW55LFxyXG4gICAgb25SZWZyZXNoOiBhbnlcclxufVxyXG5cclxuY29uc3QgUmVmcmVzaEJ1dHRvbkJpbmRpbmdzOiBJUmVmcmVzaEJ1dHRvbkJpbmRpbmdzID0ge1xyXG4gICAgdGV4dDogJzxwaXBUZXh0JyxcclxuICAgIHZpc2libGU6ICc8cGlwVmlzaWJsZScsXHJcbiAgICBvblJlZnJlc2g6ICcmP3BpcFJlZnJlc2gnXHJcbn1cclxuXHJcbmNsYXNzIFJlZnJlc2hCdXR0b25DaGFuZ2VzIGltcGxlbWVudHMgbmcuSU9uQ2hhbmdlc09iamVjdCwgSVJlZnJlc2hCdXR0b25CaW5kaW5ncyB7XHJcbiAgICBba2V5OiBzdHJpbmddOiBuZy5JQ2hhbmdlc09iamVjdDxhbnk+O1xyXG4gICAgLy8gTm90IG9uZSB3YXkgYmluZGluZ3NcclxuICAgIG9uUmVmcmVzaDogbmcuSUNoYW5nZXNPYmplY3Q8KHskZXZlbnQ6IGFueX0pID0+IG5nLklQcm9taXNlPGFueT4+O1xyXG4gICAgLy8gT25lIHdheSBiaW5kaW5nc1xyXG4gICAgdGV4dDogbmcuSUNoYW5nZXNPYmplY3Q8c3RyaW5nPjtcclxuICAgIHZpc2libGU6IG5nLklDaGFuZ2VzT2JqZWN0PGJvb2xlYW4+O1xyXG59XHJcblxyXG5jbGFzcyBSZWZyZXNoQnV0dG9uQ29udHJvbGxlciBpbXBsZW1lbnRzIElSZWZyZXNoQnV0dG9uQmluZGluZ3Mge1xyXG5cclxuICAgIHByaXZhdGUgX3RleHRFbGVtZW50OiBhbnk7XHJcbiAgICBwcml2YXRlIF9idXR0b25FbGVtZW50OiBhbnk7XHJcbiAgICBwcml2YXRlIF93aWR0aDogbnVtYmVyO1xyXG5cclxuICAgIHB1YmxpYyB0ZXh0OiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgdmlzaWJsZTogYm9vbGVhbjtcclxuICAgIHB1YmxpYyBvblJlZnJlc2g6IChwYXJhbTogeyRldmVudDogbmcuSUFuZ3VsYXJFdmVudH0pID0+IG5nLklQcm9taXNlPGFueT47XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSAkc2NvcGU6IG5nLklTY29wZSxcclxuICAgICAgICBwcml2YXRlICRlbGVtZW50OiBhbnksXHJcbiAgICAgICAgcHJpdmF0ZSAkYXR0cnM6IG5nLklBdHRyaWJ1dGVzXHJcbiAgICApIHsgfVxyXG5cclxuICAgIHB1YmxpYyAkcG9zdExpbmsoKSB7XHJcbiAgICAgICAgdGhpcy5fYnV0dG9uRWxlbWVudCA9IHRoaXMuJGVsZW1lbnQuY2hpbGRyZW4oJy5tZC1idXR0b24nKTtcclxuICAgICAgICB0aGlzLl90ZXh0RWxlbWVudCA9IHRoaXMuX2J1dHRvbkVsZW1lbnQuY2hpbGRyZW4oJy5waXAtcmVmcmVzaC10ZXh0Jyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5zaG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICRvbkNoYW5nZXMoY2hhbmdlczogUmVmcmVzaEJ1dHRvbkNoYW5nZXMpIHtcclxuICAgICAgICBpZiAoY2hhbmdlcy52aXNpYmxlLmN1cnJlbnRWYWx1ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLnRleHQgPSBjaGFuZ2VzLnRleHQuY3VycmVudFZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnNob3coKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uQ2xpY2soJGV2ZW50KSB7XHJcbiAgICAgICAgaWYgKHRoaXMub25SZWZyZXNoKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25SZWZyZXNoKHskZXZlbnQ6ICRldmVudH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNob3coKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3RleHRFbGVtZW50ID09PSB1bmRlZmluZWQgfHwgdGhpcy5fYnV0dG9uRWxlbWVudCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gU2V0IG5ldyB0ZXh0XHJcbiAgICAgICAgdGhpcy5fdGV4dEVsZW1lbnQudGV4dCh0aGlzLnRleHQpO1xyXG4gICAgICAgIC8vIFNob3cgYnV0dG9uXHJcbiAgICAgICAgdGhpcy5fYnV0dG9uRWxlbWVudC5zaG93KCk7XHJcbiAgICAgICAgLy8gQWRqdXN0IHBvc2l0aW9uXHJcbiAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLl9idXR0b25FbGVtZW50LndpZHRoKCk7XHJcbiAgICAgICAgdGhpcy5fYnV0dG9uRWxlbWVudC5jc3MoJ21hcmdpbi1sZWZ0JywgJy0nICsgd2lkdGggLyAyICsgJ3B4Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBoaWRlKCkge1xyXG4gICAgICAgIHRoaXMuX2J1dHRvbkVsZW1lbnQuaGlkZSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBjb25zdCBSZWZyZXNoQnV0dG9uQ29tcG9uZW50ID0ge1xyXG4gICAgICAgIGJpbmRpbmdzOiBSZWZyZXNoQnV0dG9uQmluZGluZ3MsXHJcbiAgICAgICAgY29udHJvbGxlcjogUmVmcmVzaEJ1dHRvbkNvbnRyb2xsZXIsXHJcbiAgICAgICAgdGVtcGxhdGU6ICc8bWQtYnV0dG9uIGNsYXNzPVwicGlwLXJlZnJlc2gtYnV0dG9uXCIgdGFiaW5kZXg9XCItMVwiIG5nLWNsaWNrPVwiJGN0cmwub25DbGljaygkZXZlbnQpXCIgYXJpYS1sYWJlbD1cIlJFRlJFU0hcIj4nICtcclxuICAgICAgICAgICAgJzxtZC1pY29uIG1kLXN2Zy1pY29uPVwiaWNvbnM6cmVmcmVzaFwiPjwvbWQtaWNvbj4nICtcclxuICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwicGlwLXJlZnJlc2gtdGV4dFwiPjwvc3Bhbj4nICtcclxuICAgICAgICAgICAgJzwvbWQtYnV0dG9uPidcclxuICAgIH07XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ3BpcFJlZnJlc2hCdXR0b24nLCBbJ25nTWF0ZXJpYWwnXSlcclxuICAgICAgICAuY29tcG9uZW50KCdwaXBSZWZyZXNoQnV0dG9uJywgUmVmcmVzaEJ1dHRvbkNvbXBvbmVudCk7XHJcblxyXG59KSgpOyIsIi8vIC8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbmNsYXNzIFRvZ2dsZUJ1dHRvbiB7XHJcbiAgICBpZDogYW55O1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgZGlzYWJsZWQ6IGJvb2xlYW47XHJcbiAgICBsZXZlbDogbnVtYmVyO1xyXG4gICAgZGlzZWxlY3RhYmxlOiBib29sZWFuO1xyXG4gICAgZmlsbGVkOiBib29sZWFuO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSVRvZ2dsZUJ1dHRvbnNCaW5kaW5ncyB7XHJcbiAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcblxyXG4gICAgbmdEaXNhYmxlZDogYW55LFxyXG4gICAgYnV0dG9uczogYW55LFxyXG4gICAgY3VycmVudEJ1dHRvblZhbHVlOiBhbnksXHJcbiAgICBjdXJyZW50QnV0dG9uOiBhbnksXHJcbiAgICBtdWx0aXNlbGVjdDogYW55LFxyXG4gICAgY2hhbmdlOiBhbnksXHJcbiAgICBvbmx5VG9nZ2xlOiBhbnlcclxufVxyXG5cclxuY29uc3QgVG9nZ2xlQnV0dG9uc0JpbmRpbmdzOiBJVG9nZ2xlQnV0dG9uc0JpbmRpbmdzID0ge1xyXG4gICAgbmdEaXNhYmxlZDogJzw/JyxcclxuICAgIGJ1dHRvbnM6ICc8cGlwQnV0dG9ucycsXHJcbiAgICBjdXJyZW50QnV0dG9uVmFsdWU6ICc9bmdNb2RlbCcsXHJcbiAgICBjdXJyZW50QnV0dG9uOiAnPT9waXBCdXR0b25PYmplY3QnLFxyXG4gICAgbXVsdGlzZWxlY3Q6ICc8P3BpcE11bHRpc2VsZWN0JyxcclxuICAgIGNoYW5nZTogJyZuZ0NoYW5nZScsXHJcbiAgICBvbmx5VG9nZ2xlOiAnPD9waXBPbmx5VG9nZ2xlJ1xyXG59XHJcblxyXG5jbGFzcyBUb2dnbGVCdXR0b25zQ2hhbmdlcyBpbXBsZW1lbnRzIG5nLklPbkNoYW5nZXNPYmplY3QsIElUb2dnbGVCdXR0b25zQmluZGluZ3Mge1xyXG4gICAgW2tleTogc3RyaW5nXTogbmcuSUNoYW5nZXNPYmplY3Q8YW55PjtcclxuICAgIFxyXG4gICAgY3VycmVudEJ1dHRvblZhbHVlOiBhbnk7XHJcbiAgICBjdXJyZW50QnV0dG9uOiBhbnk7XHJcbiAgICBjaGFuZ2U6IG5nLklDaGFuZ2VzT2JqZWN0PCgpID0+IG5nLklQcm9taXNlPHZvaWQ+PjtcclxuXHJcbiAgICBuZ0Rpc2FibGVkOiBuZy5JQ2hhbmdlc09iamVjdDxib29sZWFuPjtcclxuICAgIGJ1dHRvbnM6IG5nLklDaGFuZ2VzT2JqZWN0PFRvZ2dsZUJ1dHRvbltdPjtcclxuICAgIG11bHRpc2VsZWN0OiBuZy5JQ2hhbmdlc09iamVjdDxib29sZWFuPjtcclxuICAgIG9ubHlUb2dnbGU6IG5nLklDaGFuZ2VzT2JqZWN0PGJvb2xlYW4+O1xyXG59XHJcblxyXG5jbGFzcyBUb2dnbGVCdXR0b25zQ29udHJvbGxlciBpbXBsZW1lbnRzIElUb2dnbGVCdXR0b25zQmluZGluZ3Mge1xyXG5cclxuICAgIHB1YmxpYyBuZ0Rpc2FibGVkOiBib29sZWFuO1xyXG4gICAgcHVibGljIGNsYXNzOiBzdHJpbmc7XHJcbiAgICBwdWJsaWMgbXVsdGlzZWxlY3Q6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgYnV0dG9uczogVG9nZ2xlQnV0dG9uW107XHJcbiAgICBwdWJsaWMgZGlzYWJsZWQ6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgY3VycmVudEJ1dHRvblZhbHVlOiBhbnk7XHJcbiAgICBwdWJsaWMgY3VycmVudEJ1dHRvbkluZGV4OiBudW1iZXI7XHJcbiAgICBwdWJsaWMgY3VycmVudEJ1dHRvbjogYW55O1xyXG4gICAgcHVibGljIGNoYW5nZTogKCkgPT4gbmcuSVByb21pc2U8YW55PjtcclxuICAgIHB1YmxpYyBvbmx5VG9nZ2xlOiBib29sZWFuO1xyXG4gICAgcHVibGljIHBpcE1lZGlhOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgcHJpdmF0ZSAkZWxlbWVudDogYW55LFxyXG4gICAgICAgIHByaXZhdGUgJGF0dHJzOiBhbmd1bGFyLklBdHRyaWJ1dGVzLFxyXG4gICAgICAgIHByaXZhdGUgJHNjb3BlOiBhbmd1bGFyLklTY29wZSxcclxuICAgICAgICBwcml2YXRlICR0aW1lb3V0OiBuZy5JVGltZW91dFNlcnZpY2UsXHJcbiAgICAgICAgJGluamVjdG9yOiBuZy5hdXRvLklJbmplY3RvclNlcnZpY2VcclxuICAgICkge1xyXG4gICAgICAgIFwibmdJbmplY3RcIjtcclxuXHJcbiAgICAgICAgdGhpcy5waXBNZWRpYSA9ICRpbmplY3Rvci5oYXMoJ3BpcE1lZGlhJykgPyAkaW5qZWN0b3IuZ2V0KCdwaXBNZWRpYScpIDogbnVsbDtcclxuICAgICAgICBjb25zb2xlLmxvZygndGhpcy5waXBNZWRpYScsIHRoaXMucGlwTWVkaWEpO1xyXG4gICAgICAgIHRoaXMuY2xhc3MgPSAkYXR0cnNbJ2NsYXNzJ10gfHwgJyc7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gXy5pbmRleE9mKHRoaXMuYnV0dG9ucywgXy5maW5kKHRoaXMuYnV0dG9ucywge1xyXG4gICAgICAgICAgICBpZDogdGhpcy5jdXJyZW50QnV0dG9uVmFsdWVcclxuICAgICAgICB9KSk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50QnV0dG9uSW5kZXggPSBpbmRleCA8IDAgPyAwIDogaW5kZXg7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50QnV0dG9uID0gdGhpcy5idXR0b25zLmxlbmd0aCA+IDAgPyB0aGlzLmJ1dHRvbnNbdGhpcy5jdXJyZW50QnV0dG9uSW5kZXhdIDogdGhpcy5jdXJyZW50QnV0dG9uO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyAkb25DaGFuZ2VzKGNoYW5nZXM6IFRvZ2dsZUJ1dHRvbnNDaGFuZ2VzKSB7XHJcbiAgICAgICAgdGhpcy5tdWx0aXNlbGVjdCA9IGNoYW5nZXMubXVsdGlzZWxlY3QgPyBjaGFuZ2VzLm11bHRpc2VsZWN0LmN1cnJlbnRWYWx1ZSA6IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSBjaGFuZ2VzLm5nRGlzYWJsZWQgPyBjaGFuZ2VzLm5nRGlzYWJsZWQuY3VycmVudFZhbHVlIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5vbmx5VG9nZ2xlID0gY2hhbmdlcy5vbmx5VG9nZ2xlID8gY2hhbmdlcy5vbmx5VG9nZ2xlLmN1cnJlbnRWYWx1ZSA6IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSAhY2hhbmdlcy5idXR0b25zIHx8IF8uaXNBcnJheShjaGFuZ2VzLmJ1dHRvbnMuY3VycmVudFZhbHVlKSAmJiBjaGFuZ2VzLmJ1dHRvbnMuY3VycmVudFZhbHVlLmxlbmd0aCA9PT0gMCA/IFxyXG4gICAgICAgICAgICBbXSA6IGNoYW5nZXMuYnV0dG9ucy5jdXJyZW50VmFsdWU7XHJcblxyXG4gICAgICAgIGxldCBpbmRleCA9IF8uaW5kZXhPZih0aGlzLmJ1dHRvbnMsIF8uZmluZCh0aGlzLmJ1dHRvbnMsIHtcclxuICAgICAgICAgICAgaWQ6IHRoaXMuY3VycmVudEJ1dHRvblZhbHVlXHJcbiAgICAgICAgfSkpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbkluZGV4ID0gaW5kZXggPCAwID8gMCA6IGluZGV4O1xyXG4gICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbiA9IHRoaXMuYnV0dG9ucy5sZW5ndGggPiAwID8gdGhpcy5idXR0b25zW3RoaXMuY3VycmVudEJ1dHRvbkluZGV4XSA6IHRoaXMuY3VycmVudEJ1dHRvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgJHBvc3RMaW5rKCkge1xyXG4gICAgICAgIHRoaXMuJGVsZW1lbnRcclxuICAgICAgICAgICAgLm9uKCdmb2N1c2luJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZWxlbWVudC5hZGRDbGFzcygnZm9jdXNlZC1jb250YWluZXInKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm9uKCdmb2N1c291dCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQucmVtb3ZlQ2xhc3MoJ2ZvY3VzZWQtY29udGFpbmVyJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBidXR0b25TZWxlY3RlZChpbmRleCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbkluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50QnV0dG9uID0gdGhpcy5idXR0b25zW3RoaXMuY3VycmVudEJ1dHRvbkluZGV4XTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b25WYWx1ZSA9IHRoaXMuY3VycmVudEJ1dHRvbi5pZCB8fCBpbmRleDtcclxuXHJcbiAgICAgICAgdGhpcy4kdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoYW5nZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaGFuZ2UoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlbnRlclNwYWNlUHJlc3MoZXZlbnQpIHtcclxuICAgICAgICB0aGlzLmJ1dHRvblNlbGVjdGVkKGV2ZW50LmluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaGlnaGxpZ2h0QnV0dG9uKGluZGV4KSB7XHJcbiAgICAgICAgaWYgKHRoaXMubXVsdGlzZWxlY3QgJiZcclxuICAgICAgICAgICAgIV8uaXNVbmRlZmluZWQodGhpcy5jdXJyZW50QnV0dG9uLmxldmVsKSAmJlxyXG4gICAgICAgICAgICAhXy5pc1VuZGVmaW5lZCh0aGlzLmJ1dHRvbnNbaW5kZXhdLmxldmVsKSkge1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudEJ1dHRvbi5sZXZlbCA+PSB0aGlzLmJ1dHRvbnNbaW5kZXhdLmxldmVsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudEJ1dHRvbkluZGV4ID09IGluZGV4O1xyXG4gICAgfVxyXG59XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGNvbnN0IFRvZ2dsZUJ1dHRvbnMgPSB7XHJcbiAgICAgICAgYmluZGluZ3M6IFRvZ2dsZUJ1dHRvbnNCaW5kaW5ncyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3RvZ2dsZV9idXR0b25zL3RvZ2dsZV9idXR0b25zLmh0bWwnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFRvZ2dsZUJ1dHRvbnNDb250cm9sbGVyLFxyXG4gICAgICAgIGNvbnRyb2xsZXJBczogJ3RvZ2dsZSdcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncGlwVG9nZ2xlQnV0dG9ucycsIFsncGlwQnV0dG9ucy5UZW1wbGF0ZXMnXSlcclxuICAgICAgICAuY29tcG9uZW50KCdwaXBUb2dnbGVCdXR0b25zJywgVG9nZ2xlQnV0dG9ucyk7XHJcbiAgICBcclxufSkoKTsiLCIoZnVuY3Rpb24obW9kdWxlKSB7XG50cnkge1xuICBtb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgncGlwQnV0dG9ucy5UZW1wbGF0ZXMnKTtcbn0gY2F0Y2ggKGUpIHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcEJ1dHRvbnMuVGVtcGxhdGVzJywgW10pO1xufVxubW9kdWxlLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgJHRlbXBsYXRlQ2FjaGUucHV0KCd0b2dnbGVfYnV0dG9ucy90b2dnbGVfYnV0dG9ucy5odG1sJyxcbiAgICAnPGRpdiBjbGFzcz1cInBpcC10b2dnbGUtYnV0dG9ucyBsYXlvdXQtcm93IHt7dG9nZ2xlLmNsYXNzfX1cIiBwaXAtc2VsZWN0ZWQ9XCJ0b2dnbGUuYnVmQnV0dG9uSW5kZXhcIiBwaXAtZW50ZXItc3BhY2UtcHJlc3M9XCJ0b2dnbGUuZW50ZXJTcGFjZVByZXNzKCRldmVudClcIiBuZy1pZj1cIiF0b2dnbGUucGlwTWVkaWEoXFwneHNcXCcpIHx8IHRvZ2dsZS5vbmx5VG9nZ2xlXCI+PG1kLWJ1dHRvbiB0YWJpbmRleD1cIi0xXCIgbmctcmVwZWF0PVwiYnV0dG9uIGluIHRvZ2dsZS5idXR0b25zXCIgbmctY2xhc3M9XCJ7XFwnbWQtYWNjZW50IG1kLXJhaXNlZCBzZWxlY3RlZCBjb2xvci1hY2NlbnQtYmdcXCcgOiB0b2dnbGUuaGlnaGxpZ2h0QnV0dG9uKCRpbmRleCl9XCIgbmctYXR0ci1zdHlsZT1cInt7IFxcJ2JhY2tncm91bmQtY29sb3I6XFwnICsgKHRvZ2dsZS5oaWdobGlnaHRCdXR0b24oJGluZGV4KSA/IGJ1dHRvbi5iYWNrZ3JvdW5kQ29sb3IgOiBcXCdcXCcpICsgXFwnIWltcG9ydGFudFxcJyB9fVwiIGNsYXNzPVwicGlwLXNlbGVjdGFibGUgcGlwLWNoaXAtYnV0dG9uIGZsZXhcIiBuZy1jbGljaz1cInRvZ2dsZS5idXR0b25TZWxlY3RlZCgkaW5kZXgsICRldmVudClcIiBuZy1kaXNhYmxlZD1cImJ1dHRvbi5kaXNhYmxlZCB8fCB0b2dnbGUubmdEaXNhYmxlZFwiPnt7YnV0dG9uLm5hbWUgfHwgYnV0dG9uLnRpdGxlIHwgdHJhbnNsYXRlfX0gPHNwYW4gbmctaWY9XCJidXR0b24uY2hlY2tlZCB8fCBidXR0b24uY29tcGxldGUgfHwgYnV0dG9uLmZpbGxlZFwiIGNsYXNzPVwicGlwLXRhZ2dlZFwiPio8L3NwYW4+PC9tZC1idXR0b24+PC9kaXY+PG1kLWlucHV0LWNvbnRhaW5lciBjbGFzcz1cIm1kLWJsb2NrXCIgbmctaWY9XCJ0b2dnbGUucGlwTWVkaWEoXFwneHNcXCcpICYmICF0b2dnbGUub25seVRvZ2dsZVwiPjxtZC1zZWxlY3QgbmctbW9kZWw9XCJ0b2dnbGUuY3VycmVudEJ1dHRvbkluZGV4XCIgbmctZGlzYWJsZWQ9XCJ0b2dnbGUubmdEaXNhYmxlZFwiIGFyaWEtbGFiZWw9XCJEUk9QRE9XTlwiIG1kLW9uLWNsb3NlPVwidG9nZ2xlLmJ1dHRvblNlbGVjdGVkKHRvZ2dsZS5jdXJyZW50QnV0dG9uSW5kZXgpXCI+PG1kLW9wdGlvbiBuZy1yZXBlYXQ9XCJhY3Rpb24gaW4gdG9nZ2xlLmJ1dHRvbnNcIiB2YWx1ZT1cInt7IDo6JGluZGV4IH19XCI+e3sgKGFjdGlvbi50aXRsZSB8fCBhY3Rpb24ubmFtZSkgfCB0cmFuc2xhdGUgfX0gPHNwYW4gbmctaWY9XCJhY3Rpb24uY2hlY2tlZCB8fCBhY3Rpb24uY29tcGxldGUgfHwgYWN0aW9uLmZpbGxlZFwiIGNsYXNzPVwicGlwLXRhZ2dlZFwiPio8L3NwYW4+PC9tZC1vcHRpb24+PC9tZC1zZWxlY3Q+PC9tZC1pbnB1dC1jb250YWluZXI+Jyk7XG59XSk7XG59KSgpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1waXAtd2VidWktYnV0dG9ucy1odG1sLm1pbi5qcy5tYXBcbiJdfQ==
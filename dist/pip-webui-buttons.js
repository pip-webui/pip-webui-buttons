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
    '<div class="pip-toggle-buttons layout-row {{$ctrl.class}}" pip-selected="$ctrl.bufButtonIndex" pip-enter-space-press="$ctrl.enterSpacePress($event)" ng-if="!$ctrl.pipMedia(\'xs\') || $ctrl.onlyToggle"><md-button tabindex="-1" ng-repeat="button in $ctrl.buttons" ng-class="{\'md-accent md-raised selected color-accent-bg\' : $ctrl.highlightButton($index)}" ng-attr-style="{{ \'background-color:\' + ($ctrl.highlightButton($index) ? button.backgroundColor : \'\') + \'!important\' }}" class="pip-selectable pip-chip-button flex" ng-click="$ctrl.buttonSelected($index, $event)" ng-disabled="button.disabled || $ctrl.disabled">{{button.name || button.title | translate}} <span ng-if="button.checked || button.complete || button.filled" class="pip-tagged">*</span></md-button></div><md-input-container class="md-block" ng-if="$ctrl.pipMedia(\'xs\') && !$ctrl.onlyToggle"><md-select ng-model="$ctrl.currentButtonIndex" ng-disabled="$ctrl.disabled" aria-label="DROPDOWN" md-on-close="$ctrl.buttonSelected($ctrl.currentButtonIndex)"><md-option ng-repeat="action in $ctrl.buttons" value="{{ ::$index }}">{{ (action.title || action.name) | translate }} <span ng-if="action.checked || action.complete || action.filled" class="pip-tagged">*</span></md-option></md-select></md-input-container>');
}]);
})();



},{}]},{},[6,1,2,3,4,5])(6)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYnV0dG9ucy50cyIsInNyYy9kZXBlbmRlbmNpZXMvdHJhbnNsYXRlLnRzIiwic3JjL2ZhYnMvZmFiX3Rvb2x0aXBfdmlzaWJpbGl0eS50cyIsInNyYy9yZWZyZXNoX2J1dHRvbi9yZWZyZXNoX2J1dHRvbi50cyIsInNyYy90b2dnbGVfYnV0dG9ucy90b2dnbGVfYnV0dG9ucy50cyIsInRlbXAvcGlwLXdlYnVpLWJ1dHRvbnMtaHRtbC5taW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNFQSxDQUFDO0lBQ0csWUFBWSxDQUFDO0lBRWIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLEVBQUU7UUFDekIsa0JBQWtCO1FBQ2xCLGtCQUFrQjtRQUNsQix5QkFBeUI7S0FDNUIsQ0FBQyxDQUFDO0FBRVAsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7QUNUTCxDQUFDO0lBQ0csWUFBWSxDQUFDO0lBRWIsNkJBQTZCLFNBQW1DO1FBQzVELElBQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUM7UUFFMUYsTUFBTSxDQUFDLFVBQVMsR0FBVztZQUN2QixNQUFNLENBQUMsWUFBWSxHQUFJLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ3ZFLENBQUMsQ0FBQTtJQUNMLENBQUM7SUFFRCxPQUFPLENBQUMsTUFBTSxDQUFDLHNCQUFzQixFQUFFLEVBQUUsQ0FBQztTQUNyQyxNQUFNLENBQUMsV0FBVyxFQUFFLG1CQUFtQixDQUFDLENBQUM7QUFFbEQsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7QUNkTDtJQUtJLHdDQUNJLFFBQWEsRUFDYixNQUEyQixFQUMzQixNQUFzQixFQUN0QixRQUE0QixFQUM1QixNQUFNO1FBRU4sVUFBVSxDQUFDO1FBQ1gsSUFBSSxVQUFVLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLEVBQ3RELFVBQVUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUMsRUFDaEQsVUFBVSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7UUFFbkMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsVUFBQyxNQUFNO1lBQzdCLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFBQyxNQUFNLENBQUM7WUFFdEMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDVCxRQUFRLENBQUM7b0JBQ0wsVUFBVSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDL0IsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ1osQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLFVBQVUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDL0IsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNMLHFDQUFDO0FBQUQsQ0E3QkEsQUE2QkMsSUFBQTtBQUVELENBQUM7SUFDRyxpQ0FBaUMsTUFBTSxFQUFFLFFBQVE7UUFDN0MsTUFBTSxDQUFDO1lBQ0gsUUFBUSxFQUFFLEdBQUc7WUFDYixLQUFLLEVBQUUsS0FBSztZQUNaLFVBQVUsRUFBRSw4QkFBOEI7U0FDN0MsQ0FBQztJQUNOLENBQUM7SUFFRCxPQUFPO1NBQ0YsTUFBTSxDQUFDLHlCQUF5QixFQUFFLEVBQUUsQ0FBQztTQUNyQyxTQUFTLENBQUMseUJBQXlCLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztBQUV2RSxDQUFDLENBQUMsRUFBRSxDQUFDOztBQ3BDTCxJQUFNLHFCQUFxQixHQUEyQjtJQUNsRCxJQUFJLEVBQUUsVUFBVTtJQUNoQixPQUFPLEVBQUUsYUFBYTtJQUN0QixTQUFTLEVBQUUsY0FBYztDQUM1QixDQUFBO0FBRUQ7SUFBQTtJQU9BLENBQUM7SUFBRCwyQkFBQztBQUFELENBUEEsQUFPQyxJQUFBO0FBRUQ7SUFVSSxpQ0FDWSxNQUFpQixFQUNqQixRQUFhLEVBQ2IsTUFBc0I7UUFGdEIsV0FBTSxHQUFOLE1BQU0sQ0FBVztRQUNqQixhQUFRLEdBQVIsUUFBUSxDQUFLO1FBQ2IsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7SUFDOUIsQ0FBQztJQUVFLDJDQUFTLEdBQWhCO1FBQ0ksSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFFdEUsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFTSw0Q0FBVSxHQUFqQixVQUFrQixPQUE2QjtRQUMzQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFlBQVksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7WUFDdEMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ2hCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNoQixDQUFDO0lBQ0wsQ0FBQztJQUVNLHlDQUFPLEdBQWQsVUFBZSxNQUFNO1FBQ2pCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztRQUNyQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLHNDQUFJLEdBQVo7UUFDSSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsY0FBYyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDdkUsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUVELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVsQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRTNCLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDMUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLEdBQUcsR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFTyxzQ0FBSSxHQUFaO1FBQ0ksSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBQ0wsOEJBQUM7QUFBRCxDQXREQSxBQXNEQyxJQUFBO0FBR0QsQ0FBQztJQUNHLFlBQVksQ0FBQztJQUViLElBQU0sc0JBQXNCLEdBQUc7UUFDM0IsUUFBUSxFQUFFLHFCQUFxQjtRQUMvQixVQUFVLEVBQUUsdUJBQXVCO1FBQ25DLFFBQVEsRUFBRSw0R0FBNEc7WUFDbEgsaURBQWlEO1lBQ2pELHdDQUF3QztZQUN4QyxjQUFjO0tBQ3JCLENBQUM7SUFFRixPQUFPLENBQUMsTUFBTSxDQUFDLGtCQUFrQixFQUFFLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDN0MsU0FBUyxDQUFDLGtCQUFrQixFQUFFLHNCQUFzQixDQUFDLENBQUM7QUFFL0QsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7QUMvRkw7SUFBQTtJQU9BLENBQUM7SUFBRCxtQkFBQztBQUFELENBUEEsQUFPQyxJQUFBO0FBY0QsSUFBTSxxQkFBcUIsR0FBMkI7SUFDbEQsVUFBVSxFQUFFLElBQUk7SUFDaEIsT0FBTyxFQUFFLGFBQWE7SUFDdEIsa0JBQWtCLEVBQUUsVUFBVTtJQUM5QixhQUFhLEVBQUUsbUJBQW1CO0lBQ2xDLFdBQVcsRUFBRSxrQkFBa0I7SUFDL0IsTUFBTSxFQUFFLFdBQVc7SUFDbkIsVUFBVSxFQUFFLGlCQUFpQjtDQUNoQyxDQUFBO0FBRUQ7SUFBQTtJQVdBLENBQUM7SUFBRCwyQkFBQztBQUFELENBWEEsQUFXQyxJQUFBO0FBRUQ7SUFlSSxpQ0FDWSxRQUFhLEVBQ2IsTUFBMkIsRUFDM0IsTUFBc0IsRUFDdEIsUUFBNEIsRUFDcEMsU0FBbUM7UUFFbkMsVUFBVSxDQUFDO1FBTkgsYUFBUSxHQUFSLFFBQVEsQ0FBSztRQUNiLFdBQU0sR0FBTixNQUFNLENBQXFCO1FBQzNCLFdBQU0sR0FBTixNQUFNLENBQWdCO1FBQ3RCLGFBQVEsR0FBUixRQUFRLENBQW9CO1FBS3BDLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUM3RSxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDbkMsSUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUN2RCxFQUFFLEVBQUUsSUFBSSxDQUFDLGtCQUFrQjtTQUM5QixDQUFDLENBQUMsQ0FBQztRQUNKLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDaEQsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO0lBQzlHLENBQUM7SUFFTSw0Q0FBVSxHQUFqQixVQUFrQixPQUE2QjtRQUMzQyxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1FBQ2xGLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7UUFDN0UsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUUvRSxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsTUFBTSxLQUFLLENBQUM7WUFDbkgsRUFBRSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDO1FBRXRDLElBQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDdkQsRUFBRSxFQUFFLElBQUksQ0FBQyxrQkFBa0I7U0FDOUIsQ0FBQyxDQUFDLENBQUM7UUFDSixJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ2hELElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQztJQUM5RyxDQUFDO0lBRU0sMkNBQVMsR0FBaEI7UUFBQSxpQkFRQztRQVBHLElBQUksQ0FBQyxRQUFRO2FBQ1IsRUFBRSxDQUFDLFNBQVMsRUFBRTtZQUNYLEtBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDaEQsQ0FBQyxDQUFDO2FBQ0QsRUFBRSxDQUFDLFVBQVUsRUFBRTtZQUNaLEtBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDbkQsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRU0sZ0RBQWMsR0FBckIsVUFBc0IsS0FBSztRQUEzQixpQkFjQztRQWJHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFFRCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO1FBQ2hDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFLElBQUksS0FBSyxDQUFDO1FBRXpELElBQUksQ0FBQyxRQUFRLENBQUM7WUFDVixFQUFFLENBQUMsQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDZCxLQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDbEIsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLGlEQUFlLEdBQXRCLFVBQXVCLEtBQUs7UUFDeEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVNLGlEQUFlLEdBQXRCLFVBQXVCLEtBQUs7UUFDeEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVc7WUFDaEIsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO1lBQ3hDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUU1QyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDakUsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLElBQUksS0FBSyxDQUFDO0lBQzVDLENBQUM7SUFDTCw4QkFBQztBQUFELENBeEZBLEFBd0ZDLElBQUE7QUFFRCxDQUFDO0lBQ0csWUFBWSxDQUFDO0lBd0JiLElBQU0sYUFBYSxHQUF5QjtRQUN4QyxRQUFRLEVBQUUscUJBQXFCO1FBQy9CLFdBQVcsRUFBRSxvQ0FBb0M7UUFDakQsVUFBVSxFQUFFLHVCQUF1QjtLQUN0QyxDQUFBO0lBRUQsT0FBTztTQUNGLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLHNCQUFzQixDQUFDLENBQUM7U0FDcEQsU0FBUyxDQUFDLGtCQUFrQixFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBRXRELENBQUMsQ0FBQyxFQUFFLENBQUM7O0FDM0tMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwi77u/Ly8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgncGlwQnV0dG9ucycsIFtcclxuICAgICAgICAncGlwVG9nZ2xlQnV0dG9ucycsXHJcbiAgICAgICAgJ3BpcFJlZnJlc2hCdXR0b24nLFxyXG4gICAgICAgICdwaXBGYWJUb29sdGlwVmlzaWJpbGl0eSdcclxuICAgIF0pO1xyXG5cclxufSkoKTtcclxuXHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgZnVuY3Rpb24gVG9nZ2xlQnV0dG9uc0ZpbHRlcigkaW5qZWN0b3I6IG5nLmF1dG8uSUluamVjdG9yU2VydmljZSkge1xyXG4gICAgICAgIGNvbnN0IHBpcFRyYW5zbGF0ZSA9ICRpbmplY3Rvci5oYXMoJ3BpcFRyYW5zbGF0ZScpID8gJGluamVjdG9yLmdldCgncGlwVHJhbnNsYXRlJykgOiBudWxsO1xyXG5cclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oa2V5OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBpcFRyYW5zbGF0ZSAgPyBwaXBUcmFuc2xhdGVbJ3RyYW5zbGF0ZSddKGtleSkgfHwga2V5IDoga2V5O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgncGlwQnV0dG9ucy5UcmFuc2xhdGUnLCBbXSlcclxuICAgICAgICAuZmlsdGVyKCd0cmFuc2xhdGUnLCBUb2dnbGVCdXR0b25zRmlsdGVyKTtcclxuXHJcbn0pKCk7XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbmNsYXNzIEZhYlRvb2x0aXBWaXNpYmlsaXR5Q29udHJvbGxlciB7XHJcbiAgICBwcml2YXRlIF9lbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBfc2NvcGU6IGFuZ3VsYXIuSVNjb3BlO1xyXG4gICAgcHJpdmF0ZSBfdGltZW91dDogbmcuSVRpbWVvdXRTZXJ2aWNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICRlbGVtZW50OiBhbnksXHJcbiAgICAgICAgJGF0dHJzOiBhbmd1bGFyLklBdHRyaWJ1dGVzLFxyXG4gICAgICAgICRzY29wZTogYW5ndWxhci5JU2NvcGUsXHJcbiAgICAgICAgJHRpbWVvdXQ6IG5nLklUaW1lb3V0U2VydmljZSxcclxuICAgICAgICAkcGFyc2VcclxuICAgICkge1xyXG4gICAgICAgIFwibmdJbmplY3RcIjtcclxuICAgICAgICBsZXQgdHJpZ0dldHRlciA9ICRwYXJzZSgkYXR0cnNbJ3BpcEZhYlRvb2x0aXBWaXNpYmlsaXR5J10pLFxyXG4gICAgICAgICAgICBzaG93R2V0dGVyID0gJHBhcnNlKCRhdHRyc1sncGlwRmFiU2hvd1Rvb2x0aXAnXSksXHJcbiAgICAgICAgICAgIHNob3dTZXR0ZXIgPSBzaG93R2V0dGVyLmFzc2lnbjtcclxuXHJcbiAgICAgICAgJHNjb3BlLiR3YXRjaCh0cmlnR2V0dGVyLCAoaXNPcGVuKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghXy5pc0Z1bmN0aW9uKHNob3dTZXR0ZXIpKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBpZiAoaXNPcGVuKSB7XHJcbiAgICAgICAgICAgICAgICAkdGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd1NldHRlcigkc2NvcGUsIGlzT3Blbik7XHJcbiAgICAgICAgICAgICAgICB9LCA2MDApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2hvd1NldHRlcigkc2NvcGUsIGlzT3Blbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuKCgpID0+IHtcclxuICAgIGZ1bmN0aW9uIHBpcEZhYlRvb2x0aXBWaXNpYmlsaXR5KCRwYXJzZSwgJHRpbWVvdXQpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgICAgICAgICBzY29wZTogZmFsc2UsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IEZhYlRvb2x0aXBWaXNpYmlsaXR5Q29udHJvbGxlclxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcEZhYlRvb2x0aXBWaXNpYmlsaXR5JywgW10pXHJcbiAgICAgICAgLmRpcmVjdGl2ZSgncGlwRmFiVG9vbHRpcFZpc2liaWxpdHknLCBwaXBGYWJUb29sdGlwVmlzaWJpbGl0eSk7XHJcblxyXG59KSgpOyIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi8uLi90eXBpbmdzL3RzZC5kLnRzXCIgLz5cclxuXHJcbmludGVyZmFjZSBJUmVmcmVzaEJ1dHRvbkJpbmRpbmdzIHtcclxuICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxuXHJcbiAgICB0ZXh0OiBhbnksXHJcbiAgICB2aXNpYmxlOiBhbnksXHJcbiAgICBvblJlZnJlc2g6IGFueVxyXG59XHJcblxyXG5jb25zdCBSZWZyZXNoQnV0dG9uQmluZGluZ3M6IElSZWZyZXNoQnV0dG9uQmluZGluZ3MgPSB7XHJcbiAgICB0ZXh0OiAnPHBpcFRleHQnLFxyXG4gICAgdmlzaWJsZTogJzxwaXBWaXNpYmxlJyxcclxuICAgIG9uUmVmcmVzaDogJyY/cGlwUmVmcmVzaCdcclxufVxyXG5cclxuY2xhc3MgUmVmcmVzaEJ1dHRvbkNoYW5nZXMgaW1wbGVtZW50cyBuZy5JT25DaGFuZ2VzT2JqZWN0LCBJUmVmcmVzaEJ1dHRvbkJpbmRpbmdzIHtcclxuICAgIFtrZXk6IHN0cmluZ106IG5nLklDaGFuZ2VzT2JqZWN0PGFueT47XHJcbiAgICAvLyBOb3Qgb25lIHdheSBiaW5kaW5nc1xyXG4gICAgb25SZWZyZXNoOiBuZy5JQ2hhbmdlc09iamVjdDwoeyRldmVudDogYW55fSkgPT4gbmcuSVByb21pc2U8YW55Pj47XHJcbiAgICAvLyBPbmUgd2F5IGJpbmRpbmdzXHJcbiAgICB0ZXh0OiBuZy5JQ2hhbmdlc09iamVjdDxzdHJpbmc+O1xyXG4gICAgdmlzaWJsZTogbmcuSUNoYW5nZXNPYmplY3Q8Ym9vbGVhbj47XHJcbn1cclxuXHJcbmNsYXNzIFJlZnJlc2hCdXR0b25Db250cm9sbGVyIGltcGxlbWVudHMgSVJlZnJlc2hCdXR0b25CaW5kaW5ncyB7XHJcblxyXG4gICAgcHJpdmF0ZSBfdGV4dEVsZW1lbnQ6IGFueTtcclxuICAgIHByaXZhdGUgX2J1dHRvbkVsZW1lbnQ6IGFueTtcclxuICAgIHByaXZhdGUgX3dpZHRoOiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIHRleHQ6IHN0cmluZztcclxuICAgIHB1YmxpYyB2aXNpYmxlOiBib29sZWFuO1xyXG4gICAgcHVibGljIG9uUmVmcmVzaDogKHBhcmFtOiB7JGV2ZW50OiBuZy5JQW5ndWxhckV2ZW50fSkgPT4gbmcuSVByb21pc2U8YW55PjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlICRzY29wZTogbmcuSVNjb3BlLFxyXG4gICAgICAgIHByaXZhdGUgJGVsZW1lbnQ6IGFueSxcclxuICAgICAgICBwcml2YXRlICRhdHRyczogbmcuSUF0dHJpYnV0ZXNcclxuICAgICkgeyB9XHJcblxyXG4gICAgcHVibGljICRwb3N0TGluaygpIHtcclxuICAgICAgICB0aGlzLl9idXR0b25FbGVtZW50ID0gdGhpcy4kZWxlbWVudC5jaGlsZHJlbignLm1kLWJ1dHRvbicpO1xyXG4gICAgICAgIHRoaXMuX3RleHRFbGVtZW50ID0gdGhpcy5fYnV0dG9uRWxlbWVudC5jaGlsZHJlbignLnBpcC1yZWZyZXNoLXRleHQnKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnNob3coKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgJG9uQ2hhbmdlcyhjaGFuZ2VzOiBSZWZyZXNoQnV0dG9uQ2hhbmdlcykge1xyXG4gICAgICAgIGlmIChjaGFuZ2VzLnZpc2libGUuY3VycmVudFZhbHVlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dCA9IGNoYW5nZXMudGV4dC5jdXJyZW50VmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvdygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25DbGljaygkZXZlbnQpIHtcclxuICAgICAgICBpZiAodGhpcy5vblJlZnJlc2gpIHtcclxuICAgICAgICAgICAgdGhpcy5vblJlZnJlc2goeyRldmVudDogJGV2ZW50fSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2hvdygpIHtcclxuICAgICAgICBpZiAodGhpcy5fdGV4dEVsZW1lbnQgPT09IHVuZGVmaW5lZCB8fCB0aGlzLl9idXR0b25FbGVtZW50ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBTZXQgbmV3IHRleHRcclxuICAgICAgICB0aGlzLl90ZXh0RWxlbWVudC50ZXh0KHRoaXMudGV4dCk7XHJcbiAgICAgICAgLy8gU2hvdyBidXR0b25cclxuICAgICAgICB0aGlzLl9idXR0b25FbGVtZW50LnNob3coKTtcclxuICAgICAgICAvLyBBZGp1c3QgcG9zaXRpb25cclxuICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuX2J1dHRvbkVsZW1lbnQud2lkdGgoKTtcclxuICAgICAgICB0aGlzLl9idXR0b25FbGVtZW50LmNzcygnbWFyZ2luLWxlZnQnLCAnLScgKyB3aWR0aCAvIDIgKyAncHgnKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhpZGUoKSB7XHJcbiAgICAgICAgdGhpcy5fYnV0dG9uRWxlbWVudC5oaWRlKCk7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGNvbnN0IFJlZnJlc2hCdXR0b25Db21wb25lbnQgPSB7XHJcbiAgICAgICAgYmluZGluZ3M6IFJlZnJlc2hCdXR0b25CaW5kaW5ncyxcclxuICAgICAgICBjb250cm9sbGVyOiBSZWZyZXNoQnV0dG9uQ29udHJvbGxlcixcclxuICAgICAgICB0ZW1wbGF0ZTogJzxtZC1idXR0b24gY2xhc3M9XCJwaXAtcmVmcmVzaC1idXR0b25cIiB0YWJpbmRleD1cIi0xXCIgbmctY2xpY2s9XCIkY3RybC5vbkNsaWNrKCRldmVudClcIiBhcmlhLWxhYmVsPVwiUkVGUkVTSFwiPicgK1xyXG4gICAgICAgICAgICAnPG1kLWljb24gbWQtc3ZnLWljb249XCJpY29uczpyZWZyZXNoXCI+PC9tZC1pY29uPicgK1xyXG4gICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJwaXAtcmVmcmVzaC10ZXh0XCI+PC9zcGFuPicgK1xyXG4gICAgICAgICAgICAnPC9tZC1idXR0b24+J1xyXG4gICAgfTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgncGlwUmVmcmVzaEJ1dHRvbicsIFsnbmdNYXRlcmlhbCddKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ3BpcFJlZnJlc2hCdXR0b24nLCBSZWZyZXNoQnV0dG9uQ29tcG9uZW50KTtcclxuXHJcbn0pKCk7IiwiLy8gLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL3R5cGluZ3MvdHNkLmQudHNcIiAvPlxyXG5cclxuY2xhc3MgVG9nZ2xlQnV0dG9uIHtcclxuICAgIGlkOiBhbnk7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBkaXNhYmxlZDogYm9vbGVhbjtcclxuICAgIGxldmVsOiBudW1iZXI7XHJcbiAgICBkaXNlbGVjdGFibGU6IGJvb2xlYW47XHJcbiAgICBmaWxsZWQ6IGJvb2xlYW47XHJcbn1cclxuXHJcbmludGVyZmFjZSBJVG9nZ2xlQnV0dG9uc0JpbmRpbmdzIHtcclxuICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxuXHJcbiAgICBuZ0Rpc2FibGVkOiBhbnksXHJcbiAgICBidXR0b25zOiBhbnksXHJcbiAgICBjdXJyZW50QnV0dG9uVmFsdWU6IGFueSxcclxuICAgIGN1cnJlbnRCdXR0b246IGFueSxcclxuICAgIG11bHRpc2VsZWN0OiBhbnksXHJcbiAgICBjaGFuZ2U6IGFueSxcclxuICAgIG9ubHlUb2dnbGU6IGFueVxyXG59XHJcblxyXG5jb25zdCBUb2dnbGVCdXR0b25zQmluZGluZ3M6IElUb2dnbGVCdXR0b25zQmluZGluZ3MgPSB7XHJcbiAgICBuZ0Rpc2FibGVkOiAnPD8nLFxyXG4gICAgYnV0dG9uczogJzxwaXBCdXR0b25zJyxcclxuICAgIGN1cnJlbnRCdXR0b25WYWx1ZTogJz1uZ01vZGVsJyxcclxuICAgIGN1cnJlbnRCdXR0b246ICc9P3BpcEJ1dHRvbk9iamVjdCcsXHJcbiAgICBtdWx0aXNlbGVjdDogJzw/cGlwTXVsdGlzZWxlY3QnLFxyXG4gICAgY2hhbmdlOiAnJm5nQ2hhbmdlJyxcclxuICAgIG9ubHlUb2dnbGU6ICc8P3BpcE9ubHlUb2dnbGUnXHJcbn1cclxuXHJcbmNsYXNzIFRvZ2dsZUJ1dHRvbnNDaGFuZ2VzIGltcGxlbWVudHMgbmcuSU9uQ2hhbmdlc09iamVjdCwgSVRvZ2dsZUJ1dHRvbnNCaW5kaW5ncyB7XHJcbiAgICBba2V5OiBzdHJpbmddOiBuZy5JQ2hhbmdlc09iamVjdDxhbnk+O1xyXG4gICAgLy8gTm90IG9uZSB3YXkgYmluZGluZ3NcclxuICAgIGN1cnJlbnRCdXR0b25WYWx1ZTogYW55O1xyXG4gICAgY3VycmVudEJ1dHRvbjogYW55O1xyXG4gICAgY2hhbmdlOiBuZy5JQ2hhbmdlc09iamVjdDwoKSA9PiBuZy5JUHJvbWlzZTx2b2lkPj47XHJcbiAgICAvLyBPbmUgd2F5IGJpbmRpbmdzXHJcbiAgICBuZ0Rpc2FibGVkOiBuZy5JQ2hhbmdlc09iamVjdDxib29sZWFuPjtcclxuICAgIGJ1dHRvbnM6IG5nLklDaGFuZ2VzT2JqZWN0PFRvZ2dsZUJ1dHRvbltdPjtcclxuICAgIG11bHRpc2VsZWN0OiBuZy5JQ2hhbmdlc09iamVjdDxib29sZWFuPjtcclxuICAgIG9ubHlUb2dnbGU6IG5nLklDaGFuZ2VzT2JqZWN0PGJvb2xlYW4+O1xyXG59XHJcblxyXG5jbGFzcyBUb2dnbGVCdXR0b25zQ29udHJvbGxlciBpbXBsZW1lbnRzIElUb2dnbGVCdXR0b25zQmluZGluZ3Mge1xyXG4gICAgbGVuZ2h0OiBudW1iZXI7XHJcblxyXG4gICAgcHVibGljIG5nRGlzYWJsZWQ6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgY2xhc3M6IHN0cmluZztcclxuICAgIHB1YmxpYyBtdWx0aXNlbGVjdDogYm9vbGVhbjtcclxuICAgIHB1YmxpYyBidXR0b25zOiBUb2dnbGVCdXR0b25bXTtcclxuICAgIHB1YmxpYyBkaXNhYmxlZDogYm9vbGVhbjtcclxuICAgIHB1YmxpYyBjdXJyZW50QnV0dG9uVmFsdWU6IGFueTtcclxuICAgIHB1YmxpYyBjdXJyZW50QnV0dG9uSW5kZXg6IG51bWJlcjtcclxuICAgIHB1YmxpYyBjdXJyZW50QnV0dG9uOiBhbnk7XHJcbiAgICBwdWJsaWMgY2hhbmdlOiAoKSA9PiBuZy5JUHJvbWlzZTxhbnk+O1xyXG4gICAgcHVibGljIG9ubHlUb2dnbGU6IGJvb2xlYW47XHJcbiAgICBwdWJsaWMgcGlwTWVkaWE6IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBwcml2YXRlICRlbGVtZW50OiBhbnksXHJcbiAgICAgICAgcHJpdmF0ZSAkYXR0cnM6IGFuZ3VsYXIuSUF0dHJpYnV0ZXMsXHJcbiAgICAgICAgcHJpdmF0ZSAkc2NvcGU6IGFuZ3VsYXIuSVNjb3BlLFxyXG4gICAgICAgIHByaXZhdGUgJHRpbWVvdXQ6IG5nLklUaW1lb3V0U2VydmljZSxcclxuICAgICAgICAkaW5qZWN0b3I6IG5nLmF1dG8uSUluamVjdG9yU2VydmljZVxyXG4gICAgKSB7XHJcbiAgICAgICAgXCJuZ0luamVjdFwiO1xyXG5cclxuICAgICAgICB0aGlzLnBpcE1lZGlhID0gJGluamVjdG9yLmhhcygncGlwTWVkaWEnKSA/ICRpbmplY3Rvci5nZXQoJ3BpcE1lZGlhJykgOiBudWxsO1xyXG4gICAgICAgIHRoaXMuY2xhc3MgPSAkYXR0cnNbJ2NsYXNzJ10gfHwgJyc7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSBfLmluZGV4T2YodGhpcy5idXR0b25zLCBfLmZpbmQodGhpcy5idXR0b25zLCB7XHJcbiAgICAgICAgICAgIGlkOiB0aGlzLmN1cnJlbnRCdXR0b25WYWx1ZVxyXG4gICAgICAgIH0pKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b25JbmRleCA9IGluZGV4IDwgMCA/IDAgOiBpbmRleDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b24gPSB0aGlzLmJ1dHRvbnMubGVuZ3RoID4gMCA/IHRoaXMuYnV0dG9uc1t0aGlzLmN1cnJlbnRCdXR0b25JbmRleF0gOiB0aGlzLmN1cnJlbnRCdXR0b247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICRvbkNoYW5nZXMoY2hhbmdlczogVG9nZ2xlQnV0dG9uc0NoYW5nZXMpIHtcclxuICAgICAgICB0aGlzLm11bHRpc2VsZWN0ID0gY2hhbmdlcy5tdWx0aXNlbGVjdCA/IGNoYW5nZXMubXVsdGlzZWxlY3QuY3VycmVudFZhbHVlIDogZmFsc2U7XHJcbiAgICAgICAgdGhpcy5kaXNhYmxlZCA9IGNoYW5nZXMubmdEaXNhYmxlZCA/IGNoYW5nZXMubmdEaXNhYmxlZC5jdXJyZW50VmFsdWUgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLm9ubHlUb2dnbGUgPSBjaGFuZ2VzLm9ubHlUb2dnbGUgPyBjaGFuZ2VzLm9ubHlUb2dnbGUuY3VycmVudFZhbHVlIDogZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuYnV0dG9ucyA9ICFjaGFuZ2VzLmJ1dHRvbnMgfHwgXy5pc0FycmF5KGNoYW5nZXMuYnV0dG9ucy5jdXJyZW50VmFsdWUpICYmIGNoYW5nZXMuYnV0dG9ucy5jdXJyZW50VmFsdWUubGVuZ3RoID09PSAwID8gXHJcbiAgICAgICAgICAgIFtdIDogY2hhbmdlcy5idXR0b25zLmN1cnJlbnRWYWx1ZTtcclxuXHJcbiAgICAgICAgY29uc3QgaW5kZXggPSBfLmluZGV4T2YodGhpcy5idXR0b25zLCBfLmZpbmQodGhpcy5idXR0b25zLCB7XHJcbiAgICAgICAgICAgIGlkOiB0aGlzLmN1cnJlbnRCdXR0b25WYWx1ZVxyXG4gICAgICAgIH0pKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b25JbmRleCA9IGluZGV4IDwgMCA/IDAgOiBpbmRleDtcclxuICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b24gPSB0aGlzLmJ1dHRvbnMubGVuZ3RoID4gMCA/IHRoaXMuYnV0dG9uc1t0aGlzLmN1cnJlbnRCdXR0b25JbmRleF0gOiB0aGlzLmN1cnJlbnRCdXR0b247XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljICRwb3N0TGluaygpIHtcclxuICAgICAgICB0aGlzLiRlbGVtZW50XHJcbiAgICAgICAgICAgIC5vbignZm9jdXNpbicsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGVsZW1lbnQuYWRkQ2xhc3MoJ2ZvY3VzZWQtY29udGFpbmVyJyk7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vbignZm9jdXNvdXQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRlbGVtZW50LnJlbW92ZUNsYXNzKCdmb2N1c2VkLWNvbnRhaW5lcicpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYnV0dG9uU2VsZWN0ZWQoaW5kZXgpIHtcclxuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmN1cnJlbnRCdXR0b25JbmRleCA9IGluZGV4O1xyXG4gICAgICAgIHRoaXMuY3VycmVudEJ1dHRvbiA9IHRoaXMuYnV0dG9uc1t0aGlzLmN1cnJlbnRCdXR0b25JbmRleF07XHJcbiAgICAgICAgdGhpcy5jdXJyZW50QnV0dG9uVmFsdWUgPSB0aGlzLmN1cnJlbnRCdXR0b24uaWQgfHwgaW5kZXg7XHJcblxyXG4gICAgICAgIHRoaXMuJHRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jaGFuZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW50ZXJTcGFjZVByZXNzKGV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5idXR0b25TZWxlY3RlZChldmVudC5pbmRleCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGhpZ2hsaWdodEJ1dHRvbihpbmRleCkge1xyXG4gICAgICAgIGlmICh0aGlzLm11bHRpc2VsZWN0ICYmXHJcbiAgICAgICAgICAgICFfLmlzVW5kZWZpbmVkKHRoaXMuY3VycmVudEJ1dHRvbi5sZXZlbCkgJiZcclxuICAgICAgICAgICAgIV8uaXNVbmRlZmluZWQodGhpcy5idXR0b25zW2luZGV4XS5sZXZlbCkpIHtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRCdXR0b24ubGV2ZWwgPj0gdGhpcy5idXR0b25zW2luZGV4XS5sZXZlbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRCdXR0b25JbmRleCA9PSBpbmRleDtcclxuICAgIH1cclxufVxyXG5cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAvLyBXZSBjYW4gdXNlIHRoaXMgdmFyaWFudCwgd2hpY2ggcmVxdWlyZXMgbGVzcyBtZW1vcnkgYWxsb2NhdGlvblxyXG4gICAgLypjb25zdCBUb2dnbGVCdXR0b25zID0ge1xyXG4gICAgICAgIGJpbmRpbmdzOiBUb2dnbGVCdXR0b25zQmluZGluZ3MsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6ICd0b2dnbGVfYnV0dG9ucy90b2dnbGVfYnV0dG9ucy5odG1sJyxcclxuICAgICAgICBjb250cm9sbGVyOiBUb2dnbGVCdXR0b25zQ29udHJvbGxlcixcclxuICAgIH0qL1xyXG5cclxuICAgIC8vIE9yIHRoaXMgdmFyaWFudCwgd2hpY2ggc2FmZXJcclxuICAgIC8qY2xhc3MgVG9nZ2xlQnV0dG9ucyBpbXBsZW1lbnRzIG5nLklDb21wb25lbnRPcHRpb25zIHtcclxuICAgICAgICBwdWJsaWMgYmluZGluZ3M6IElUb2dnbGVCdXR0b25zQmluZGluZ3M7XHJcbiAgICAgICAgcHVibGljIGNvbnRyb2xsZXI6IG5nLkluamVjdGFibGU8bmcuSUNvbnRyb2xsZXJDb25zdHJ1Y3Rvcj47XHJcbiAgICAgICAgcHVibGljIHRlbXBsYXRlVXJsOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICB0aGlzLmJpbmRpbmdzID0gVG9nZ2xlQnV0dG9uc0JpbmRpbmdzO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xsZXIgPSBUb2dnbGVCdXR0b25zQ29udHJvbGxlcjtcclxuICAgICAgICAgICAgdGhpcy50ZW1wbGF0ZVVybCA9ICd0b2dnbGVfYnV0dG9ucy90b2dnbGVfYnV0dG9ucy5odG1sJztcclxuICAgICAgICB9XHJcbiAgICB9Ki9cclxuXHJcbiAgICAvLyBPciwgSSB0aGluaywgdGhpcyB2YXJpYW50LiBcclxuICAgIC8vIFRoaXMgb25lIGlzIHNhZmUgYmVjYXVzZSB3ZSd2ZSBzcGVjaWZpZWQgaW50ZXJmYWNlIGFuZCByZXF1aXJlcyBsZXNzIG1lbW9yeSBhbGxvY2F0aW9uIGJlY2F1c2Ugd2UgdXNlIGNvbnN0YW50LlxyXG4gICAgY29uc3QgVG9nZ2xlQnV0dG9uczogbmcuSUNvbXBvbmVudE9wdGlvbnMgPSB7XHJcbiAgICAgICAgYmluZGluZ3M6IFRvZ2dsZUJ1dHRvbnNCaW5kaW5ncyxcclxuICAgICAgICB0ZW1wbGF0ZVVybDogJ3RvZ2dsZV9idXR0b25zL3RvZ2dsZV9idXR0b25zLmh0bWwnLFxyXG4gICAgICAgIGNvbnRyb2xsZXI6IFRvZ2dsZUJ1dHRvbnNDb250cm9sbGVyXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3BpcFRvZ2dsZUJ1dHRvbnMnLCBbJ3BpcEJ1dHRvbnMuVGVtcGxhdGVzJ10pXHJcbiAgICAgICAgLmNvbXBvbmVudCgncGlwVG9nZ2xlQnV0dG9ucycsIFRvZ2dsZUJ1dHRvbnMpO1xyXG4gICAgXHJcbn0pKCk7IiwiKGZ1bmN0aW9uKG1vZHVsZSkge1xudHJ5IHtcbiAgbW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3BpcEJ1dHRvbnMuVGVtcGxhdGVzJyk7XG59IGNhdGNoIChlKSB7XG4gIG1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCdwaXBCdXR0b25zLlRlbXBsYXRlcycsIFtdKTtcbn1cbm1vZHVsZS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICR0ZW1wbGF0ZUNhY2hlLnB1dCgndG9nZ2xlX2J1dHRvbnMvdG9nZ2xlX2J1dHRvbnMuaHRtbCcsXG4gICAgJzxkaXYgY2xhc3M9XCJwaXAtdG9nZ2xlLWJ1dHRvbnMgbGF5b3V0LXJvdyB7eyRjdHJsLmNsYXNzfX1cIiBwaXAtc2VsZWN0ZWQ9XCIkY3RybC5idWZCdXR0b25JbmRleFwiIHBpcC1lbnRlci1zcGFjZS1wcmVzcz1cIiRjdHJsLmVudGVyU3BhY2VQcmVzcygkZXZlbnQpXCIgbmctaWY9XCIhJGN0cmwucGlwTWVkaWEoXFwneHNcXCcpIHx8ICRjdHJsLm9ubHlUb2dnbGVcIj48bWQtYnV0dG9uIHRhYmluZGV4PVwiLTFcIiBuZy1yZXBlYXQ9XCJidXR0b24gaW4gJGN0cmwuYnV0dG9uc1wiIG5nLWNsYXNzPVwie1xcJ21kLWFjY2VudCBtZC1yYWlzZWQgc2VsZWN0ZWQgY29sb3ItYWNjZW50LWJnXFwnIDogJGN0cmwuaGlnaGxpZ2h0QnV0dG9uKCRpbmRleCl9XCIgbmctYXR0ci1zdHlsZT1cInt7IFxcJ2JhY2tncm91bmQtY29sb3I6XFwnICsgKCRjdHJsLmhpZ2hsaWdodEJ1dHRvbigkaW5kZXgpID8gYnV0dG9uLmJhY2tncm91bmRDb2xvciA6IFxcJ1xcJykgKyBcXCchaW1wb3J0YW50XFwnIH19XCIgY2xhc3M9XCJwaXAtc2VsZWN0YWJsZSBwaXAtY2hpcC1idXR0b24gZmxleFwiIG5nLWNsaWNrPVwiJGN0cmwuYnV0dG9uU2VsZWN0ZWQoJGluZGV4LCAkZXZlbnQpXCIgbmctZGlzYWJsZWQ9XCJidXR0b24uZGlzYWJsZWQgfHwgJGN0cmwuZGlzYWJsZWRcIj57e2J1dHRvbi5uYW1lIHx8IGJ1dHRvbi50aXRsZSB8IHRyYW5zbGF0ZX19IDxzcGFuIG5nLWlmPVwiYnV0dG9uLmNoZWNrZWQgfHwgYnV0dG9uLmNvbXBsZXRlIHx8IGJ1dHRvbi5maWxsZWRcIiBjbGFzcz1cInBpcC10YWdnZWRcIj4qPC9zcGFuPjwvbWQtYnV0dG9uPjwvZGl2PjxtZC1pbnB1dC1jb250YWluZXIgY2xhc3M9XCJtZC1ibG9ja1wiIG5nLWlmPVwiJGN0cmwucGlwTWVkaWEoXFwneHNcXCcpICYmICEkY3RybC5vbmx5VG9nZ2xlXCI+PG1kLXNlbGVjdCBuZy1tb2RlbD1cIiRjdHJsLmN1cnJlbnRCdXR0b25JbmRleFwiIG5nLWRpc2FibGVkPVwiJGN0cmwuZGlzYWJsZWRcIiBhcmlhLWxhYmVsPVwiRFJPUERPV05cIiBtZC1vbi1jbG9zZT1cIiRjdHJsLmJ1dHRvblNlbGVjdGVkKCRjdHJsLmN1cnJlbnRCdXR0b25JbmRleClcIj48bWQtb3B0aW9uIG5nLXJlcGVhdD1cImFjdGlvbiBpbiAkY3RybC5idXR0b25zXCIgdmFsdWU9XCJ7eyA6OiRpbmRleCB9fVwiPnt7IChhY3Rpb24udGl0bGUgfHwgYWN0aW9uLm5hbWUpIHwgdHJhbnNsYXRlIH19IDxzcGFuIG5nLWlmPVwiYWN0aW9uLmNoZWNrZWQgfHwgYWN0aW9uLmNvbXBsZXRlIHx8IGFjdGlvbi5maWxsZWRcIiBjbGFzcz1cInBpcC10YWdnZWRcIj4qPC9zcGFuPjwvbWQtb3B0aW9uPjwvbWQtc2VsZWN0PjwvbWQtaW5wdXQtY29udGFpbmVyPicpO1xufV0pO1xufSkoKTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGlwLXdlYnVpLWJ1dHRvbnMtaHRtbC5taW4uanMubWFwXG4iXX0=
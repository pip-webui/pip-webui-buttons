// /// <reference path="../../typings/tsd.d.ts" />

class ToggleButton {
    id: any;
    name: string;
    disabled: boolean;
    level: number;
    diselectable: boolean;
    filled: boolean;
}

interface IToggleButtonsBindings {
    [key: string]: any;

    ngDisabled: any,
    buttons: any,
    currentButtonValue: any,
    currentButton: any,
    multiselect: any,
    change: any,
    onlyToggle: any
}

const ToggleButtonsBindings: IToggleButtonsBindings = {
    ngDisabled: '<?',
    buttons: '<pipButtons',
    currentButtonValue: '=ngModel',
    currentButton: '=?pipButtonObject',
    multiselect: '<?pipMultiselect',
    change: '&ngChange',
    onlyToggle: '<?pipOnlyToggle'
}

class ToggleButtonsChanges implements ng.IOnChangesObject, IToggleButtonsBindings {
    [key: string]: ng.IChangesObject<any>;
    // Not one way bindings
    currentButtonValue: any;
    currentButton: any;
    change: ng.IChangesObject<() => ng.IPromise<void>>;
    // One way bindings
    ngDisabled: ng.IChangesObject<boolean>;
    buttons: ng.IChangesObject<ToggleButton[]>;
    multiselect: ng.IChangesObject<boolean>;
    onlyToggle: ng.IChangesObject<boolean>;
}

class ToggleButtonsController implements IToggleButtonsBindings {
    lenght: number;

    public ngDisabled: boolean;
    public class: string;
    public multiselect: boolean;
    public buttons: ToggleButton[];
    public disabled: boolean;
    public currentButtonValue: any;
    public currentButtonIndex: number;
    public currentButton: any;
    public change: () => ng.IPromise<any>;
    public onlyToggle: boolean;
    public pipMedia: any;

    constructor(
        private $element: any,
        private $attrs: angular.IAttributes,
        private $scope: angular.IScope,
        private $timeout: ng.ITimeoutService,
        $injector: ng.auto.IInjectorService
    ) {
        "ngInject";

        this.pipMedia = $injector.has('pipMedia') ? $injector.get('pipMedia') : null;
        this.class = $attrs['class'] || '';
        const index = _.indexOf(this.buttons, _.find(this.buttons, {
            id: this.currentButtonValue
        }));
        this.currentButtonIndex = index < 0 ? 0 : index;
        this.currentButton = this.buttons.length > 0 ? this.buttons[this.currentButtonIndex] : this.currentButton;
    }

    public $onChanges(changes: ToggleButtonsChanges) {
        this.multiselect = changes.multiselect ? changes.multiselect.currentValue : false;
        this.disabled = changes.ngDisabled ? changes.ngDisabled.currentValue : false;
        this.onlyToggle = changes.onlyToggle ? changes.onlyToggle.currentValue : false;

        this.buttons = !changes.buttons || _.isArray(changes.buttons.currentValue) && changes.buttons.currentValue.length === 0 ? 
            [] : changes.buttons.currentValue;

        const index = _.indexOf(this.buttons, _.find(this.buttons, {
            id: this.currentButtonValue
        }));
        this.currentButtonIndex = index < 0 ? 0 : index;
        this.currentButton = this.buttons.length > 0 ? this.buttons[this.currentButtonIndex] : this.currentButton;
    }

    public $postLink() {
        this.$element
            .on('focusin', () => {
                this.$element.addClass('focused-container');
            })
            .on('focusout', () => {
                this.$element.removeClass('focused-container');
            });
    }

    public buttonSelected(index) {
        if (this.disabled) {
            return;
        }

        this.currentButtonIndex = index;
        this.currentButton = this.buttons[this.currentButtonIndex];
        this.currentButtonValue = this.currentButton.id || index;

        this.$timeout(() => {
            if (this.change) {
                this.change();
            }
        });
    }

    public enterSpacePress(event) {
        this.buttonSelected(event.index);
    }

    public highlightButton(index) {
        if (this.multiselect &&
            !_.isUndefined(this.currentButton.level) &&
            !_.isUndefined(this.buttons[index].level)) {

            return this.currentButton.level >= this.buttons[index].level;
        }

        return this.currentButtonIndex == index;
    }
}

(function () {
    'use strict';

    // We can use this variant, which requires less memory allocation
    /*const ToggleButtons = {
        bindings: ToggleButtonsBindings,
        templateUrl: 'toggle_buttons/toggle_buttons.html',
        controller: ToggleButtonsController,
    }*/

    // Or this variant, which safer
    /*class ToggleButtons implements ng.IComponentOptions {
        public bindings: IToggleButtonsBindings;
        public controller: ng.Injectable<ng.IControllerConstructor>;
        public templateUrl: string;

        constructor() {
            this.bindings = ToggleButtonsBindings;
            this.controller = ToggleButtonsController;
            this.templateUrl = 'toggle_buttons/toggle_buttons.html';
        }
    }*/

    // Or, I think, this variant. 
    // This one is safe because we've specified interface and requires less memory allocation because we use constant.
    const ToggleButtons: ng.IComponentOptions = {
        bindings: ToggleButtonsBindings,
        templateUrl: 'toggle_buttons/toggle_buttons.html',
        controller: ToggleButtonsController,
    }

    angular
        .module('pipToggleButtons', ['pipButtons.Templates'])
        .component('pipToggleButtons', ToggleButtons);
    
})();
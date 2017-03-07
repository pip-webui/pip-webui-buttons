declare module pip.buttons {


interface IRefreshButtonBindings {
    [key: string]: any;
    text: any;
    visible: any;
    onRefresh: any;
}
const RefreshButtonBindings: IRefreshButtonBindings;
class RefreshButtonChanges implements ng.IOnChangesObject, IRefreshButtonBindings {
    [key: string]: ng.IChangesObject<any>;
    onRefresh: ng.IChangesObject<({$event: any}) => ng.IPromise<any>>;
    text: ng.IChangesObject<string>;
    visible: ng.IChangesObject<boolean>;
}
class RefreshButtonController implements IRefreshButtonBindings {
    private $scope;
    private $element;
    private $attrs;
    private _textElement;
    private _buttonElement;
    private _width;
    text: string;
    visible: boolean;
    onRefresh: (param: {
        $event: ng.IAngularEvent;
    }) => ng.IPromise<any>;
    constructor($scope: ng.IScope, $element: any, $attrs: ng.IAttributes);
    $postLink(): void;
    $onChanges(changes: RefreshButtonChanges): void;
    onClick($event: any): void;
    private show();
    private hide();
}

class FabTooltipVisibilityController {
    private _element;
    private _scope;
    private _timeout;
    constructor($element: any, $attrs: angular.IAttributes, $scope: angular.IScope, $timeout: ng.ITimeoutService, $parse: any);
}

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
    ngDisabled: any;
    buttons: any;
    currentButtonValue: any;
    currentButton: any;
    multiselect: any;
    change: any;
    onlyToggle: any;
}
const ToggleButtonsBindings: IToggleButtonsBindings;
class ToggleButtonsChanges implements ng.IOnChangesObject, IToggleButtonsBindings {
    [key: string]: ng.IChangesObject<any>;
    currentButtonValue: any;
    currentButton: any;
    change: ng.IChangesObject<() => ng.IPromise<void>>;
    ngDisabled: ng.IChangesObject<boolean>;
    buttons: ng.IChangesObject<ToggleButton[]>;
    multiselect: ng.IChangesObject<boolean>;
    onlyToggle: ng.IChangesObject<boolean>;
}
class ToggleButtonsController implements IToggleButtonsBindings {
    private $element;
    private $attrs;
    private $scope;
    private $timeout;
    ngDisabled: boolean;
    class: string;
    multiselect: boolean;
    buttons: ToggleButton[];
    disabled: boolean;
    currentButtonValue: any;
    currentButtonIndex: number;
    currentButton: any;
    change: () => ng.IPromise<any>;
    onlyToggle: boolean;
    constructor($element: any, $attrs: angular.IAttributes, $scope: angular.IScope, $timeout: ng.ITimeoutService);
    $onChanges(changes: ToggleButtonsChanges): void;
    $postLink(): void;
    buttonSelected(index: any): void;
    enterSpacePress(event: any): void;
    highlightButton(index: any): boolean;
}

}

declare module pip.buttons {


class FabTooltipVisibilityController {
    private _element;
    private _scope;
    private _timeout;
    constructor($mdMedia: angular.material.IMedia, $element: any, $attrs: angular.IAttributes, $scope: angular.IScope, $timeout: ng.ITimeoutService, $parse: any);
}


class ToggleButtonsController {
    private _element;
    private _scope;
    private _timeout;
    $mdMedia: angular.material.IMedia;
    class: string;
    multiselect: boolean;
    buttons: any;
    currentButtonValue: any;
    currentButtonIndex: number;
    currentButton: any;
    buttonSelected: any;
    disabled: any;
    enterSpacePress: Function;
    ngDisabled: Function;
    highlightButton: any;
    change: Function;
    onlyToggle: boolean;
    constructor($mdMedia: angular.material.IMedia, $element: any, $attrs: angular.IAttributes, $scope: angular.IScope, $timeout: ng.ITimeoutService);
}

}

{

class FabTooltipVisibilityController {
    private _element;
    private _scope: angular.IScope;
    private _timeout: ng.ITimeoutService;

    constructor(
        $element: any,
        $attrs: angular.IAttributes,
        $scope: angular.IScope,
        $timeout: ng.ITimeoutService,
        $parse
    ) {
        "ngInject";
        let trigGetter = $parse($attrs['pipFabTooltipVisibility']),
            showGetter = $parse($attrs['pipFabShowTooltip']),
            showSetter = showGetter.assign;

        $scope.$watch(trigGetter, (isOpen) => {
            if (!_.isFunction(showSetter)) return;

            if (isOpen) {
                $timeout(() => {
                    showSetter($scope, isOpen);
                }, 600);
            } else {
                showSetter($scope, isOpen);
            }
        });
    }
}


function pipFabTooltipVisibility($parse, $timeout): ng.IDirective {
    return {
        restrict: 'A',
        scope: false,
        controller: FabTooltipVisibilityController
    };
}

angular
    .module('pipFabTooltipVisibility', [])
    .directive('pipFabTooltipVisibility', pipFabTooltipVisibility);

}
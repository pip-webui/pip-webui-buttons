// /// <reference path="../../typings/tsd.d.ts" />

// class ToggleButtonsController {
//     private _element;
//     private _scope: angular.IScope;
//     private _timeout: ng.ITimeoutService;

//     public $mdMedia: angular.material.IMedia;
//     public class: string;
//     public multiselect: boolean;
//     public buttons;
//     public currentButtonValue;
//     public currentButtonIndex: number;
//     public currentButton;
//     public buttonSelected;
//     public disabled;
//     public enterSpacePress: Function;
//     public ngDisabled: Function;
//     public highlightButton;
//     public change: Function;
//     public onlyToggle: boolean;
    
//     constructor(
//         $mdMedia: angular.material.IMedia,
//         $element: any,
//         $attrs: angular.IAttributes,
//         $scope: angular.IScope,
//         $timeout: ng.ITimeoutService
//     ) {
//         "ngInject";
//          this.$mdMedia = $mdMedia;
//          this.class = $attrs['class'] || '';
//          this.multiselect = $scope['multiselect'] || false;
//          this.ngDisabled = $scope['ngDisabled'];
//          this.currentButtonValue = $scope['currentButtonValue'];
//          this.currentButton = $scope['currentButton'];
//          this.change = $scope['change'];
//          this.onlyToggle = $scope['onlyToggle'];

//          this.buttons = !$scope['buttons'] || _.isArray($scope['buttons']) && $scope['buttons'].length === 0 ? 
//                         [] : $scope['buttons'];
         
//         let index = _.indexOf(this.buttons, _.find(this.buttons, {id: this.currentButtonValue}));
//         this.currentButtonIndex = index < 0 ? 0 : index;
//         this.currentButton = this.buttons.length > 0 ? this.buttons[this.currentButtonIndex] : this.currentButton;
       
//         this.buttonSelected = (index) => {
//             if (this.disabled()) { return; }
//             this.currentButtonIndex = index;
//             this.currentButton = this.buttons[this.currentButtonIndex];
//             this.currentButtonValue = this.currentButton.id || index;

//             $timeout( () => {
//                 if (this.change) {
//                     this.change();
//                 } });
//         };

//         this.enterSpacePress = (event) => {
//              this.buttonSelected(event.index);
//         };

//         this.disabled = () => {
//             if (this.ngDisabled) { 
//                 return this.ngDisabled(); 
//             }
//         };

//         this.highlightButton = (index) => {
//             if (this.multiselect && 
//                 !_.isUndefined(this.currentButton.level) && 
//                 !_.isUndefined(this.buttons[index].level)) {

//                 return this.currentButton.level >= this.buttons[index].level;
//             } 

//             return this.currentButtonIndex == index;
//         }
//     }


// }

// (() => {
//     function ToggleButtonsDirective() {
//         return {
//             restrict: 'EA',
//             controller: ToggleButtonsController,
//             controllerAs: 'toggle',
//             scope: {
//                 ngDisabled: '&',
//                 buttons: '=pipButtons',
//                 currentButtonValue: '=ngModel',
//                 currentButton: '=?pipButtonObject',
//                 multiselect: '=?pipMultiselect',
//                 change: '&ngChange',
//                 onlyToggle: '=?pipOnlyToggle'
//             },
//             link: function (scope, elem) {
//                 elem
//                     .on('focusin', function () {
//                         elem.addClass('focused-container');
//                     })
//                     .on('focusout', function () {
//                         elem.removeClass('focused-container');
//                     });
//             },
//             templateUrl: 'toggle_buttons/toggle_buttons.html'
//         };
//     }

//     angular
//         .module('pipToggleButtons', ['pipButtons.Templates'])
//         .directive('pipToggleButtons', ToggleButtonsDirective);

// })();


(function () {
    'use strict';

    var thisModule = angular.module('pipToggleButtons', ['pipButtons.Templates']);

    thisModule.directive('pipToggleButtons',
        function () {
            return {
                restrict: 'EA',
                scope: {
                    ngDisabled: '&',
                    buttons: '=pipButtons',
                    currentButtonValue: '=ngModel',
                    currentButton: '=?pipButtonObject',
                    multiselect: '=?pipMultiselect',
                    change: '&ngChange',
                    onlyToggle: '=?pipOnlyToggle'
                },
                templateUrl: 'toggle_buttons/toggle_buttons.html',
                controller: 
                function ($scope, $element, $attrs, $mdMedia, $timeout) {
                    var index;

                    $scope.$mdMedia = $mdMedia;
                    $scope.class = $attrs.class || '';
                    $scope.multiselect = $scope.multiselect || false;

                    if (!$scope.buttons || _.isArray($scope.buttons) && $scope.buttons.length === 0) {
                        $scope.buttons = [];
                    }

                    index = _.indexOf($scope.buttons, _.find($scope.buttons, {id: $scope.currentButtonValue}));
                    $scope.currentButtonIndex = index < 0 ? 0 : index;
                    $scope.currentButton = $scope.buttons.length > 0 ? $scope.buttons[$scope.currentButtonIndex]
                        : $scope.currentButton;

                    $scope.buttonSelected = function (index) {
                        if ($scope.disabled()) {
                            return;
                        }
                        
                        if ($scope.buttons[index].diselectable === true && index === $scope.currentButtonIndex 
                                && $scope.buttons[index].level !== undefined) 
                        {
                            let curLevel = $scope.buttons[index].level, tmp;
                            curLevel--;

                            tmp = _.findIndex($scope.buttons, (b) => { return b['level'] === curLevel; });
                            index = tmp > -1 ? tmp: index;
                        }

                        $scope.currentButtonIndex = index;
                        $scope.currentButton = $scope.buttons[$scope.currentButtonIndex];
                        $scope.currentButtonValue = $scope.currentButton.id || index;

                        $timeout(function () {
                            if ($scope.change) {
                                $scope.change();
                            }
                        });
                    };

                    $scope.enterSpacePress = function (event) {
                        $scope.buttonSelected(event.index);
                    };

                    $scope.disabled = function () {
                        if ($scope.ngDisabled) {
                            return $scope.ngDisabled();
                        }
                    };

                    $scope.highlightButton = function (index) {
                        if ($scope.multiselect && $scope.currentButton.level !== undefined && $scope.buttons[index].level !== undefined) {
                           return $scope.currentButton.level >= $scope.buttons[index].level;
                        } else {
                            return $scope.currentButtonIndex == index;
                        }
                    }
                },
                link: function (scope, elem) {
                    elem
                        .on('focusin', function () {
                            elem.addClass('focused-container');
                        })
                        .on('focusout', function () {
                            elem.removeClass('focused-container');
                        });
                }
            };
        }
    );

})(); 


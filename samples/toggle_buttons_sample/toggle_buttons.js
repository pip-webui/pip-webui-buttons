(function (angular) {
    'use strict';

    var thisModule = angular.module('appButtons.ToggleButtons', []);

    thisModule.controller('ToggleButtonsController',
        function($scope, $injector, $timeout) {
            var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;

            if (pipTranslate) {
                pipTranslate.translations('en', {
                    SAMPLE: 'Sample',                    
                    CODE: 'Code',
                    LOW: 'Low',
                    NORMAL: 'Normal',
                    HIGH: 'High',
                    INITIALIZED: 'Initialized',
                    NOT_TEXT: 'Not',
                    DISABLED: 'Disabled',
                    COLORED: 'Colored',
                    MULTI: 'Multiselectable'                
                });
                pipTranslate.translations('ru', {
                    SAMPLE: 'Пример',  
                    CODE: 'Пример кода',
                    LOW: 'Низкий',
                    NORMAL: 'Средний',
                    HIGH: 'Высокий',                    
                    INITIALIZED: 'Инициализированный',
                    NOT_TEXT: 'Не',
                    DISABLED: 'Не активна',
                    COLORED: 'Цветной',
                    MULTI: 'Выбор нескольких вариантов'                    
                });
                $scope.initialized = pipTranslate.translate('INITIALIZED');
                $scope.sample = pipTranslate.translate('SAMPLE');
                $scope.code = pipTranslate.translate('CODE');  
                $scope.notText = pipTranslate.translate('NOT_TEXT');  
                $scope.colored = pipTranslate.translate('COLORED');  
                $scope.disabled = pipTranslate.translate('DISABLED');  
                $scope.multi = pipTranslate.translate('MULTI');  
            } else {
                $scope.initialized = 'Initialized';
                $scope.notText = 'Not';
                $scope.colored = 'Colored';
                $scope.sample = 'Sample';
                $scope.code = 'Code';   
                $scope.disabled = 'Disabled';   
            }

            $timeout(function() {
                $('pre code').each(function(i, block) {
                    if (Prism)
                        Prism.highlightElement(block);
                });
            });

            $scope.buttonsCollection = [
                {id: 1, name: 'LOW', disabled: false, filled: true, level: 0},
                {id: 2, name: 'NORMAL', disabled: false, level: 1, diselectable: true},
                {id: 3, name: 'HIGH', disabled: false, level: 2, diselectable: true},
                {id: 0, name: 'None', disabled: false}
            ];
            $scope.buttonsCollection2 = [
                {id: 'type 1', name: 'LOW', disabled: false},
                {id: 'type 2', name: 'NORMAL', disabled: false, filled: true},
                {id: 'type 3', name: 'HIGH', disabled: false}
            ];

            $scope.buttonsCollection3 = [
                {id: 'type 1', name: 'LOW', disabled: false},
                {id: 'type 2', name: 'NORMAL', disabled: false},
                {id: 'type 3', name: 'HIGH', disabled: false}
            ];

            $scope.buttonsColoredCollection = [
                {id: 'type 1', name: 'LOW', disabled: false, backgroundColor: '#F06292'},
                {id: 'type 2', name: 'NORMAL', disabled: false, backgroundColor: '#BA68C8'},
                {id: 'type 3', name: 'HIGH', disabled: false, backgroundColor: '#009688'}
            ];

            $scope.type = 'type LOW';

            $scope.initType = 'type 2';
        }
    );

})(window.angular);

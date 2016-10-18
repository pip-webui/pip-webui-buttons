/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('appComponentsStyles.ActionList', []);

    thisModule.controller('ActionListController',
        function($scope, $injector) {
            var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;

            if (pipTranslate) {
                pipTranslate.translations('en', {
                    ACTION_LIST: 'Action list',
                    SAMPLE: 'Sample',                    
                    CODE: 'Code',
                    CANCEL: 'Cancel',
                    FORWARD: 'Forward',
                    REPLY: 'Reply',
                    DELETE: 'Delete',
                    DO_IT_TOMORROW: 'Do it tomorrow',
                    EDIT: 'Edit',
                    CONVERT: 'Convert'
                });
                pipTranslate.translations('ru', {
                    ACTION_LIST: 'Список действий',
                    SAMPLE: 'Пример',  
                    CODE: 'Пример кода',
                    CANCEL: 'Отменить',
                    FORWARD: 'Назад',
                    REPLY: 'Ответить',
                    DELETE: 'Удалить',
                    DO_IT_TOMORROW: 'Сделать завтра',
                    EDIT: 'Редактировать',
                    CONVERT: 'Конвертировать'                                     
                });
                $scope.actionList = pipTranslate.translate('ACTION_LIST');
                $scope.sample = pipTranslate.translate('SAMPLE');
                $scope.code = pipTranslate.translate('CODE');                
                $scope.cancel = pipTranslate.translate('CANCEL');                
                $scope.forward = pipTranslate.translate('FORWARD');                
                $scope.reply = pipTranslate.translate('REPLY');                
                $scope.delete = pipTranslate.translate('DELETE');                
                $scope.tomorrow = pipTranslate.translate('DO_IT_TOMORROW');                
                $scope.edit = pipTranslate.translate('EDIT');                
                $scope.convert = pipTranslate.translate('CONVERT');                
            } else {
                $scope.actionList = 'Action list';
                $scope.sample = 'Sample';
                $scope.code = 'Code';      
                $scope.cancel = 'Cancel';                
                $scope.forward = 'Forward';                
                $scope.reply = 'Reply';                
                $scope.delete = 'Delete';                
                $scope.tomorrow = 'Do it tomorrow';                
                $scope.edit = 'Edit';                
                $scope.convert = 'Convert';                             
            }
        }
    );

})();

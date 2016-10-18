/* global angular */

(function () {
    'use strict';

    var thisModule = angular.module('appComponentsStyles.DrilldownList', []);

    thisModule.controller('DrilldownListController',
        function($scope, $injector) {
            var pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;

            if (pipTranslate) {
                pipTranslate.translations('en', {
                    SAMPLE: 'Sample',                    
                    SHARE: 'Share',
                    TEXT_LONG_1: 'A: Monotonectally grow accurate quality vectors rather than performance based infomediaries',
                    TEXT_LONG_2: 'Uniquely reinvent process-centric relationships with cross functional e-commerce. Efficiently brand best-of-breed schemas and functional models. Competently morph scalable best practices via excellent growth strategies. Completely streamline enterprise-wide channels before.'
                });
                pipTranslate.translations('ru', {
                    SAMPLE: 'Пример',  
                    SHARE: 'Доступ',
                    TEXT_LONG_1: 'A: Monotonectally grow accurate quality vectors rather than performance based infomediaries',
                    TEXT_LONG_2: 'Uniquely reinvent process-centric relationships with cross functional e-commerce. Efficiently brand best-of-breed schemas and functional models. Competently morph scalable best practices via excellent growth strategies. Completely streamline enterprise-wide channels before.',
                });
                $scope.share = pipTranslate.translate('SHARE');
                $scope.sample = pipTranslate.translate('SAMPLE');
                $scope.textLong1 = pipTranslate.translate('TEXT_LONG_1');                
                $scope.textLong2 = pipTranslate.translate('TEXT_LONG_2');                
            } else {
                $scope.share = 'Share';
                $scope.sample = 'Sample';
                $scope.textLong1 = 'A: Monotonectally grow accurate quality vectors rather than performance based infomediaries';      
                $scope.textLong2 = 'Uniquely reinvent process-centric relationships with cross functional e-commerce. Efficiently brand best-of-breed schemas and functional models. Competently morph scalable best practices via excellent growth strategies. Completely streamline enterprise-wide channels before.';                
            }
        }
    );

})();

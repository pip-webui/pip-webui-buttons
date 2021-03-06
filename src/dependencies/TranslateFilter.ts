{
    function translate($injector: ng.auto.IInjectorService) {
        const pipTranslate = $injector.has('pipTranslate') ? $injector.get('pipTranslate') : null;

        return function (key: string) {
            return pipTranslate ? pipTranslate['translate'](key) || key : key;
        }
    }

    angular.module('pipButtons.Translate', [])
        .filter('translate', translate);
}
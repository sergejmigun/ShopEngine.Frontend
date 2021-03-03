app.registerComponent('localizationManagementService', 'Services', [
    'Services.apiControllers.settings.localization',
    function (api) {
        'use strict';

        var service = {} as Settings.Services.ILocalizationManagementService;

        service.findLanguages = function (filterData) {
            return api.findLanguages(filterData).send();
        };

        service.getLanguage = function (shortName) {
            return api.getLanguage({
                shortName: shortName
            }).send();
        };

        service.createLanguage = function (language) {
            return api.createLanguage(language).send();
        };

        service.updateLanguage = function (language) {
            return api.updateLanguage(language).send();
        };

        service.deleteLanguage = function (shortName) {
            return api.deleteLanguage({
                shortName: shortName
            }).send();
        };

        return service;
    }
]);
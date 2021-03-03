app.registerComponent('globalConfiguration', 'Services', [function () {
    'use strict';

    return {
        clientExceptionTypeName: 'ShopEngine.Exceptions.ClientException'
    } as Services.IGlobalConfiguration;
}]);
app.registerComponent('systemUrls', 'Shared', [
    'Urls',
    function (urls) {
        'use strict';
        function getMvcUrl(controller, action) {
            return urls.mvc[controller][action].url;
        }
        function getApiUrl(controller, action) {
            return urls.api[controller][action].url;
        }
        return {
            downloadFileUrl: getMvcUrl('help', 'download'),
            uploadFileUrl: getMvcUrl('help', 'download'),
            removeFileUrl: getMvcUrl('help', 'removeFile'),
            templateUrl: getMvcUrl('help', 'getTemplate'),
            getBackgroundProcessInfoApiUrl: getApiUrl('backgroundProcess', 'getBackgroundProcessInfo'),
            getBackgroundProcessProgressInfoApiUrl: getApiUrl('backgroundProcess', 'getBackgroundProcessProgress')
        };
    }
]);

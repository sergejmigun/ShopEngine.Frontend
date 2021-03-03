app.registerComponent('viewHelper', 'Services', [
    'Utils.urls',
    'Promise',
    'Services.modalHelper',
    'Services.containerHelper',
    'UI.buttons',
    function (urls, promise, modalHelper, containerHelper, buttons) {
        'use strict';
        var openInModal = false;
        return {
            open: function (data) {
                if (openInModal) {
                    urls.navigate(data.externalUrl);
                }
                else {
                    return modalHelper.open(data);
                }
            },
            initCloseButton: function ($container, modalHelper) {
                buttons.cancel({
                    css: 'pull-right margin-r-10',
                    action: function () {
                        modalHelper.modal.close();
                    }
                }, containerHelper.appendTo($container, promise.empty()));
            }
        };
    }
]);

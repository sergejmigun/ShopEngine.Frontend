app.registerComponent('viewHelper', 'Services', [
    'Utils.urls',
    'Promise',
    'Services.modalHelper',
    'Services.containerHelper',
    'UI.buttons',
    function (urls: Utils.IUrls,
        promise: IPromise,
        modalHelper: Services.IModalHelper,
        containerHelper: Services.IContainerHelper,
        buttons: UI.IButtonsFactory) {
    'use strict';

    var openInModal = false;

    return {
        open: function (data) {
            if (openInModal) {
                urls.navigate(data.externalUrl);
            } else {
                return modalHelper.open(data);
            }
        },
        initCloseButton: function ($container: JQuery, modalHelper) {
            buttons.cancel({
                css: 'pull-right margin-r-10',
                action: function () {
                    modalHelper.modal.close();
                }
            }, containerHelper.appendTo($container, promise.empty()));
        }
    } as Services.Helpers.IViewHelper;
}]);
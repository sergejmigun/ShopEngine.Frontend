app.registerComponent('errorViewer', 'Components.common', [
    '$',
    'Promise',
    function($: JQueryStatic, promise: IPromise) {
        'use strict';

        return {
            init: function(model, container) {
                var template = {} as Components.Common.IErrorViewer,
                    _$html;

                function renderError(errorData: Components.Common.IErrorViewData, $container: JQuery) {
                    var $errorWrapper = $('<div />');

                    $errorWrapper.append($('<h4 class="bold" />').text(errorData.exceptionMessage));
                    $errorWrapper.append($('<p class="bold" />').text(errorData.exceptionType));
                    $errorWrapper.append($('<p class="margin-b-20" />').text(errorData.stackTrace));

                    if (errorData.innerException) {
                        renderError(errorData.innerException, $errorWrapper);
                    }

                    $container.append($errorWrapper);
                }

                function init(success) {
                    _$html = $('<div />');
                    renderError(model.errorData, _$html);
                    container.setContent(_$html);
                    success(template);
                }

                return promise.create(function (success) {
                    init(success);
                });
            }
        } as Components.Common.IErrorViewerFactory;
    }
]);
app.registerComponent('contentVariable', 'Components', [
    '$',
    'Promise',
    'Resources.UI',
    'Services.containerHelper',
    'Services.clipboardService',
    'Services.apiService',
    'UI.buttons',
    function ($, promise, resources, containerHelper, clipboardService, apiService, buttons) {
        'use strict';
        return {
            init: function (model, container) {
                var template = {}, _$html;
                function init(success) {
                    var variableName = '{{' + model.name + '}}';
                    container.setContent(_$html);
                    _$html.find('.variableName').text(variableName);
                    _$html.find('.variableDescription').text(model.description);
                    buttons.roundIcon('fa-copy', {
                        size: UI.ButtonSize.Small,
                        title: resources.copyToClipboard,
                        action: function () {
                            clipboardService.copy(variableName);
                        }
                    }, containerHelper.appendTo(_$html.find('.clipboardCopyButton'), container.ready()));
                    success(template);
                }
                return promise.create(function (success) {
                    apiService.getTemplateHtml('contentVariable').then(function (html) {
                        _$html = $(html);
                        init(success);
                    });
                });
            }
        };
    }
]);

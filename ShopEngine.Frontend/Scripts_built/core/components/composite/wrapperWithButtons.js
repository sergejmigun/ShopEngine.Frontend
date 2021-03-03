app.registerComponent('wrapperWithButtons', 'Components', [
    '$',
    'Promise',
    'Components',
    'Collections',
    'Services.apiService',
    'Services.containerHelper',
    'UI.buttons',
    function ($, promise, templates, collections, apiService, containerHelper, buttons) {
        'use strict';
        return {
            init: function (model, container) {
                var _$html, _innerTemplate, _$buttonsContainer, _formButtons = [], _$bodyContainer;
                var _component = {
                    getInnerTemplate: function () {
                        return _innerTemplate;
                    },
                    setReadOnly: function (readOnly) {
                        collections.foreach(_formButtons, function (_button) {
                            if (readOnly) {
                                _button.hide();
                            }
                            else {
                                _button.show();
                            }
                        });
                    },
                    setDisabled: function (disabled) {
                        collections.foreach(_formButtons, function (_button) {
                            if (disabled) {
                                _button.disable();
                            }
                            else {
                                _button.enable();
                            }
                        });
                    }
                };
                function initButtons() {
                    collections.safeForeach(model.buttons, function (buttonData) {
                        var button = buttons.doAction(buttonData, containerHelper.appendTo(_$buttonsContainer, container.ready()));
                        if (buttonData.buttonType === UI.ButtonType.Submit || buttonData.buttonType === UI.ButtonType.Cancel) {
                            _formButtons.push(button);
                        }
                    });
                }
                function init(success) {
                    initButtons();
                    container.ready();
                    var innerTemplateContainer = containerHelper.appendTo(_$bodyContainer, container.ready()), _setContent = innerTemplateContainer.setContent;
                    innerTemplateContainer.setContent = function (content) {
                        container.setContent(_$html);
                        _setContent(content);
                    };
                    templates.init(model.templateData, innerTemplateContainer).then(function (innerTemplate) {
                        _innerTemplate = innerTemplate;
                        success(_component);
                    });
                }
                return promise.create(function (success) {
                    apiService.getTemplateHtml('wrapperWithButtons').then(function (html) {
                        _$html = $(html);
                        _$buttonsContainer = _$html.find('.buttonsContainer');
                        _$bodyContainer = _$html.find('.bodyContainer');
                        if (model.noLine) {
                            _$buttonsContainer.addClass('no-border');
                        }
                        init(success);
                    });
                });
            }
        };
    }
]);

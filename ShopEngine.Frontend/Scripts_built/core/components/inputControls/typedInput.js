app.registerComponent('typedInput', 'UI', [
    '$',
    'Promise',
    'Utils.objects',
    'Services.defaultInputValidationHandler',
    'Services.eventsInitializer',
    'Services.componentInitializationHelper',
    'Services.containerHelper',
    'UI.multiSelectList',
    'UI.singleSelectList',
    'UI.dateTimePicker',
    'UI.localizedInput',
    'UI.htmlEditor',
    'UI.numericBox',
    'UI.checkBox',
    'UI.textBox',
    'UI.multiLineTextBox',
    function ($, promise, objects, defaultInputValidationHandler, eventsInitializer, componentInitializationHelper, containerHelper, multiSelectList, singleSelectList, dateTimePicker, localizedInput, htmlEditor, numericBox, checkBox, textBox, multiLineTextBox) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {}, _$wrapper, _currentControl, _validationHandler = defaultInputValidationHandler.init(control), _events = eventsInitializer.init(control, ['onChange', 'onRemove']);
                function getInitData(controlInitData) {
                    if (!controlInitData) {
                        controlInitData = {};
                    }
                    if (initData.typeInitData && initData.typeInitData[initData.type]) {
                        objects.map(initData.typeInitData[initData.type], controlInitData);
                    }
                    controlInitData.value = initData.value;
                    return controlInitData;
                }
                function initMultiOptionsInput($input) {
                    return multiSelectList.init(containerHelper.replace($input, container.ready()), getInitData());
                }
                function initOptionsInput($input) {
                    return singleSelectList.init(containerHelper.replace($input, container.ready()), getInitData());
                }
                function initDateTime($input) {
                    return dateTimePicker.init(containerHelper.replace($input, container.ready()), getInitData({
                        includeTime: true
                    }));
                }
                function initDate($input) {
                    return dateTimePicker.init(containerHelper.replace($input, container.ready()), getInitData());
                }
                function initHtml($input) {
                    if (initData.localizableStrings) {
                        return localizedInput.init(containerHelper.replace($input, container.ready()), {
                            controlInitializer: componentInitializationHelper.forInputControl(htmlEditor, getInitData()),
                            value: initData.value
                        });
                    }
                    return htmlEditor.init(containerHelper.replace($input, container.ready()), getInitData());
                }
                function initNumber($input, decimals) {
                    return numericBox.init(containerHelper.replace($input, container.ready()), getInitData({
                        decimals: decimals
                    }));
                }
                function initCheckbox($input) {
                    return checkBox.init(containerHelper.replace($input, container.ready()), getInitData());
                }
                function initSingleLineString($input) {
                    if (initData.localizableStrings) {
                        return localizedInput.init(containerHelper.replace($input, container.ready()), {
                            controlInitializer: componentInitializationHelper.forInputControl(textBox, getInitData()),
                            value: initData.value
                        });
                    }
                    return textBox.init(containerHelper.replace($input, container.ready()), getInitData());
                }
                function initString($input) {
                    if (initData.localizableStrings) {
                        $input.wrap('<div class="margin-t-30" />');
                        return localizedInput.init(containerHelper.replace($input, container.ready()), {
                            controlInitializer: componentInitializationHelper.forInputControl(multiLineTextBox, {
                                rows: 2
                            }),
                            value: initData.value
                        });
                    }
                    return multiLineTextBox.init(containerHelper.replace($input, container.ready()), getInitData({
                        rows: 2
                    }));
                }
                function initControlByType(type) {
                    if (!type) {
                        return;
                    }
                    if (_currentControl) {
                        _currentControl.remove();
                    }
                    var initPromise, $input = $('<input type="hidden" />');
                    _$wrapper.html($input);
                    switch (type) {
                        case UI.InputType.String:
                            initPromise = initString($input);
                            break;
                        case UI.InputType.SingleLineString:
                            initPromise = initSingleLineString($input);
                            break;
                        case UI.InputType.Integer:
                            initPromise = initNumber($input);
                            break;
                        case UI.InputType.Decimal:
                            initPromise = initNumber($input, 2);
                            break;
                        case UI.InputType.Boolean:
                            initPromise = initCheckbox($input);
                            break;
                        case UI.InputType.Html:
                            initPromise = initHtml($input);
                            break;
                        case UI.InputType.Date:
                            initPromise = initDate($input);
                            break;
                        case UI.InputType.DateTime:
                            initPromise = initDateTime($input);
                            break;
                        case UI.InputType.Options:
                            initPromise = initOptionsInput($input);
                            break;
                        case UI.InputType.MultiOptions:
                            initPromise = initMultiOptionsInput($input);
                            break;
                    }
                    return initPromise.then(function (inst) {
                        inst.onChange(function () {
                            _events.onChange.invoke();
                        });
                        _currentControl = inst;
                    });
                }
                function init(success) {
                    _$wrapper = $('<div class="typed-input" />');
                    container.setContent(_$wrapper);
                    initControlByType(initData.type).then(function () {
                        success(control);
                    });
                }
                control.value = function (value) {
                    if (value !== undefined) {
                        _currentControl.value(value);
                    }
                    else {
                        return _currentControl.value();
                    }
                };
                control.setType = function (type) {
                    if (type === initData.type) {
                        return;
                    }
                    initData.type = type;
                    return initControlByType(type);
                };
                control.disabled = function (disabled) {
                    if (!_currentControl) {
                        return;
                    }
                    if (disabled !== undefined) {
                        _currentControl.disabled(disabled);
                    }
                    else {
                        return _currentControl.disabled();
                    }
                };
                control.readOnly = function (readOnly) {
                    if (!_currentControl) {
                        return;
                    }
                    if (readOnly !== undefined) {
                        _currentControl.readOnly(readOnly);
                    }
                    else {
                        return _currentControl.readOnly();
                    }
                };
                control.displayError = function (error) {
                    _validationHandler.displayError(error);
                };
                control.getAllErrors = function () {
                    return _validationHandler.getAllErrors();
                };
                control.clearError = function (errorName) {
                    _validationHandler.clearError(errorName);
                };
                control.clearAllErrors = function () {
                    _validationHandler.clearAllErrors();
                };
                control.remove = function () {
                    if (_currentControl) {
                        _currentControl.remove();
                    }
                    _$wrapper.remove();
                    _events.onRemove.invoke();
                };
                control.getJQueryObject = function () {
                    return _$wrapper;
                };
                return promise.create(function (success) {
                    init(success);
                });
            }
        };
    }
]);

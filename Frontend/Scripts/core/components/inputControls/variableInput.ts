app.registerComponent('variableInput', 'UI', [
    '$',
    'Promise',
    'Collections',
    'Utils.objects',
    'Services.defaultInputValidationHandler',
    'Services.eventsInitializer',
    'Services.containerHelper',
    'UI.itemsSwitcher',
    function ($: JQueryStatic,
        promise: IPromise,
        collections: ICollections,
        objects: Utils.IObjects,
        defaultInputValidationHandler: Services.IDefaultInputValidationHandlerFactory,
        eventsInitializer: Services.Initialization.IEventsInitializer,
        containerHelper: Services.IContainerHelper,
        itemsSwitcher: UI.IItemsSwitcherFactory) {
        'use strict';

        return {
            init: function (container, initData) {
                var control = {} as UI.IVariableInput,
                    _$wrapper: JQuery,
                    _$variablesListWrapper: JQuery,
                    _variationsData = {},
                    _currentVariation: string,
                    _input: UI.IInputControl<any>,
                    _variationPicker: UI.IItemsSwitcher,
                    _$inputWrapper: JQuery,
                    _ignoreChange: boolean,
                    _validationHandler = defaultInputValidationHandler.init(control),
                    _events = eventsInitializer.init(control, ['onChange', 'onRemove']);

                function invokeChange() {
                    if (!_ignoreChange) {
                        _events.onChange.invoke();
                    }
                }

                function updateValue() {
                    _variationsData[_currentVariation] = _input.value();
                }

                function setDisabled() {
                    if (initData.disabled) {
                        _input.disabled(true);
                    } else {
                        _input.disabled(false);
                    }
                }

                function setReadOnly() {
                    if (initData.readOnly) {
                        _input.readOnly(true);
                        _$variablesListWrapper.hide();
                    } else {
                        _input.readOnly(false);
                        _$variablesListWrapper.show();
                    }
                }

                function setValue(value: {}) {
                    if (!value) {
                        collections.foreach(_variationsData, function (variationValue, variationName) {
                            app.ignoreParams(variationValue);

                            _variationsData[variationName] = null;
                            _input.value(null);
                        });
                    } else {
                        collections.foreach(value, function (variationValue, variationName) {
                            _variationsData[variationName] = variationValue;

                            if (variationName === _currentVariation) {
                                _input.value(_variationsData[_currentVariation]);
                            }
                        });
                    }
                }

                function getValue() {
                    return objects.clone(_variationsData);
                }

                function initSwitcher(listItems) {
                    _$variablesListWrapper = $('<div class="variable-items-switcher" />');
                    _$wrapper.prepend(_$variablesListWrapper);

                    return itemsSwitcher.init(containerHelper.appendTo(_$variablesListWrapper, container.ready()), {
                        items: listItems,
                        value: _currentVariation
                    }).then(function (inst) {
                        _variationPicker = inst;
                        _variationPicker.onChange(function () {
                            _ignoreChange = true;
                            updateValue();
                            _currentVariation = _variationPicker.value();
                            _input.value(_variationsData[_currentVariation]);
                            _ignoreChange = false;
                        });
                    });
                }

                function initInput() {
                    _$inputWrapper = $('<div />');
                    _$wrapper.append(_$inputWrapper);

                    return initData.controlInitializer.init(
                        containerHelper.appendTo(_$inputWrapper, container.ready()), {
                            value: initData.value ? initData.value[_currentVariation] : null,
                            readOnly: initData.readOnly,
                            disabled: initData.disabled
                        }
                    ).then(function (inst) {
                        _input = inst;
                        _input.onChange(function () {
                            updateValue();
                            invokeChange();
                        });
                    });
                }

                function init(success) {
                    var $mainWrapper = $('<div class="variable-input" />');

                    _$wrapper = $('<div />');
                    $mainWrapper.append(_$wrapper);

                    container.setContent($mainWrapper);

                    var listItems = [];

                    collections.foreach(initData.variations, function (variation) {
                        _variationsData[variation.name] = '';

                        listItems.push({
                            text: variation.title,
                            value: variation.name
                        });
                    });

                    if (initData.activeVariation) {
                        _currentVariation = initData.activeVariation;
                    } else {
                        _currentVariation = initData.variations[0].name;
                    }

                    var inputPromise = initInput(),
                        ddPromise = initSwitcher(listItems);

                    promise.all([inputPromise, ddPromise]).then(function () {
                        setValue(initData.value);

                        if (initData.readOnly) {
                            _$variablesListWrapper.hide();
                        }

                        success(control);
                    });
                }

                control.value = function (value) {
                    if (value !== undefined) {
                        setValue(value);
                    } else {
                        return getValue();
                    }
                };

                control.changeVariation = function (variationName) {
                    if (!_variationsData.hasOwnProperty(variationName)) {
                        return;
                    }

                    _ignoreChange = true;
                    _currentVariation = variationName;
                    _input.value(_variationsData[_currentVariation]);
                    _variationPicker.value(variationName);
                    _ignoreChange = false;
                };

                control.getCurrentVariation = function () {
                    return _currentVariation;
                };

                control.disabled = function (disabled) {
                    if (disabled !== undefined) {
                        initData.disabled = disabled;
                        setDisabled();
                    } else {
                        return initData.disabled;
                    }
                };

                control.readOnly = function (readOnly) {
                    if (readOnly !== undefined) {
                        initData.readOnly = readOnly;
                        setReadOnly();
                    } else {
                        return initData.readOnly;
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
        } as UI.IVariableInputFactory;
    }
]);
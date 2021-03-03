app.registerComponent('rangeNumericBox', 'UI', [
    '$',
    'Promise',
    'Services.defaultInputValidationHandler',
    'Services.eventsInitializer',
    'Services.apiService',
    'Services.containerHelper',
    'UI.numericBox',
    'UI.rangeSlider',
    function ($: JQueryStatic,
        promise: IPromise,
        defaultInputValidationHandler: Services.IDefaultInputValidationHandlerFactory,
        eventsInitializer: Services.Initialization.IEventsInitializer,
        apiService: Services.IApiService,
        containerHelper: Services.IContainerHelper,
        numericBox: UI.INumericBoxFactory,
        rangeSlider: UI.IRangeSliderFactory) {
        'use strict';

        return {
            init: function (container, initData) {
                var control = {} as UI.IRangeNumericBox,
                    _$wrapper: JQuery,
                    _$controlWrapper: JQuery,
                    _toNumericBox: UI.INumericBox,
                    _fromNumericBox: UI.INumericBox,
                    _slider: UI.IRangeSlider,
                    _validationHandler = defaultInputValidationHandler.init(control),
                    _events = eventsInitializer.init(control, ['onChange', 'onRemove']);

                function invokeChange() {
                    _events.onChange.invoke();
                }

                function setReadOnly(readOnly) {
                    _toNumericBox.disabled(readOnly);
                    _fromNumericBox.disabled(readOnly);
                }

                function setDisabled(disabled) {
                    _toNumericBox.disabled(disabled);
                    _fromNumericBox.disabled(disabled);
                }

                function setValue(value) {
                    if (!value) {
                        _fromNumericBox.value(null);
                        _toNumericBox.value(null);
                    } else {
                        _fromNumericBox.value(value.from);
                        _toNumericBox.value(value.to);
                    }
                }

                function getValue() {
                    return {
                        from: _fromNumericBox.value(),
                        to: _toNumericBox.value()
                    };
                }

                function initInputs() {
                    var promise1 = numericBox.init(containerHelper.appendTo(_$controlWrapper.find('.fromWrapper'), container.ready()), {
                        min: initData.from,
                        max: initData.to,
                        value: initData.value
                            ? initData.value.from
                            : initData.from,
                        nullable: !!initData.nullableFrom,
                        decimals: initData.decimals
                    }).then(function (control) {
                        _fromNumericBox = control;
                        _fromNumericBox.onChange(invokeChange);

                        return control;
                    });

                    var promise1 = numericBox.init(containerHelper.appendTo(_$controlWrapper.find('.toWrapper'), container.ready()), {
                        min: initData.from,
                        max: initData.to,
                        value: initData.value
                            ? initData.value.to
                            : initData.to,
                        nullable: !!initData.nullableTo,
                        decimals: initData.decimals
                    }).then(function (control) {
                        _toNumericBox = control;
                        _toNumericBox.onChange(invokeChange);

                        return control;
                    });

                    var promises: Promise<any>[] = [promise1, promise1];

                    if (initData.showSlider && !initData.nullableFrom && !initData.nullableTo) {
                        var promise3 = rangeSlider.init(containerHelper.appendTo(_$controlWrapper.find('.rangeSliderContainer'), container.ready()), {
                            from: initData.from,
                            to: initData.to,
                            value: initData.value
                        }).then(function (slider) {
                            _slider = slider;
                            slider.onChange(function () {
                                var val = slider.value();

                                _fromNumericBox.value(val ? val.from: initData.from);
                                _toNumericBox.value(val ? val.to : initData.to);
                                invokeChange();
                            });
                        });

                        promises.push(promise3);
                    }

                    return promise.all(promises);
                }

                function init(success) {
                    _$wrapper = $('<div class="range-numeric-box" />');
              
                    apiService.getTemplateHtml('rangeNumericBoxTemplate').then(function (html) {
                        _$controlWrapper = $(html);
                        _$wrapper.append(_$controlWrapper);

                        initInputs().then(function () {
                            setReadOnly(initData.readOnly);
                            setDisabled(initData.disabled);

                            if (_slider) {
                                _toNumericBox.onChange(function () {
                                    _slider.value(getValue());
                                });

                                _fromNumericBox.onChange(function () {
                                    _slider.value(getValue());
                                });
                            }

                            success(control);
                        });
                    });

                    container.setContent(_$wrapper);
                }

                control.value = function (value) {
                    if (value !== undefined) {
                        setValue(value);
                    } else {
                        return getValue();
                    }
                };

                control.disabled = function (disabled) {
                    if (disabled !== undefined) {
                        setDisabled(disabled);
                    } else {
                        return initData.disabled;
                    }
                };

                control.readOnly = function (readOnly) {
                    if (readOnly !== undefined) {
                        setReadOnly(readOnly);
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
        } as UI.IRangeNumericBoxFactory;
    }
]);
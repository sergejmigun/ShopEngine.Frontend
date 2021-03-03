app.registerComponent('finder', 'UI', [
    '$',
    'Promise',
    'Resources.UICore',
    'Services.defaultInputValidationHandler',
    'Services.eventsInitializer',
    'Utils.objects',
    'Collections',
    function ($: JQueryStatic,
        promise: IPromise,
        resources: Resources.UICore,
        defaultInputValidationHandler: Services.IDefaultInputValidationHandlerFactory,
        eventsInitializer: Services.Initialization.IEventsInitializer,
        objects: Utils.IObjects,
        collections: ICollections) {
        'use strict';

        return {
            init: function (container, initData) {
                var control = {} as UI.IFinder,
                    _$wrapper: JQuery,
                    _$controlWrapper: JQuery,
                    _$readOnlyLabel: JQuery,
                    _$control: JQuery,
                    _$clearInput: JQuery,
                    _valueData,
                    _validationHandler = defaultInputValidationHandler.init(control),
                    _events = eventsInitializer.init(control, ['onChange', 'onRemove']);

                function setUiDisabled() {
                    _$control.prop('disabled', initData.disabled);
                }

                function setReadOnlyText() {
                    _$readOnlyLabel.text(objects.isNullOrUndefined(_valueData)
                        ? initData.noValueText || resources.noValue
                        : _valueData[initData.textPropName]);
                }

                function invokeChange() {
                    setReadOnlyText();
                    _events.onChange.invoke();
                }

                function showReadOnly() {
                    _$controlWrapper.hide();
                    _$readOnlyLabel.css('display', 'inline-block');
                }

                function setReadOnly(readOnly) {
                    if (readOnly) {
                        showReadOnly();
                        initData.readOnly = true;
                    } else {
                        _$controlWrapper.show();
                        _$readOnlyLabel.hide();
                        initData.readOnly = false;
                    }
                }

                function updateUi() {
                    if (!_valueData) {
                        _$clearInput.hide();
                        _$wrapper.find('.select2-selection__rendered')
                            .html('').append($('<span class="select2-selection__placeholder"></span>').text(initData.placeholder));
                        _$control.val(null);
                    } else {
                        _$wrapper.find('.select2-selection__rendered').html(_valueData[initData.textPropName]);
                        _$clearInput.show();
                    }
                }

                function setValueData(valueData) {
                    _valueData = valueData;
                    updateUi();
                    invokeChange();
                }

                function setValue(value) {
                    if (!value && !_valueData) {
                        return promise.empty();
                    }

                    if (value === objects.tryGet(_valueData, initData.valuePropName)) {
                        return promise.empty();
                    }

                    if (!value) {
                        setValueData(null);

                        return promise.empty();
                    }

                    if (value !== objects.tryGet(_valueData, initData.valuePropName)) {
                        return initData.loadById(value).then(function (data) {
                            setValueData(data);
                        });
                    }
                }

                function filterResults(resultItems: any[]) {
                    if (!objects.isEmptyArray(initData.excludedItems)) {
                        collections.remove(resultItems, function (resultItem) {
                            return collections.from(initData.excludedItems).any(function (excludedItem) {
                                return excludedItem.toString() === resultItem[initData.valuePropName];
                            });
                        });
                    }

                    collections.foreach(resultItems, function (item) {
                        item.id = item[initData.valuePropName];
                        item.text = item[initData.textPropName];
                    });

                    return resultItems;
                }

                function init(success) {
                    _$wrapper = $('<div />');
                    _$controlWrapper = $('<div class="finder-wrapper"></div>');
                    _$clearInput = $('<i class="clear-input glyphicon glyphicon-remove"></i>').hide();
                    _$control = $('<select style="width: 100%;"></select>');
                    _$readOnlyLabel = $('<span class="form-property" />').hide();
                    _$controlWrapper.append(_$control).append(_$clearInput);
                    _$wrapper.append(_$controlWrapper).append(_$readOnlyLabel);
                    container.setContent(_$wrapper);

                    var select2Options = objects.createAndMap(initData, ['placeholder']);

                    if (initData.minLength) {
                        select2Options.minimumInputLength = initData.minLength;
                    }

                    select2Options.templateResult = function (arg) {
                        return arg.text;
                    };

                    select2Options.templateSelection = function (arg) {
                        if (arg.text) {
                            return arg.text;
                        }

                        return '<div>' + arg.text + '</div>';
                    };

                    select2Options.ajax = {
                        url: initData.url,
                        dataType: 'json',
                        delay: 250,
                        data: function (params) {
                            return {
                                query: params.term,
                                page: params.page
                            };
                        },
                        processResults: function (data, params) {
                            params.page = params.page || 1;

                            return {
                                results: filterResults(data.items),
                                pagination: {
                                    more: params.page * 30 < data.total
                                }
                            };
                        },
                        cache: initData.cache
                    };

                    _$control['select2'](select2Options);

                    _$control.on("select2:select", function (e: any) {
                        setValueData(e.params.data);
                    });

                    _$clearInput.click(function () {
                        if (initData.disabled) {
                            return;
                        }

                        setValue(null);
                    });

                    if (initData.readOnly) {
                        showReadOnly();
                    }

                    setValue(initData.value).then(function () {
                        if (initData.readOnly) {
                            setReadOnlyText();
                        }

                        success(control);
                    });

                    setUiDisabled();
                }

                control.getValueData = function () {
                    return objects.clone(_valueData);
                };

                control.value = function (value) {
                    if (value !== undefined) {
                        setValue(value);
                    } else {
                        return objects.tryGet(_valueData, initData.valuePropName);
                    }
                };

                control.disabled = function (disabled) {
                    if (disabled !== undefined) {
                        initData.disabled = disabled;
                        setUiDisabled();
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
                    _$control['select2']('destroy');
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
        } as UI.IFinderFactory;
    }
]);
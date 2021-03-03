app.registerComponent('autoCompleter', 'UI', [
    '$',
    'Promise',
    'Services',
    'Utils.objects',
    function ($, promise, services, objects) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {}, _$wrapper, _$controlWrapper, _$readOnlyLabel, _$control, _value, _initData = objects.clone(initData), _validationHandler = services.defaultInputValidationHandler.init(control), _events = services.eventsInitializer.init(control, ['onChange', 'onRemove']);
                function setUiDisabled() {
                    _$control.prop('disabled', _initData.disabled);
                }
                function setReadOnlyText() {
                    _$readOnlyLabel.text(control.value());
                }
                function invokeChange() {
                    setReadOnlyText();
                    _events.onChange.invoke();
                }
                function showReadOnly() {
                    _$controlWrapper.hide();
                    _$readOnlyLabel.show();
                }
                function setReadOnly(readOnly) {
                    if (readOnly) {
                        showReadOnly();
                        _initData.readOnly = true;
                    }
                    else {
                        _$controlWrapper.show();
                        _$readOnlyLabel.hide();
                        _initData.readOnly = false;
                    }
                }
                function setValue(value) {
                    if (value !== _value) {
                        _value = value;
                        _$control.val(_value);
                        invokeChange();
                    }
                }
                function init(success) {
                    _$wrapper = $('<div />');
                    _$controlWrapper = $('<div />');
                    _$control = $('<input type="text" class="form-control" />');
                    _$controlWrapper.append(_$control);
                    _$readOnlyLabel = $('<span />').hide();
                    _$wrapper.append(_$controlWrapper).append(_$readOnlyLabel);
                    container.setContent(_$wrapper);
                    if (initData.placeholder) {
                        _$control.attr('placeholder', initData.placeholder);
                    }
                    var typeheadOptions = objects.createAndMap(initData, ['minLength', {
                            items: 'maxItems'
                        }]);
                    typeheadOptions.source = function (query, process) {
                        services.apiService.get(initData.url + '?query=' + query).then(function (results) {
                            process(results);
                        });
                    };
                    _$control.typeahead(typeheadOptions);
                    _$control.change(function () {
                        _value = _$control.val();
                        invokeChange();
                    });
                    if (_initData.readOnly) {
                        showReadOnly();
                    }
                    setUiDisabled();
                    success(control);
                }
                control.value = function (value) {
                    if (value !== undefined) {
                        setValue(value);
                    }
                    else {
                        return _value;
                    }
                };
                control.disabled = function (disabled) {
                    if (disabled !== undefined) {
                        _initData.disabled = disabled;
                        setUiDisabled();
                    }
                    else {
                        return _initData.disabled;
                    }
                };
                control.readOnly = function (readOnly) {
                    if (readOnly !== undefined) {
                        setReadOnly(readOnly);
                    }
                    else {
                        return _initData.readOnly;
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
                    _$control.typeahead('destroy');
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

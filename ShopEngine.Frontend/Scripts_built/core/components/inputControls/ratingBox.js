app.registerComponent('ratingBox', 'UI', [
    '$',
    'Promise',
    'Services.defaultInputValidationHandler',
    'Services.eventsInitializer',
    'Utils.objects',
    function ($, promise, defaultInputValidationHandler, eventsInitializer, objects) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {}, _$wrapper, _$input, _validationHandler = defaultInputValidationHandler.init(control), _events = eventsInitializer.init(control, ['onChange', 'onRemove']);
                function setDisabled() {
                    _$input['rating']("refresh", {
                        disabled: true
                    });
                }
                function setReadOnly() {
                    _$input['rating']("refresh", {
                        displayOnly: true
                    });
                }
                function setValue(value) {
                    _$input['rating']("update", value);
                }
                function init(success) {
                    _$wrapper = $('<div class="rating-wrapper" />');
                    _$input = $('<input />').val(initData.value || 0);
                    _$wrapper.append(_$input);
                    container.setContent(_$wrapper);
                    var ratingOptions = {
                        showClear: false,
                        showCaption: false,
                        displayOnly: false
                    };
                    objects.map(initData, ratingOptions, [
                        'min',
                        'max',
                        'step',
                        'size'
                    ]);
                    if (initData.readOnly) {
                        ratingOptions.displayOnly = true;
                    }
                    _$input['rating'](ratingOptions);
                    success(control);
                }
                control.value = function (value) {
                    if (value !== undefined) {
                        setValue(value);
                    }
                    else {
                        return _$input.val();
                    }
                };
                control.disabled = function (disabled) {
                    if (disabled !== undefined) {
                        initData.disabled = disabled;
                        setDisabled();
                    }
                    else {
                        return initData.disabled;
                    }
                };
                control.readOnly = function (readOnly) {
                    if (readOnly !== undefined) {
                        initData.readOnly = readOnly;
                        setReadOnly();
                    }
                    else {
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
        };
    }
]);

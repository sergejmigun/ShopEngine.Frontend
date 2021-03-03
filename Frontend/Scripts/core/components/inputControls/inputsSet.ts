app.registerComponent('inputsSet', 'UI', [
    '$',
    'Promise',
    'Utils.objects',
    'Services.inputsSetValidationHandler',
    'Services.eventsInitializer',
    'Services.containerHelper',
    'Collections',
    function ($: JQueryStatic,
        promise: IPromise,
        objects: Utils.IObjects,
        inputsSetValidationHandler: Services.ValidationHandlers.IInputsSetValidationHandlerFactory,
        eventsInitializer: Services.Initialization.IEventsInitializer,
        containerHelper: Services.IContainerHelper,
        collections: ICollections) {
        'use strict';

        return {
            init: function (container, initData) {
                var control = {} as UI.IInputsSet,
                    _$wrapper: JQuery,
                    _controls: UI.IInputControl<any>[] = [],
                    _validationHandler: Services.ValidationHandlers.IInputsSetValidationHandler,
                    _events = eventsInitializer.init(control, ['onChange', 'onRemove']);

                function setDisabled(disabled) {
                    initData.disabled = disabled;
                    collections.foreach(_controls, function (controlInst) {
                        controlInst.disabled(disabled);
                    });
                }

                function setReadOnly(readOnly) {
                    initData.readOnly = readOnly;
                    collections.foreach(_controls, function (controlInst) {
                        controlInst.readOnly(readOnly);
                    });
                }

                function setValue(value) {
                    collections.foreach(_controls, function (control) {
                        var controlValue = null;

                        if (value && value[control.name]) {
                            controlValue = value[control.name];
                        }

                        control.value(controlValue);
                    });

                    _events.onChange.invoke();
                }

                function getValue() {
                    var value = initData.value
                        ? objects.clone(initData.value)
                        : {};

                    collections.foreach(_controls, function (control) {
                        if (!control.name) {
                            return;
                        }

                        value[control.name] = control.value();
                    });

                    return value;
                }

                function initControls() {
                    var initPromises: Promise<UI.IInputControl<any>>[] = [];
                    var $content = $(initData.template);

                    _$wrapper.append($content);

                    collections.foreach(initData.controlInitializators, function (controlInitializer, controlName) {
                        if (!controlInitializer) {
                            return;
                        }

                        var $input = $content.find('input[name="' + controlName + '"]');

                        if (!$input.length) {
                            return;
                        }

                        initPromises.push(controlInitializer.init(containerHelper.replace($input, container.ready()), {
                            value: objects.tryGet(initData.value, controlName),
                            name: controlName,
                            disabled: initData.disabled,
                            readOnly: initData.readOnly,
                        }));
                    });

                    return promise.all(initPromises);
                }

                function init(success) {
                    _$wrapper = $('<div />');
                    container.setContent(_$wrapper);

                    initControls().then(function (controls) {
                        _controls = controls;

                        collections.foreach(_controls, function (controlInst) {
                            controlInst.onChange(function () {
                                _events.onChange.invoke();
                            });
                        });

                        _validationHandler = inputsSetValidationHandler.init(control),

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

                control.getControl = function (name) {
                    return collections.from(_controls).first(function (control) {
                        return control.name === name;
                    });
                };

                control.getAllControls = function () {
                    return collections.clone(_controls);
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
                    collections.foreach(_controls, function (control) {
                        control.remove();
                    });

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
        } as UI.IInputsSetFactory;
    }
]);
app.registerComponent('form', 'UI', [
    'Promise',
    'Components',
    'Utils.objects',
    'Collections',
    'Services.containerHelper',
    'Services.controlValidation',
    'Services.errorHandler',
    'Services.controlsChangesDetector',
    'UI.loader',
    function (promise: IPromise,
        templates: ITemplates,
        objects: Utils.IObjects,
        collections: ICollections,
        containerHelper: Services.IContainerHelper,
        controlValidation: Services.IControlValidationFactory,
        errorHandler: Services.IErrorHandler,
        controlsChangesDetectorFactory: Services.IControlsChangesDetectorFactory,
        loader: UI.ILoaderFactory) {
        'use strict';

        return {
            init: function (initData) {
                var form = {} as UI.IForm,
                    _validation = controlValidation.init({
                        validateOnChange: true
                    }),
                    _loader: UI.ILoader,
                    _isReady = false,
                    _controlsChangesDetector = controlsChangesDetectorFactory.init(),
                    _controlsData = [] as { control: UI.IInputControl<any>, initialValue: any }[],
                    _controlPromises = [] as Promise<UI.IInputControl<any>>[],
                    _templatesData = [] as Components.IFormTemplate<any, any>[],
                    _templatePromises = [] as Promise<Components.IFormTemplate<any, any>>[],
                    _serializationData = [];

                function removeSerialization(name) {
                    collections.remove(_serializationData, function (serializationDataItem) {
                        return serializationDataItem.propName === name;
                    });
                }

                function findControlByModelProperty(model, controlName) {
                    return collections.from(_serializationData).where(function (item) {
                        return item.modelProperty === model && item.control.name === controlName;
                    }).select(function (item) {
                        return item.control;
                    }).first();
                }

                function displayControlServerErrorInner(control, message) {
                    var error = {
                        message: message
                    };

                    control.displayError(error);
                    control.onChange(function () {
                        control.clearError(error);
                    });
                }

                function displayControlServerError(control, objectsPath, message) {
                    function processInputsSet() {
                        if (!objectsPath || !objectsPath.childObjectPath) {
                            displayControlServerErrorInner(control, message);
                        } else {
                            control = control.getControl(objectsPath.childObjectPath.name);
                            displayControlServerError(control, objectsPath.childObjectPath, message);
                        }
                    }

                    function processInputsList() {
                        if (!objectsPath || objectsPath.index === undefined) {
                            displayControlServerErrorInner(control, message);
                        } else {
                            control = control.getControl(objectsPath.index);

                            if (objectsPath.childObjectPath) {
                                processInputsSet();
                            } else {
                                displayControlServerError(control, objectsPath.childObjectPath, message);
                            }
                        }
                    }

                    if (control.type === 'inputsList') {
                        processInputsList();
                    } else if (control.type === 'inputsSet') {
                        processInputsSet();
                    } else {
                        displayControlServerErrorInner(control, message);
                    }
                }

                function displayServerError(objectsPath, model, message) {
                    if (!objectsPath || !model.hasOwnProperty(objectsPath.name)) {
                        return;
                    }

                    var control = findControlByModelProperty(model, objectsPath.name),
                        modelProperty = model[objectsPath.name];

                    if (!control) {
                        if (objectsPath.index !== undefined) {
                            modelProperty = modelProperty[objectsPath.index];
                        }

                        displayServerError(objectsPath.childObjectPath, modelProperty, message);
                    } else {
                        displayControlServerError(control, objectsPath, message);
                    }
                }

                function displayServerErrors(errors, submitModel) {
                    collections.safeForeach(errors, function (message, path) {
                        var objectsPath = objects.parseObjectsPath(path);

                        displayServerError(objectsPath, submitModel, message);
                    });
                }

                function clearAllErrors() {
                    collections.foreach(_controlsData, function (obj) {
                        obj.control.clearAllErrors();
                    });
                }

                function getCustomSerializationInitFunc<T, TControl extends UI.IInputControl<T>>(controlPromise: Promise<TControl>) {
                    return function (serializationRule: UI.IFormSerializationRule<T>): UI.IFormInitControlResult2<T, TControl> {
                        controlPromise.then(function (control) {
                            removeSerialization(control.name);

                            _serializationData.push({
                                propName: control.name,
                                getValueFunc: function () {
                                    return serializationRule(control.value());
                                }
                            });
                        });

                        return {
                            withValidation: getValidationInitFunc(controlPromise)
                        };
                    };
                }

                function getValidationInitFunc<T, TControl extends UI.IInputControl<T>>(controlPromise: Promise<TControl>) {
                    return function (validatorName: string, validator: Services.IControlValidationFunc<T, TControl>): UI.IFormInitControlResult2<T, TControl> {
                        controlPromise.then(function (control) {
                            _validation.add(control, validatorName, validator);

                            control.onRemove(function () {
                                _validation.clearValidation(control);
                            });
                        });

                        return {
                            withValidation: getValidationInitFunc(controlPromise)
                        };
                    };
                }

                function getComponentContainer(cssSelectorOrContainer) {
                    var container = cssSelectorOrContainer;

                    if (objects.isString(cssSelectorOrContainer)) {
                        container = containerHelper.replace(initData.container.find('.' + cssSelectorOrContainer), initData.containerReady);
                    }

                    return container as IContainer;
                }

                function serializeValue(submitModel, propName, value) {
                    if (propName) {
                        objects.setValue(submitModel, propName, value);
                    } else if (value) {
                        objects.extend(value, submitModel, true);
                    }
                }

                form.initSubmissionModelProperty = function (propName, value) {
                    _serializationData.push({
                        propName: propName,
                        getValueFunc: function () {
                            if (objects.isFunction(value)) {
                                return value();
                            }

                            return value;
                        }
                    });
                };

                form.initControl = function (cssSelectorOrContainer, controlInitializer) {
                    var controlPromise = controlInitializer.init(getComponentContainer(cssSelectorOrContainer)).then(function (control) {
                        if (control.name) {
                            _serializationData.push({
                                controlName: control.name,
                                propName: control.name,
                                getValueFunc: function () {
                                    return control.value();
                                }
                            });

                            control.onRemove(function () {
                                removeSerialization(control.name);
                            });
                        }

                        var controlValue = control.value();

                        _controlsData.push({
                            control: control,
                            initialValue: controlValue === undefined
                                ? null
                                : controlValue
                        });

                        return control;
                    });

                    return form.registerControl(controlPromise);
                };

                form.registerControl = function (controlPromise) {
                    _controlPromises.push(controlPromise);

                    return {
                        withCustomSerialization: getCustomSerializationInitFunc(controlPromise),
                        withValidation: getValidationInitFunc(controlPromise)
                    };
                };

                form.initFormTemplate = function (cssSelectorOrContainer, propName, templateData) {
                    var templatePromise = templates.init(templateData, getComponentContainer(cssSelectorOrContainer)).then(function (formTemplate) {
                        removeSerialization(propName);

                        _serializationData.push({
                            propName: propName,
                            getValueFunc: function () {
                                return formTemplate.serialize();
                            }
                        });

                        _templatesData.push(formTemplate);

                        formTemplate.onRemove(() => {
                            removeSerialization(propName);
                            collections.remove(_templatePromises, templatePromise);
                            collections.remove(_templatesData, formTemplate);
                        });

                        return formTemplate;
                    });

                    _templatePromises.push(templatePromise);
                };

                form.ready = function () {
                    if (_isReady) {
                        throw 'form has been initialized already';
                    }

                    promise.all(_controlPromises).then(function (controls) {
                        collections.foreach(controls, function (control) {
                            _controlsChangesDetector.addControl(control);
                        });
                    });

                    return promise.all(_controlPromises.concat(_templatePromises as Promise<any>[])).then(function () {
                        _isReady = true;
                    });    
                };

                form.clearValidation = function (control) {
                    _validation.clearValidation(control);
                };

                form.validate = function () {
                    return promise.create(function (success, error) {
                        promise.all(_templatePromises).then(function (templates) {
                            var innerTemplateValidationPromises = collections.from(templates).select(function (template) {
                                return template.validate();
                            }).toArray();

                            _validation.validate().then(function (errors) {
                                if (errors.length) {
                                    error(errors);
                                } else {
                                    promise.all(innerTemplateValidationPromises).then(function () {
                                        success();
                                    });
                                }
                            });
                        });
                    });
                };

                form.validateControl = function (control, targetValidatorNames) {
                    return _validation.validateControl(control, targetValidatorNames);
                };

                form.submit = function (submitAction) {
                    if (!_isReady) {
                        throw 'form is not ready';
                    }

                    return promise.create(function (success, error) {
                        form.validate().then(function () {
                            clearAllErrors();
                            _loader.show();

                            var submitModel = form.serialize();

                            submitAction(submitModel).then(function (response) {
                                _loader.hide();
                                _controlsChangesDetector.update();
                                success(response);
                            }, function (response) {
                                _loader.hide();

                                if (!objects.isEmptyArray(objects.tryGet(response.responseJSON, 'ValidationErrors'))) {
                                    displayServerErrors(response.responseJSON.ValidationErrors, submitModel);
                                    response.handled = true;
                                } else {
                                    errorHandler.handle(response);
                                }

                                error(response);
                            });
                        });
                    });
                };

                form.reset = function () {
                    collections.foreach(_controlsData, function (obj) {
                        obj.control.value(obj.initialValue);
                    });

                    collections.foreach(_templatesData, function (template) {
                        template.reset();
                    });
                };

                form.serialize = function () {
                    if (!_isReady) {
                        throw 'form is not ready';
                    }

                    var submitModel = {};

                    collections.foreach(_serializationData, function (serializationDataItem) {
                        serializeValue(submitModel, serializationDataItem.propName, serializationDataItem.getValueFunc());
                    });

                    return submitModel;
                };

                form.hasUnsubmittedChanges = function () {
                    return _controlsChangesDetector.hasChanges();
                };

                function init(success) {
                    if (initData.loader) {
                        _loader = initData.loader;
                    } else if (initData.container) {
                        loader.initOverlay(initData.container).then(function (inst) {
                            _loader = inst;
                        });
                    }

                    success(form);
                }

                return promise.create(function (success) {
                    init(success);
                });
            }
        } as UI.IFormFactory;
    }
]);
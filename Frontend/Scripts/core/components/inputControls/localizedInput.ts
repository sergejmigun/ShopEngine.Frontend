app.registerComponent('localizedInput', 'UI', [
    '$',
    'Promise',
    'Utils.objects',
    'Collections',
    'Shared',
    'Services.containerHelper',
    'UI.variableInput',
    'Services.localizationManagementService',
    function ($: JQueryStatic,
        promise: IPromise,
        objects: Utils.IObjects,
        collections: ICollections,
        shared,
        containerHelper: Services.IContainerHelper,
        variableInput: UI.IVariableInputFactory,
        localizationManagementService: Settings.Services.ILocalizationManagementService) {
        'use strict';

        return {
            init: function (container, initData) {
                var control = {} as UI.ILocalizedInput,
                    _languages = [],
                    _variableInput: UI.IVariableInput;

                function getLocalizedInputValue() {
                    var value = _variableInput.value();

                    if (!value) {
                        return null;
                    }

                    var items = collections.fromObject<any>(value).select(function (variableItem) {
                        return {
                            value: variableItem.value,
                            language: variableItem.name
                        };
                    }).toArray();

                    return {
                        items: items
                    };
                }

                function getVariableInputValue(value: UI.ILocalizedValue) {
                    if (!value) {
                        return null;
                    }

                    var valueObj = {};

                    collections.foreach(_languages, function (localizedItem) {
                        var localizedValueItem = collections.from(value.items).where(function (valueItem) {
                            return valueItem.language === localizedItem.name;
                        }).select(function (valueItem) {
                            return valueItem.value;
                        }).first();

                        valueObj[localizedItem.name] = localizedValueItem === undefined
                            ? null
                            : localizedValueItem;
                    });

                    return valueObj;
                }

                function getVariableInputOptions() {
                    var variableInputOptions = objects.createAndMap(initData, ['name', 'readOnly', 'disabled']);

                    variableInputOptions.variations = objects.clone(_languages);
                    variableInputOptions.controlInitializer = initData.controlInitializer;
                    variableInputOptions.value = getVariableInputValue(initData.value);
                    variableInputOptions.readOnly = initData.readOnly;
                    
                    return variableInputOptions;
                }

                function init(success) {
                    if (!initData.type) {
                        initData.type = 'singleLineText';
                    }

                    var $input = $('<input type="hidden" />');

                    localizationManagementService.findLanguages({}).then(function (languages) {
                        collections.foreach(languages.items as any[], function (lang) {
                            _languages.push({
                                name: lang.shortName,
                                title: lang.shortName
                            });
                        });

                        container.setContent($input);

                        variableInput.init(containerHelper.replace($input, container.ready()), getVariableInputOptions()).then(function (variableInput) {
                            _variableInput = variableInput;

                            shared.globalEvents.toggleLanguage(function (lang) {
                                _variableInput.changeVariation(lang);
                            });

                            success(control);
                        });
                    });
                }

                control.value = function (value) {
                    if (value === undefined) {
                        return getLocalizedInputValue();
                    }

                    _variableInput.value(getVariableInputValue(value));
                };

                control.disabled = function (disabled) {
                    return _variableInput.disabled(disabled);
                };

                control.readOnly = function (readOnly) {
                    return _variableInput.readOnly(readOnly);
                };

                control.onChange = function (handler) {
                    _variableInput.onChange(handler);
                };

                control.onRemove = function (handler) {
                    _variableInput.onRemove(handler);
                };

                control.changeLanguage = function (language) {
                    _variableInput.changeVariation(language);
                };

                control.displayError = function (error: any) {
                    var invalidLanguages = error.data as string[];

                    if (!objects.isEmptyArray(invalidLanguages)) {
                        var currentVariation = _variableInput.getCurrentVariation();

                        var currentLanguageIsInvalid = collections.from(invalidLanguages).any(function (language) {
                            return currentVariation === language;
                        });

                        if (!currentLanguageIsInvalid) {
                            _variableInput.changeVariation(invalidLanguages[0]);
                        }
                    }

                    _variableInput.displayError(error);
                };

                control.getAllErrors = function () {
                    return _variableInput.getAllErrors();
                };

                control.clearError = function (errorName) {
                    _variableInput.clearError(errorName);
                };

                control.clearAllErrors = function () {
                    _variableInput.clearAllErrors();
                };

                control.remove = function () {
                    _variableInput.remove();
                };

                control.getJQueryObject = function () {
                    return _variableInput.getJQueryObject();
                };

                return promise.create(function (success) {
                    init(success);
                });
            }
        } as UI.ILocalizedInputFactory;
    }
]);
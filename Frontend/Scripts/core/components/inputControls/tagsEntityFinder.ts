app.registerComponent('tagsEntityFinder', 'UI', [
    '$',
    'Promise',
    'Utils.objects',
    'Services.defaultInputValidationHandler',
    'Services.eventsInitializer',
    'Services.componentInitializationHelper',
    'Services.containerHelper',
    'UI.finder',
    'UI.tagsInput',
    'Collections',
    function ($: JQueryStatic,
        promise: IPromise,
        objects: Utils.IObjects,
        defaultInputValidationHandler: Services.IDefaultInputValidationHandlerFactory,
        eventsInitializer: Services.Initialization.IEventsInitializer,
        componentInitializationHelper: Services.Initialization.IComponentInitializationHelper,
        containerHelper: Services.IContainerHelper,
        finder: UI.IFinderFactory,
        tagsInput: UI.ITagsInputFactory,
        collections: ICollections) {
        'use strict';

        return {
            init: function (container, initData) {
                var control = {} as UI.ITagsEntityFinder,
                    _$wrapper = $('<div class="tags-entity-finder" />'),
                    _$finderInput: JQuery,
                    _$tagsContainer: JQuery,
                    _tags: UI.ITagsInput,
                    _validationHandler = defaultInputValidationHandler.init(control),
                    _events = eventsInitializer.init(control, ['onChange', 'onRemove']);

                function loadStoredData(ids) {
                    if (objects.isEmptyArray(ids)) {
                        return promise.empty();
                    }

                    return initData.loadByIds(ids).then(function (entities) {
                        _tags.value(collections.from(entities).select(function (entity) {
                            return {
                                tagName: objects.tryGet<string>(entity, initData.textPropName),
                                data: objects.tryGet(entity, initData.valuePropName)
                            };
                        }).toArray());
                    });
                }

                function initTags() {
                    var tagsData = {
                        value: [],
                        controlInitializer: componentInitializationHelper.forInputControl(finder, {
                            url: initData.finderUrl,
                            placeholder: initData.finderPlaceholder,
                            textPropName: initData.textPropName,
                            valuePropName: initData.valuePropName
                        }),
                        valueFormatter: function (control: UI.IFinder) {
                            return {
                                tagName: objects.tryGet(control.getValueData(), initData.textPropName),
                                data: control.value()
                            };
                        },
                        inputWrapperCss: 'w-300',
                        readOnly: initData.readOnly,
                        disabled: initData.disabled
                    } as UI.ITagsInputInitData;

                    return tagsInput.init(containerHelper.appendTo(_$tagsContainer, container.ready()), tagsData).then(function (inst) {
                        _tags = inst;
                        _tags.onChange(function () {
                            _events.onChange.invoke();
                        });

                        return _tags;
                    });
                }

                function init(success) {
                    _$finderInput = $('<input type="hidden" />');
                    _$tagsContainer = $('<div />');

                    _$wrapper.append(_$tagsContainer);
                    _$wrapper.append(_$finderInput.wrap('<div />').parent());

                    container.setContent(_$wrapper);

                    var promises = [initTags()];

                    promise.all(promises).then(function () {
                        loadStoredData(initData.value).then(function () {
                            success(control);
                        });
                    });
                }

                control.value = function (value) {
                    if (value !== undefined) {
                        loadStoredData(value);
                    } else {
                        return collections.from(_tags.value()).select(function (tag) {
                            return tag.data;
                        }).toArray();
                    }
                };

                control.disabled = function (disabled) {
                    if (disabled !== undefined) {
                        initData.disabled = disabled;
                    } else {
                        return initData.disabled;
                    }
                };

                control.readOnly = function (readOnly) {
                    if (readOnly !== undefined) {
                        initData.readOnly = readOnly;
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
        } as UI.ITagsEntityFinderFactory;
    }
]);
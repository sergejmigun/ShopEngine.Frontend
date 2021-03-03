app.registerComponent('tagsInput', 'UI', [
    '$',
    'Promise',
    'Utils.objects',
    'Services.containerHelper',
    'Services.defaultInputValidationHandler',
    'Services.eventsInitializer',
    'Collections',
    function ($, promise, objects, containerHelper, defaultInputValidationHandler, eventsInitializer, collections) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {}, _$wrapper, _$tagsWrapper, _$inputwrapper, _inputControl, _tagsData = [], _validationHandler = defaultInputValidationHandler.init(control), _events = eventsInitializer.init(control, ['onChange', 'onRemove']);
                function invokeChange() {
                    _events.onChange.invoke();
                }
                function setReadOnlyOrDisabled() {
                    collections.foreach(_tagsData, function (tagData) {
                        tagData.removeButton.hide();
                    });
                }
                function setEditableOrEnabled() {
                    collections.foreach(_tagsData, function (tagData) {
                        tagData.removeButton.show();
                    });
                }
                function setDisabled() {
                    if (initData.disabled) {
                        setReadOnlyOrDisabled();
                        _inputControl.disabled(true);
                    }
                    else {
                        setEditableOrEnabled();
                        _inputControl.disabled(false);
                    }
                }
                function setReadOnly() {
                    if (initData.readOnly) {
                        setReadOnlyOrDisabled();
                        _$inputwrapper.hide();
                    }
                    else {
                        setEditableOrEnabled();
                        _$inputwrapper.show();
                    }
                }
                function initTag(targetTagData) {
                    if (!targetTagData.tagName) {
                        return;
                    }
                    var tagExists = collections.from(_tagsData).any(function (tagData) {
                        return tagData.tagName === targetTagData.tagName;
                    });
                    if (tagExists) {
                        return;
                    }
                    var tagData = {}, $tagWrapper = $('<div class="tag-wrapper" />'), $removeButton = $('<i class="glyphicon glyphicon-remove-circle tag-remove-button"></i>');
                    if (initData.readOnly || initData.disabled) {
                        $removeButton.hide();
                    }
                    tagData.tagWrapper = $tagWrapper;
                    tagData.removeButton = $removeButton;
                    tagData.data = targetTagData.data;
                    tagData.tagName = targetTagData.tagName;
                    $tagWrapper.append($('<span class="tag-name" />').text(tagData.tagName));
                    $tagWrapper.append($removeButton);
                    $removeButton.click(function () {
                        collections.remove(_tagsData, tagData);
                        $tagWrapper.remove();
                        invokeChange();
                    });
                    _tagsData.push(tagData);
                    _$tagsWrapper.append($tagWrapper);
                }
                function initTags(tagsData) {
                    if (objects.isEmptyArray(tagsData)) {
                        return;
                    }
                    collections.foreach(tagsData, function (tagData) {
                        initTag(tagData);
                    });
                }
                function initInput() {
                    return initData.controlInitializer.init(containerHelper.appendTo(_$inputwrapper, container.ready()))
                        .then(function (inst) {
                        _inputControl = inst;
                        _inputControl.onChange(function () {
                            var value = _inputControl.value();
                            if (initData.validate && !initData.validate(value)) {
                                _inputControl.value(null);
                                return;
                            }
                            if (value) {
                                if (initData.valueFormatter) {
                                    initTag(initData.valueFormatter(inst));
                                }
                                else {
                                    initTag({
                                        tagName: value,
                                        data: value
                                    });
                                }
                            }
                            _inputControl.value(null);
                            invokeChange();
                        });
                        return inst;
                    });
                }
                function setValue(newValue) {
                    collections.foreach(_tagsData, function (tagData) {
                        tagData.tagWrapper.remove();
                    });
                    collections.removeAll(_tagsData);
                    if (newValue && newValue.length) {
                        initTags(newValue);
                    }
                    invokeChange();
                }
                function getValue() {
                    return collections.from(_tagsData).select(function (tagData) {
                        return objects.createAndMap(tagData, ['tagName', 'data']);
                    }).toArray();
                }
                function init(success) {
                    _$wrapper = $('<div class="tags-input-wrapper" />');
                    _$tagsWrapper = $('<div class="tags-wrapper" />');
                    _$inputwrapper = $('<div class="tags-input" />');
                    if (initData.inputWrapperCss) {
                        _$inputwrapper.addClass(initData.inputWrapperCss);
                    }
                    _$wrapper.append(_$tagsWrapper)
                        .append(_$inputwrapper)
                        .append('<div class="clear" />');
                    container.setContent(_$wrapper);
                    initInput().then(function () {
                        initTags(initData.value);
                        setReadOnly();
                        setDisabled();
                        success(control);
                    });
                }
                control.value = function (value) {
                    if (value !== undefined) {
                        setValue(value);
                    }
                    else {
                        return getValue();
                    }
                };
                control.append = function (item) {
                    initTag(item);
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
                    _inputControl.remove();
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

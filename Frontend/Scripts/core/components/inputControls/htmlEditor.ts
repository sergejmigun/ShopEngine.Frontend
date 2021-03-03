app.registerComponent('htmlEditor', 'UI', [
    '$',
    'Promise',
    'Services.defaultInputValidationHandler',
    'Services.eventsInitializer',
    'Utils.objects',
    function ($: JQueryStatic,
        promise: IPromise,
        defaultInputValidationHandler: Services.IDefaultInputValidationHandlerFactory,
        eventsInitializer: Services.Initialization.IEventsInitializer,
        objects: Utils.IObjects) {
        'use strict';

        return {
            init: function (container, initData) {
                var control = {} as UI.IHtmlEditor,
                    _$wrapper: JQuery,
                    _$controlWrapper: JQuery,
                    _$readOnlyArea: JQuery,
                    _$control: JQuery,
                    _tinyMceEditor,
                    _tinyMceEditorId,
                    _readOnly: boolean,
                    _disabled: boolean,
                    _toolbar = 'insertfile undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist | forecolor backcolor',
                    _validationHandler = defaultInputValidationHandler.init(control),
                    _events = eventsInitializer.init(control, ['onChange', 'onRemove']);

                function invokeChange() {
                    _$readOnlyArea.html(control.value());
                    _events.onChange.invoke();
                }

                function setReadOnly(readOnly) {
                    _readOnly = readOnly;

                    if (_readOnly) {
                        _$controlWrapper.hide();
                        _$readOnlyArea.show();
                    } else {
                        _$controlWrapper.show();
                        _$readOnlyArea.hide();
                    }
                }

                function setDisabled(disabled) {
                    _disabled = disabled;
                    _tinyMceEditor.destroy();
                    initTinyMce();
                }

                function setValue(value) {
                    if (objects.isNullOrUndefined(value)) {
                        value = '';
                    }

                    if (value !== control.value()) {
                        invokeChange();
                        _tinyMceEditor.setContent(value);
                    }
                }

                function initTinyMce() {
                    return promise.create(function (success) {
                        window['tinyMCE'].init({
                            theme: "modern",
                            mode: 'exact',
                            plugins: [
                                'advlist autolink lists link image charmap print preview hr anchor pagebreak',
                                'searchreplace wordcount visualblocks visualchars code fullscreen',
                                'insertdatetime media nonbreaking save table contextmenu directionality',
                                'emoticons template paste textcolor colorpicker textpattern imagetools'
                            ],
                            toolbar1: _toolbar,
                            image_advtab: true,
                            templates: [],
                            theme_advanced_toolbar_location: "top",
                            theme_advanced_toolbar_align: "left",
                            theme_advanced_statusbar_location: "bottom",
                            theme_advanced_resizing: true,
                            width: '100%',
                            elements: _tinyMceEditorId,
                            oninit: function () {
                                _tinyMceEditor = window['tinyMCE'].get(_tinyMceEditorId);
                                success();
                            },
                            setup: function (editor) {
                                editor.on('change', function () {
                                    invokeChange();
                                });
                            },
                            readonly: initData.disabled
                                ? 1
                                : 0
                        });
                    });
                }

                function init(success) {
                    _$wrapper = $('<div />');
                    _$controlWrapper = $('<div />').hide();
                    _$readOnlyArea = $('<div class="mce-content-body" />').hide();
                    _$control = $('<textarea></textarea>');

                    container.setContent(_$wrapper);
                    _$wrapper.append(_$readOnlyArea);
                    _$readOnlyArea.html(initData.value);

                    setReadOnly(initData.readOnly);

                    container.ready().then(function () {
                        _$controlWrapper.append(_$control);
                        _$wrapper.append(_$controlWrapper);
                        _tinyMceEditorId = 'TinyMce_' + Date.now();
                        _$control.attr('id', _tinyMceEditorId);
                        _$control.val(initData.value);
                        initTinyMce().then(function () {
                            success(control);
                        });
                    });
                }

                control.value = function (value) {
                    if (value !== undefined) {
                        setValue(value);
                    } else {
                        return _tinyMceEditor.getContent();
                    }
                };

                control.disabled = function (disabled) {
                    if (disabled !== undefined) {
                        setDisabled(disabled);
                    } else {
                        return _disabled;
                    }
                };

                control.readOnly = function (readOnly) {
                    if (readOnly !== undefined) {
                        setReadOnly(readOnly);
                    } else {
                        return _readOnly;
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
                    _tinyMceEditor.destroy();
                    _$control.remove();
                    _events.onRemove.invoke();
                };

                control.getJQueryObject = function () {
                    return _$wrapper;
                };

                return promise.create(function (success) {
                    init(success);
                });
            }
        } as UI.IHtmlEditorFactory;
    }
]);
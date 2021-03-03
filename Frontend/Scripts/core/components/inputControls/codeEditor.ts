app.registerComponent('codeEditor', 'UI', [
    '$',
    'Promise',
    'Services.defaultInputValidationHandler',
    'Services.eventsInitializer',
    function ($: JQueryStatic,
        promise: IPromise,
        defaultInputValidationHandler: Services.IDefaultInputValidationHandlerFactory,
        eventsInitializer: Services.Initialization.IEventsInitializer) {
        'use strict';

        return {
            init: function (container, initData) {
                var control = {} as UI.ICodeEditor,
                    _$control: JQuery,
                    _codeMirrorMode: string,
                    _codeMirrorEditor,
                    _validationHandler = defaultInputValidationHandler.init(control),
                    _events = eventsInitializer.init(control, ['onChange', 'onRemove']);

                function setRedOnlyAndDisabled() {
                    if (initData.readOnly || initData.disabled) {
                        _codeMirrorEditor.setOption("readOnly", initData.disabled
                            ? "nocursor"
                            : true);
                    } else {
                        _codeMirrorEditor.setOption("readOnly", false);
                    }
                }

                function setValue(value) {
                    _codeMirrorEditor.setValue(value);
                }

                function init(success) {
                    _$control = $('<textarea  class="form-control" rows="5" />');

                    if (initData.value) {
                        _$control.val(initData.value);
                    }

                    container.setContent(_$control);

                    switch (initData.mode) {
                        case 'js':
                            _codeMirrorMode = 'text/javascript';
                            break;
                        case 'css':
                            _codeMirrorMode = 'text/css';
                            break;
                        case 'html':
                            _codeMirrorMode = 'text/html';
                            break;
                        case 'xml':
                            _codeMirrorMode = 'text/xml';
                            break;
                    }

                    var codeMirrorOptions = {
                        lineNumbers: true,
                        mode: _codeMirrorMode
                    };

                    _codeMirrorEditor = window['CodeMirror'].fromTextArea(_$control[0], codeMirrorOptions);

                    setRedOnlyAndDisabled();

                    _codeMirrorEditor.on("change", function () {
                        _events.onChange.invoke();
                    });

                    success(control);
                }

                control.value = function (value) {
                    if (value !== undefined) {
                        setValue(value);
                    } else {
                        return _codeMirrorEditor.getValue();
                    }
                };

                control.disabled = function (disabled) {
                    if (disabled !== undefined) {
                        initData.disabled = disabled;
                        setRedOnlyAndDisabled();
                    } else {
                        return initData.disabled;
                    }
                };

                control.readOnly = function (readOnly) {
                    if (readOnly !== undefined) {
                        initData.readOnly = readOnly;
                        setRedOnlyAndDisabled();
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
                    _$control.next().remove();
                    _$control.remove();
                    _events.onRemove.invoke();
                };

                control.getJQueryObject = function () {
                    return _$control;
                };

                return promise.create(function (success) {
                    init(success);
                });
            },
        } as UI.ICodeEditorFactory;
    }]);
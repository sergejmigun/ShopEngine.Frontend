app.registerComponent('fileUploader', 'UI', [
    '$',
    'Promise',
    'Services.defaultInputValidationHandler',
    'Services.eventsInitializer',
    'Services.containerHelper',
    'Utils.objects',
    'Utils.urls',
    'Collections',
    'UI.filesViewer',
    'Resources.UICore',
    function ($: JQueryStatic,
        promise: IPromise,
        defaultInputValidationHandler: Services.IDefaultInputValidationHandlerFactory,
        eventsInitializer: Services.Initialization.IEventsInitializer,
        containerHelper: Services.IContainerHelper,
        objects: Utils.IObjects,
        urls: Utils.IUrls,
        collections: ICollections,
        filesViewer: UI.IFilesViewerFactory,
        resources: Resources.UICore) {
        'use strict';

        return {
            init: function (container, initData) {
                var _$wrapper: JQuery,
                    _$uploadButton: JQuery,
                    _$currentFileName: JQuery,
                    _$progressBar: JQuery,
                    _$progressBarInner: JQuery,
                    _filesViewer: UI.IFilesViewer,
                    _files = [] as UI.IFileData[];

                var _events = {
                    onChange: eventsInitializer.initVoidEvent(),
                    onRemove: eventsInitializer.initVoidEvent(),
                    onStart: eventsInitializer.initEvent<any>(),
                    onDone: eventsInitializer.initEvent<any>(),
                    onFail: eventsInitializer.initEvent<any>(),
                    onProgress: eventsInitializer.initEvent<number>()
                };

                var _control: UI.IFileUploader = {
                    onChange: _events.onChange.event,
                    onRemove: _events.onRemove.event,
                    onStart: _events.onStart.event,
                    onDone: _events.onDone.event,
                    onFail: _events.onFail.event,
                    onProgress: _events.onProgress.event,
                    value: function (value) {
                        if (value !== undefined) {
                            setValue(value);
                        } else {
                            return objects.clone(_files);
                        }
                    },
                    disabled: function (disabled) {
                        if (disabled !== undefined) {
                            setDisabled(disabled);
                        } else {
                            return initData.disabled;
                        }
                    },
                    readOnly: function (readOnly) {
                        if (readOnly !== undefined) {
                            setReadOnly(readOnly);
                        } else {
                            return initData.readOnly;
                        }
                    },
                    displayError: function (error) {
                        _validationHandler.displayError(error);
                    },
                    getAllErrors: function () {
                        return _validationHandler.getAllErrors();
                    },
                    clearError: function (errorName) {
                        _validationHandler.clearError(errorName);
                    },
                    clearAllErrors: function () {
                        _validationHandler.clearAllErrors();
                    },
                    remove: function () {
                        _$wrapper.remove();
                        _events.onRemove.invoke();
                    },
                    getJQueryObject: function () {
                        return _$wrapper;
                    },
                    removeFile: function (fileName) {
                        var file = collections.from(_files).where(function (fileItem) {
                            return fileItem.fileName === fileName;
                        }).first();

                        if (file) {
                            collections.remove(_files, file);

                            if (_filesViewer) {
                                _filesViewer.removeFile(file);
                            }

                            invokeChange();
                        }
                    }
                };

                var _validationHandler = defaultInputValidationHandler.init(_control);

                function initFilesViewer($container) {
                    var filesViewerOptions = {
                        defaultAction: 'download',
                        files: initData.value,
                        filesViewMode: 'mode',
                        downloadAction: function (file) {
                            urls.navigate(file.downloadUrl);
                        },
                        deleteAction: function (file) {
                            _control.removeFile(file.fileName);
                        }
                    };

                    return filesViewer.init(containerHelper.appendTo($container, container.ready()), filesViewerOptions).then(function (filesViewer) {
                        _filesViewer = filesViewer;

                        return filesViewer;
                    });
                }

                function get$uploadInput() {
                    return _$wrapper.find('input[type=file]');
                }

                function setDisabled(disabled) {
                    if (initData.disabled === disabled) {
                        return;
                    }

                    initData.disabled = disabled;
                    _$uploadButton.prop('disabled', disabled);
                    get$uploadInput().prop('disabled', disabled);

                }

                function setReadOnly(readOnly) {
                    initData.readOnly = readOnly;

                    if (readOnly) {
                        _$uploadButton.hide();
                        _$currentFileName.hide();

                        if (_filesViewer) {
                            _filesViewer.disableAction('deleteAction');
                        }
                    } else {
                        _$uploadButton.show();
                        _$currentFileName.show();

                        if (_filesViewer) {
                            _filesViewer.enableAction('deleteAction');
                        }
                    }
                }

                function checkMaxUploads() {
                    if (initData.maxUploads && _files.length >= initData.maxUploads) {
                        _$uploadButton.hide();
                    } else {
                        _$uploadButton.show();
                    }
                }

                function invokeChange() {
                    checkMaxUploads();
                    _events.onChange.invoke();
                }

                function setFilesOnView(files) {
                    if (_filesViewer) {
                        _filesViewer.setFiles(files);
                    }
                }

                function addFileOnView(file) {
                    if (_filesViewer) {
                        _filesViewer.addFile(file);
                    }
                }

                function clearFilesView() {
                    if (_filesViewer) {
                        _filesViewer.clear();
                    }
                }

                function showProgressBar() {
                    _$progressBar.show();
                }

                function hideProgressBar() {
                    _$progressBar.hide();
                    _$progressBarInner.css('width', "0%");
                }

                function setValue(value) {
                    if (!value) {
                        _files = null;
                        clearFilesView();
                        return;
                    }

                    _files = [];

                    collections.foreach(value as any[], function (file) {
                        _files.push(file);
                    });

                    setFilesOnView(_files);
                    invokeChange();
                }

                function start(e, data) {
                    showProgressBar();
                    _events.onStart.invoke(data);
                    app.ignoreParams(e);
                }

                function done(e, data) {
                    var file = data.result;
                    file.isUploaded = true;
                    _files.push(file);
                    addFileOnView(file);
                    hideProgressBar();
                    _$currentFileName.hide();
                    _events.onDone.invoke(file);
                    invokeChange();
                    app.ignoreParams(e);
                }

                function fail(e, data) {
                    _events.onFail.invoke(data);
                    app.ignoreParams(e);
                }

                function progress(e, data: any) {
                    var p = parseInt((data.loaded / data.total * 100).toString(), 10);

                    _$progressBarInner.css('width', p + "%");
                    _events.onProgress.invoke(data);
                    app.ignoreParams(e);
                }

                function change(e, data) {
                    _$currentFileName.text(data.files[0].name).show();
                    app.ignoreParams(e);
                }

                function getDefaults() {
                    return {
                        uploadButtonText: 'Upload',
                        multiupload: true,
                        showFileName: true,
                        showProgressBar: true,
                        showUploadedFiles: true,
                        autoUpload: true,
                        uploadedFilesView: 'list'
                    };
                }

                function initUploader(success) {
                    _$uploadButton.append('<input type="file" name="files[]" multiple="">');
                    checkMaxUploads();

                    var acceptFileExtensions = '';

                    if (initData.acceptFileTypes) {
                        initData.acceptFileTypes.forEach(function (val, i) {
                            acceptFileExtensions += val + ((i !== initData.acceptFileTypes.length - 1) ? '|' : '');
                        });
                    }

                    get$uploadInput()['fileupload']({
                        url: initData.uploadUrl,
                        autoUpload: initData.autoUpload,
                        dataType: 'json',
                        start: start,
                        done: done,
                        fail: fail,
                        progress: progress,
                        change: change,
                        acceptFileTypes: acceptFileExtensions ? new RegExp('(\.|\/)(' + acceptFileExtensions + ')$') : undefined
                    });

                    if (initData.readOnly) {
                        setReadOnly(true);
                    }

                    success(_control);
                }

                function init(success) {
                    _$wrapper = $('<div class="file-uploader" />');
                    _$currentFileName = $('<span class="uploader-filename" />');
                    _$progressBar = $('<div class="uploader-progress-bar" />');
                    _$progressBarInner = $('<div class="uploader-progress-inner" />');
                    _$uploadButton = initData.customButton || $('<button class="btn btn-success" />').text(resources.selectFile);
                    _$uploadButton.addClass('fileinput-button');

                    container.setContent(_$wrapper);
                    objects.extend(getDefaults(), initData, false);
                    _$wrapper.append(_$uploadButton);

                    if (initData.showFileName) {
                        _$wrapper.append(_$currentFileName);
                    }

                    if (initData.showProgressBar) {
                        _$wrapper.append(_$progressBar);
                        _$progressBar.append(_$progressBarInner).hide();
                    }

                    if (initData.value) {
                        collections.foreach(initData.value, function (file) {
                            _files.push(objects.clone(file));
                        });
                    }

                    if (initData.showUploadedFiles) {
                        var $fileslistWrapper = $('<div class="margin-t-10" />');

                        _$wrapper.append($fileslistWrapper);
                        initFilesViewer($fileslistWrapper).then(function () {
                            initUploader(success);
                        });
                    } else {
                        initUploader(success);
                    }
                }

                return promise.create(function (success) {
                    init(success);
                });
            }
        } as UI.IFileUploaderFactory;
    }
]);
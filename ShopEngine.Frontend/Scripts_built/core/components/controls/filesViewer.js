app.registerComponent('filesViewer', 'UI', [
    '$',
    'Promise',
    'Utils.objects',
    'Utils.strings',
    'Collections',
    'Services.containerHelper',
    'UI.popover',
    function ($, promise, objects, strings, collections, containerHelper, popover) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {}, _filesData = [], _mode, _addFileFunc, _$wrapper = $('<div class="files-viewer-container" />');
                function getActionButton(faClass, title) {
                    return $('<span class="round-button round-button-sm margin-5"><a><i class="fa ' + faClass + ' fa-fw"></i></a></span>')
                        .attr('title', title);
                }
                function applyAction($el, action, fileData) {
                    $el.click(function (e) {
                        e.preventDefault();
                        action(fileData.file);
                    });
                }
                function initDownloadAction($container, fileData, isDefaultAction) {
                    var $button = getActionButton('fa-download', 'Download file');
                    applyAction($button, initData.downloadAction, fileData);
                    if (isDefaultAction) {
                        applyAction(fileData.element.find('.fileName'), initData.downloadAction, fileData);
                    }
                    fileData.downloadAction = {
                        button: $button
                    };
                    $container.append($button);
                }
                function initViewAction($container, fileData, isDefaultAction) {
                    var $button = getActionButton('fa-edit', 'Edit file');
                    applyAction($button, initData.viewAction, fileData);
                    if (isDefaultAction) {
                        applyAction(fileData.element.find('.fileName'), initData.viewAction, fileData);
                    }
                    fileData.viewAction = {
                        button: $button
                    };
                    $container.append($button);
                }
                function initEditAction($container, fileData, isDefaultAction) {
                    var $button = getActionButton('fa-eye', 'View file');
                    applyAction($button, initData.editAction, fileData);
                    if (isDefaultAction) {
                        applyAction(fileData.element.find('.fileName'), initData.editAction, fileData);
                    }
                    fileData.editAction = {
                        button: $button
                    };
                    $container.append($button);
                }
                function initDeleteAction($container, fileData, isDefaultAction) {
                    var $button = getActionButton('fa-times', 'Delete file'), deleteAction = function (file) {
                        fileData.popover.hide();
                        initData.deleteAction(file);
                    };
                    applyAction($button, deleteAction, fileData);
                    if (isDefaultAction) {
                        applyAction(fileData.element.find('.fileName'), deleteAction, fileData);
                    }
                    fileData.deleteAction = {
                        button: $button
                    };
                    $container.append($button);
                }
                function renderActions($container, fileData) {
                    var hasActions = false;
                    if (initData.downloadUrl || initData.downloadAction) {
                        initDownloadAction($container, fileData, initData.defaultAction === 'download');
                        hasActions = true;
                    }
                    if (initData.viewAction) {
                        initViewAction($container, fileData, initData.defaultAction === 'view');
                        hasActions = true;
                    }
                    if (initData.editAction) {
                        initEditAction($container, fileData, initData.defaultAction === 'edit');
                        hasActions = true;
                    }
                    if (initData.deleteAction) {
                        initDeleteAction($container, fileData, initData.defaultAction === 'delete');
                        hasActions = true;
                    }
                    return hasActions;
                }
                function getFileTypeIcon(fileName) {
                    var extension, index = fileName.lastIndexOf('.');
                    if (index !== -1) {
                        extension = fileName.substr(index + 1).toLowerCase();
                    }
                    var css = 'file-icon file-icon-32 file-icon-' + extension + '-32';
                    return $('<a />').addClass(css);
                }
                function findFileDataItem(filePredicate) {
                    if (objects.isFunction(filePredicate)) {
                        return collections.from(_filesData).where(function (fileData) {
                            return filePredicate(fileData.file);
                        }).first();
                    }
                    return collections.from(_filesData).where(function (fileData) {
                        return fileData.file.fileName === filePredicate.fileName;
                    }).first();
                }
                function initTilesView(files) {
                    var $tilesViewWrapper = $('<ul class="file-tiles-view-container filesViewContainer">');
                    function initInfoAndActions(fileData, $infoButon) {
                        var $infoContainer = $('<div />'), $actionsContainer = $('<div class="text-center" />');
                        $infoContainer.append($('<div class="text-center" />')
                            .append($('<strong />').text(fileData.file.displayName || fileData.file.fileName)));
                        if (fileData.file.size) {
                            $infoContainer.append($('<div class="text-center" />')
                                .append($('<small class="color-dark-gray" />').text(strings.formatFileSize(fileData.file.size))));
                        }
                        if (renderActions($actionsContainer, fileData)) {
                            $infoContainer.append('<hr class="margin-5" />').append($actionsContainer);
                        }
                        popover.init(containerHelper.appendTo($infoButon, container.ready()), {
                            title: '',
                            placement: UI.PopoverPlacement.Right,
                            trigger: 'manual',
                            content: $infoContainer,
                            hideOnBodyClick: true
                        }).then(function (popover) {
                            fileData.popover = popover;
                            $infoButon.click(function () {
                                popover.show();
                            });
                        });
                    }
                    function renderFile(file) {
                        var $fileWrapper = $('<li class="file-wrapper">'), $fileAction = $('<a />'), $fileIcon = getFileTypeIcon(file.fileName), $fileName = $('<span class="fileName file-name" />'), $infoButon = $('<span class="info-button">...</span>');
                        var fileData = {
                            file: file,
                            element: $fileWrapper
                        };
                        $fileName.text(file.displayName || file.fileName);
                        $fileWrapper.append($fileAction)
                            .append($infoButon);
                        $fileAction.append($fileIcon)
                            .append('<span class="block margin-5" />')
                            .append($fileName);
                        initInfoAndActions(fileData, $infoButon);
                        _filesData.push(fileData);
                        $tilesViewWrapper.append($fileWrapper);
                    }
                    collections.safeForeach(files, function (file) {
                        renderFile(file);
                    });
                    _addFileFunc = renderFile;
                    _$wrapper.append($tilesViewWrapper);
                    _$wrapper.append('<div class="clear" />');
                }
                function initListView(files) {
                    var $listViewWrapper = $('<ul class="file-list-view-container list-group filesViewContainer" />');
                    function renderFile(file) {
                        var $fileWrapper = $('<li class="file-wrapper list-group-item" />'), $fileIcon = getFileTypeIcon(file.fileName), $fileName = $('<a />'), $fileSize = $('<span class="file-size" />'), $fileActions = $('<span class="file-actions" />');
                        $fileName.text(file.fileName);
                        $fileWrapper.append($fileIcon)
                            .append($fileName);
                        if (file.size) {
                            $fileWrapper.append($fileSize);
                            $fileSize.text(strings.formatFileSize(file.size));
                        }
                        if (renderActions($fileActions, file.data)) {
                            $fileWrapper.append($fileActions);
                        }
                        _filesData.push({
                            file: file,
                            element: $fileWrapper
                        });
                        $listViewWrapper.append($fileWrapper);
                    }
                    collections.safeForeach(files, function (file) {
                        renderFile(file);
                    });
                    _addFileFunc = renderFile;
                    _$wrapper.append($listViewWrapper);
                }
                function clearView() {
                    _$wrapper.find('.filesViewContainer').remove();
                    collections.removeAll(_filesData);
                }
                function updateView(files) {
                    if (_mode === 'list') {
                        initListView(files);
                    }
                    else if (_mode === 'tiles') {
                        initTilesView(files);
                    }
                }
                function init(success) {
                    container.setContent(_$wrapper);
                    _mode = initData.mode || 'tiles';
                    updateView(initData.files);
                    success(control);
                }
                control.changeView = function (mode) {
                    var files = collections.from(_filesData).select(function (data) {
                        return data.file;
                    });
                    _mode = mode;
                    clearView();
                    updateView(files);
                };
                control.setFiles = function (files) {
                    clearView();
                    updateView(files);
                };
                control.addFile = function (file) {
                    _addFileFunc(file);
                };
                control.removeFile = function (file) {
                    var fileDataItem = findFileDataItem(file);
                    if (fileDataItem) {
                        fileDataItem.element.remove();
                        collections.remove(_filesData, fileDataItem);
                    }
                };
                control.clear = function () {
                    clearView();
                };
                control.disableAction = function (actionName) {
                    _filesData.forEach(function (fileData) {
                        fileData[actionName].button.hide();
                    });
                };
                control.enableAction = function (actionName) {
                    _filesData.forEach(function (fileData) {
                        fileData[actionName].button.show();
                    });
                };
                return promise.create(function (success) {
                    init(success);
                });
            }
        };
    }
]);

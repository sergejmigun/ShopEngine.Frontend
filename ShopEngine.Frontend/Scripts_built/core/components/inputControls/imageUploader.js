app.registerComponent('imageUploader', 'UI', [
    '$',
    'Promise',
    'Services.defaultInputValidationHandler',
    'Services.eventsInitializer',
    'Services.containerHelper',
    'Collections',
    'UI.fileUploader',
    'UI.carousel',
    'UI.popover',
    'UI.imageGallery',
    'Resources.UICore',
    'Shared',
    'Utils.urls',
    function ($, promise, defaultInputValidationHandler, eventsInitializer, containerHelper, collections, fileUploader, carousel, popover, imageGallery, resources, shared, urls) {
        'use strict';
        return {
            init: function (container, initData) {
                var _$wrapper, _$uploaderWrapper = $('<div class="file-uploader-wrapper" />').hide(), _$imagesList = $('<div class="uploader-imagelist" />').hide(), _$removeButtons = [], _fileUploaderInstance, _carouselInstance, _carouselMoving = false, _popovers = [], _value = [];
                var _events = {
                    onDone: eventsInitializer.initEvent(),
                    onChange: eventsInitializer.initVoidEvent(),
                    onRemove: eventsInitializer.initVoidEvent()
                };
                var _control = {
                    onDone: _events.onDone.event,
                    onChange: _events.onChange.event,
                    onRemove: _events.onRemove.event,
                    value: function (value) {
                        if (value !== undefined) {
                            setValue(value);
                        }
                        else {
                            return _value;
                        }
                    },
                    disabled: function (disabled) {
                        if (disabled !== undefined) {
                            setDisabled(disabled);
                        }
                        else {
                            return initData.disabled;
                        }
                    },
                    readOnly: function (readOnly) {
                        if (readOnly !== undefined) {
                            setReadOnly(readOnly);
                        }
                        else {
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
                    }
                };
                var _validationHandler = defaultInputValidationHandler.init(_control);
                function setDisabled(disabled) {
                    if (initData.disabled === disabled) {
                        return;
                    }
                    initData.disabled = disabled;
                    _fileUploaderInstance.disabled(disabled);
                    collections.foreach(_$removeButtons, function ($removeButton) {
                        $removeButton.prop('disabled', disabled);
                    });
                }
                function setReadOnly(readOnly) {
                    if (initData.readOnly === readOnly) {
                        return;
                    }
                    _fileUploaderInstance.readOnly(readOnly);
                    collections.foreach(_$removeButtons, function ($removeButton) {
                        if (readOnly) {
                            $removeButton.hide();
                        }
                        else {
                            $removeButton.show();
                        }
                    });
                }
                function setValue(value) {
                    if (_fileUploaderInstance) {
                        _fileUploaderInstance.value(value);
                    }
                }
                function hidePopovers(except) {
                    collections.foreach(_popovers, function (popover) {
                        if (popover !== except) {
                            popover.hide();
                        }
                    });
                }
                function initRemoving(item, $removeButton) {
                    function deleteItem() {
                        hidePopovers();
                        var index = collections.indexOf(_value, function (valueItem) {
                            return valueItem.fileName === item.fileName;
                        });
                        _carouselInstance.removeItem(index);
                        collections.removeByIndex(_value, index);
                        _fileUploaderInstance.removeFile(item.fileName);
                        _events.onChange.invoke();
                        if (!_value.length) {
                            _$imagesList.hide();
                        }
                    }
                    $removeButton.click(function () {
                        deleteItem();
                    });
                    _$removeButtons.push($removeButton);
                    if (initData.readOnly) {
                        $removeButton.hide();
                    }
                }
                function initDownloading(item, $downloadLink) {
                    $downloadLink.click(function () {
                        if (item.downloadUrl) {
                            shared.location.href = item.downloadUrl;
                        }
                    });
                }
                function initView(item, $viewButton) {
                    $viewButton.click(function () {
                        var i = 0, currentIndex;
                        var galleryItems = collections.select(_value, function (valueItem) {
                            if (valueItem.fileName === item.fileName) {
                                currentIndex = i;
                            }
                            i += 1;
                            return {
                                src: valueItem.downloadUrl
                            };
                        }).toArray();
                        imageGallery.open(galleryItems, {
                            index: currentIndex
                        });
                    });
                }
                function getCarouselItem(imageItem) {
                    var $img = $('<img />')
                        .attr('src', urls.addParam(imageItem.downloadUrl, 'thumb', 'true'))
                        .css({
                        width: '100%'
                    })
                        .wrap('<div />');
                    var $carouselItemContent = $img.parent();
                    var carouselItem = {
                        content: $carouselItemContent.wrap('<a href="#" class="thumbnail" />').parent(),
                        contentReady: promise.create(function (success) {
                            $img.one("load", function () {
                                success();
                            });
                        }),
                        fileName: imageItem.fileName,
                        downloadUrl: imageItem.downloadUrl
                    };
                    var $popoverContent = $('<div class="padding-10 text-center" />'), $downloadButton = $('<a class="btn btn-success btn-xs margin-r-10" />').text(resources.download), $removeButton = $('<button class="btn btn-danger btn-xs margin-r-10" />').text(resources.remove), $viewButton = $('<a type="button" class="btn btn-success btn-xs" />').text(resources.view);
                    $popoverContent.append($downloadButton)
                        .append($removeButton)
                        .append($viewButton);
                    initDownloading(carouselItem, $downloadButton);
                    initRemoving(carouselItem, $removeButton);
                    initView(carouselItem, $viewButton);
                    popover.init(containerHelper.appendTo($carouselItemContent, container.ready()), {
                        content: $popoverContent,
                        placement: UI.PopoverPlacement.Bottom,
                        trigger: 'manual',
                        title: imageItem.fileName
                    }).then(function (popover) {
                        _popovers.push(popover);
                        $carouselItemContent.click(function () {
                            if (!_carouselMoving) {
                                hidePopovers(popover);
                                popover.show();
                                $popoverContent.closest('.popover').css('z-index', 999);
                            }
                            return false;
                        });
                        $popoverContent.click(function () {
                            return false;
                        });
                    });
                    return carouselItem;
                }
                function init(success) {
                    _$wrapper = $('<div class="image-uploader" />');
                    container.setContent(_$wrapper);
                    var carouselOptions = {
                        items: [],
                        infinite: false,
                        dots: true,
                        slides: undefined,
                        minItemWidth: 150,
                        minItemHeight: 100
                    };
                    _$wrapper.append(_$uploaderWrapper).append(_$imagesList);
                    initData.showUploadedFiles = false;
                    initData.showFileName = false;
                    initData.customButton = $('<button type="submit" class="btn btn-sm btn-default form-control-button" />')
                        .append('<i class="fa fa-picture-o" />')
                        .append(resources.loadImage);
                    if (initData.value) {
                        collections.foreach(initData.value, function (imageItem) {
                            carouselOptions.items.push(getCarouselItem(imageItem));
                            _value.push(imageItem);
                        });
                        _$imagesList.show();
                    }
                    if (!initData.readOnly) {
                        _$uploaderWrapper.show();
                    }
                    container.ready().then(function () {
                        carouselOptions.slides = Math.round(_$wrapper.parent().width() / 150) || 1;
                        carousel.init(containerHelper.appendTo(_$imagesList, container.ready()), carouselOptions).then(function (carousel) {
                            _carouselInstance = carousel;
                            _carouselInstance.movingStart(function () {
                                hidePopovers();
                                _carouselMoving = true;
                            });
                            _carouselInstance.movingEnd(function () {
                                _carouselMoving = false;
                            });
                        });
                    });
                    fileUploader.init(containerHelper.appendTo(_$uploaderWrapper, container.ready()), initData).then(function (fileUploader) {
                        _fileUploaderInstance = fileUploader;
                        _fileUploaderInstance.onDone(function (file) {
                            _value.push(file);
                            _$imagesList.show();
                            _carouselInstance.addItem(getCarouselItem(file));
                            _events.onChange.invoke();
                            _events.onDone.invoke(file);
                        });
                        $('body').click(function () {
                            hidePopovers();
                        });
                        success(_control);
                    });
                }
                return promise.create(function (success) {
                    init(success);
                });
            }
        };
    }
]);

app.registerComponent('imageEditor', 'UI', [
    '$',
    'Promise',
    'Utils.objects',
    'Services.eventsInitializer',
    'Collections',
    'Utils.strings',
    'Utils.math',
    function($: JQueryStatic,
        promise: IPromise,
        objects: Utils.IObjects,
        eventsInitializer: Services.Initialization.IEventsInitializer,
        collections: ICollections,
        strings: Utils.IStrings,
        math: Utils.IMath) {
        'use strict';

        return {
            init: function(container, initData) {
                var control = {} as UI.IImageEditor,
                    _$wrapper = $('<div class="image-editor-container" />'),
                    _$image: JQuery,
                    _cropState,
                    _enableCropping: boolean,
                    _currentState = {
                        rotation: 0,
                        originalWidth: 0,
                        originalHeight: 0,
                        currentWidth: 0,
                        currentHeight: 0,
                        zoom: 1
                    },
                    _updateState,
                    _events = eventsInitializer.init(control, ['onChange', 'onRemove', 'dblclick', 'submit']);

                function getButton(inner) {
                    var $button = $('<div class="round-button-circle" />'),
                        $innerWrapper = $('<div class="round-button-inner" />');

                    $innerWrapper.html(inner);
                    $button.append($innerWrapper);

                    return $button.wrap('<div class="round-button-2" />').parent();
                }

                function clearCropper() {
                    _$image['cropper']('clear');
                    _cropState = null;
                    _updateState();
                }

                function loadImage($imageWrapper) {
                    return promise.create(function (success) {
                        _$image = ($('<img />').attr('src', initData.imageUrl) as any).load(function () {
                            $imageWrapper.append(_$image);
                            var wrapperWidth = $imageWrapper.width();

                            _currentState.originalWidth = _$image.width();
                            _currentState.originalHeight = _$image.height();
                            _currentState.currentWidth = _currentState.originalWidth;
                            _currentState.currentHeight = _currentState.originalHeight;
                            _currentState.zoom = wrapperWidth / _currentState.originalWidth;

                            _$image.width(wrapperWidth);

                            var cropperOptions = {
                                autoCrop: false,
                                modal: true,
                                viewMode: 1,
                                guides: false,
                                scalable: false,
                                //dragMode: 'none',
                                toggleDragModeOnDblclick: false,
                                crop: function(e) {
                                    if (!_cropState) {
                                        _cropState = {};
                                    }

                                    objects.map(e, _cropState, ['x', 'y', 'width', 'height']);
                                    _updateState();
                                    _events.onChange.invoke(_currentState);
                                },
                                zoom: function(e) {
                                    _currentState.zoom = e.ratio;
                                    _updateState();
                                    _events.onChange.invoke(_currentState);
                                },
                                dragMode: undefined
                            };

                            if (initData.disableCropping) {
                                cropperOptions.dragMode = 'none';
                            } else {
                                _enableCropping = true;
                            }

                            _$image['cropper'](cropperOptions);

                            $('body').click(clearCropper);

                            $imageWrapper.click(function () {
                                return false;
                            }).dblclick(function () {
                                _events.dblclick.invoke(_currentState);
                            });

                            _updateState();
                            success();
                        });
                    });
                }

                function initActions($actionsWrapper) {
                    var needBullet = false;

                    function appendBullet() {
                        if (needBullet) {
                            $actionsWrapper.append('<span class="image-editor-bullet">.</span>');
                        }

                        needBullet = true;
                    }

                    function initCropping() {
                        if (initData.disableCropping) {
                            return;
                        }

                        appendBullet();

                        var $aspectRatioWrapper,
                            $cropButton;

                        $cropButton = getButton('<i class="fa fa-crop" />').click(function () {
                            if (_enableCropping) {
                                clearCropper();
                                _enableCropping = false;
                                $cropButton.addClass('button-disabled');
                                _$image['cropper']('setDragMode', 'none');

                                if ($aspectRatioWrapper) {
                                    $aspectRatioWrapper.hide();
                                }
                            } else {
                                _enableCropping = true;
                                _cropState = {};
                                $cropButton.removeClass('button-disabled');
                                _$image['cropper']('setDragMode', 'crop');

                                if ($aspectRatioWrapper) {
                                    $aspectRatioWrapper.show();
                                }
                            }

                            return false;
                        });

                        $actionsWrapper.append($cropButton);

                        if (initData.aspectRatio) {
                            var $buttons = [],
                                setActiveButton = function ($activeButton) {
                                    collections.foreach($buttons, function ($button) {
                                        if ($button === $activeButton) {
                                            $button.addClass('active-ratio');
                                        } else {
                                            $button.removeClass('active-ratio');
                                        }
                                    });
                                };

                            $aspectRatioWrapper = $('<div style="display: inline-block;" />');
                            $actionsWrapper.append($aspectRatioWrapper);

                            collections.foreach(initData.aspectRatio as any[], function (ratio) {
                                var $button;

                                if (ratio.free) {
                                    $button = getButton('<span>Free</span>').click(function () {
                                        _$image['cropper']('setAspectRatio', null);
                                        setActiveButton($button);
                                        return false;
                                    });
                                } else {
                                    $button = getButton(strings.format('<span>{0} : {1}</span>', ratio.x, ratio.y)).click(function () {
                                        _$image['cropper']('setAspectRatio', ratio.x / ratio.y);
                                        setActiveButton($button);
                                        return false;
                                    });
                                }

                                $buttons.push($button);
                                $aspectRatioWrapper.append($button);
                            });

                            setActiveButton($buttons[0]);
                        }
                    }

                    function initZooming() {
                        if (initData.disableZooming) {
                            return;
                        }

                        appendBullet();

                        var $zoomInc = getButton('<i class="fa fa-search-plus" />').click(function () {
                            _$image['cropper']('zoom', 0.1);
                            return false;
                        });

                        var $zoomDec = getButton('<i class="fa fa-search-minus" />').click(function () {
                            _$image['cropper']('zoom', -0.1);
                            return false;
                        });

                        $actionsWrapper.append($zoomInc);
                        $actionsWrapper.append($zoomDec);
                    }

                    function initRotation() {
                        if (initData.disableRotation) {
                            return;
                        }

                        appendBullet();

                        function setRotation(rotation) {
                            _currentState.rotation += rotation;

                            if (_currentState.rotation === 360 || _currentState.rotation === -360) {
                                _currentState.rotation = 0;
                            }

                            _updateState();
                        }

                        var $rotateLeft = getButton('<i class="fa fa-rotate-left" />').click(function () {
                            _$image['cropper']('rotate', 90);
                            setRotation(90);
                            return false;
                        });

                        var $rotateRight = getButton('<i class="fa fa-rotate-right" />').click(function () {
                            _$image['cropper']('rotate', -90);
                            setRotation(-90);
                            return false;
                        });

                        $actionsWrapper.append($rotateLeft);
                        $actionsWrapper.append($rotateRight);
                    }

                    initCropping();
                    initZooming();
                    initRotation();
                }

                function initInfo($infoWrapper) {
                    var $originalWidth = $('<span />'),
                        $originalHeight = $('<span />'),
                        $currentHeight = $('<span />'),
                        $currentWidth = $('<span />'),
                        $zoomLevel = $('<span />'),
                        $rotation = $('<span />'),
                        $submit = $('<button class="btn btn-default">Save changes</button>');

                    $infoWrapper.append('<span class="info-title">Original size (w:h)</span>');
                    $infoWrapper.append($originalWidth);
                    $infoWrapper.append(' : ');
                    $infoWrapper.append($originalHeight);
                    $infoWrapper.append('<hr />');

                    $infoWrapper.append('<span class="info-title">Current size (w:h)</span>');
                    $infoWrapper.append($currentWidth);
                    $infoWrapper.append(' : ');
                    $infoWrapper.append($currentHeight);
                    $infoWrapper.append('<hr />');

                    $infoWrapper.append('<span class="info-title">Zoom Level</span>');
                    $infoWrapper.append($zoomLevel);
                    $infoWrapper.append('<hr />');

                    $infoWrapper.append('<span class="info-title">Rotation</span>');
                    $infoWrapper.append($rotation);
                    $infoWrapper.append('<hr />');

                    $infoWrapper.append('<br /><br />');
                    $infoWrapper.append($submit);

                    _updateState = function () {
                        if (_cropState && _cropState.height && _cropState.width) {
                            _currentState.currentHeight = _cropState.height;
                            _currentState.currentWidth = _cropState.width;
                        } else {
                            _currentState.currentHeight = _currentState.originalHeight;
                            _currentState.currentWidth = _currentState.originalWidth;
                        }

                        $originalWidth.text(_currentState.originalWidth);
                        $originalHeight.text(_currentState.originalHeight);
                        $currentHeight.text(Math.round(_currentState.currentHeight));
                        $currentWidth.text(Math.round(_currentState.currentWidth));
                        $zoomLevel.text(math.decimalRound(_currentState.zoom, 2));
                        $rotation.text(_currentState.rotation + '°');
                    };

                    $submit.click(function () {
                        _events.submit.invoke(_currentState);
                        return false;
                    });

                    _updateState();
                }

                function init(success) {
                    var $imageWrapper = $('<div class="image-editor-wrapper" />'),
                        $actionsWrapper = $('<div class="image-editor-actions" />'),
                        $infoWrapper = $('<div class="image-editor-info" />');

                    container.setContent(_$wrapper);
                    _$wrapper.append($actionsWrapper).append($imageWrapper).append($infoWrapper);

                    initActions($actionsWrapper);
                    initInfo($infoWrapper);

                    loadImage($imageWrapper).then(function () {
                        success(control);
                    });
                }

                control.getState = function () {
                    return objects.clone(_currentState);
                };

                control.destroy = function () {
                    return;
                };

                return promise.create(function (success) {
                    init(success);
                });
            }
        } as UI.IImageEditorFactory;
    }
]);
app.registerComponent('mapEditor', 'UI', [
    '$',
    'Promise',
    'Utils.objects',
    'Collections',
    'Services.defaultInputValidationHandler',
    'Services.eventsInitializer',
    'Services.apiService',
    'UI.modals',
   
    function ($: JQueryStatic,
        promise: IPromise,
        objects: Utils.IObjects,
        collections: ICollections,
        defaultInputValidationHandler: Services.IDefaultInputValidationHandlerFactory,
        eventsInitializer: Services.Initialization.IEventsInitializer,
        apiService: Services.IApiService,
        modals: UI.IModalsFactory,
        numericBox: UI.INumericBoxFactory,
        multiLineTextBox: UI.IMultiLineTextBoxFactory,
        htmlEditor: UI.IHtmlEditorFactory) {
        'use strict';

        return {
            init: function (container, initData) {
                var control = {} as UI.IMapEditor,
                    _$wrapper: JQuery,
                    _$mapContainer: JQuery,
                    _$addMarkerBtn: JQuery,
                    _$clearMarkersBtn: JQuery,
                    _value = {} as any,
                    _markerModalHtml,
                    _modalInst,
                    _map,
                    _markers = [],
                    _validationHandler = defaultInputValidationHandler.init(control),
                    _events = eventsInitializer.init(control, ['onChange', 'onRemove', 'init']);

                function isDisabledOrReadOnly() {
                    return initData.disabled || initData.readOnly;
                }

                function setDisabled(disabled) {
                    if (initData.disabled === disabled) {
                        return;
                    }
                    initData.disabled = disabled;
                    _$addMarkerBtn.prop('disabled', disabled);
                    _$clearMarkersBtn.prop('disabled', disabled);

                    function toggleGmap(disabled) {
                        _map.setOptions({
                            draggable: !disabled,
                            draggableCursor: !disabled,
                            disableDoubleClickZoom: disabled,
                            disableDefaultUI: disabled
                        });

                        collections.foreach(_markers, function (markerData) {
                            markerData.marker.setDraggable(!disabled);
                        });
                    }

                    if (disabled) {
                        if (_modalInst) {
                            _modalInst.close();
                        }
                        toggleGmap(true);
                    } else {
                        toggleGmap(false);
                    }
                }

                function setReadOnly(readOnly) {
                    if (initData.readOnly === readOnly) {
                        return;
                    }
                    initData.readOnly = readOnly;

                    function toggleGmap(readOnly) {
                        collections.foreach(_markers, function (markerData) {
                            markerData.marker.setDraggable(!readOnly);
                        });
                    }

                    if (readOnly) {
                        _$addMarkerBtn.hide();
                        _$clearMarkersBtn.hide();
                        if (_modalInst) {
                            _modalInst.close();
                        }
                        toggleGmap(true);
                    } else {
                        _$addMarkerBtn.show();
                        _$clearMarkersBtn.show();
                        toggleGmap(false);
                    }
                }

                function toGmapPosition(lattitude, longtitude) {
                    if (lattitude !== undefined && longtitude !== undefined) {
                        return {
                            lat: lattitude,
                            lng: longtitude
                        };
                    }
                }

                function fillMarkerData(marker, markerData) {
                    var position = marker.getPosition();

                    markerData.lattitude = position.lat();
                    markerData.longtitude = position.lng();
                    markerData.title = marker.title;
                    markerData.marker = marker;

                    return markerData;
                }

                function getMarkerNumericOptions(value?) {
                    return {
                        min: -1000,
                        max: 1000,
                        nullable: true,
                        decimals: 14,
                        hideButtons: true,
                        value: value
                    };
                }

                function openMarkerModal(
                    modalTitle,
                    $markerContent,
                    modalButtons,
                    lattitudeOptions,
                    longtitudeOptions,
                    titleOptions,
                    captionOptions
                ) {
                    return promise.create(function (success) {
                        modals.openCustom(modalTitle, $markerContent, modalButtons).then(function (modalInst) {
                            var markerLattitudeInit = numericBox.init($markerContent.find('.markerLattitude'), lattitudeOptions),
                                markerLongtitudeInit = numericBox.init($markerContent.find('.markerLongtitude'), longtitudeOptions),
                                markerTitleInit = multiLineTextBox.init($markerContent.find('.markerTitle'), titleOptions),
                                markerCaptionInit = htmlEditor.init($markerContent.find('.markerCaption'), captionOptions);

                            var promises = [markerLattitudeInit, markerLongtitudeInit, markerTitleInit, markerCaptionInit];

                            promise.all<any>(promises).then(function (instances) {
                                success({
                                    modalInst: modalInst,
                                    markerLattitude: instances[0],
                                    markerLongtitude: instances[1],
                                    markerTitle: instances[2],
                                    markerCaption: instances[3]
                                });
                            });
                        });
                    });
                }

                function editMarker(lattitude, longtitude, title, caption, markerData) {
                    var latLng = toGmapPosition(lattitude, longtitude);

                    if (!latLng) {
                        latLng = _map.getCenter();
                    }

                    markerData.marker.setPosition(latLng);
                    markerData.marker.setTitle(title);

                    if (caption) {
                        if (markerData.infowindow) {
                            markerData.infowindow.setContent(caption);
                        } else {
                            var infowindow = new window['google'].maps.InfoWindow({
                                content: caption
                            });

                            markerData.infowindow = infowindow;

                            window['google'].maps.event.addListener(markerData.marker, 'click', function () {
                                infowindow.open(_map, markerData.marker);
                            });
                        }
                    } else if (markerData.infowindow) {
                        delete markerData.infowindow;
                        window['google'].maps.event.clearListeners(markerData.marker, 'click');
                    }

                    _map.setCenter(latLng);
                    _events.onChange.invoke();
                }

                function openEditMarkerModal(html, markerData) {
                    var $markerContent = $(html),
                        lattitudeOptions = getMarkerNumericOptions(markerData.lattitude),
                        longtitudeOptions = getMarkerNumericOptions(markerData.longtitude),
                        captionOptions = {} as any,
                        titleOptions = {
                            rows: 2,
                            value: markerData.title
                        },
                        modalTitle = 'Edit marker',
                        $saveButton = $('<button type="button" class="btn btn-success">Save</button>'),
                        $removeMarkerButton = $('<button type="button" class="btn btn-danger pull-left">Delete marker</button>'),
                        modalButtons = [$saveButton, $removeMarkerButton];

                    if (markerData.infowindow) {
                        captionOptions.value = markerData.infowindow.getContent();
                    }

                    openMarkerModal(modalTitle, $markerContent, modalButtons, lattitudeOptions, longtitudeOptions, titleOptions, captionOptions)
                        .then(function (res: any) {
                            _modalInst = res.modalInst;

                            $saveButton.click(function () {
                                editMarker(
                                    res.markerLattitude.value(),
                                    res.markerLongtitude.value(),
                                    res.markerTitle.value(),
                                    res.markerCaption.value(),
                                    markerData
                                );

                                res.modalInst.close();
                                _modalInst = null;
                            });

                            $removeMarkerButton.click(function () {
                                modals.confirm({
                                    title: 'Remove marker',
                                    message: 'Are you sure you want to remove this marker?'
                                }).then(function () {
                                    markerData.marker.setMap(null);
                                    collections.remove(_markers, markerData.marker);
                                    res.modalInst.close();
                                    _modalInst = null;
                                });
                            });
                        });
                }

                function addMarker(lattitude, longtitude, title, caption, html) {
                    var latLng = toGmapPosition(lattitude, longtitude),
                        markerData = {} as any;

                    if (!latLng) {
                        latLng = _map.getCenter();
                    }

                    var marker = new window['google'].maps.Marker({
                        position: latLng,
                        draggable: true,
                        map: _map,
                        title: title
                    });

                    markerData.marker = marker;

                    if (caption) {
                        var infowindow = new window['google'].maps.InfoWindow({
                            content: caption
                        });

                        window['google'].maps.event.addListener(marker, 'click', function () {
                            infowindow.open(_map, marker);
                        });

                        markerData.infowindow = infowindow;
                    }

                    window['google'].maps.event.addListener(marker, 'rightclick', function () {
                        if (isDisabledOrReadOnly()) {
                            return;
                        }
                        openEditMarkerModal(html, fillMarkerData(marker, markerData));
                    });

                    window['google'].maps.event.addListener(marker, 'dragend', function () {
                        _events.onChange.invoke();
                    });

                    _markers.push(markerData);
                    _map.setCenter(latLng);
                    _events.onChange.invoke();
                }

                function openAddMarkerModal(html) {
                    var $markerContent = $(html),
                        lattitudeOptions = getMarkerNumericOptions(),
                        longtitudeOptions = getMarkerNumericOptions(),
                        captionOptions = {},
                        titleOptions = {
                            rows: 2
                        },
                        modalTitle = 'Add marker',
                        $saveButton = $('<button type="button" class="btn btn-success">Save</button>'),
                        modalButtons = [$saveButton];

                    openMarkerModal(modalTitle, $markerContent, modalButtons, lattitudeOptions, longtitudeOptions, titleOptions, captionOptions)
                        .then(function (res: any) {
                            $saveButton.click(function () {
                                addMarker(res.markerLattitude.value(),
                                        res.markerLongtitude.value(),
                                        res.markerTitle.value(),
                                        res.markerCaption.value(),
                                        html);

                                res.modalInst.close();
                            });
                        });
                }

                function clearAllMarkers() {
                    collections.foreach(_markers, function (markerData) {
                        markerData.marker.setMap(null);
                    });
                    collections.removeAll(_markers);
                    _events.onChange.invoke();
                }

                function getValue() {
                    return {
                        center: _value.center,
                        zoom: _value.zoom,
                        lattitude: _value.lattitude,
                        longtitude: _value.longtitude,
                        markers: collections.select(_markers, function (markerData) {
                            var gmarker = markerData.marker;
                            var markerPosition = gmarker.getPosition();

                            return {
                                title: gmarker.getTitle(),
                                caption: markerData.infowindow
                                    ? markerData.infowindow.getContent()
                                    : null,
                                lattitude: markerPosition.lat(),
                                longtitude: markerPosition.lng()
                            };
                        }).toArray()
                    };
                }

                function setValue(value: UI.IMapData) {
                    clearAllMarkers();

                    if (value === null) {
                        _value = {};

                        return;
                    }

                    // markers
                    collections.foreach(value.markers, function (marker) {
                        addMarker(marker.lattitude, marker.longtitude, marker.title, marker.caption, _markerModalHtml);
                    });

                    // zoom
                    if (value.zoom) {
                        _map.setZoom(value.zoom);
                    }

                    // center
                    var center = toGmapPosition(value.lattitude, value.longtitude);
                    if (center) {
                        _map.setCenter(center);
                    }

                    _events.onChange.invoke();
                }

                function init(success) {
                    function initAddingMarkers() {
                        apiService.getTemplateHtml('mapEditorMarkerFormTemplate').then(function (html) {
                            _$addMarkerBtn.click(function () {
                                openAddMarkerModal(html);

                                return false;
                            });
                        });
                    }

                    function initClearingMarkers() {
                        _$clearMarkersBtn.click(function () {
                            modals.confirm({
                                title: 'Remove markers',
                                message: 'Are you sure you want to remove all markers from the map?'
                            }).then(function () {
                                clearAllMarkers();
                            });

                            return false;
                        });
                    }

                    apiService.getTemplateHtml('mapEditorTemplate').then(function (html) {
                        _markerModalHtml = html;
                        _$wrapper = $(html);

                        _$mapContainer = _$wrapper.find('.mapContainer').css('height', '300px');
                        _$addMarkerBtn = _$wrapper.find('.addMarker');
                        _$clearMarkersBtn = _$wrapper.find('.clearMarkers');

                        initAddingMarkers();
                        initClearingMarkers();

                        container.setContent(_$wrapper);

                        var mapCanvas = _$mapContainer[0],
                            _mapOptions = {
                                mapTypeId: window['google'].maps.MapTypeId.ROADMAP,
                                center: undefined
                            };

                        objects.map(initData, _mapOptions, {
                            zoom: {
                                name: 'zoom',
                                def: 8
                            },
                            center: function (val) {
                                var lat = 37.769, lng = -122.446;

                                if (val) {
                                    lat = val.lattitude;
                                    lng = val.longtitude;
                                }

                                _mapOptions.center = toGmapPosition(lat, lng);
                            }
                        });

                        _map = new window['google'].maps.Map(mapCanvas, _mapOptions);

                        _map.addListener('idle', function () {
                            var centerPosition = _map.getCenter();
                            _value.lattitude = centerPosition.lat();
                            _value.longtitude = centerPosition.lng();
                            _value.zoom = _map.getZoom();
                            _events.onChange.invoke();
                        });

                        success(control);
                        _events.init.invoke();
                    });
                }

                control.value = function (value) {
                    if (value !== undefined) {
                        setValue(value);
                    } else {
                        return getValue();
                    }
                };

                control.disabled = function (disabled) {
                    if (disabled !== undefined) {
                        setDisabled(disabled);
                    } else {
                        return initData.disabled;
                    }
                };

                control.readOnly = function (readOnly) {
                    if (readOnly !== undefined) {
                        setReadOnly(readOnly);
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
        } as UI.IMapEditorFactory;
    }
]);
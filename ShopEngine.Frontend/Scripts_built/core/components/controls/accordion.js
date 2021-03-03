app.registerComponent('accordion', 'UI', [
    '$',
    'Promise',
    'Services.eventsInitializer',
    'Collections',
    'UI',
    function ($, promise, eventsInitializer, collections, ui) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {}, _$wrapper = $('<ul class="-accordion" />'), _panelWidth, _events = eventsInitializer.init(control, ['expandingSection', 'expandedSection']);
                function setHorizontalAccordionPanelWidth($panelContent) {
                    $panelContent.css('width', _panelWidth + 'px');
                }
                function appendPanel(panel, index) {
                    var $panelWrapper = $('<li class="-accordion__panel" />'), $panelHeading = $('<span class="-accordion__heading"><i class="-icon"></i></span>'), $panelContent = $('<div class="-accordion__expander"></div>');
                    _$wrapper.append($panelWrapper);
                    $panelWrapper.append($panelHeading).append($panelContent);
                    $panelHeading.append(panel.title).click(function () {
                        _events.expandingSection.invoke(index);
                    });
                    if (initData.direction === UI.AccordionDirection.Horizontal) {
                        $panelHeading.find('i').addClass('-icon--left');
                        if (initData.height) {
                            $panelHeading.css('width', initData.height + 'px');
                        }
                        setHorizontalAccordionPanelWidth($panelContent);
                    }
                    else {
                        $panelHeading.find('i').addClass('-icon--right');
                    }
                    ui.renderItem($panelContent, container.ready(), panel.content);
                }
                function init(success) {
                    container.setContent(_$wrapper);
                    if (!initData.currentPanelIndex) {
                        initData.currentPanelIndex = 0;
                    }
                    if (initData.direction === UI.AccordionDirection.Horizontal) {
                        if (initData.height) {
                            _$wrapper.css('height', initData.height + 'px');
                        }
                        // wrapper width - ((header width + right margin) * panels count - right margin of last element)
                        _panelWidth = _$wrapper.width() - (60 * initData.panels.length - 10);
                    }
                    collections.foreach(initData.panels, function (panel, index) {
                        appendPanel(panel, index);
                    });
                    _$wrapper['asAccordion']({
                        namespace: '-accordion',
                        skin: 'box',
                        initialIndex: initData.currentPanelIndex,
                        easing: 'ease-in-out',
                        speed: 400,
                        direction: initData.direction,
                        event: 'click'
                    }).on('moveEnd', function (arg, index) {
                        _events.expandedSection.invoke(index);
                        app.ignoreParams(arg);
                    });
                    success(control);
                }
                control.remove = function () {
                    _$wrapper.remove();
                };
                return promise.create(function (success) {
                    init(success);
                });
            }
        };
    }
]);

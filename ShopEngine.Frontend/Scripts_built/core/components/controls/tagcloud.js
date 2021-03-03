app.registerComponent('tagCloud', 'UI', [
    '$',
    'Promise',
    'Collections',
    'Services',
    function ($, promise, collections, eventsInitializer) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {}, _$wrapper = $('<div class="tag-cloud-wrapper" />'), _events = eventsInitializer.init(control, ['tagClick']);
                function getWords() {
                    return collections.from(initData.tags).select(function (tag) {
                        return {
                            text: tag.text,
                            link: tag.link,
                            weight: tag.rate / 10,
                            handlers: {
                                click: function () {
                                    _events.tagClick.invoke(tag);
                                }
                            }
                        };
                    }).toArray();
                }
                function init(success) {
                    container.setContent(_$wrapper);
                    if (!initData.height) {
                        initData.height = 250;
                    }
                    _$wrapper.css('height', initData.height + 'px');
                    _$wrapper['jQCloud'](getWords(), {});
                    success(control);
                }
                control.remove = function () {
                    _$wrapper['jQCloud']('destroy');
                    _$wrapper.remove();
                };
                return promise.create(function (success) {
                    init(success);
                });
            }
        };
    }
]);

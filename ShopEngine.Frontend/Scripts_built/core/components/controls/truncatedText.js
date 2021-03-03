app.registerComponent('truncatedText', 'UI', [
    '$',
    'Promise',
    function ($, promise) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {};
                function init(success) {
                    var $el = $('<div class="truncated-text-wrapper" />'), $inlineSpan = $('<span class="truncated-text-inline" />'), $innerSpan = $('<span />').text(initData.text);
                    $el.append($inlineSpan.append($innerSpan));
                    container.setContent($el);
                    function truncate() {
                        var currentWidth;
                        if (!initData.width) {
                            currentWidth = $el.width();
                        }
                        else {
                            currentWidth = initData.width;
                        }
                        var realWidth = $innerSpan.width();
                        if (realWidth > currentWidth) {
                            $inlineSpan.css('width', currentWidth + 'px').attr('title', initData.text);
                        }
                        else {
                            $inlineSpan.removeAttr('style').removeAttr('title');
                        }
                    }
                    container.ready().then(function () {
                        truncate();
                    });
                    success(control);
                }
                return promise.create(function (success) {
                    init(success);
                });
            }
        };
    }
]);

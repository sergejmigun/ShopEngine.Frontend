app.registerComponent('imageGallery', 'UI', [
    '$',
    'Promise',
    'Collections',
    'Services.apiService',
    function ($, promise, collections, apiService) {
        'use strict';
        return {
            open: function (items, initData) {
                var control = {}, _$wrapper;
                return promise.create(function (success) {
                    apiService.getTemplateHtml('imageGalleryTemplate').then(function (html) {
                        _$wrapper = $('<div />');
                        _$wrapper.html(html);
                        $('body').append(_$wrapper);
                        var galleryItems = collections.select(items, function (item) {
                            return {
                                src: item.src,
                                w: 0,
                                h: 0
                            };
                        }).toArray();
                        var galleryOptions = {
                            index: initData.index
                        };
                        var gallery = new window['PhotoSwipe'](_$wrapper.find(">:first-child")[0], window['PhotoSwipeUI_Default'], galleryItems, galleryOptions);
                        gallery.listen('gettingData', function (ignore, item) {
                            if (item.w < 1 || item.h < 1) {
                                var img = new Image();
                                img.onload = function () {
                                    var self = this;
                                    item.w = self.width;
                                    item.h = self.height;
                                    gallery.invalidateCurrItems();
                                    gallery.updateSize(true);
                                };
                                img.src = item.src;
                                app.ignoreParams(ignore);
                            }
                        });
                        gallery.init();
                        success(control);
                    });
                });
            }
        };
    }
]);

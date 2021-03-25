app.registerComponent('priceRangeFilter', 'UI', [
    'Promise',
    'Utils.objects',
    'Services.templatesHtmlProvider',
    function (promise: IPromise,
        objects: Utils.IObjects,
        templatesHtmlProvider: Services.ITemplatesHtmlProviderFactory) {
        'use strict';

        return {
            init: function (container, initData) {
                var $html = $('<div />');
                var control: UI.IPriceRangeFilter = {
                };

                function init(template, success) {
                    app.ignoreParams(objects);

                    var vm = new Vue({
                        data: {
                            rangeFrom: initData.rangeFrom,
                            rangeTo: initData.rangeTo
                        },
                        template: template,
                        methods: {
                        },
                        mounted: function () {
                            var self = this;
                            var $element = $(self.$el as any);
                            var rangeSlider = $element.find('.rangeSlider')[0];

                            window['noUiSlider'].create(rangeSlider, {
                                start: [initData.rangeFrom, initData.rangeTo],
                                connect: true,
                                range: {
                                    'min': initData.min,
                                    'max': initData.max
                                },
                                step: initData.step
                            });

                            rangeSlider['noUiSlider'].on('update', function (ranges) {
                                self.$data.rangeFrom = ranges[0];
                                self.$data.rangeTo = ranges[1];
                            });
                        }
                    });

                    container.setContent($html);
                    vm.$mount($html[0]);

                    success(control);
                }

                return promise.create(function (success) {
                    templatesHtmlProvider.init('shopping').getHtml(['priceRangeFilter']).then(function (obj) {
                        app.ignoreParams(initData);
                        init(obj['priceRangeFilter'], success);
                    });
                });
            }
        } as UI.IPriceRangeFilterFactory;
    }
]);
app.registerComponent('priceRangeFilter', 'UI', [
    'Promise',
    'Services.eventsInitializer',
    'Services.templatesHtmlProvider',
    function (promise: IPromise,
        eventsInitializer: Services.Initialization.IEventsInitializer,
        templatesHtmlProvider: Services.ITemplatesHtmlProviderFactory) {
        'use strict';

        return {
            init: function (container, initData) {
                var $html = $('<div />');
                var events = {
                    onSubmit: eventsInitializer.initEvent<number, number>()
                };

                var control: UI.IPriceRangeFilter = {
                    onSubmit: events.onSubmit.event
                };

                function init(template, success) {
                    var vm = new Vue({
                        data: {
                            rangeFrom: initData.rangeFrom,
                            rangeTo: initData.rangeTo
                        },
                        template: template,
                        methods: {
                            submit: function () {
                                var self = this;
                                events.onSubmit.invoke(self.$data.rangeFrom, self.$data.rangeTo);
                            }
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
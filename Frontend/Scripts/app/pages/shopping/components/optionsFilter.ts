﻿app.registerComponent('optionsFilter', 'UI', [
    'Promise',
    'Utils.strings',
    'Collections',
    'Services.eventsInitializer',
    'Services.templatesHtmlProvider',
    function (promise: IPromise,
        strings: Utils.IStrings,
        collections: ICollections,
        eventsInitializer: Services.Initialization.IEventsInitializer,
        templatesHtmlProvider: Services.ITemplatesHtmlProviderFactory) {
        'use strict';

        return {
            init: function (container, initData) {
                var $html = $('<div />');
                var events = {
                    onChange: eventsInitializer.initEvent<UI.ICheckedFilterOption[]>()
                };

                var control: UI.IOptionsFilter = {
                    onChange: events.onChange.event
                };

                function getCheckedOptions(vm) {
                    var categoryOptions = vm.$data.categoryOptions as UI.ICategoryFilterOptions[];

                    return collections.from(categoryOptions).selectMany(function (categoryOption) {
                        return collections.from(categoryOption.options).where(x => x.checked).select((x) => {
                            return {
                                categoryId: categoryOption.categoryId,
                                optionId: x.id
                            };
                        }).toArray();
                    }).toArray();
                }

                function init(template, success) {
                    var vm = new Vue({
                        data: {
                            categoryOptions: initData.categoryOptions
                        },
                        template: template,
                        methods: {
                            optionChanged: function () {
                                events.onChange.invoke(getCheckedOptions(this));
                            },
                            getHtmlId: function (categoryId, optionId) {
                                return strings.format('option_{0}_{1}', categoryId, optionId);
                            }
                        }
                    });

                    container.setContent($html);
                    vm.$mount($html[0]);

                    success(control);
                }

                return promise.create(function (success) {
                    templatesHtmlProvider.init('shopping').getHtml(['optionsFilter']).then(function (obj) {
                        app.ignoreParams(initData);
                        init(obj['optionsFilter'], success);
                    });
                });
            }
        } as UI.IOptionsFilterFactory;
    }
]);
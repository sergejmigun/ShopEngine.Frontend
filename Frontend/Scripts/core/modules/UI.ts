app.registerModule('UI', [
    'Promise',
    'Components',
    'Utils.objects',
    'Services.containerHelper',
    function (promise: IPromise,
        templates: ITemplates,
        objects: Utils.IObjects,
        containerHelper: Services.IContainerHelper) {
        'use strict';

        function initControl(component, componentName) {
            var controlInit = component.init;

            component.init = function () {
                var initPromise,
                    initData;

                if (arguments.length === 1) {
                    initData = objects.clone(arguments[0]) || {};
                    initPromise = controlInit(initData);
                } else {
                    initData = objects.clone(arguments[1]) || {};
                    initPromise = controlInit(arguments[0], initData);
                }

                return initPromise.then(function (control) {
                    control.name = initData.name;

                    var controlRemove = control.remove;

                    control.type = componentName;
                    control.remove = function () {
                        control.removed = true;

                        if (controlRemove) {
                            controlRemove();
                        }
                    };

                    return control;
                });
            };
        }

        return {
            module: {
                renderItem: function ($wrapper, containerReady, itemModel, defaultContent, autoTruncatedContent) {
                    var module = this;

                    function renderText(text, success) {
                        if (autoTruncatedContent) {
                            module.truncatedText.init(containerHelper.appendTo($wrapper, containerReady), {
                                text: text
                            }).then(function () {
                                success();
                            });
                        } else {
                            $wrapper.text(text);
                            success();
                        }
                    }

                    return promise.create(function (success) {
                        function renderDefaultContent(success) {
                            if (objects.isJQueryObj(defaultContent)) {
                                $wrapper.append(defaultContent);
                                success();
                            } else {
                                renderText(defaultContent, success);
                            }
                        }

                        if (!itemModel) {
                            renderDefaultContent(success);

                            return;
                        }

                        if (itemModel.css) {
                            $wrapper.attr('class', itemModel.css);
                        }

                        if (itemModel.text) {
                            renderText(itemModel.text, success);
                        } else if (itemModel.html) {
                            $wrapper.html('').append(itemModel.html);
                            success();
                        } else if (itemModel.render) {
                            itemModel.render(itemModel.data, function (content) {
                                $wrapper.append(content);
                                success();
                            });
                        } else if (itemModel.template) {
                            templates.init(itemModel.template, containerHelper.custom(function (content) {
                                $wrapper.append(content);
                            }, containerReady)).then(function (template) {
                                success(template);
                            });
                        } else {
                            renderDefaultContent(success);
                        }
                    });
                }
            } as IUi,
            initComponent: function (component, componentName) {
                if (component.hasOwnProperty('init')) {
                    initControl(component, componentName);
                }
            }
        };
    }
]);
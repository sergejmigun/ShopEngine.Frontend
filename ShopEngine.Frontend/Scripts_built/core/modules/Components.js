app.registerModule('Components', [
    '$',
    'Utils.objects',
    'Services.eventsInitializer',
    function ($, objects, eventsInitializer) {
        'use strict';
        function initTemplate(component, componentName) {
            var templateInit = component.init;
            component.init = function (model, container) {
                var initialSetContent = container.setContent, templateContent;
                container.setContent = function (content) {
                    if (!objects.isJQueryObj(content)) {
                        templateContent = $(content);
                    }
                    else {
                        templateContent = content;
                    }
                    initialSetContent(templateContent);
                };
                function initTemplateInstance(templateModel, container) {
                    return templateInit.call(component, templateModel, container).then(function (template) {
                        var initialTemplateRemove = template.remove, thisTemplateContent = templateContent, onRemove = eventsInitializer.initVoidEvent();
                        template.name = componentName;
                        template.remove = function () {
                            thisTemplateContent.remove();
                            if (initialTemplateRemove) {
                                initialTemplateRemove();
                            }
                            onRemove.invoke();
                        };
                        template.onRemove = onRemove.event;
                        template.reinit = function (model) {
                            var containerWrapper = objects.clone(container);
                            containerWrapper.setContent = function (content) {
                                container.setContent(content);
                                template.remove();
                            };
                            return initTemplateInstance(model || templateModel, containerWrapper).then(function (newTemplate) {
                                return newTemplate;
                            });
                        };
                        template.getContainer = function () {
                            return container;
                        };
                        return template;
                    });
                }
                return initTemplateInstance(model, container);
            };
        }
        return {
            module: {
                initContentProvider: function ($templateElement) {
                    var html = $templateElement.html();
                    $templateElement.remove();
                    return {
                        getContent: function () {
                            return $(html);
                        }
                    };
                },
                init: function (initData, container) {
                    return initData.factory.init(initData.model, container).then(function (template) {
                        if (initData.onInit) {
                            initData.onInit(template);
                        }
                        return template;
                    });
                }
            },
            initComponent: function (component, componentName) {
                initTemplate(component, componentName);
                return component;
            }
        };
    }
]);

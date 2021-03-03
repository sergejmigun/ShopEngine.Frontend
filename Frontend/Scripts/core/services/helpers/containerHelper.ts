app.registerComponent('containerHelper', 'Services', [
    'Promise',
    'Services.eventsInitializer',
    function (promise: IPromise,
        eventsInitializer: Services.Initialization.IEventsInitializer) {
        'use strict';

        function initContainer(setContentAction: ($content: JQuery | string) => void, parentReady: Promise<any>, beforeSetContentAction?: () => void) {
            var onSetContent = eventsInitializer.initVoidEvent();
            var setContentPromise = promise.create(function (success) {
                onSetContent.event(function () {
                    success();
                });
            });

            var container = {
                setContent: function ($content) {
                    if (beforeSetContentAction) {
                        beforeSetContentAction();
                    }

                    setContentAction($content);
                    onSetContent.invoke();
                },
                ready: function () {
                    return promise.all([setContentPromise, parentReady]);
                }
            } as IContainer;

            return container;
        }

        return {
            replace: function ($el, parentReady: Promise<any>, beforeSetContentAction?: () => void) {
                return initContainer(function ($content) {
                    $el.replaceWith($content);
                }, parentReady, beforeSetContentAction);
            },
            appendTo: function ($container, parentReady: Promise<any>, beforeSetContentAction?: () => void) {
                return initContainer(function ($content) {
                    $container.append($content);
                }, parentReady, beforeSetContentAction);
            },
            prependTo: function ($container, parentReady: Promise<any>, beforeSetContentAction?: () => void) {
                return initContainer(function ($content) {
                    $container.prepend($content);
                }, parentReady, beforeSetContentAction);
            },
            custom: function (setContent, parentReady: Promise<any>, beforeSetContentAction?: () => void) {
                return initContainer(setContent, parentReady, beforeSetContentAction);
            },
            provide: function ($container) {
                return {
                    getContent: () => $container
                }
            },
            extractContainer: function(container) {
                return {
                    setContent: container.setContent,
                    ready: container.ready
                };
            }
        } as Services.IContainerHelper
    }
]);


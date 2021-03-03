﻿app.registerComponent('componentInitializationHelper', 'Services', [
    'Utils.objects',
    function (objects: Utils.IObjects) {
        'use strict';

        var service: Services.Initialization.IComponentInitializationHelper = {
            forInputControl: function (factory, initData, onInit) {
                return {
                    init: function (container, overridenInitData) {
                        if (overridenInitData) {
                            objects.extend(overridenInitData, initData, true);
                        }

                        var inputPromise = factory.init(container, initData);

                        if (onInit) {
                            inputPromise.then(function (control) {
                                onInit(control);
                            });
                        }

                        return inputPromise;
                    }
                };
            },
            forTemplate: function (factory, model, onInit) {
                return {
                    factory: factory,
                    model: model,
                    onInit: onInit
                };
            }
        };

        return service;
    }
]);
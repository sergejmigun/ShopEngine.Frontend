app.registerComponent('formInitHelper', 'Services.forms', [
    'Promise',
    'Collections',
    'Components',
    'Resources.UICore',
    'UI.buttons',
    'UI.modals',
    'Services.viewHelper',
    'Services.containerHelper',
    'Services.eventsInitializer',
    'Components.wrapperWithButtons',
    function (promise: IPromise,
        collections: ICollections,
        templates: ITemplates,
        resourcesCore: Resources.UICore,
        buttons: UI.IButtonsFactory,
        modals: UI.IModalsFactory,
        viewHelper: Services.Helpers.IViewHelper,
        containerHelper: Services.IContainerHelper,
        eventsInitializer: Services.Initialization.IEventsInitializer,
        wrapperWithButtons: Components.Common.IWrapperWithButtonsFactory) {
        'use strict';

        function getSubmitButtonData(templateObj, event: Services.Initialization.IEventInitResult<any>) {
            return buttons.getData(UI.ButtonType.Submit, {
                css: 'pull-right',
                action: function () {
                    return templateObj.template.submit().then(function (data) {
                        var result = {
                            status: Constants.FormActionStatus.Submitted,
                            data: data
                        };

                        event.invoke(data);

                        return result;
                    });
                }
            });
        }

        function getCancelButtonData(templateObj, event: Services.Initialization.IVoidEventInitResult) {
            return buttons.getData(UI.ButtonType.Cancel, {
                css: 'pull-right margin-r-10',
                action: function () {
                    return promise.create(function (success) {
                        function cancel() {
                            event.invoke();

                            success({
                                status: Constants.FormActionStatus.Canceled
                            });
                        }

                        if (templateObj.template.hasUnsubmittedChanges()) {
                            modals.confirm({
                                title: 'Warning',
                                message: 'Are you sure you want to close the modal?'
                            }).then(function () {
                                cancel();
                            });
                        } else {
                            cancel();
                        }
                    });
                }
            });
        }

        var formInitHelper: Services.Helpers.IFormInitHelper = {
            openModal: function (initData) {
                var events = {
                    onSubmit: eventsInitializer.initEvent<any>(),
                    onCancel: eventsInitializer.initVoidEvent()
                };

                var modalInitData = {
                    title: initData.title,
                    externalUrl: initData.externalUrl,
                    large: initData.large,
                    template: initData.innerTemplateData,
                    initButtons: function ($container, modalHelper) {
                        var container = containerHelper.appendTo($container, promise.empty()),
                            submitButtonData = getSubmitButtonData(modalHelper, events.onSubmit),
                            cancelButtonData = getCancelButtonData(modalHelper, events.onCancel),
                            submitButtonInitAction = submitButtonData.action,
                            cancelButtonInitAction = cancelButtonData.action;

                        submitButtonData.action = function () {
                            submitButtonInitAction().then(function (res) {
                                modalHelper.modal.close();

                                return res;
                            });
                        };

                        cancelButtonData.action = function () {
                            cancelButtonInitAction().then(function (res) {
                                modalHelper.modal.close();

                                return res;
                            });
                        };

                        if (initData.readOnly) {
                            cancelButtonData.text = resourcesCore.close;
                        } else {
                            buttons.doAction(submitButtonData, container);
                        }

                        buttons.doAction(cancelButtonData, container);
                    }
                };

                return viewHelper.open(modalInitData).then(function (modalResult) {
                    var result = modalResult as Services.Helpers.IFormModalHelperResult<any, any>;

                    result.onSubmit = events.onSubmit.event;
                    result.onCancel = events.onCancel.event;

                    return result;
                });
            },
            getWrapperTemplateData: function (initData) {
                var events = {
                    onSubmit: eventsInitializer.initEvent<any>(),
                    onCancel: eventsInitializer.initVoidEvent()
                };

                function getButtons(templateObj) {
                    var buttons = [];

                    if (initData.hasSubmitButton !== false) {
                        buttons.push(getSubmitButtonData(templateObj, events.onSubmit));
                    }

                    if (initData.hasCancelButton !== false) {
                        buttons.push(getCancelButtonData(templateObj, events.onCancel));
                    }

                    collections.safeForeach(initData.customButtons, function (customButton) {
                        buttons.push(customButton);
                    });

                    return buttons;
                }

                var targetTemplateObj = {
                    template: undefined
                };

                var wrapperTemplateData = {
                    factory: wrapperWithButtons,
                    model: {
                        templateData: initData.innerTemplateData,
                        buttons: getButtons(targetTemplateObj),
                        noLine: initData.noLine
                    } as any,
                    onInit: function (wrapperWithButtonsTemplate) {
                        targetTemplateObj.template = wrapperWithButtonsTemplate.getInnerTemplate();

                        if (initData.readOnly) {
                            wrapperWithButtonsTemplate.setReadOnly(initData.readOnly);
                        } else {
                            events.onCancel.event(function () {
                                targetTemplateObj.template.reset();
                            });
                        }

                        if (initData.onInit) {
                            initData.onInit(wrapperWithButtonsTemplate);
                        }
                    }
                }

                return {
                    templateData: wrapperTemplateData,
                    onSubmit: events.onSubmit.event,
                    onCancel: events.onCancel.event
                };
            },
            initWrapperTemplate: function (initData, container) {
                var result = formInitHelper.getWrapperTemplateData(initData);

                return templates.init(result.templateData, container).then(function (template) {
                    return {
                        onSubmit: result.onSubmit,
                        onCancel: result.onCancel,
                        wrapper: template
                    };
                });
            }
        };

        return formInitHelper; 
    }
]);
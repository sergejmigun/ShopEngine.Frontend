app.registerComponent('modals', 'UI', [
    '$',
    'Promise',
    'Components',
    'Utils.objects',
    'Collections',
    'Services.eventsInitializer',
    'Services.apiService',
    'Services.containerHelper',
    'Shared',
    function ($, promise, templates, objects, collections, eventsInitializer, apiService, containerHelper, shared) {
        'use strict';
        function createModalJQueryObjects(modalHtml) {
            var $modalWrapper = $(modalHtml), result = {
                modalWrapper: $modalWrapper,
                modalHeader: $modalWrapper.find('.modal-header'),
                modalTitle: $modalWrapper.find('.modal-title'),
                modalBody: $modalWrapper.find('.modal-body'),
                modalFooter: $modalWrapper.find('.modal-footer')
            };
            return result;
        }
        function showModal($modalWrapper, options, onModalShow) {
            var modalObj = {
                close: function () {
                    $modalWrapper['modal']('hide');
                }
            };
            var modalEvents = eventsInitializer.init(modalObj, ['onClose']);
            $(shared.document).find('#hiddenArea').append($modalWrapper);
            if (objects.tryGet(options, 'large')) {
                $modalWrapper.find('.modal-dialog:first').addClass('large-modal');
            }
            $modalWrapper['modal']('show');
            $modalWrapper.on('hidden.bs.modal', function () {
                $modalWrapper.remove();
                modalEvents.onClose.invoke();
            });
            $modalWrapper.on('shown.bs.modal', function () {
                if (onModalShow) {
                    onModalShow(modalObj);
                }
            });
            return modalObj;
        }
        return {
            confirm: function (confirmation) {
                function init(success) {
                    apiService.getTemplateHtml('modalTemplate').then(function (modalHtml) {
                        var modalObjects = createModalJQueryObjects(modalHtml), $okButton = $('<button type="button" class="btn btn-primary" data-dismiss="modal">Ok</button>'), templateInst, onModalShow = eventsInitializer.initVoidEvent();
                        // custom logic
                        modalObjects.modalTitle
                            .append('<i class="glyphicon glyphicon-alert"></i>&nbsp;&nbsp;')
                            .append(confirmation.title);
                        modalObjects.modalBody.append(confirmation.message);
                        modalObjects.modalFooter.append($okButton);
                        if (confirmation.template) {
                            var $templateWrapper = $('<div />'), tempalteData = confirmation.template;
                            modalObjects.modalBody.append($templateWrapper);
                            tempalteData.setContent = function (templateContent) {
                                $templateWrapper.append(templateContent);
                            };
                            var readyPromise = promise.create(function (success) {
                                onModalShow.event(function () {
                                    success();
                                });
                            });
                            templates.init(confirmation.template, containerHelper.appendTo($templateWrapper, readyPromise)).then(function (template) {
                                templateInst = template;
                            });
                        }
                        $okButton.click(function () {
                            success(templateInst);
                        });
                        showModal(modalObjects.modalWrapper, null, function () {
                            onModalShow.invoke();
                        });
                    });
                }
                return promise.create(function (success) {
                    init(success);
                });
            },
            openSubmit: function (title, $content) {
                function init(success) {
                    apiService.getTemplateHtml('modalTemplate').then(function (modalHtml) {
                        var modalObjects = createModalJQueryObjects(modalHtml), $submitButton = $('<button type="button" class="btn btn-primary" data-dismiss="modal">Submit</button>');
                        modalObjects.modalTitle.append(title);
                        modalObjects.modalBody.append($content);
                        modalObjects.modalFooter.append($submitButton);
                        $submitButton.click(function () {
                            success();
                        });
                        showModal(modalObjects.modalWrapper);
                    });
                }
                return promise.create(function (success) {
                    init(success);
                });
            },
            openCustom: function (title, $content, options) {
                function init(success) {
                    apiService.getTemplateHtml('modalTemplate').then(function (modalHtml) {
                        var modalObjects = createModalJQueryObjects(modalHtml);
                        modalObjects.modalTitle.append(title);
                        modalObjects.modalBody.append($content);
                        if (options) {
                            if (objects.isEmptyArray(options.buttons)) {
                                modalObjects.modalFooter.remove();
                            }
                            else {
                                collections.foreach(options.buttons, function ($button) {
                                    modalObjects.modalFooter.append($button);
                                });
                            }
                        }
                        showModal(modalObjects.modalWrapper, options, success);
                    });
                }
                return promise.create(function (success) {
                    init(success);
                });
            }
        };
    }
]);

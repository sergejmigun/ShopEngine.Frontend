app.registerComponent('modalHelper', 'Services', [
    '$',
    'Promise',
    'Components',
    'Utils.urls',
    'Services.containerHelper',
    'Services.eventsInitializer',
    'UI.modals',
    function ($, promise, templates, urls, containerHelper, eventsInitializer, modals) {
        'use strict';
        var helper = {
            open: function (initData) {
                function initTemplate(done, $bodyWrapper, $title, $wrapper) {
                    var result = {};
                    if (initData.initButtons) {
                        var $buttonsWrapper = $('<div class="box-footer" />');
                        $wrapper.append($buttonsWrapper);
                        initData.initButtons($buttonsWrapper, result);
                    }
                    var modalReadyEvent = eventsInitializer.initVoidEvent(), readyPromise = promise.create(function (success) {
                        modalReadyEvent.event(success);
                    });
                    templates.init(initData.template, containerHelper.appendTo($bodyWrapper, readyPromise)).then(function (template) {
                        modals.openCustom($title, $wrapper, {
                            large: initData.large !== false
                        }).then(function (modal) {
                            modalReadyEvent.invoke();
                            urls.setActionUrlHash(initData.externalUrl, true);
                            modal.onClose(function () {
                                urls.popUrlHash();
                            });
                            result.template = template;
                            result.modal = modal;
                            done(result);
                        });
                    });
                }
                function init(success) {
                    var $wrapper = $('<div />'), $bodyWrapper = $('<div class="body-wrapper" />'), $title = $('<a target="_blank" class="modal-link-title" />')
                        .append(initData.title)
                        .append('<i class="fa fa-external-link"></i>')
                        .attr('href', initData.externalUrl);
                    $wrapper.append($bodyWrapper);
                    initTemplate(success, $bodyWrapper, $title, $wrapper);
                }
                return promise.create(function (success) {
                    init(success);
                });
            }
        };
        return helper;
    }
]);

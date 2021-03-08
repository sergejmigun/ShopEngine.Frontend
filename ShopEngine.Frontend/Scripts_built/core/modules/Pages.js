app.registerModule('Pages', [
    'Promise',
    '$',
    'Utils.objects',
    'Shared.pageContext',
    function (promise, $, objects, sharedPageContext) {
        'use strict';
        var onPageContrextInit;
        sharedPageContext.context = promise.create(function (success) {
            onPageContrextInit = success;
        });
        function initPage(component) {
            var pageInit = component.init;
            component.init = function () {
                $(document).ready(function () {
                    var $pageContextHidden = $('#pageContextHidden'), pageContext = objects.parseJson($pageContextHidden.val());
                    onPageContrextInit(pageContext);
                    pageInit.call(component, pageContext);
                });
            };
        }
        return {
            module: {
                init: function (pageName) {
                    return this[pageName].init();
                }
            },
            initComponent: function (component) {
                initPage(component);
                return component;
            }
        };
    }
]);

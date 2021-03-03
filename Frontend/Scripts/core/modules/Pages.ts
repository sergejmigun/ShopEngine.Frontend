app.registerModule('Pages', [
    '$',
    'Utils.objects', function ($: JQueryStatic, objects: Utils.IObjects) {
    'use strict';

    function initPage(component) {
        var pageInit = component.init;

        component.init = function () {
            $(document).ready(function () {
                var $pageContextHidden = $('#pageContextHidden'),
                    pageContext = objects.parseJson($pageContextHidden.val() as string);

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
}]);

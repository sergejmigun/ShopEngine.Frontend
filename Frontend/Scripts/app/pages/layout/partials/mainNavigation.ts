app.registerComponent('mainNavigation', 'Components', [
    '$',
    'Promise',
    'Shared',
    'Services.apiService',
    function (
        $: JQueryStatic,
        promise: IPromise,
        shared,
        apiService: Services.IApiService) {
        'use strict';

        return {
            init: function (model, container) {
                var template = {},
                    _$html: JQuery;

                function initSideBarTree(success) {
                    var animationSpeed = 500;

                    $(shared.document).on('click', '.sidebar li a', function (e) {
                        //Get the clicked link and the next element
                        var $this = $(this);
                        var checkElement = $this.next();

                        //Check if the next element is a menu and is visible
                        if (checkElement.is('.treeview-menu') && checkElement.is(':visible')) {
                            //Close the menu
                            checkElement.slideUp(animationSpeed, function () {
                                checkElement.removeClass('menu-open');
                                //Fix the layout in case the sidebar stretches over the height of the window
                                //_this.layout.fix();
                            });
                            checkElement.parent("li").removeClass("active");
                        } else if (checkElement.is('.treeview-menu') && !checkElement.is(':visible')) {
                            //Get the parent menu
                            var parent = $this.parents('ul').first();
                            //Close all open menus within the parent
                            var ul = parent.find('ul:visible').slideUp(animationSpeed);
                            //Remove the menu-open class from the parent
                            ul.removeClass('menu-open');
                            //Get the parent li
                            var parent_li = $this.parent("li");

                            //Open the target menu and add the menu-open class
                            checkElement.slideDown(animationSpeed, function () {
                                //Add the class active to the parent li
                                checkElement.addClass('menu-open');
                                parent.find('li.active').removeClass('active');
                                parent_li.addClass('active');
                            });
                        }

                        //if this isn't a link, prevent the page from being redirected
                        if (checkElement.is('.treeview-menu')) {
                            e.preventDefault();
                        }
                    });

                    success(template);
                }

                return promise.create(function (success) {
                    app.ignoreParams(model);
                    apiService.getTemplateHtml('mainNavigation').then(function (html) {
                        _$html = $(html);
                        container.setContent(_$html);
                        initSideBarTree(success);
                    });
                });
            }
        };
    }
]);
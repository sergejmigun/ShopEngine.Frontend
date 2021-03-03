app.registerComponent('pageFormHelper', 'Services', [
    'Resources.UI',
    'UI.buttons',
    'Collections',
    'Utils.objects',
    'Components',
    'Services.pageUrlHelper',
    'Services.eventsInitializer',
    'Services.initialization.tabsInitializer',
    'Services.forms.formInitHelper',
    function (resources: Resources.UI,
        buttons: UI.IButtonsFactory,
        colections: ICollections,
        objects: Utils.IObjects,
        templates: ITemplates,
        pageUrlHelper: Services.IPageUrlHelper,
        eventsInitializer: Services.Initialization.IEventsInitializer,
        tabsInitializer: Services.Initialization.ITabsInitializer,
        formInitHelper: Services.Helpers.IFormInitHelper) {
        'use strict';

        var _pageData: Services.IPageHashData;
        var _setPageShortDescription: Promise<(text: string) => void>;
        var _onCancelCreation = eventsInitializer.initVoidEvent();

        function initPageShortDescriptionSetter(container: IContainer) {
            _setPageShortDescription = container.ready().then(function () {
                return function (text) {
                    $('#pageShortDescription').text(text);
                };
            });
        }

        function setPageState(mode: Services.PageMode, pageDescription: string, id, tabIndex?) {
            _setPageShortDescription.then(function (setter) {
                setter(pageDescription);
            });

            window.location.hash = pageUrlHelper.getHashString({
                mode: mode,
                id: id,
                tabIndex: tabIndex
            });
        }

        function getTemplateData(
            data: Services.Helpers.IPageTemplateData,
            isPropName: string,
            container: IContainer,
            isViewMode: boolean,
            submitable: boolean,
            onSubmit) {
            function setId(data: Services.Helpers.IPageTemplateData) {
                data.formTemplateData.model[isPropName] = _pageData.id;
                data.viewTemplateData.model[isPropName] = _pageData.id;
            }

            function getViewTemplateData(data: Services.Helpers.IPageTemplateData, container: IContainer) {
                var wrapperTemplate;

                function showForm() {
                    var formTemplateData = getFormTemplateData(data, container);

                    wrapperTemplate.reinit(formTemplateData.model).then(function (template) {
                        formTemplateData.onInit(template);
                    });

                    _pageData.mode = Services.PageMode.edit;
                    pageUrlHelper.setHashData(_pageData);
                }

                var customButtons = objects.clone(data.viewTemplateCustomButtons || []);

                if (submitable) {
                    customButtons.push(buttons.getData('edit', {
                        action: function () {
                            showForm();
                        }
                    }));
                }

                var wrapperTemplateData = formInitHelper.getWrapperTemplateData({
                    innerTemplateData: data.viewTemplateData,
                    readOnly: true,
                    customButtons: customButtons,
                    onInit: function (template) { 
                        wrapperTemplate = template;
                    }
                });

                return wrapperTemplateData.templateData;
            }

            function getFormTemplateData(data: Services.Helpers.IPageTemplateData, container: IContainer) {
                var wrapperTemplate;

                function showView() {
                    var viewTemplateData = getViewTemplateData(data, container);

                    wrapperTemplate.reinit(viewTemplateData.model).then(function (template) {
                        viewTemplateData.onInit(template);
                    });

                    _pageData.mode = Services.PageMode.view;
                    pageUrlHelper.setHashData(_pageData);
                }

                var wrapperTemplateData = formInitHelper.getWrapperTemplateData({
                    innerTemplateData: data.formTemplateData,
                    onInit: function (template) {
                        wrapperTemplate = template;
                    },
                    customButtons: data.formTemplateCustomButtons
                });

                wrapperTemplateData.onCancel(function () {
                    if (_pageData.mode === Services.PageMode.create) {
                        _onCancelCreation.invoke();
                    } else {
                        showView();
                    }
                });

                wrapperTemplateData.onSubmit(function (response) {
                    if (_pageData.mode === Services.PageMode.create) {
                        _pageData.id = response.data.id;
                        setId(data);
                    }

                    showView();

                    if (onSubmit) {
                        onSubmit(response.data.id);
                    }
                });

                return wrapperTemplateData.templateData;
            }

            setId(data);

            if (isViewMode || !submitable) {
                return getViewTemplateData(data, container);
            } 

            return getFormTemplateData(data, container);
        }

        function initSingleView(data: Services.Helpers.ISingleViewData, container: IContainer) {
            var templateData = getTemplateData(
                data.viewData,
                data.idPropName,
                container,
                _pageData.mode === Services.PageMode.view,
                true,
                null);

            _onCancelCreation.event(data.cancelCreationAction);
            initPageShortDescriptionSetter(container);

            return templates.init(templateData, container);
        }

        function initTabs(tabsData: Services.Helpers.ITabsData, container: IContainer) {
            var currentTabsData = [],
                tabsDataRequireId = [],
                tabsControl: UI.ITabs;

            colections.foreach(tabsData.tabs, function (tab, i) {
                if (_pageData.mode === Services.PageMode.create && tab.requireId) {
                    tabsDataRequireId.push({
                        tabData: tab,
                        index: i
                    });
                } else {
                    currentTabsData.push(tab);
                }
            });

            function getTab(tabData: Services.Helpers.ITabPageData) {
                var tab: UI.ITab = {
                    header: {
                        render: function (data, append) {
                            var $icon = $('<i class="fa margin-r-10"></i>').addClass(tabData.tabIconCss);

                            append($('<span />').append($icon).append(tabData.tabTitle), data);
                        }
                    },
                    content: {
                        template: getTemplateData(
                            tabData.viewData,
                            tabsData.idPropName,
                            container,
                            _pageData.mode === Services.PageMode.view,
                            tabData.submitable,
                            function (identity) {
                                if (tabData.onSubmit) {
                                    tabData.onSubmit(identity);
                                }

                                colections.safeForeach(tabsDataRequireId, function (item) {
                                    tabsControl.addTab(getTab(item.tabData), item.index);
                                });

                                tabsDataRequireId = null;
                            })
                    }
                };

                return tab;
            }

            initPageShortDescriptionSetter(container);
            _onCancelCreation.event(tabsData.cancelCreationAction);

            return tabsInitializer.initTabs({
                container: container,
                tabs: colections.from(currentTabsData).select(getTab).toArray(),
                activeTabIndex: _pageData.tabIndex || 0
            }).then(function (tabs) {
                tabs.onTabChanged(function (tab) {
                    _pageData.tabIndex = tab.index;
                    pageUrlHelper.setHashData(_pageData);
                    setPageState(_pageData.mode, resources.creation, _pageData.id, tab.index);
                    app.ignoreParams(tab);
                });

                tabsControl = tabs;

                return tabs;
            });
        }

        var pageFormHelper: Services.Helpers.IPageFormHelper = {
            initSingleView: function (data, container) {
                _pageData = pageUrlHelper.parseHashData();

                return initSingleView(data, container);
            },
            initTabs: function (data, container) {
                _pageData = pageUrlHelper.parseHashData();

                return initTabs(data, container);
            }
        };

        return pageFormHelper;
    }
]);
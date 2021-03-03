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
    function (resources, buttons, colections, objects, templates, pageUrlHelper, eventsInitializer, tabsInitializer, formInitHelper) {
        'use strict';
        var _pageData;
        var _setPageShortDescription;
        var _onCancelCreation = eventsInitializer.initVoidEvent();
        function initPageShortDescriptionSetter(container) {
            _setPageShortDescription = container.ready().then(function () {
                return function (text) {
                    $('#pageShortDescription').text(text);
                };
            });
        }
        function setPageState(mode, pageDescription, id, tabIndex) {
            _setPageShortDescription.then(function (setter) {
                setter(pageDescription);
            });
            window.location.hash = pageUrlHelper.getHashString({
                mode: mode,
                id: id,
                tabIndex: tabIndex
            });
        }
        function getTemplateData(data, isPropName, container, isViewMode, submitable, onSubmit) {
            function setId(data) {
                data.formTemplateData.model[isPropName] = _pageData.id;
                data.viewTemplateData.model[isPropName] = _pageData.id;
            }
            function getViewTemplateData(data, container) {
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
            function getFormTemplateData(data, container) {
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
                    }
                    else {
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
        function initSingleView(data, container) {
            var templateData = getTemplateData(data.viewData, data.idPropName, container, _pageData.mode === Services.PageMode.view, true, null);
            _onCancelCreation.event(data.cancelCreationAction);
            initPageShortDescriptionSetter(container);
            return templates.init(templateData, container);
        }
        function initTabs(tabsData, container) {
            var currentTabsData = [], tabsDataRequireId = [], tabsControl;
            colections.foreach(tabsData.tabs, function (tab, i) {
                if (_pageData.mode === Services.PageMode.create && tab.requireId) {
                    tabsDataRequireId.push({
                        tabData: tab,
                        index: i
                    });
                }
                else {
                    currentTabsData.push(tab);
                }
            });
            function getTab(tabData) {
                var tab = {
                    header: {
                        render: function (data, append) {
                            var $icon = $('<i class="fa margin-r-10"></i>').addClass(tabData.tabIconCss);
                            append($('<span />').append($icon).append(tabData.tabTitle), data);
                        }
                    },
                    content: {
                        template: getTemplateData(tabData.viewData, tabsData.idPropName, container, _pageData.mode === Services.PageMode.view, tabData.submitable, function (identity) {
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
        var pageFormHelper = {
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

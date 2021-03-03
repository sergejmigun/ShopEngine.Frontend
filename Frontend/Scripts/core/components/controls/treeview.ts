app.registerComponent('treeView', 'UI', [
    '$',
    'Promise',
    'Utils.objects',
    'Collections',
    'Services.eventsInitializer',
    'UI',
    function ($: JQueryStatic,
        promise: IPromise,
        objects: Utils.IObjects,
        collections: ICollections,
        eventsInitializer: Services.Initialization.IEventsInitializer,
        ui: IUi) {
        'use strict';

        return {
            init: function (container, initData) {
                var control = {} as UI.ITreeView,
                    _$wrapper = $('<div class="tree-view" />'),
                    _$nodesContainer: JQuery,
                    _nodesData = [],
                    _events = eventsInitializer.init(control, ['renderCompleted', 'renderItemCompleted', 'onToggle']);

                function getToggleButton() {
                    return $('<span class="tree-view-node-toggle" />');
                }

                function getLoadingIndicator() {
                    return $('<i class="glyphicon glyphicon-refresh spinning tree-view-node-spinner" />');
                }

                function getNodesContainer() {
                    return $('<ul class="tree-view-list" />');
                }

                function getElementContainer() {
                    var html = '<div class="tree-view-label">'
                            + '  <div class="node-content-area">'
                            + '    <span class="nodeContentArea" />'
                            + '  </div>'
                            + '</div>';

                    var $el = $(html).wrap('<li class="tree-view-node treeViewNode" />');

                    return $el.parent();
                }

                function walkNodes(nodesData, action) {
                    if (!nodesData) {
                        return;
                    }

                    collections.foreach(nodesData as any[], function (nodeData) {
                        action(nodeData.node);
                        walkNodes(nodeData.nodesData, action);
                    });
                }

                function walkChildNodes(nodesData, action) {
                    if (!nodesData) {
                        return;
                    }

                    collections.foreach(nodesData as any[], function (nodeData) {
                        action(nodeData.node);
                    });
                }

                function buildNode(node, parentNodeData, index?) {
                    function initToggling($toggleButton, nodeData) {
                        function toggleNodes() {
                            var $childNodesArea = nodeData.element.find('.childNodesArea:first');

                            function show() {
                                nodeData.element.removeClass('tree-view-node-collapsed');
                                $childNodesArea.show();
                            }

                            if (nodeData.node.expanded) {
                                if (nodeData.node.lazyLoading) {
                                    var $loadingIndicator = getLoadingIndicator();

                                    $toggleButton.hide();
                                    $loadingIndicator.insertAfter($toggleButton);

                                    nodeData.node.lazyLoading(nodeData.node.data).then(function (nodes) {
                                        delete nodeData.node.lazyLoading;
                                        $loadingIndicator.remove();
                                        $toggleButton.show();

                                        collections.foreach(nodes, function (childNode) {
                                            buildNode(childNode, nodeData);
                                        });
                                        show();
                                    });
                                } else {
                                    show();
                                }
                            } else {
                                nodeData.element.addClass('tree-view-node-collapsed');
                                $childNodesArea.hide();
                            }
                        }

                        $toggleButton.click(function () {
                            nodeData.node.expanded = !nodeData.node.expanded;
                            toggleNodes();
                            _events.onToggle.invoke(nodeData.node.data, nodeData.node.expanded);
                        });

                        toggleNodes();
                    }

                    function initSelection(nodeData) {
                        if (!nodeData.node.selectable) {
                            return;
                        }

                        var $cb = $('<input type="checkbox" class="tree-view-selector" />');
                        nodeData.element.prepend($cb);
                        nodeData.checkBoxElement = $cb;
                        nodeData.element.addClass('selectable');

                        function setSelection(currentNodeData) {
                            if (!currentNodeData.node.selectable) {
                                return;
                            }

                            currentNodeData.checkBoxElement.prop('checked', currentNodeData.node.selected);
                        }

                        function deselectParentsNodes(currentNodeData) {
                            if (currentNodeData.parentNodeData && currentNodeData.parentNodeData.node) {
                                currentNodeData.parentNodeData.node.selected = false;
                                setSelection(currentNodeData.parentNodeData);
                                deselectParentsNodes(currentNodeData.parentNodeData);
                            }
                        }

                        function selectChildNodes(currentNodeData) {
                            if (currentNodeData.nodesData) {
                                collections.foreach(currentNodeData.nodesData as any[], function (childNodeData) {
                                    childNodeData.node.selected = currentNodeData.node.selected;
                                    setSelection(childNodeData);
                                    selectChildNodes(childNodeData);
                                });
                            }
                        }

                        $cb.change(function () {
                            nodeData.node.selected = $cb.prop('checked');
                            selectChildNodes(nodeData);

                            if (!nodeData.node.selected) {
                                deselectParentsNodes(nodeData);
                            }
                        });

                        setSelection(nodeData);
                    }

                    function initChildNodesContainer(nodeData) {
                        nodeData.childNodesContainer = getNodesContainer();
                        nodeData.toggleButton = getToggleButton();
                        nodeData.nodesData = [];
                        nodeData.element.append(nodeData.childNodesContainer.wrap('<div class="child-nodes-area childNodesArea" />').parent());
                        nodeData.element.prepend(nodeData.toggleButton);

                        initToggling(nodeData.toggleButton, nodeData);
                    }

                    function initNodeActions(nodeData) {
                        function checkChildNodesContainer() {
                            if (!nodeData.nodesData) {
                                initChildNodesContainer(nodeData);
                            }
                        }

                        nodeData.node.remove = function () {
                            collections.remove(nodeData.parentNodeData.nodesData, function (nodeData) {
                                return nodeData.node === node;
                            });

                            nodeData.element.remove();

                            if (!nodeData.parentNodeData.nodesData) {
                                nodeData.parentNodeData.toggleButton.remove();
                                nodeData.parentNodeData.element.find('.childNodesArea').remove();
                                delete nodeData.parentNodeData.nodesData;
                            }
                        };

                        nodeData.node.insert = function (index, node) {
                            checkChildNodesContainer();
                            buildNode(node, nodeData, index);
                        };

                        nodeData.node.append = function (node) {
                            checkChildNodesContainer();
                            buildNode(node, nodeData);
                        };

                        nodeData.node.prepend = function (node) {
                            checkChildNodesContainer();
                            buildNode(node, nodeData.parentNodeData, 0);
                        };

                        nodeData.node.after = function (node) {
                            var currentIndex = collections.indexOf(nodeData.parentNodeData.nodesData, nodeData);
                            buildNode(node, nodeData.parentNodeData, currentIndex + 1);
                        };

                        nodeData.node.before = function (node) {
                            var currentIndex = collections.indexOf(nodeData.parentNodeData.nodesData, nodeData);
                            buildNode(node, nodeData.parentNodeData, currentIndex);
                        };

                        nodeData.node.walkChildNodes = function (action) {
                            walkChildNodes(nodeData.nodesData, action);
                        };

                        nodeData.node.walkNodes = function (action) {
                            walkNodes(nodeData.nodesData, action);
                        };
                    }

                    var nodesData = parentNodeData.nodesData,
                        nodeData = {
                            node: node,
                            element: getElementContainer(),
                            parentNodeData: parentNodeData
                        },
                        buildPromises = [];

                    node.parent = parentNodeData.node;
                    node.tree = control;

                    if (index === undefined) {
                        nodesData.push(nodeData);
                        parentNodeData.childNodesContainer.append(nodeData.element);
                    } else {
                        if (index > nodesData.length) {
                            index = nodesData.length;
                        }

                        collections.insert(nodesData, index, nodeData);

                        if (index === 0) {
                            parentNodeData.childNodesContainer.prepend(nodeData.element);
                        } else {
                            parentNodeData.childNodesContainer.children("li.treeViewNode:eq(" + (index - 1) + ")").after(nodeData.element);
                        }
                    }

                    if (nodeData.node.data) {
                        nodeData.node.data.getNode = function () {
                            return nodeData.node;
                        };
                    }

                    var buildPromise = ui.renderItem(
                        nodeData.element.find('.nodeContentArea'),
                        container.ready(),
                        nodeData.node,
                        objects.tryGet(nodeData.node.data, 'text'),
                        true
                    );

                    buildPromise.then(function (res) {
                        _events.renderItemCompleted.invoke(res);

                        if (nodeData.node.renderCompleted) {
                            nodeData.node.renderCompleted(res);
                        }

                        return res;
                    });

                    buildPromises.push(buildPromise);

                    if (!objects.isEmptyArray(node.nodes) || node.lazyLoading) {
                        initChildNodesContainer(nodeData);

                        if (node.nodes) {
                            collections.foreach(node.nodes, function (childNode) {
                                collections.copy(buildNode(childNode, nodeData), buildPromises);
                            });
                        }
                    }

                    initSelection(nodeData);
                    initNodeActions(nodeData);

                    return buildPromises;
                }

                function init(success) {
                    var buildPromises = [];

                    _$nodesContainer = getNodesContainer();
                    _$wrapper.append(_$nodesContainer);
                    container.setContent(_$wrapper);

                    collections.foreach(initData.nodes, function (node) {
                        var buildNodePromises = buildNode(node, {
                            childNodesContainer: _$nodesContainer,
                            nodesData: _nodesData
                        });

                        collections.copy(buildNodePromises, buildPromises);
                    });

                    promise.all(buildPromises).then(function () {
                        _events.renderCompleted.invoke();
                    });

                    success(control);
                }

                control.insert = function (index, node) {
                    buildNode(node, {
                        childNodesContainer: _$nodesContainer,
                        nodesData: _nodesData
                    }, index);
                };

                control.append = function (node) {
                    buildNode(node, {
                        childNodesContainer: _$nodesContainer,
                        nodesData: _nodesData
                    });
                };

                control.prepend = function (node) {
                    buildNode(node, {
                        childNodesContainer: _$nodesContainer,
                        nodesData: _nodesData
                    }, 0);
                };

                control.walkTree = function (action) {
                    walkNodes(_nodesData, action);
                };

                control.walkChildNodes = function (action) {
                    walkChildNodes(_nodesData, action);
                };

                return promise.create(function (success) {
                    init(success);
                });
            }
        } as UI.ITreeViewFactory;
    }
]);
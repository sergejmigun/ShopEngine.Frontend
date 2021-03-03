app.registerComponent('conditionsBuilder', 'UI', [
    '$',
    'Promise',
    'Utils.objects',
    'Utils.dom',
    'Collections',
    'Services.containerHelper',
    'UI.buttons',
    'UI.dropDownMenu',
    'UI.singleSelectList',
    'UI.typedInput',
    function ($, promise, objects, collections, containerHelper, buttons, dropDownMenu, singleSelectList, typedInput) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {}, _$wrapper = $('<div class="conditions-builder" />'), _data = initData.conditionsData || {};
                function setNodata($container) {
                    $container.append('<div class="no-data noData">No conditions added</div>');
                }
                function getConditionWrapper($container) {
                    var $conditionWrapper = $('<div class="condition-item-wrapper" />');
                    $conditionWrapper.wrap('<div class="condition-wrapper" />').wrap('<div class="condition-wrapper-inner" />');
                    $container.append($conditionWrapper.parent().parent());
                    return $conditionWrapper;
                }
                function initCondition(condition, $container) {
                    $container.find('>.noData').remove();
                    var $conditionWrapper = getConditionWrapper($container), $row = $('<div class="row" />'), $operandCol = $('<div class="col-md-2" />'), $predicateActionCol = $('<div class="col-md-2" />'), $predicateValueCol = $('<div class="col-md-7" />'), $deleteButtonCol = $('<div class="col-md-1" />');
                    function initPredicateValue(predicate) {
                        function initControl() {
                            return predicate.initControl(containerHelper.appendTo($predicateValueCol, container.ready()));
                        }
                        function initTypedInput() {
                            var typeInitData = {};
                            if (predicate.options) {
                                typeInitData[predicate.type] = predicate.options;
                            }
                            return typedInput.init(containerHelper.appendTo($predicateValueCol, container.ready()), {
                                type: predicate.type,
                                value: condition.predicateValue,
                                typeInitData: typeInitData
                            });
                        }
                        var controlPromise;
                        $predicateValueCol.html('');
                        if (predicate.initControl) {
                            controlPromise = initControl();
                        }
                        else if (predicate.type) {
                            controlPromise = initTypedInput();
                        }
                        else {
                            condition.predicateValue = null;
                            return;
                        }
                        controlPromise.then(function (inst) {
                            inst.onChange(function () {
                                condition.predicateValue = inst.value();
                                condition.predicateValueControl = inst;
                            });
                        });
                    }
                    function initPredicateAction(operand) {
                        $predicateActionCol.html('');
                        var currentPredicate;
                        if (!condition.predicateId) {
                            condition.predicateId = operand.predicates[0].id;
                            currentPredicate = operand.predicates[0];
                        }
                        else {
                            currentPredicate = collections.from(operand.predicates).first(function (predicate) {
                                return predicate.id === condition.predicateId;
                            });
                        }
                        singleSelectList.init(containerHelper.appendTo($predicateActionCol, container.ready()), {
                            items: collections.from(operand.predicates).select(function (predicate) {
                                return {
                                    text: predicate.name,
                                    value: predicate.id,
                                    data: predicate
                                };
                            }).toArray(),
                            value: condition.predicateId,
                            fullWidth: true
                        }).then(function (inst) {
                            inst.onChange(function () {
                                if (condition.predicateValueControl) {
                                    condition.predicateValueControl.remove();
                                }
                                condition.predicateValue = null;
                                condition.predicateId = inst.value();
                                initPredicateValue(inst.getSelectedItem().data);
                            });
                        });
                        initPredicateValue(currentPredicate);
                    }
                    function initOperand() {
                        var currentOperand;
                        if (!condition.operandId) {
                            condition.operandId = initData.operands[0].id;
                            currentOperand = initData.operands[0];
                        }
                        else {
                            currentOperand = collections.from(initData.operands).first(function (operand) {
                                return operand.id === condition.operandId;
                            });
                        }
                        singleSelectList.init(containerHelper.appendTo($operandCol, container.ready()), {
                            items: collections.from(initData.operands).select(function (operand) {
                                return {
                                    text: operand.name,
                                    value: operand.id,
                                    data: operand
                                };
                            }).toArray(),
                            value: condition.operandId,
                            fullWidth: true
                        }).then(function (inst) {
                            inst.onChange(function () {
                                if (condition.predicateValueControl) {
                                    condition.predicateValueControl.remove();
                                }
                                condition.predicateValue = null;
                                condition.predicateId = null;
                                condition.operandId = inst.value();
                                initPredicateAction(inst.getSelectedItem().data);
                            });
                        });
                        initPredicateAction(currentOperand);
                    }
                    function initDeleteButton() {
                        buttons.remove({
                            css: 'pull-right',
                            size: UI.ButtonSize.XSmall,
                            action: function () { }
                        }, containerHelper.appendTo($deleteButtonCol, container.ready()));
                    }
                    $row.append($operandCol).append($predicateActionCol).append($predicateValueCol).append($deleteButtonCol);
                    $conditionWrapper.append($row);
                    initOperand();
                    initDeleteButton();
                }
                function initConditionsGroup(group, $container) {
                    $container.find('>.noData').remove();
                    var $conditionWrapper = getConditionWrapper($container), $conditionBar = $('<div class="condition-bar" />'), $conditionBody = $('<div class="condition-body" />');
                    $conditionWrapper.append($conditionBar).append($conditionBody);
                    function initConditionBar() {
                        var $conditionBarWrapper = $('<div class="row condition-bar-wrapper" />'), $andOrCol = $('<div class="col-md-6" />'), $buttonsCol = $('<div class="col-md-6" />');
                        function initAndOrSwitch() {
                            var $wrapper = $('<div class="btn-group" />'), $and = $('<button type="button" class="btn w-50 btn-sm">And</button>'), $or = $('<button type="button" class="btn w-50 btn-sm">Or</button>'), activeCss = 'btn-primary', inactiveCss = 'btn-default';
                            $wrapper.append($or).append($and);
                            $andOrCol.append($wrapper);
                            function setButtonsCss() {
                                function setCss($button, active) {
                                    if (active) {
                                        $button.addClass(activeCss);
                                        $button.removeClass(inactiveCss);
                                    }
                                    else {
                                        $button.addClass(inactiveCss);
                                        $button.removeClass(activeCss);
                                    }
                                }
                                setCss($and, group.conditionType === UI.ConditionType.And);
                                setCss($or, group.conditionType === UI.ConditionType.Or);
                            }
                            $and.click(function () {
                                group.conditionType = UI.ConditionType.And;
                                setButtonsCss();
                            });
                            $or.click(function () {
                                group.conditionType = UI.ConditionType.Or;
                                setButtonsCss();
                            });
                            if (group.conditionType !== UI.ConditionType.Or && group.conditionType !== UI.ConditionType.And) {
                                group.conditionType = UI.ConditionType.Or;
                            }
                            setButtonsCss();
                        }
                        function initButtons() {
                            var remove = buttons.getData('remove'), addCondition = buttons.getData('add'), addGroup = buttons.getData('add');
                            remove.action = function () {
                                return;
                            };
                            addCondition.text = 'Add single condition';
                            addCondition.iconColorCss = 'color-green';
                            addCondition.action = function () {
                                initCondition({
                                    conditionType: UI.ConditionType.And,
                                    isGroup: false
                                }, $conditionBody);
                            };
                            addGroup.text = 'Add conditions group';
                            addGroup.iconColorCss = 'color-green';
                            addGroup.action = function () {
                                initConditionsGroup({
                                    conditionType: UI.ConditionType.And,
                                    isGroup: true
                                }, $conditionBody);
                            };
                            dropDownMenu.init(containerHelper.appendTo($buttonsCol.wrap('<span class="pull-right" />').parent(), container.ready()), {
                                currentItemButton: addCondition,
                                items: [addGroup, remove]
                            });
                        }
                        $conditionBarWrapper.append($andOrCol).append($buttonsCol);
                        $conditionBar.append($conditionBarWrapper);
                        initAndOrSwitch();
                        initButtons();
                    }
                    initConditionBar();
                    if (group.conditions) {
                        collections.foreach(group.conditions, function (condition) {
                            if (condition.isGroup) {
                                initConditionsGroup(condition, $conditionBody);
                            }
                            else {
                                initCondition(condition, $conditionBody);
                            }
                        });
                    }
                    else {
                        setNodata($conditionBody);
                    }
                }
                function init(success) {
                    container.setContent(_$wrapper);
                    initConditionsGroup(_data, _$wrapper);
                    success(control);
                }
                control.getConditionsData = function () {
                    return objects.clone(_data);
                };
                control.remove = function () {
                    _$wrapper.remove();
                };
                return promise.create(function (success) {
                    init(success);
                });
            }
        };
    }
]);

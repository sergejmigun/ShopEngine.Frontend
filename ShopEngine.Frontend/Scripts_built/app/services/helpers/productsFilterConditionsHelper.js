app.registerComponent('productsFilterConditionsHelper', 'Services', [
    'Shared',
    'UI.conditionsBuilder',
    'UI.singleSelectList',
    'UI.finder',
    function (shared, conditionsBuilder, singleSelectList, finder) {
        'use strict';
        function initConditionsBuilder(data) {
            return conditionsBuilder.init(data.container, {
                operands: [{
                        name: 'All products',
                        id: '1',
                        predicates: [{
                                name: 'Of Group',
                                id: '2',
                                initControl: function (container) {
                                    return singleSelectList.init(container, {
                                        items: [{
                                                text: 'Group 1',
                                                value: '1'
                                            }, {
                                                text: 'Group 2',
                                                value: '2'
                                            }]
                                    }).then(function (inst) {
                                        return inst;
                                    });
                                }
                            }, {
                                name: 'Of Brand',
                                id: '1',
                                type: UI.InputType.String
                            }, {
                                name: 'Of Category',
                                id: '3',
                                type: UI.InputType.String
                            }]
                    }, {
                        name: 'Single product',
                        id: '2',
                        predicates: [{
                                name: 'Find',
                                id: '10',
                                initControl: function (container) {
                                    return finder.init(container, {
                                        url: shared.pageContext.model.findProductApiUrl,
                                        textPropName: 'product',
                                        valuePropName: 'product',
                                        placeholder: ''
                                    }).then(function (inst) {
                                        return inst;
                                    });
                                }
                            }]
                    }],
                conditionsData: {
                    conditionType: UI.ConditionType.Or
                }
            });
        }
        return {
            init: function (data) {
                return initConditionsBuilder(data);
            }
        };
    }
]);

app.registerComponent('selectListValuesCompleterHelper', 'Services', [
    'Collections',
    function (collections) {
        'use strict';
        return {
            serialize: function (valueOptios, propName) {
                return collections.from(valueOptios).select(function (valueOption) {
                    var result = {
                        id: valueOption.data
                    };
                    result[propName] = valueOption.value;
                    return result;
                }).toArray();
            }
        };
    }
]);

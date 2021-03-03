app.registerComponent('selectListValuesCompleterHelper', 'Services', [
    'Collections',
    function (collections: ICollections) {
    'use strict';

    return {
        serialize: function (valueOptios, propName) {
            return collections.from(valueOptios as any[]).select(function (valueOption) {
                var result = {
                    id: valueOption.data
                };

                result[propName] = valueOption.value;

                return result;
            }).toArray();
        }
    } as Services.Helpers.ISelectListValuesCompleterHelper;
}]);
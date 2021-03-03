app.registerComponent('specificationDefinitionGroupHelper', 'Services', [
    '$',
    'Services',
    function (services) {
        'use strict';

        var helper = {
            getRequiredValidator: function (message) {
                return function (control) {
                    return services.inputControlsValidationFactory.validateRequired({
                        type: 'localizedInput',
                        value: function () {
                            return control.value().name;
                        }
                    }, message);
                };
            }
        };

        services.inputControlsValidationFactory.extend('required', 'categorySpecificationGroup', function (control, message) {
            return helper.getRequiredValidator(message)(control);
        });

        return helper;
    }
]);
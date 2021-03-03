app.registerComponent('formSubmissionHelper', 'Services.forms', [
    'UI.notifier',
    function (notifier: UI.INotifierFactory) {
        'use strict';

        function getResult(id, response) {
            return {
                data: {
                    id: id,
                    data: response
                },
                status: Components.IFormSubmissionStatus.success,
            };
        }

        var formSubmissionHelper: Services.Helpers.IFormSubmissionHelper = {
            submitForm: function (form, data) {
                if (data.id) {
                    return form.submit(data.editAction).then(function (response) {
                        if (data.editActionNotification) {
                            notifier.notify(data.editActionNotification);
                        }

                        return getResult(data.id, response);
                    });
                } else {
                    return form.submit(data.createAction).then(function (response) {
                        if (data.createActionNotification) {
                            notifier.notify(data.createActionNotification);
                        }

                        return getResult(response.id, response);
                    });
                }
            }
        };

        return formSubmissionHelper;
    }
]);
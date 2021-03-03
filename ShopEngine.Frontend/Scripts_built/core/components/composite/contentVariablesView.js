app.registerComponent('contentVariablesView', 'Components', [
    '$',
    'Promise',
    'Collections',
    'Components.contentVariable',
    'Services.containerHelper',
    'Services.apiService',
    function ($, promise, collections, contentVariable, containerHelper, apiService) {
        'use strict';
        return {
            init: function (model, container) {
                var template = {}, _$html, _$templateVariablesList;
                function showVariables(variables) {
                    var hasItems = false;
                    collections.safeForeach(variables, function (variable) {
                        hasItems = true;
                        contentVariable.init(variable, containerHelper.appendTo(_$templateVariablesList, container.ready()));
                    });
                    if (!hasItems) {
                        _$templateVariablesList.html('<li class="margin-t-20"><span class="no-data">No available variables</span></li>');
                    }
                }
                function init(success) {
                    container.setContent(_$html);
                    showVariables(model.variables);
                    success(template);
                }
                template.showVariables = function (variables) {
                    _$templateVariablesList.html('');
                    showVariables(variables);
                };
                return promise.create(function (success) {
                    apiService.getTemplateHtml('contentVariablesView').then(function (html) {
                        _$html = $(html);
                        _$templateVariablesList = _$html.find('.templateVariablesList');
                        container.setContent(_$html);
                        init(success);
                    });
                });
            }
        };
    }
]);

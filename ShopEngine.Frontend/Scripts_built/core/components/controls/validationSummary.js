app.registerComponent('validationSummary', 'UI', [
    '$',
    'Collections',
    function ($, collections) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {}, errors = [], $wrapper = $('<div class="validation-summary" />').hide();
                container.setContent($wrapper);
                function showControl(control) {
                    var $element = control.getJQueryObject();
                    $.scrollTo($element, 500, {
                        easing: 'swing',
                        margin: true,
                        offset: -200
                    });
                    if (control.focus) {
                        control.focus();
                    }
                }
                function getErrorMessage(controlErrorData) {
                    if (initData.messageGetter) {
                        return initData.messageGetter(controlErrorData.error.data);
                    }
                    return controlErrorData.error.data;
                }
                function addUiElement(controlErrorData) {
                    var $element = $('<div class="validation-summary-item" />'), $elementWrapper = $('<div class="padding-5" />');
                    if (initData.scrollToControl) {
                        $element.click(function () {
                            showControl(controlErrorData.control);
                        });
                    }
                    $elementWrapper.append('<i class="fa fa-exclamation-circle"></i>').append($element);
                    $element.text(getErrorMessage(controlErrorData));
                    $wrapper.append($elementWrapper);
                    $wrapper.show();
                    return $elementWrapper;
                }
                function addError(controlErrorData) {
                    var $element = addUiElement(controlErrorData);
                    errors.push({
                        controlErrorData: controlErrorData,
                        element: $element
                    });
                }
                function clearError(controlErrorData) {
                    var error = collections.from(errors).first(function (existingError) {
                        return existingError.controlErrorData === controlErrorData;
                    });
                    if (error) {
                        error.element.remove();
                        collections.remove(errors, error);
                        if (!errors.length) {
                            $wrapper.hide();
                        }
                    }
                }
                control.clearError = function (controlErrorData) {
                    clearError(controlErrorData);
                };
                control.addError = function (controlErrorData) {
                    addError(controlErrorData);
                };
                return control;
            }
        };
    }
]);

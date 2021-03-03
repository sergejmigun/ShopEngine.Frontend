app.registerComponent('controlsChangesDetector', 'Services', [
    'Collections',
    'Utils.objects',
    function (collections, objects) {
        'use strict';
        return {
            init: function () {
                var detector = {}, _state = [];
                function getValue(control) {
                    return control.value();
                }
                detector.addControl = function (control) {
                    _state.push({
                        control: control,
                        initialValue: getValue(control)
                    });
                };
                detector.update = function (control) {
                    if (control) {
                        var state = collections.from(_state).first(function (state) {
                            return state.control === control;
                        });
                        if (state) {
                            state.initialValue = getValue(control);
                        }
                    }
                    else {
                        collections.foreach(_state, function (state) {
                            state.initialValue = getValue(state.control);
                        });
                    }
                };
                detector.hasChanges = function () {
                    return collections.from(_state).any(function (state) {
                        var actualValue = getValue(state.control);
                        return !objects.areSame(actualValue, state.initialValue);
                    });
                };
                return detector;
            }
        };
    }
]);

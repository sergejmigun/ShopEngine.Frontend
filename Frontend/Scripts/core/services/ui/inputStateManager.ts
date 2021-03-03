app.registerComponent('inputStateManager', 'Services', [
    'Collections',
    function (collections: ICollections) {
        'use strict';

        return {
            init: function (innerInputs, readOnlyState, disabledState) {
                var manager = {
                    readOnly: function (readOnly) {
                        if (readOnly !== undefined) {
                            readOnlyState = readOnly;
                        }

                        collections.foreach(innerInputs, function (input) {
                            input.readOnly(readOnly);
                        });

                        return readOnlyState;
                    },
                    disabled: function (disabled) {
                        if (disabled !== undefined) {
                            disabledState = disabled;
                        }

                        collections.foreach(innerInputs, function (input) {
                            input.disabled(disabled);
                        });

                        return disabledState;
                    },
                    getValue: function () {
                        var value = {};

                        collections.foreach(innerInputs, function (input) {
                            value[input.name] = input.value();
                        });

                        return value;
                    },
                    setValue: function (value) {
                        collections.foreach(innerInputs, function (input) {
                            if (!value) {
                                input.value(null);
                            } else {
                                input.value(value[input.name]);
                            }
                        });
                    }
                } as Services.Controls.IInputStateManager;

                return manager;
            }
        } as Services.Controls.IInputStateManagerFactory;
    }]);
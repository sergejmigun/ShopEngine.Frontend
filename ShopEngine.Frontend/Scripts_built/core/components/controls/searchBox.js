app.registerComponent('searchBox', 'UI', [
    '$',
    'Promise',
    'UI.textBox',
    'Services.eventsInitializer',
    'Services.containerHelper',
    'Resources.UICore',
    function ($, promise, textBox, eventsInitializer, containerHelper, resources) {
        'use strict';
        return {
            init: function (container, initData) {
                var control = {}, _$wrapper = $('<div class="input-group search-box" />'), _textBox, _events = eventsInitializer.init(control, ['onChange', 'onRemove', 'submit']);
                function initBox() {
                    return textBox.init(containerHelper.appendTo(_$wrapper, container.ready()), {
                        placeholder: initData.placeholder || resources.searchFor,
                        value: initData.value,
                        clearInput: true
                    }).then(function (inst) {
                        _textBox = inst;
                        _textBox.onChange(function () {
                            _events.onChange.invoke(control.getValue());
                        });
                    });
                }
                function initButton() {
                    var $button = $('<button type="submit" class="btn btn-flat"><i class="fa fa-search"></i></button>');
                    $button.click(function () {
                        _events.submit.invoke(control.getValue());
                        return false;
                    });
                    _$wrapper.append($button);
                    $button.wrap('<span class="input-group-btn" />');
                }
                function init(success) {
                    container.setContent(_$wrapper);
                    initBox().then(function () {
                        initButton();
                        success(control);
                    });
                }
                control.getValue = function () {
                    if (!_textBox) {
                        return;
                    }
                    return _textBox.value();
                };
                return promise.create(function (success) {
                    init(success);
                });
            }
        };
    }
]);

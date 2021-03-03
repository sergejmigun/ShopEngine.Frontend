app.registerComponent('buttons', 'UI', [
    '$',
    'Resources.UICore',
    'Utils.strings',
    'Utils.objects',
    function ($, resources, strings, objects) {
        'use strict';
        function getControlButton($button, action, hidden, disabled, setTextFunc, setIconFunc) {
            var controlButton = {
                disable: function () {
                    $button.addClass('button-disabled');
                    $button.prop('disabled', 'disabled');
                },
                enable: function () {
                    $button.removeClass('button-disabled');
                    $button.removeProp('disabled', 'disabled');
                },
                hide: function () {
                    $button.hide();
                },
                show: function () {
                    $button.show();
                },
                remove: function () {
                    $button.remove();
                },
                setText: function (text) {
                    if (!setTextFunc) {
                        return;
                    }
                    setTextFunc(text);
                },
                setIcon: function (iconCss) {
                    if (!iconCss) {
                        return;
                    }
                    setIconFunc(iconCss);
                }
            };
            if (hidden) {
                controlButton.hide();
            }
            if (disabled) {
                controlButton.disable();
            }
            $button.click(function (e) {
                e.preventDefault();
                var isDisabled = $button.prop('disabled');
                if (!isDisabled) {
                    action();
                }
            });
            return controlButton;
        }
        function initButton(defaults, initData, container) {
            defaults.size = 'sm';
            defaults.element = '<button type="submit" />';
            var element = initData.element || defaults.element, size = initData.size || defaults.size, type = initData.type || defaults.type, iconCss = initData.iconCss || defaults.iconCss, text = initData.text || defaults.text, $text = $('<span />').text(text), $icon, $button = $(element);
            $button.addClass('btn')
                .addClass(strings.format('btn-{0}', size))
                .addClass(strings.format('btn-{0}', type));
            if (initData.css) {
                $button.addClass(initData.css);
            }
            $button.append($text);
            if (iconCss) {
                $icon = $('<i />').attr('class', iconCss);
                $button.prepend($icon);
            }
            container.setContent($button);
            var controlButton = getControlButton($button, initData.action, initData.hidden, initData.disabled, function (text) {
                $text.text(text);
            }, function (iconCss) {
                if (iconCss) {
                    $icon = $icon || $('<i />');
                    $icon.attr('class', iconCss);
                }
                else if ($icon) {
                    $icon.remove();
                    $icon = null;
                }
            });
            if (initData.onInit) {
                initData.onInit(controlButton);
            }
            return controlButton;
        }
        function getDefaults(buttonType) {
            switch (buttonType) {
                case UI.ButtonType.Submit:
                    return {
                        type: 'primary',
                        text: resources.submit,
                        iconCss: 'fa fa-check-circle',
                        buttonType: UI.ButtonType.Submit
                    };
                case UI.ButtonType.Cancel:
                    return {
                        type: 'default',
                        text: resources.cancel,
                        iconCss: 'fa fa-ban',
                        buttonType: UI.ButtonType.Cancel
                    };
                case UI.ButtonType.Remove:
                    return {
                        type: 'danger',
                        text: resources.remove,
                        iconCss: 'fa fa-times',
                        iconColorCss: 'color-red',
                        buttonType: UI.ButtonType.Remove
                    };
                case UI.ButtonType.Add:
                    return {
                        type: 'success',
                        text: resources.add,
                        iconCss: 'fa fa-plus',
                        buttonType: UI.ButtonType.Add
                    };
                case UI.ButtonType.Edit:
                    return {
                        type: 'success',
                        text: resources.edit,
                        iconCss: 'fa fa-pencil-square-o',
                        iconColorCss: 'color-dark-gray',
                        buttonType: UI.ButtonType.Edit
                    };
                case UI.ButtonType.View:
                    return {
                        type: 'default',
                        text: resources.view,
                        iconCss: 'fa fa-info-circle',
                        iconColorCss: 'color-blue',
                        buttonType: UI.ButtonType.View
                    };
                case UI.ButtonType.Back:
                    return {
                        type: 'default',
                        text: resources.back,
                        iconCss: 'fa fa-arrow-left',
                        buttonType: UI.ButtonType.Back
                    };
                default:
                    return {
                        type: 'primary'
                    };
            }
        }
        function initRoundButton(content, initData, container) {
            var $button = $('<span />'), $a = $('<a />');
            $button.append($a);
            $a.html(content);
            if (initData.css) {
                $button.addClass(initData.css);
            }
            if (initData.size === UI.ButtonSize.Large) {
                $button.addClass('round-button');
            }
            else if (initData.size === UI.ButtonSize.XSmall || initData.size === UI.ButtonSize.Small) {
                $button.addClass('round-button round-button-sm');
            }
            else {
                $button.addClass('round-button round-button-md');
            }
            if (initData.title) {
                $button.attr('title', initData.title);
            }
            container.setContent($button);
            return getControlButton($button, initData.action, initData.hidden, initData.disabled);
        }
        function initLinkButton(container, initData) {
            var $a = $('<a class="cursor-pointer" />').text(initData.text);
            if (initData.css) {
                $a.addClass(initData.css);
            }
            if (initData.iconCss) {
                var $icon = $('<i />').attr('class', initData.iconCss);
                if (initData.iconPosition === UI.ButtonIconPosition.Right) {
                    $a.append(' ').append($icon);
                }
                else {
                    $a.prepend(' ').prepend($icon);
                }
            }
            container.setContent($a);
            return getControlButton($a, initData.action, initData.hidden, initData.disabled, function (text) {
                $a.text(text);
            });
        }
        return {
            submit: function (initData, container) {
                return initButton(getDefaults(UI.ButtonType.Submit), initData, container);
            },
            cancel: function (initData, container) {
                return initButton(getDefaults(UI.ButtonType.Cancel), initData, container);
            },
            remove: function (initData, container) {
                return initButton(getDefaults(UI.ButtonType.Remove), initData, container);
            },
            add: function (initData, container) {
                return initButton(getDefaults(UI.ButtonType.Add), initData, container);
            },
            edit: function (initData, container) {
                return initButton(getDefaults(UI.ButtonType.Edit), initData, container);
            },
            view: function (initData, container) {
                return initButton(getDefaults(UI.ButtonType.View), initData, container);
            },
            back: function (initData, container) {
                return initButton(getDefaults(UI.ButtonType.Back), initData, container);
            },
            doAction: function (initData, container) {
                return initButton(getDefaults(UI.ButtonType.Other), initData, container);
            },
            roundIcon: function (iconCss, initData, container) {
                return initRoundButton($('<i />').attr('class', 'fa ' + iconCss + ' fa-fw'), initData, container);
            },
            roundText: function (text, initData, container) {
                return initRoundButton(text, initData, container);
            },
            link: function (initData, container) {
                return initLinkButton(container, initData);
            },
            getData: function (buttonType, initData) {
                var defaults = objects.clone(getDefaults(buttonType));
                if (initData) {
                    objects.extend(initData, defaults);
                }
                return defaults;
            }
        };
    }
]);

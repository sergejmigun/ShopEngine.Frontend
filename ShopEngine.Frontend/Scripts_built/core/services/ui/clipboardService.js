app.registerComponent('clipboardService', 'Services', [
    'Shared',
    function (shared) {
        'use strict';
        return {
            copy: function (text) {
                var textArea = shared.document.createElement("textarea");
                textArea.style.position = 'fixed';
                textArea.style.top = 0;
                textArea.style.left = 0;
                textArea.style.width = '2em';
                textArea.style.height = '2em';
                textArea.style.padding = 0;
                textArea.style.border = 'none';
                textArea.style.outline = 'none';
                textArea.style.boxShadow = 'none';
                textArea.style.background = 'transparent';
                textArea.value = text;
                shared.document.body.appendChild(textArea);
                textArea.select();
                try {
                    shared.document.execCommand('copy');
                }
                catch (ignore) { }
                shared.document.body.removeChild(textArea);
            }
        };
    }
]);

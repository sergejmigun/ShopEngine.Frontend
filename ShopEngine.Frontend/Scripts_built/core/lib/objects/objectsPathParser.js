app.registerComponent('objectsPathParser', 'Lib.objects', ['Collections', function (collections) {
        'use strict';
        return {
            parse: function (path) {
                if (!path) {
                    return;
                }
                var parts = path.split('.'), currentObjectPath = {}, resultObjectPath = currentObjectPath;
                collections.foreach(parts, function (part, index) {
                    var arrayBracketIndex = part.indexOf('[');
                    if (arrayBracketIndex === -1) {
                        currentObjectPath.name = part;
                    }
                    else {
                        currentObjectPath.name = part.substring(0, arrayBracketIndex);
                        currentObjectPath.index = parseInt(part.substring(arrayBracketIndex + 1, part.length - 1), 10);
                    }
                    if (index !== parts.length - 1) {
                        var childObjectPath = {};
                        currentObjectPath.childObjectPath = childObjectPath;
                        currentObjectPath = childObjectPath;
                    }
                });
                return resultObjectPath;
            }
        };
    }]);

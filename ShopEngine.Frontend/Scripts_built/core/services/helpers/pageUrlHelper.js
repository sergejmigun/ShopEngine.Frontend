app.registerComponent('pageUrlHelper', 'Services', [
    '$',
    'Utils.strings',
    function ($, strings) {
        'use strict';
        function validateHash(data) {
            if (data.mode !== Services.PageMode.create && !data.id) {
                window.location.hash = '';
                return false;
            }
            return true;
        }
        var service = {
            getHashString: function (data) {
                var obj = {
                    mode: data.mode
                };
                if (data.id) {
                    obj['id'] = data.id;
                }
                if (data.tabIndex) {
                    obj['tab'] = data.tabIndex;
                }
                return strings.format('#{0}', $['param'](obj));
            },
            setHashData: function (data) {
                if (validateHash(data)) {
                    var hashString = this.getHashString(data);
                    window.location.hash = hashString;
                }
            },
            parseHashData: function () {
                var params = $['deparam'](window.location.hash.substring(1));
                var result = {
                    mode: params.mode || Services.PageMode.create,
                    id: params.id,
                    tabIndex: params.tab ? parseInt(params.tab) : null
                };
                validateHash(result);
                return result;
            },
            hasSetMode: function () {
                var params = $['deparam'](window.location.hash.substring(1));
                return !!params.mode;
            }
        };
        return service;
    }
]);

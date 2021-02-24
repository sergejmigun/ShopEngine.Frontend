var shopApp = {
    sendApiRequest: function (url, data, method, dataType) {
        var contentType;

        if (method.toLowerCase() === 'post' || method.toLowerCase() === 'put') {
            contentType = 'application/json';
            data = JSON.stringify(data);
        }

        if (method.toLowerCase() === 'delete') {
            url = url + '?' + $.param(data, true);
            data = undefined;
        }

        return new Promise(function (success, error) {
            $.ajax({
                url: url,
                type: method,
                data: data,
                success: success,
                cache: false,
                contentType: contentType,
                error: function (data) {
                    error(data);
                },
                dataType: dataType
            });
        });
    },
    state: {
        currency: undefined,
        language: undefined
    }
}
﻿app.registerComponent('templatesHtmlProvider', 'Services', [
    'Promise',
    'Services.apiService',
    'Collections',
    function (promise: IPromise,
        apiService: Services.IApiService,
        collections: ICollections) {
        'use strict';

        var service = {} as Services.ITemplatesHtmlProviderFactory;

        service.init = function (area) {
            return {
                getHtml: function (templates) {
                    var promises = collections.from(templates).select(function (template) {
                        return apiService.getTemplateHtml(template, area);
                    }).toArray();

                    return promise.all(promises).then(function (htmls) {
                        var res = {};

                        collections.foreach(templates, function (template, i) {
                            res[template] = htmls[i];
                        });

                        return res;
                    });
                }
            };
        };

        return service;
    }
]);
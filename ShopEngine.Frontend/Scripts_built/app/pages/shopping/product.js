app.registerComponent('Product', 'Pages', [
    function () {
        'use strict';
        return {
            init: function (pageContext) {
                new Vue({
                    el: '#productPage',
                    data: pageContext.model
                });
            }
        };
    }
]);

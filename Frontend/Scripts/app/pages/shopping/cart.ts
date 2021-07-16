app.registerComponent('Cart', 'Pages', [
    function () {
        'use strict';

        return {
            init: function (pageContext) {
                new Vue({
                    el: '#cartPage',
                    data: pageContext.model
                });
            }
        };
    }
]);
app.registerComponent('cartService', 'Services', [
    'Promise',
    'Utils.objects',
    'Services.eventsInitializer',
    'Services.apiControllers.shopping.cart',
    'Services.mvcControllers.shopping.cart',
    function (promise: IPromise,
        objects: Utils.IObjects,
        eventsInitializer: Services.Initialization.IEventsInitializer,
        apiCartController: Api.Shopping.Controllers.ICartController,
        webCartController: Web.Shopping.Controllers.ICartController) {
        'use strict';

        var serviceEvents = {
            onChange: eventsInitializer.initEvent<Common.ICart>()
        };

        var cartPromise: Promise<Common.ICart> = apiCartController.getCart().send() as any;

        var cartService: Services.ICartService = {
            onChange: serviceEvents.onChange.event,
            addItem: function (productId, count) {
                app.ignoreParams(productId);
                return cartPromise.then(cart => {
                    cart.items[0].quantity += count;
                    serviceEvents.onChange.invoke(cart);

                    return;
                });
            },
            removeItem: function (productId) {
                app.ignoreParams(productId);
                return cartPromise.then(cart => {
                    cart.items.splice(0, 1);
                    serviceEvents.onChange.invoke(cart);

                    return;
                });
            },
            updateCount: function (productId, count) {
                app.ignoreParams(productId);
                app.ignoreParams(count);
                return promise.fromResult<any>({});
            },
            getCart: function () {
                return cartPromise.then(cart => objects.clone(cart));
            },
            getCartPageUrl: function () {
                return webCartController.index().url;
            }
        };

        return cartService;
    }
]);
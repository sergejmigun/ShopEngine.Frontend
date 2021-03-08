app.registerComponent('cartService', 'Services', [
    'Promise',
    'Utils.objects',
    'Services.eventsInitializer',
    'Shared.pageContext',
    function (promise: IPromise,
        objects: Utils.IObjects,
        eventsInitializer: Services.Initialization.IEventsInitializer,
        pageContext: Shared.IPageContext) {
        'use strict';

        var serviceEvents = {
            onChange: eventsInitializer.initEvent<Common.ICart>()
        };

        var cartPromise: Promise<Common.ICart> = pageContext.context.then(context => objects.clone(context.model.header.cart));

        var cartService: Services.ICartService = {
            onChange: serviceEvents.onChange.event,
            addItem: function (productId, count) {
                app.ignoreParams(productId);
                return cartPromise.then(cart => {
                    cart.cartItems[0].productsCount += count;
                    serviceEvents.onChange.invoke(cart);

                    return;
                });
            },
            removeItem: function (productId) {
                app.ignoreParams(productId);
                return cartPromise.then(cart => {
                    cart.cartItems.splice(0, 1);
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
            }
        };

        return cartService;
    }
]);
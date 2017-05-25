define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // PageRouter prototype
    ,'prototypes/page.composer'

    // Index page for this route
    ,'pages/login/reset/index'
    // Subroutes
    // ...

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,PageRouter
                ,IndexPage
                // ...
    ) {
        var ResetPasswordRouter = Backbone.PageRouter.extend({
            // We are good to go with the base funcionality,
            // defined in the page.router prototype
            options: {
                index: IndexPage
            }
        });
        return ResetPasswordRouter;
    }
);
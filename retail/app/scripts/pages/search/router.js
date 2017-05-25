define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // PageRouter prototype
    ,'prototypes/page.router'

    // Index page for this route
    ,'pages/search/index'
    ,'pages/search/link/router'
    // Subroutes
    // ...

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,PageRouter
                ,IndexPage
                ,LinkPageRouter
                // ...
    ) {
        var SearchRouter = Backbone.PageRouter.extend({
            // We are good to go with the base functionality,
            // defined in the page.router prototype
            options: {
                index: IndexPage
                ,linkPageRouter: LinkPageRouter
            }
        });
        return SearchRouter;
    }
);
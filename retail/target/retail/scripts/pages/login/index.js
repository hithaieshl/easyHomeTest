define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // PageComposer prototype
    ,'prototypes/page.composer'

    // Modules
    ,'modules/customerLogin/composer'
    
    ], function(
        $
        ,_
        ,Backbone
        ,Eva
        ,PageComposer
        ,LoginModule
    ) {
        var LoginPage = Backbone.PageComposer.extend({
            className: 'page '
            ,pageName: 'login'
            ,title: null
            ,shouldBeRemoved: true
            ,modules: [
                {
                    constructor: LoginModule
                    ,arguments: {}
                }
            ]
        });
        return LoginPage;
    }
);
define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // PageView prototype. All pages are extended from this View
    ,'prototypes/page.composer'

    // Modules
    ,'modules/login/composer'
    
    ], function(
        $
        ,_
        ,Backbone
        ,Eva
        ,PageComposer
        ,LoginModule
    ) {
        var HomePage = Backbone.PageComposer.extend({
            className: 'page home'
            ,pageName: 'home'
            ,modules: [{
                constructor: LoginModule
                ,arguments: {}
            }]
            ,isUserLoggedIn: function() {
                return true;
            }
        });
        return HomePage;
    }
);
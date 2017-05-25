define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // PageComposer prototype
    ,'prototypes/page.composer'

    // Modules

    // TransUnion Authentication module
    ,'modules/auth.tu/composer'
    
    ], function(
        $
        ,_
        ,Backbone
        ,Eva
        ,PageComposer
        ,AuthTuModule
    ) {
        var _initialize = Backbone.PageComposer.prototype.initialize;
        var AuthPage = Backbone.PageComposer.extend({
             className: 'page '
            ,pageName: 'auth'
            ,title: 'Authentication'
            ,shouldBeRemoved: true
            ,modules: [
                {
                    constructor: AuthTuModule
                    ,arguments: {}
                }
            ]
            ,initialize: function (arguments) {
            if (arguments.lang) { this.lang = arguments.lang; }
                _initialize.call(this);
            }
        });
        return AuthPage;
    }
);
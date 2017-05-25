define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // PageComposer prototype
    ,'prototypes/page.composer'

    // Modules
    ,'modules/resetPassword/composer'
    
    ], function(
        $
        ,_
        ,Backbone
        ,Eva
        ,PageComposer
        ,Reset
    ) {
        var ResetPage = Backbone.PageComposer.extend({
            className: 'page '
            ,pageName: 'reset'
            ,title: null
            ,shouldBeRemoved: true
            ,modules: [
                {
                    constructor: Reset
                    ,arguments: {}
                }
            ]
        });
        return ResetPage;
    }
);
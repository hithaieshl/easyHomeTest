define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // PageComposer prototype
    ,'prototypes/page.composer'

    // Modules
    ,'modules/profileLinking/composer'
    
    ], function(
        $
        ,_
        ,Backbone
        ,Eva
        ,PageComposer
        ,ProfileLinking
    ) {
        var LinkPage = Backbone.PageComposer.extend({
            className: 'page '
            ,pageName: 'link'
            ,title: 'RSSS Linking'
            ,shouldBeRemoved: true
            ,isSensitivePage: true
            ,modules: [
                {
                    constructor: ProfileLinking
                    ,arguments: {}
                }
            ]
        });
        return LinkPage;
    }
);
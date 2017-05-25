define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // PageComposer prototype
    ,'prototypes/page.composer'

    // Modules
    ,'modules/search/composer'
    
    ], function(
        $
        ,_
        ,Backbone
        ,Eva
        ,PageComposer
        // Modules
        ,SearchModule
    ) {
        var SearchPage = Backbone.PageComposer.extend({
            className: 'page '
            ,pageName: 'search'
            ,title: 'Customer Lookup'
            ,isSensitivePage: true
            ,modules: [
                {
                    constructor: SearchModule
                    ,arguments: {}
                }
            ]
            ,onPageRemove: function() {
                this.remove();
            }
            ,initialize: function() {
                // Render the page with all invoked modules
                this.render();
                Eva.on('search:remove', this.onPageRemove, this);
            }
        });
        return SearchPage;
    }
);
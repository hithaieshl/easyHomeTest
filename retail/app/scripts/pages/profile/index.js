define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // PageComposer prototype
    ,'prototypes/page.composer'

    // Modules
    ,'modules/profile/composer'
    ,'helpers/pageLeaveManager'
    ,'modules/profileHeader/composer'
    
    ], function(
        $
        ,_
        ,Backbone
        ,Eva
        ,PageComposer
        ,ProfileModule
        ,Unloader,
        profileHeader
    ) {
        var ProfilePage = Backbone.PageComposer.extend({
            className: 'page '
            ,pageName: 'profile'
            //,title: 'Customer Profile'
            ,header: profileHeader
            ,shouldBeRemoved: true
            ,modules: [
                {
                    constructor: ProfileModule
                    ,arguments: {}
                }
            ]
            ,initialize: function() {
                this.render();
                Unloader.apply(this);
            }
        });
        return ProfilePage;
    }
);
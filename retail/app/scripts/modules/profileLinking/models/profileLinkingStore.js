define([
    // Primary dependency
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Environment stats
    ,'config/env'

    ,'modules/profileLinking/models/onlineProfile'
    ,'modules/profileLinking/models/match'
    ,'modules/profileLinking/collections/matches'

    // 1-1, 1-many, many-1 model relations
    ,'backbone-associations'
], function(
            $
            ,_
            ,Backbone
            ,Eva
            ,Env
            ,OnlineProfileModel
            ,MatchModel
            ,MatchesCollection
            ,Relations
) {
    var ProfileLinkingModel = Backbone.AssociatedModel.extend({
         urlRoot: Env.getUrlFor('link')
        ,defaults: {
             onlineProfile: null
            ,matches: []
        }
        ,relations: [
            {
                 type: Backbone.One
                ,key: 'onlineProfile'
                ,relatedModel: OnlineProfileModel
            },{
                 type: Backbone.Many
                ,key: 'matches'
                ,relatedModel: MatchModel
                ,collectionType: MatchesCollection
            }
        ]
    });

    return ProfileLinkingModel;
});
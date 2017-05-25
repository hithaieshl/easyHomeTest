define([
    // Primary dependency
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Environment stats
    ,'config/env'

], function(
            $
            ,_
            ,Backbone
            ,Eva
            ,env
) {
    var LinkedProfile = Backbone.Model.extend({
        idAttribute: '_id'
        ,defaults: {
            mainProfileType: 'RSSS'
        }
        ,url: env.getUrlFor('link')
        ,onSync: function() {
            this.trigger('profileLinking:completeLinking');
        }
        ,initialize: function() {
            this.on('sync', this.onSync, this);
        }
    });

    return LinkedProfile;
});
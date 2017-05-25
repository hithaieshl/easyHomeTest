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
    var HgroupModel = Backbone.Model.extend({
        defaults: {
            title: null
        }
        ,initialize: function() {}
    });

    return HgroupModel;
});
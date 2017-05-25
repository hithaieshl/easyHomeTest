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
    var ResetLoginModel = Backbone.Model.extend({
        defaults: {
            email: ''
            ,tokenLength: 6
        }
        ,url: env.getUrlFor('customerSendResetEmail')
    });

    return ResetLoginModel;
});
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
    var LoginModel = Backbone.Model.extend({
        defaults: {
            j_username: ''
            ,j_password: ''
        }
        ,url: env.getUrlFor('managerLogin')
        ,validation: {
            'j_username': [{
                 required: true
                ,msg: 'Please enter username'
            }]
            ,"j_password": {
                required: true
                ,msg: 'Please enter your password'
            }
        }
        ,onSync: function(model, xhr) {
            Eva.trigger('Profile:login:navigate');
        }
        ,onError: function(model, xhr) {
            if (xhr.status === 401) {
                Eva.trigger('Profile:login:invalidate');
            }
        }
        ,initialize: function() {
            this.on('sync', this.onSync, this);
            this.on('error', this.onError, this);
        }
    });

    return LoginModel;
});
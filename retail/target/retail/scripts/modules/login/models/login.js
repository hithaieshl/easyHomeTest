define([
    // Primary dependency
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Environment stats
    ,'config/env'
    ,'helpers/localStorageManager'
    
    // Regular expression wrapper
    ,'xregexp'

], function(
            $
            ,_
            ,Backbone
            ,Eva
            ,env
            ,localStorageManager
) {
    var LoginModel = Backbone.Model.extend({
        defaults: {
             j_username: ''
            ,j_password: ''
            ,j_salesperson: ''
        }
        ,isLogin: true
        ,url: env.getUrlFor('managerLogin')
        ,validation: {
            'j_username': [{
                 required: true
                ,msg: 'Please enter username'
            }]
            ,'j_password': {
                required: true
                ,msg: 'Please enter your password'
            }
            ,'j_salesperson': [{
                pattern: XRegExp("^([a-zA-Z\\s]){2,70}$")
                ,msg: 'Salesperson name should be at least 3 characters long'
            }, {
                required: true
                ,msg: 'Please enter salesperson name'
            }]
        }
        ,onSync: function(model, xhr) {
            var result = xhr.value;
            if (result === 'true') {
                localStorageManager.setItem("username", this.get('j_username'));
                localStorageManager.setItem("password", this.get('j_password'));
                localStorageManager.setItem("salesperson", this.get('j_salesperson'));
                Eva.trigger('Login:login:navigate');
            }
        }
        ,onError: function(model, xhr) {
            localStorageManager.removeItem("username");
            localStorageManager.removeItem("password");
            localStorageManager.removeItem("salesperson");
            if (xhr.status === 401) {
                Eva.trigger('Login:login:invalidate');
            }
        }
        ,initialize: function() {
            this.on('sync', this.onSync, this);
            this.on('error', this.onError, this);
        }
    });

    return LoginModel;
});
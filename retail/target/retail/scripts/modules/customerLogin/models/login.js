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
            id: ''
            ,email: ''
            ,password: ''
        }
        ,idAttribute: '_id'
        ,_isFecth: true
        ,url: env.getUrlFor('checkPassword')
        ,fetchUrl: function() {
            return env.getUrlFor('login') + '/' + this.get('id')
        }
        ,validation: {
            'email': [{
                 required: true
                ,msg: 'Please enter email'
            }]
            ,"password": {
                required: true
                ,msg: 'Please enter your password'
            }
        }
        ,fetch: function(options) {
            options = _.defaults((options || {}), {url: this.fetchUrl()});
            return Backbone.Model.prototype.fetch.call(this, options);
        }
        ,onSync: function(model, xhr) {
            if (xhr.value === 'true') {
                this.trigger('customerLogin:success');
            }
        }
        ,onError: function(model, xhr) {
            var response = xhr.responseJSON;
            var errors = response.errors;
            if (errors.length === 2 && errors[1].errorMessage === errors[0].errorMessage) {
                this.trigger('customerLogin:error', errors[1].errorMessage);
            }
        }
        ,initialize: function() {
            this.on('sync', this.onSync, this);
            this.on('error', this.onError, this);
        }
    });

    return LoginModel;
});
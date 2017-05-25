define([
    // Primary dependency
     'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Environment stats
    ,'config/env'

    // Regular expression wrapper
    ,'xregexp'

], function(
            $
            ,_
            ,Backbone
            ,Eva
            ,env
) {
    var ResetPasswordModel = Backbone.Model.extend({
        defaults: {
             email: ''
            ,token: ''
            ,password: ''
            ,passwordConfirm: ''
        }
        ,idAttribute: '_id'
        ,url: env.getUrlFor('customerResetPassword')
        ,validation: {
            password: [{
                required: true
                ,msg: 'Please enter new password'
            },{
                pattern: XRegExp("((?=[a-zA-Z{!@#$%\\^&*()\\-=_+}]*\\d)(?=[0-9A-Z{!@#$%\\^&*()\\-=_+}]*[a-z])(?=[a-z0-9{!@#$%\\^&*()" + 
                    "\\-=_+}]*[A-Z])[a-zA-Z0-9{!@#$%\\^&*()\\-=_+}]{6,20})")
                ,msg: 'Please enter a valid password'
            }]
            ,passwordConfirm: {
                equalTo: 'password'
                ,msg: 'Please enter new password'
            }
        }
        ,onSync: function(model, xhr) {
            Eva.trigger('resetPassword:reset:navigate');
        }
        ,initialize: function() {
            this.on('sync', this.onSync, this);
        }
    });

    return ResetPasswordModel;
});
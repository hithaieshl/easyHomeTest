define([
    // Primary dependency
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Environment stats
    ,'config/env'

    //Parent model
    ,'modules/login/models/login'

], function(
            $
            ,_
            ,Backbone
            ,Eva
            ,env
            ,LoginModel
) {
    var LoginPopupModel = LoginModel.extend({
        onSync: function(model, xhr) {
            Eva.trigger('Login:login:navigate');
        }
        ,onError: function(model, xhr) {
            if (xhr.status === 401) {
                Eva.trigger('Login:login:invalidate');
            }
        }
    });

    return LoginPopupModel;
});
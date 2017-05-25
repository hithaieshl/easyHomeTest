define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'
    ,'helpers/idleStateTracker'

    // Template
    ,'requirejs-text!modules/login.popup/templates/login.html'
    
    //Model
    //,'modules/login.popup/models/login'

    //parent view
    ,'modules/login/views/login'
    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,idleStateTracker
                ,LoginTemplate
                ,LoginView
                ,LoginModel
    ) {
        var LoginPopupView = LoginView.extend({
            template: _.template(LoginTemplate)
            //,model: new LoginModel()
            ,events: {
                'submit': 'onSubmit'
                ,'click .close': 'onClose'
                ,'focus .password input' : 'onPasswordFocus'
                ,'blur .password input' : 'onPasswordBlur'
                ,'keyup .js-salesperson input' : '_toggleSalespersonNames'
                ,'blur .js-salesperson input' : '_removeSalespersonnames'
                ,'click .js-clear-salesperson': '_onSalespersonClear'
                ,'mousedown .js-salesperson-names': '_onSalespersonSelect'
            }
            ,onClose: function() {
                this.restoreStoreCredentials();

                Eva.trigger('page:navigate');
            }
            ,onNavigate: function() {
                // Set idleStateTracker to state when password is accessible from Local Storage
                idleStateTracker.resetIdleTimeLimitReached();

                Eva.trigger('page:terminate');
                Eva.trigger('page:success');
            }
        });

        return LoginPopupView;
    }
);
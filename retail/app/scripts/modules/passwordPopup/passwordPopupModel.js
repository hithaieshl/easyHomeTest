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

    var _pwdValidation = {
         pattern: XRegExp("((?=[a-zA-Z{!@#$%\\^&*()\\-=_+}]*\\d)(?=[0-9A-Z{!@#$%\\^&*()\\-=_+}]*[a-z])(?=[a-z0-9{!@#$%\\^&*()" +
            "\\-=_+}]*[A-Z])[a-zA-Z0-9{!@#$%\\^&*()\\-=_+}]{6,20})")
        ,msg: 'Password must be at least 6 characters including 1 capital letter, 1 small letter and 1 number'
    };
    
    var PasswordPopupModel = Backbone.Model.extend({
        
        defaults: {
            j_password: ''
            ,j_password_repeat: ''
            ,firstName: ''
        }
        ,validation: {
            'j_password': [{
                    required: true
                    ,msg: 'Please enter your password'
                },
                _pwdValidation
            ]
            ,'j_password_repeat': [
                {
                    required: true
                    ,msg: 'Please repeat your password'
                },
                _pwdValidation,
                { fn: function(value, attr, model) {
                        if ((this.get('j_password') !== value) || !this.get('j_password').length || !this.isValid('j_password')) {
                            return 'Passwords should be identical';
                        }
                        return false;
                    }
                }
            ]
        }
        ,initialize: function() {
            //validate entire model when any value changes
            this.on('change', function() {
                this.validate();
            })
        }
    });

    return PasswordPopupModel;
});
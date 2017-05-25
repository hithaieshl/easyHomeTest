define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'
    
    // Templates
    ,'requirejs-text!modules/passwordPopup/header.html'
    ,'requirejs-text!modules/passwordPopup/content.html'
    ,'requirejs-text!modules/passwordPopup/footer.html'
    
    //parent view
    ,'modules/basePopup/basePopupView'
    
    //Model
    ,'modules/passwordPopup/passwordPopupModel'
    
    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,headerTpl
                ,contentTpl
                ,footerTpl
                ,BasePopupView
                ,PasswordPopupModel
    ) {
        var _initialize = BasePopupView.prototype.initialize;
        var _options = BasePopupView.prototype.options;
        var _events = BasePopupView.prototype.events;

        var PasswordPopupView = BasePopupView.extend({
            options: $.extend (_options, {
                className: 'password-popup'
            })
            
            ,templates: {
                    header: headerTpl,
                    content: contentTpl,
                    footer: footerTpl
            }
            
            ,bindings: {
                '[name=j_password]':  'j_password'
                ,'[name=j_password_repeat]':  'j_password_repeat'
                ,'.header-firstname': 'firstName'
            }
            
            ,events: $.extend (_events, {
                'submit': 'onSubmit'
                ,'focus .password input' : 'onPasswordFocus'
                ,'blur .password input' : 'onPasswordBlur'
            })
            
            ,onPasswordFocus: function(event) {
                $(event.target).prop('type', 'text');
            }
            ,onPasswordBlur: function(event) {
                $(event.target).prop('type', 'password');
            }
            ,onSubmit: function(e) {
                e.preventDefault();
                if (this.model.isValid()) {
                    this.trigger('submit', this.model.get('j_password'));
                    this.hide();
                    this.model.set(PasswordPopupModel.defaults);
                }
            }
            
            ,_toggleSubmitBtn: function(isValid) {
                var disabled = isValid ? false : 'disabled';
                this.$el.find('.submitBtn').prop('disabled', disabled);
            }
            ,initialize: function(options) {
                this.model = new PasswordPopupModel();
                var self = this;
                this.model.set('firstName', options.profileArgs.firstName, {silent: true});

                this.model.bind('validated', function(isValid) {
                    self._toggleSubmitBtn(isValid);
                });
                _initialize.apply(this);
            }
        })

        return PasswordPopupView;
    }
);
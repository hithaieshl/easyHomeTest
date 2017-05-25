define([
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'
     
     // - idleStateTracker is stopped when user Logs Out
     // - idleStateTracker is started when user Logs back In
    ,'helpers/idleStateTracker'

	,'helpers/logoutPopupState'
	
    // Template
    ,'requirejs-text!modules/login.popup/templates/login.html'
    
    ,'modules/login/models/login'
    ,'modules/login/views/login'
    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,idleStateTracker
				,logoutPopupState
                ,LoginTemplate
                ,LoginModel
                ,LoginView
    ) {

        var LogoutPopupView = LoginView.extend({
            template: _.template(LoginTemplate)
            ,events: {
                'submit': 'onSubmit'
                ,'focus .password input' : 'onPasswordFocus'
                ,'blur .password input' : 'onPasswordBlur'
                ,'keyup .js-salesperson input' : '_toggleSalespersonNames'
                ,'blur .js-salesperson input' : '_removeSalespersonnames'
                ,'click .js-clear-salesperson': '_onSalespersonClear'
                ,'mousedown .js-salesperson-names': '_onSalespersonSelect'
            }
            ,onNavigate: function() {
                var self = this;
                idleStateTracker.start();
                self.remove();
            }
            ,render: function() {
                var self = this;
                self.showOverlay();
                self.showLogin();
                LoginView.prototype.render.call(this);
				
				logoutPopupState.setIsOpened(true);
            }
            ,showOverlay: function() {
                var $overlay = _.template(
                        '<div class="overlay"><div class="login popup js-logout-popup">' +
                        '</div></div>');
                    // Remove previously set state
                    this.$el.find('.overlay').remove();
                    
                    // Add new state and overlay
                    $('body').addClass('loading').append($overlay);
            }
            ,showLogin: function() {
                $('.js-logout-popup').append(this.$el);
            }
            ,remove: function() {
                $('body > .overlay').remove();
                this.undelegateEvents();
                this.$el.removeData().unbind(); 
                Backbone.View.prototype.remove.call(this);
				
				logoutPopupState.setIsOpened(false);
            }
            ,initialize: function() {
                idleStateTracker.stop();
                LoginView.prototype.initialize.apply(this);
            }
        });

        return LogoutPopupView;
    }
);
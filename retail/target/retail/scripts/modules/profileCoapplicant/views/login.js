define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Template
    ,'requirejs-text!modules/profileCoapplicant/templates/login.html'

    // Model
    ,'modules/profileCoapplicant/models/login'

    ,'helpers/backbone/loader'

    // Backbone extension for two way data-binding (View<->Model)
    ,'backbone.stickit'

    // Backbone extension for client-side validation
    ,'backbone-validation'

    // Backbone validation callbacks overrides
    ,'helpers/backbone/validation'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,LoginTemplate
                ,LoginModel
                ,Loader
    ) {
        var LoginModule = Backbone.View.extend({
            tagName: 'form'
            ,className: 'loginPopup login'
            ,model: null
            ,resetPasswordModel: null
            ,template: _.template(LoginTemplate)
            ,bindings: {
                 '[name=j_username]':  'j_username'
                ,'[name=j_password]':  'j_password'
            }
            ,events: {
                'submit': 'onSubmit'
            }
            ,onSubmit: function(e) {
                // Prevent page reload
                e.preventDefault();
                // If model is valid, then post data to the server
                if ( this.model.isValid(true) ) {
                    this.model.save();
                }
            }
            ,onNavigate: function() {
                //var hash = window.location.href.split('#')[1] || '';
                //Eva.trigger('onNavigate', hash);
                Eva.trigger('Profile:composer:unbindEvents');
                //window.location.reload();
            }
            ,invalidate: function(errorMsg) {
                Backbone.Validation.callbacks.invalid(self, 'password', errorMsg);
            }
            ,render: function() {
                // Render the template
                this.$el.html(this.template(this.model));
                // Initialize stickit with view.bindings and view.model
                this.stickit();
                // Initialize validation of this view model attributes
                Backbone.Validation.bind(this);
                // Return the viewObj onRender to enable chain call
                return this;
            }
            ,initialize: function(attributes, options) {
                this.model = new LoginModel();
                Loader.apply(this, [false]);
                Eva.on('Profile:login:navigate', this.onNavigate, this);
                Eva.on('Profile:login:invalidate', this.invalidate, this);
            }
        });

        return LoginModule;
    }
);
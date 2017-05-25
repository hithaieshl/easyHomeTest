define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Template
    ,'requirejs-text!modules/customerLogin/templates/login.html'

    // Model
    ,'modules/customerLogin/models/login'
    ,'modules/customerLogin/models/resetLogin'

    ,'helpers/backbone/loader'

    // Backbone extension for two way data-binding (View<->Model)
    ,'backbone.stickit'

    // Backbone extension for client-side validation
    ,'backbone-validation'

    // Backbone validation callbacks overrides
    ,'helpers/backbone/validation'
    
    ,"helpers/backbone/stickit"

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,LoginTemplate
                ,LoginModel
                ,ResetPasswordModel
                ,Loader
    ) {
        var LoginModule = Backbone.View.extend({
            tagName: 'form'
            ,className: 'customerLogin login'
            ,model: null
            ,resetPasswordModel: null
            ,template: _.template(LoginTemplate)
            ,bindings: {
                 '[name=email]':  'email'
                ,'[name=password]':  'password'
            }
            ,events: {
                'submit': 'onSubmit'
                ,'click .resetPassword': 'onPasswordReset'
                ,'focus .password input' : 'onPasswordFocus'
                ,'blur .password input' : 'onPasswordBlur'
            }
            ,onPasswordFocus: function(event) {
                var target = $(event.target);
                target.prop('type', 'text');
            }
            ,onPasswordBlur: function(event) {
                var target = $(event.target);
                target.prop('type', 'password');
            }
            ,onSubmit: function(e) {
                // Prevent page reload
                e.preventDefault();
                // If model is valid, then post data to the server
                if ( this.model.isValid(true) ) {
                    this.model.save();
                }
            }
            ,onPasswordReset: function(event) {
                event.preventDefault();
                var self = this;
                this.resetPasswordModel.set('email', this.model.get('email'));
                this.resetPasswordModel.fetch({
                    data: this.resetPasswordModel.attributes
                });
            }
            ,onProfileNavigate: function(id) {
                Eva.trigger('navigateTo', 'profile/' + this.model.get('id'), {trigger: true});
                this.removeErrors();
            }
            ,onResetFormNavigate: function() {
                Eva.trigger('navigateTo', 'login/reset/' + this.model.get('id'), {trigger:true, replace: true}, this.model.attributes);
            }
            ,invalidate: function(errorMsg) {
                if (this.$el.find('.errorMessage').length === 0) {
                    $('<span class="errorMessage">' + errorMsg + '</span>').insertAfter(this.$el.find(".loginHeader"));
                }
            }
            ,removeErrors: function() {
                this.$el.find('.error').remove();
            }
            ,setPredifinedModelData: function(data) {
                if (data !== undefined) {
                    this.model.set('email', data.email);
                    this.model.set('id', data.id);
                }
            }
            ,remove: function() {
                // Remove the validation binding
                // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/unbinding
                Backbone.Validation.unbind(this);
                return Backbone.View.prototype.remove.apply(this, arguments);
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
            ,initialize: function(attributes) {
                var self = this;
                this.model = new LoginModel({id: attributes.id});
                this.model.fetch({
                    success: function() {
                        self.render();
                    }
                })
                this.resetPasswordModel = new ResetPasswordModel();
                this.resetPasswordModel.on('customerLogin:resetPassword', _.bind(this.onResetFormNavigate, this));
                this.model.on('customerLogin:success', _.bind(this.onProfileNavigate, this));
                this.model.on('customerLogin:error',  _.bind(this.invalidate, this));
                Loader.apply(this, [false]);
                Eva.on(attributes.pageName + ':setOptions', this.setPredifinedModelData, this);
            }
        });

        return LoginModule;
    }
);
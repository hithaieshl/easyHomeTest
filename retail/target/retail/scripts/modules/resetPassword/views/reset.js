define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Template
    ,'requirejs-text!modules/resetPassword/templates/resetPassword.html'

    // Model
    ,'modules/resetPassword/models/login'
    ,'modules/resetPassword/models/reset'

    ,'helpers/backbone/loader'
    // Backbone validation callbacks overrides
    ,'helpers/backbone/validation'

    // Backbone extension for two way data-binding (View<->Model)
    ,'backbone.stickit'

    // Backbone extension for client-side validation
    ,'backbone-validation'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,ResetPasswordTemplate
                ,LoginModel
                ,ResetModel
                ,Loader
    ) {
        var LoginModule = Backbone.View.extend({
            tagName: 'form'
            ,className: 'login'
            ,model: null
            ,resetModel: null
            ,template: _.template(ResetPasswordTemplate)
            ,bindings: {
                 '[name=token]':  'token'
                ,'[name=password]':  'password'
                ,'[name=passwordConfirm]':  'passwordConfirm'
            }
            ,events: {
                'submit': 'onSubmit'
                ,'click .resendPassword': 'onPasswordReset'
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
                this.resetModel.set('email', this.model.get('email'));
                this.resetModel.fetch({
                    data: this.resetModel.attributes
                });
            }
            ,onProfileNavigate: function() {
                 Eva.trigger('navigateTo', 'profile/' + this.model.get('id'), {trigger: true});
            }
            ,setPredifinedData: function(data) {
                if (data !== undefined) {
                    this.model.set('email', data.email);
                    this.model.set('id', data.id);
                    this.render();
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
            ,initialize: function(options) {
                this.model = new LoginModel();
                this.resetModel = new ResetModel();
                Eva.on(options.pageName + ':setOptions', this.setPredifinedData, this);
                Eva.on('resetPassword:reset:navigate', this.onProfileNavigate, this);
                Loader.apply(this, [false]);
            }
        });

        return LoginModule;
    }
);
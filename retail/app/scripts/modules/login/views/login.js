define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Template
    ,'requirejs-text!modules/login/templates/login.html'

    // Model
    ,'modules/login/models/login'

    ,'helpers/backbone/loader'
    ,'helpers/localStorageManager'
    ,'helpers/idleStateTracker'

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
                ,localStorageManager
                ,idleStateTracker
    ) {
        var LoginModule = Backbone.View.extend({
            tagName: 'form'
            ,className: 'login'
            ,model: null
            ,template: _.template(LoginTemplate)
            ,bindings: {
                 '[name=j_username]':  'j_username'
                ,'[name=j_password]':  'j_password'
                ,'[name=j_salesperson]' : 'j_salesperson'
            }
            ,events: {
                'submit': 'onSubmit'
                ,'focus .password input' : 'onPasswordFocus'
                ,'blur .password input' : 'onPasswordBlur'
                ,'keyup .js-salesperson input' : '_toggleSalespersonNames'
                ,'blur .js-salesperson input' : '_removeSalespersonnames'
                ,'click .js-clear-salesperson': '_onSalespersonClear'
                ,'mousedown .js-salesperson-names': '_onSalespersonSelect'
            }
            ,onPasswordFocus: function(event) {
                var target = $(event.target);
                target.prop('type', 'text');
            }
            ,onPasswordBlur: function(event) {
                var target = $(event.target);
                target.prop('type', 'password');
            }
            ,_toggleSalespersonNames: function(e) {
                var $names = this.$el.find('.salesperson-names');
                var storedNames = localStorageManager.getItem('salesperson');
                var currentInput = this.model.get('j_salesperson');
                
                var foundMatch = '';
                var numMatchedLetters = 0;
                if (storedNames.length && currentInput.length) {
                    storedNames.forEach(function(name, i) {
                        name = name.toLowerCase();
                        currentInput = currentInput.toLowerCase();
                        if (name.indexOf(currentInput) == 0 
                            && (currentInput.length >= numMatchedLetters)
                            && name !== currentInput) {
                            numMatchedLetters = currentInput.length;
                            foundMatch = name;
                        };
                    })
                }
                if (foundMatch) {
                    var element = '<span>'+foundMatch+'</span>';
                    $names.html($(element))
                } else {
                    this._removeSalespersonnames();
                }
            }
            ,_removeSalespersonnames: function() {
                this.$el.find('.salesperson-names').html('');
            }
            ,_onSalespersonSelect: function(e) {
                if(event.target.tagName.toLowerCase() === 'span') {
                    var text = e.target.innerHTML.trim();
                    this.model.set('j_salesperson', text);
                    this._removeSalespersonnames();
                    this.model.validate();
                }
            }
            ,_onSalespersonClear: function() {
                localStorageManager.removeItem('salesperson');
                this.model.set('j_salesperson', '');
                this._removeSalespersonnames();
                this._toggleClearSalesperson();
                this.model.validate();
            }
            ,onSubmit: function(e) {
                // Prevent page reload
                e.preventDefault();
                // If model is valid, then post data to the server

                /* Comment this, uncomment next block in dev to disable login validation */
                if ( this.model.isValid(true) ) {
                    this.model.save();
                }

                /* Development only
                    window.localStorage.setItem("username", "retail");
                    window.localStorage.setItem("password", "retail");
                    Eva.trigger('Login:login:navigate'); 
                */
            }
            ,onNavigate: function() {
                this.$el.find('.errorMessage').remove();
                Eva.trigger('navigateTo', 'search', {trigger:true});
            }
            ,invalidate: function() {
                var modelAttr = this.model.attributes;
                
                Backbone.Validation.callbacks.invalid(this, 'j_username', '');
                Backbone.Validation.callbacks.invalid(this, 'j_password', '');
                
                if (this.$el.find('.errorMessage').length === 0) {
                    $('<span class="errorMessage">The email or password you entered is incorrect</span>').insertAfter(this.$el.find(".title"));
                }
            }
            ,remove: function() {
                // Remove the validation binding
                // See: http://thedersen.com/projects/backbone-validation/#using-form-model-validation/unbinding
                Backbone.Validation.unbind(this);
                return Backbone.View.prototype.remove.apply(this, arguments);
            }
            ,deleteStoredCredentials: function() {
                this.model.set('j_password', '');
                this.model.set('j_username', localStorageManager.getItem('username'));
                this.model.set('j_salesperson', localStorageManager.getItem('salesperson')[0]);
            }
            ,restoreStoreCredentials: function() {
                localStorageManager.setItem("username", this.model.get('username'));
                localStorageManager.setItem("password", this.model.get('password'));
                localStorageManager.setItem("salesperson", this.model.get('salesperson'));
            }
            ,render: function() {
                var data = _.extend(this.model.toJSON(), {salespersonNames: localStorageManager.getItem('salesperson')});
                this.template = this.template(data);
                // Render the template
                this.$el.html(this.template);
                
                Backbone.Stickit.addHandler({
                     selector: 'input'
                    ,setOptions: {
                        validate: true
                    }
                });
                
                // Initialize stickit with view.bindings and view.model
                this.stickit();
                // Initialize validation of this view model attributes
                Backbone.Validation.bind(this);
                
                this.model.validate();
                
                // Return the viewObj onRender to enable chain call
                return this;
            }
            
            ,_toggleSubmitButton: function() {
                var $submitBtn = this.$el.find('[type="submit"]')
                var disabled = !this.model.isValid(); 
                $submitBtn.attr('disabled', disabled);
            }
            ,_toggleClearSalesperson: function() {
                var $clear = this.$el.find('.js-clear-salesperson');
                (localStorageManager.getItem('salesperson').length) 
                    ? $clear.addClass('visible') 
                    : $clear.removeClass('visible');
            }
            ,initialize: function() {
                this.model = new LoginModel();
                this.deleteStoredCredentials();
                Eva.on('Login:login:navigate', this.onNavigate, this);
                Eva.on('Login:login:invalidate', this.invalidate, this);
                Loader.apply(this);
                // Render the view
                this.render();
                this._toggleSubmitButton();
                this._toggleClearSalesperson();
                this.model.on('change', this._toggleSubmitButton, this);
                this.model.on('validated', this._toggleSubmitButton, this);	
            }
        });

        return LoginModule;
    }
);
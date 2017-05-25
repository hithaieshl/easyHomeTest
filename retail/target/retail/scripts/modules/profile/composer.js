define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Module composer prototype
    ,'prototypes/module.composer'

    // Local dependencies
    ,'modules/profile/views/panes'
    ,'modules/profile/views/footer'
    ,'modules/passwordPopup/passwordPopupView'
    ,'modules/profileUser/composer'
    ,'modules/profileCoapplicant/composer'
    
    ,'modules/profile/models/profile'

    // Helper module that add custom callbacks to model states based on xhr
    ,'helpers/backbone/loader'
    
    // Popup content, that will be shown on successful profile save
    ,'requirejs-text!modules/profileUser/templates/success.html'
    
    // Popup content, that will be shown on unsuccessful profile save
    ,'requirejs-text!modules/profileUser/templates/errors.html'

    // Helper for rendering a popup with custom template
    ,'helpers/popup'
    ,'google-analytics'

    // Backbone extension for client-side validation
    ,'backbone-validation'

    // Backbone validation callbacks overrides
    ,'helpers/backbone/validation'

    // RequireJS modules for Async load of Canada Post API
    ,'async'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,ModuleComposerPrototype
                ,PanesView
                ,FooterView
                ,PasswordPopup
                ,UserProfile
                ,CoapplicantProfile
                ,ProfileModel
                ,Loader
                ,SuccessPopupTemplate
                ,ErrorListPopupTemplate
                ,Popup
                ,_gaq
    ) {
        var ProfileModule = Backbone.ModuleComposer.extend({
            tagName: 'section',
            className: 'module profileWrapper',
            mode: '',
            successPopup: _.template(SuccessPopupTemplate),
            errorListPopup: _.template(ErrorListPopupTemplate),
            moduleName: 'profile',
            tabIndex: 1,
            events: {
                'click .js-auth-button-en': 'onAuthenticateEn',
                'click .js-auth-button-fr': 'onAuthenticateFr'
            },
            initSubmodules: function() {
                var self = this;
                // @2do :: refactor this
                var customerModel = self.model;
                var coapp = customerModel.attributes.coApplicant;
                var panes = [{
                        constructor: UserProfile,
                        arguments: {
                            pageName: self.attributes.pageName,
                            model: self.model.get('user')
                        }
                    } ,{
                        constructor: CoapplicantProfile,
                        arguments: {
                            pageName: self.attributes.pageName,
                            model: self.model.get('coApplicant')
                        }
                    }
                ];
                this.submodules = [{
                        constructor: PanesView,
                        arguments: {
                            panes: panes
                        }
                    }, {
                        constructor: FooterView,
                        arguments: {
                            // Pass the mode string attribute to FooterView
                            // So it would know which buttons to render
                            mode: self.mode
                        }
                    }
                ];
            },
            onCoapplicantChange: function(hasCoapplicant) {
                this.model.validateCoapplicantModel(hasCoapplicant);
            },
            initialize: function(attributes, options) {
                // Assign attributes to the view, so it can be
                // enriched with new data and then parsed into templates
                this.attributes = attributes;
                // Set pageName on a module
                this.pageName = attributes.pageName || '';
                
                // Instantiate an empty profile Model
                this.model = new ProfileModel();
                // Set mode and perform specific actions for profile instantiation
                this.setMode();
                // Render the profile page
                //this.render();
                Eva.on('ProfileModel:validated', this.onSubModelValidate, this);
                this.model.on('validated', this.onMainModelValidate, this);
                Eva.on('Profile:save', this.onSaveProfile, this);
                Eva.on('profile:coapplicant:change', this.onCoapplicantChange, this);
                Eva.on(attributes.pageName + ':setOptions', this.setPredifinedModelData, this);
            },
            _triggerAuthenticateNavigation: function (lang) {
                var self = this;
                Eva.trigger('navigateTo', 'auth/' + self.model.get('id') + '/' + lang, {trigger: true, replace: true});
            },
            onAuthenticateEn: function() {
              this._triggerAuthenticateNavigation('en');
            },
            onAuthenticateFr: function() {
               this._triggerAuthenticateNavigation('fr');
            },
            sendAnalytics: function(prefix) {
            	var customerId = this.model.get('id');
            	if (customerId) {
            		var type = (this.mode === 'update') ? 'profileUpdate' : 'profileCreation'; 
	            	console.log('id: ' + customerId);
	                _gaq.endTime('easyOrders', type);
	                _gaq.sendTime('easyOrders', type, customerId, prefix);
	            }
            },
            successCallback: function(model, response, options) {
                if (!model.get('isTuAuthRequired')) {
                    this.sendAnalytics('');
                }
            },
            showErrorPopup: function(model, xhr, options) {
                var $error;
                var errors = xhr.responseJSON !== undefined ?  xhr.responseJSON.errors : xhr.responseText;
                var defaultMessage = 'Server is currently unavailable. Please try again later.';
                var errorMessage = '';
                var errorTemplate = '';
                var self = this;

                // Clear the element of previous error/loading states
                this.loaderContainer
                        .removeClass('loading')
                        .addClass('error')
                        .find('.error.popup').detach();

                // Create a template for the popup
                errorTemplate = this.errorPopup || _.template(
                    '<section class="error popup">' +
                        '<header><button class="close">Close</button></header>' +
                        '<section class="content">' +
                            '<header>' +
                                '<h1><%- error %></h1>' +
                            '</header>' +
                        '</section>' +
                        '<footer><button class="button retry">Retry</button></footer>' +
                    '</section>');
                
                // Go over errors array returned by the API
                // and concat them into a single errorMessage string
                if (_.isArray(errors)) {
                    _.each(errors, function(error, index, list) {
                        errorMessage = errorMessage + error.errorMessage;
                    });
                }
                else if (_.isString(errors)) {
                    //parse string as html
                    var htmlObj = $(errors);
                    //show just header if we receive html from server
                    var header = htmlObj.filter('h1');
                    header = header.length === 0 ? htmlObj.filter('title'): header
                    errorMessage = header.length > 0 ? header.text() : errors;
                    errorMessage = errors;
                }
                else {
                    errorMessage = defaultMessage;
                }

                // Render the template
                $error = errorTemplate({ error: errorMessage });

                // Inject it into the DOM
                var $overlay = this.loaderContainer.find('.overlay');
                if ($overlay.length === 0) {
                    this.showSpinner();
                    this.loaderContainer.removeClass('loading');
                    $overlay = this.loaderContainer.find('.overlay');
                }
                $overlay.append($error);

                // Setup event listeners
                this.loaderContainer.find('.overlay .retry').on('click', function(event) {
                    // Prevent form submit
                    event.preventDefault();
                    // Retry saving the profile
                    self.saveData();
                });
                this.loaderContainer.find('.overlay .close').on('click', function(event) {
                    event.preventDefault();
                    self.sendAnalytics('-failed');
                    // Remove error state and overlay, which contains the error popup
                    self.loaderContainer
                        .removeClass('error')
                        .find('.overlay').remove();
                    Eva.trigger('navigateTo', '/');
                });
            },
            showSuccessPopup: function(model, response, options) {
                var self = this;
                // Set attributes to be the empty object by default (in case it happens to be undefined)
                var attributes = this.attributes || {};

                $overlay = this.loaderContainer.find('.overlay');
                if ($overlay.length === 0) {
                    this.showSpinner();
                    $overlay = this.loaderContainer.find('.overlay');
                }

                this.loaderContainer
                        .removeClass('loading');
                $overlay
                        .append(this.successPopup(_.extend(attributes, response)));

                // Setup event listeners
                this.loaderContainer.find('.overlay .close').on('click', function(event) {
                    event.preventDefault();
                    // Remove error state and overlay, which contains the error popup
                    self.hideSpinner();
                    self.sendAnalytics('');
                    if (_.isFunction(self.afterSuccessfulSubmition)) {
                        self.afterSuccessfulSubmition()
                    };
                    Eva.trigger('navigateTo', '/');
                });
            },
            _saveAfterPasswordPopup: function() {
                var self = this;
                new PasswordPopup({ profileArgs: { 
                    firstName: this.model.get('user').get('personal').get('firstName')
                }}).render().on('submit', function(value) {
                    self.model.get('user').get('personal').set('password', value);
                    self.saveData();
                })
            },
            saveData: function() {
                Eva.trigger('Profile:save');
            },
            add: function(event) {
                this._saveAfterPasswordPopup();
            },
            update: function(event) {
                // Submit the model to the API    
                this.isDraft ? this._saveAfterPasswordPopup() : this.saveData();
            },
            onDraftSave: function() {
                this.saveDraft();
            },
            /*
                Set mode and perform specific actions for profile instantiation

                Depending on the existence of id attribute applied
                to the composer, set mode property to be equal to either
                'update' or 'add'.

                Then apply mode 
            */
            setMode: function() {
                (this.id) ?
                    this.mode = 'update':
                    this.mode = 'add';

                switch(this.mode) {
                    case 'add': 
                        _gaq.startTime('easyOrders', 'profileCreation');
                        this.initAddMode(); break;
                    case 'update':
                        _gaq.startTime('easyOrders', 'profileUpdate');
                        this.initUpdateMode(); break;
                }
            },
            setIsDraft: function(isDraft) {
                this.isDraft = isDraft;
            },
            getUserProfileView: function() {
                return this.views[0].views[0];
            },
            getCoapplicantView: function() {
                return this.views[0].views[1];
            },
            setPredifinedModelData: function(data) {
                if (this.mode !== 'update') {
                    var userProfileView = this.getUserProfileView()
                    userProfileView.setPredifinedModelData(data);
                }
            },
            initAddMode: function() {
                // Instantiate an empty profile Model
                //this.model = new ProfileModel();
                // Apply Loader Helper to this View,
                // which brings xhr states handling to the table
                Loader.apply(this);
                // Render the profile page
                this.render();
            },
            initUpdateMode: function() {
                var self = this;
                //this.model = new ProfileModel({ id: self.id });
                this.model.set('id', self.id);
                // Apply Loader Helper to this View,
                // which brings xhr states handling to the table
                Loader.apply(this);
                // Fetch all profile data based on id and render the profile page
                this.model.fetch({
                    success: function(response, xhr) {
                        self.setIsDraft(response.attributes.isDraft);
                        self.render();
                    }
                });
            },
            validate: function() {
                var panes = this.views[0];
                panes.validateActivePane()
            },
            onSaveProfile: function() {
                // var response = {
                    // responseJSON: {"errors":[{"errorMessage":"Customer already exists with the email: galeQAEasy@gmail.com","fieldName":"user.personal.email","fieldType":""}, {"errorMessage":"Errorrr","fieldName":"user.address.addrCity","fieldType":""}, {"errorMessage":"Errorrr","fieldName":"user.employment.empPayment","fieldType":""}]}
                // }
                // this.onValidationError(this.model, response)
            	
                this.save();
            },
            /* convenience method to autofill profile form */
            onAutoFill: function() {
                //user profile tab
                var panesView = this.views[0]
                var views = panesView.views;
                for(var i = 0; i < views.length - 1; i++) {
                    if ($.isFunction(views[i].autoFillFields)) {
                        views[i].autoFillFields();
                    }
                }
            },
            onUndo: function() {
                var panesView = this.views[0];
                var views = panesView.views;
                views[panesView.activePaneIndex].onUndo();
            },
            onSubModelValidate: function(isValid, view) {
                var index = view.tabIndex;
                Eva.trigger('Profile:header:validate', isValid, index);
                //mark appropriate tab title as valid/invalid
                //this.views[0].validate(isValid, index);
            },
            onMainModelValidate: function(isValid) {
                //var panesView = this.views[0];
                //disable/enable footer buttons
                this.views[1].invalidate(isValid);
            },
            switchPane: function(index) {
                var panes = this.views[0];
                panes.switchPane(index);
            },
            render: function() {
                // Define modules to be rendered
                this.initSubmodules();
                // Render these modules
                this.invokeSubmodules(this.submodules);
                //bind to footer view undo event
                this.views[1].on('Profile:undo', this.onUndo, this);
                this.views[1].on('Profile:autofill', this.onAutoFill, this);
                this.views[1].on('Profile:draftSave', this.onDraftSave, this);
                this.views[1].on('Profile:add', this.add, this);
                this.views[1].on('Profile:update', this.update, this);
                Eva.on('Profile:header:switchPane', this.switchPane, this);
            }
        });
        return ProfileModule;
    }
);
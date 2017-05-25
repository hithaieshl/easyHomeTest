define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Module composer prototype
    ,'prototypes/module.composer'

    // Local dependencies
    ,'modules/auth.tu/views/header'
    ,'modules/auth.tu/views/questions'
    ,'modules/auth.tu/views/noQuestions'
    ,'modules/auth.tu/views/footer'

    // Primary Model
    ,'modules/auth.tu/models/auth.tu'

    // Success popup
    ,'requirejs-text!modules/auth.tu/templates/success.html'

    // Helper module that add custom callbacks to model states based on xhr
    ,'helpers/backbone/loader'
    ,'google-analytics'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,ModuleComposerPrototype
                ,HeaderView
                ,QuestionsView
                ,NoQuestionsView
                ,FooterView
                ,AuthTuModel
                ,SuccessPopupTemplate
                ,Loader
                ,_gaq
    ) {
        var AuthTuModule = Backbone.ModuleComposer.extend({
             tagName: 'section'
            ,events: {
                'click .submit': 'onSubmit'
            }
            ,className: 'module auth transUnion'
            ,showLoader: true
            ,successPopup: _.template(SuccessPopupTemplate)
            ,save: function(options) {
                if ( this.model.isValid(true) ) this.model.save(this.model.toJSON(), options);
            }
            /*
                Instantiate all submodules that will be
                rendered within this page, which includes:

                Header - static content, that explains to the user
                what these questions are for.
                
                Questions - 3 questions sent from TransUnion, that allow us
                to authenticate this user. They are supplied with a dropdown
                of possible answers. You have a limited number of attempts to answer those.

                Footer - action panel with buttons.
            */
            ,onSubmit: function(event) {
                var self = this;
                // Prevent form submit on button click
                event.preventDefault()
                /* Submit the model to the API. This request may take a while,
                therefore we're setting the timeout to 30 seconds  for this request.
                */
                this.save({lang: self.lang});
            }
            /*  Listen to primary model validation event
                and pass model's validation state (true/false) to the footer's view
                that will enable or disable submit button */
            ,onValidate: function(isValid) {
                console.log(isValid);
                this.views[2].onValidate(isValid);
            }
            ,initSubmodules: function() {
                var self = this;
                /*  If we did not retrieve any questions for this
                    profile, then display a dedicated NoQuestions view */
                if (this.model.get('questions').length === 0) {
                    this.submodules = [{
                         constructor: NoQuestionsView
                        ,arguments: {}
                    }];
                }
                /*  Otherwise, display tips, questions themselves
                    and submit button for user to complete authentication process */
                else {
                    this.submodules = [{
                            constructor: HeaderView
                            ,arguments: { lang: self.lang }
                        },{
                             constructor: QuestionsView
                            ,arguments: {
                                 lang: self.lang
                                ,collection: self.model.get('questions')
                            }
                        },{
                             constructor: FooterView
                            ,arguments: { lang: self.lang }
                    }];
                }
            }
            ,initialize: function(attributes) {
                var self = this;
                // Render the module
                this.model = new AuthTuModel({ id: self.id });
                self.lang = attributes.lang;
                // Subscribe to model's validation event
                this.model.on('validated', this.onValidate, this);
                // Apply Loader Helper to this View,
                // which brings xhr states handling to the table
                // Loader.apply(this);

                this.model.on('request', this.onRequest, this);
                this.model.on('fetch', this.onFetch, this);
                this.model.on('save', this.onSave, this);
                this.model.on('error', this.onError, this);
                /* Fetch data from the API with customer ID
                and render questions. This request may take a while,
                therefore we're setting the timeout to 30 seconds  for this request */

                // @2do :: remove timeout (as of now, without timeout, xhr gets cancelled for some reason)
                setTimeout(function() {
                    self.model.fetch({
                        data: { lang: self.lang } 
                        ,success: function(data, status, xhr) {
                            self.render();
                        }
                    });
                }, 200);
                
            }
            ,render: function() {
                // Define modules to be rendered
                this.initSubmodules();
                // Render these modules
                this.invokeSubmodules(this.submodules);
            }
            ,onRequest: function(model, xhr, options) {
                
                // Overlay template
                var $overlay = _.template(
                    '<div class="overlay">' +
                        '<span class="spinner"></span>' +
                    '</div>');

                // Remove previously set state
                this.$el
                        .removeClass('error')
                        .find('.overlay').remove();

                // Add new state and overlay
                this.$el
                        .append($overlay);
                if (this.showLoader) {
                    this.$el.addClass('loading')
                }
            }
            ,onSave: function(model, response, options) {
                var self = this;

                // Remove previous states
                this.$el
                        .removeClass('loading error')
                        .addClass('success');

                /*  If authentication succeeded, then display success popup */
                if (response && response.decision === 'PASS') {
                    this.showSuccessPopup(model, response, options);
                    _gaq.endTime('easyOrders', 'profileCreation');
                    _gaq.sendTime('easyOrders', 'profileCreation', this.id, '');
                    _gaq.endTime('easyOrders', 'profileUpdate');
                    _gaq.sendTime('easyOrders', 'profileUpdate', this.id, '');
                /*  If authentication failed and we did not receive any additional questions,
                    then display a success popup, that encourages customer to seek associate's assistance */
                } else if (response && response.decision === 'FAIL' && response.questions.length === 0) {
                    this.showSuccessPopup(model, response, options);
                    _gaq.endTime('easyOrders', 'profileCreation');
                    _gaq.sendTime('easyOrders', 'profileCreation', this.id, '');
                    _gaq.endTime('easyOrders', 'profileUpdate');
                    _gaq.sendTime('easyOrders', 'profileUpdate', this.id, '');
                /*  If authentication failed and we have received new set of questions,
                    then remove them and render new ones */
                } else if (response && response.decision === 'FAIL' && response.questions.length !== 0) {
                    // Remove the overlay
                    this.$el
                        .removeClass('loading')
                        .find('.overlay').remove();
                    // Remove previous questions from the DOM
                    this.views[1].$el.contents().detach();
                    // Re-render the questions view
                    this.views[1].render();
                }
            }
            ,onFetch: function(model, response, options) {
                // If this.showLoader is not set, then do nothing
                if (!this.showLoader) return;
                
                /*  If request was successful, then:
                    -> change module's state back to normal
                    -> remove the loader from the DOM */
                this.$el
                    .removeClass('loading')
                    .find('.overlay').remove();
            }
            ,onError: function(model, xhr, options) {
                var self = this;

                _gaq.endTime('easyOrders', 'profileCreation');
                _gaq.sendTime('easyOrders', 'profileCreation', this.id, '');
                _gaq.endTime('easyOrders', 'profileUpdate');
                _gaq.sendTime('easyOrders', 'profileUpdate', this.id, '');
                
                switch (xhr.status) {
                    case 503: // Service is unavailable
                        this.showErrorPopup(model, xhr, options);
                        break;
                    case 500: // Server internal error
                        this.showErrorPopup(model, xhr, options);
                        break;
                    case 404: // Unknown url
                        this.showErrorPopup(model, xhr, options);
                        break;
                    case 401: // Server side validation error
                        this.onValidationError(model, xhr, options);
                        break;
                    case 400: // Server side validation error
                        this.showErrorPopup(model, xhr, options);
                        break;
                    default:
                        this.showErrorPopup(model, xhr, options);
                        break;
                };
            }
            ,showSuccessPopup: function(model, response, options) {
                // Set attributes to be the empty object by default (in case it happens to be undefined)
                var attributes = this.attributes || {};
                attributes = _.extend(attributes, {lang: this.lang});

                this.$el.find('.overlay').append(this.successPopup(_.extend(attributes, response)));

                // Setup event listeners
                this.$el.find('.overlay .close').on('click', function(event) {
                    // Prevent form submit
                    event.preventDefault();
                    _gaq.endTime('easyOrders', 'profileCreation');
                    _gaq.sendTime('easyOrders', 'profileCreation', this.id, '');
                    _gaq.endTime('easyOrders', 'profileUpdate');
                    _gaq.sendTime('easyOrders', 'profileUpdate', this.id, '');
                    // Remove error state and overlay, which contains the error popup
                    self.$el
                        .removeClass('success')
                        .find('.overlay').remove();
                });
            }
            ,showErrorPopup: function(model, xhr, options) {
                var $error;
                var errors = xhr.responseJSON !== undefined ? xhr.responseJSON.errors : xhr.responseText;
                var defaultMessage = 'Server is currently unavailable. Please try again later.';
                var errorMessage = '';
                var errorTemplate = '';
                var self = this;

                // Clear the element of previous error/loading states
                this.$el
                        .removeClass('loading')
                        .addClass('error')
                        .find('.error.popup').detach();
                
                
                if( xhr.getResponseHeader('content-type').indexOf('text/html') >= 0 ) {
                    /* If server returns HTML -> simply insert it into popup */
                    this.$el.find('.overlay').append(xhr.responseText);
                } else {
                    /* If server returns JSON -> build error HTML piece */
                
                    // Create a template for the popup
                    errorTemplate = _.template(
                        '<section class="error popup">' +
                            '<header><button class="close">Close</button></header>' +
                            '<section class="content">' +
                                '<header>' +
                                    '<h1><%- error %></h1>' +
                                '</header>' +
                            '</section>' +
                            '<footer><a class="button close startOver" href="/search" data-internal="true"><span class="text">Home page</span></a></footer>' +
                        '</section>');

                    // If 'errors' is an empty array, then display failed authentication message
                    if (_.isArray(errors) && errors.length === 0)
                        errorMessage = 'Unfortunately you did not pass authentication.';
                    // If 'errors' is not empty, then go over errors array returned by the API
                    // and concat them into a single errorMessage string
                    else if (errors.length !== 0)
                        _.each(errors, function(error, index, list) {
                            // error HAS to contain 'errorMessage' field
                            var errText = error.errorMessage || error.text || JSON.stringify(error);
                            errorMessage = errorMessage + errText;
                        });
                    // If 'errors' is a string, then display that string as an error message
                    else if (_.isString(errors))
                        errorMessage = errors;
                    // In all other cases display a default message
                    else
                        errorMessage = defaultMessage;

                    // Render the template
                    $error = errorTemplate({ error: errorMessage });

                    // Inject it into the DOM
                    this.$el.find('.overlay').append($error);
                }
                
                
                // Setup event listeners
                this.$el.find('.overlay .retry').on('click', function(event) {
                    // Prevent form submit
                    event.preventDefault();
                    // Retry saving the profile
                    self.save({lang: self.lang});
                });
                this.$el.find('.overlay .close').on('click', function(event) {
                    // Prevent form submit
                    event.preventDefault();
                    // Remove error state and overlay, which contains the error popup
                    self.$el
                        .removeClass('error')
                        .find('.overlay').remove();
                    _gaq.endTime('easyOrders', 'profileCreation');
                    _gaq.sendTime('easyOrders', 'profileCreation', this.id, '');
                    _gaq.endTime('easyOrders', 'profileUpdate');
                    _gaq.sendTime('easyOrders', 'profileUpdate', this.id, '');
                    Eva.trigger('search:remove');
                    Eva.trigger('navigateTo', 'search', {trigger: true});
                });
            }
        });

        return AuthTuModule;
    }
);
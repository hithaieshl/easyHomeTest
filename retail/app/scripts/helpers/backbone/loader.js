define([
     'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'
    ], function(
        $
        ,_
        ,Backbone
        ,Eva
    ) {
        Loader = function(showLoader, loaderContainer) {
            // this.showPopup = false;
            this.loaderContainer = loaderContainer || this.$el;
            this.continuousRequest = false;
            this.showLoader = true;
            this._saveAsDraftFlag = false;
            this.showSpinner = function() {
                // Overlay template
                var $overlay = _.template(
                    '<div class="overlay">' +
                        '<span class="spinner"></span>' +
                    '</div>');

                if (this.showLoader && this.loaderContainer.find('.overlay').length === 0) {
                    this.loaderContainer
                        .addClass('loading')
                        .append($overlay);
                }
            };
            this.hideSpinner = function() {
                // If this.showLoader is not set, then do nothing
                if (!this.showLoader) return;
                
                /*  If request was successful, then:
                    -> change module's state back to normal
                    -> remove the loader from the DOM */
                if (!this.continuousRequest) {
                    this.loaderContainer
                        .removeClass('loading error success')
                        .find('.overlay').remove();
                }
            };
            /*
                Callback for $.ajax.start()

                This callback is triggered when communcation with the
                server has started. Then loader is displayed, which will be
                removed once the request has succeeded or failed
            */
            this.onRequest = function(model, xhr, options) {
                // Remove previously set state
                this.hideSpinner();

                this.showSpinner();
            };
            /*
                Callback for $.ajax.success()

                If request was successful, then simply remove
                redundant elements from the DOM.

                Some modules may treat @this.onSync() callback in a different way.
                For instance, profile would display the popup, that profile was either
                successfully registered or changes has been saved. In this case we create
                a custom implementation of that method within module's composer.
                In profile's case it's @this._onSync() which overrides this callback
                in @this.initialize() function with this.onSync = this._onSync;
            */
            this.onFetch = function(model, response, options) {
                $('.connectionError').remove();
                if (_.isFunction(self.successCallback)) {
                    self.successCallback()
                };
                this.hideSpinner();
            };

            this.onSave = function(model, response, options) {
            	if (response && response.errors && response.errors.length > 0) {
            		this.showErrorListPopup(model, response, options);
            	}
            	else if (!this.continuousRequest) {
                    $('.connectionError').remove();
                    this.loaderContainer.addClass('success');

                    if (_.isFunction(this.successCallback)) {
                        this.successCallback(model, response, options);
                    };
                    // If there's not success popup template defined,
                    // simply hide the overlay and revert modules status back to normal
                    if (!this.successPopup) {
                        this.hideSpinner();
                        return;
                    }

                    this.showSuccessPopup(model, response, options);
                }
            };
            /*
                Callback for $.ajax.error()
                
                We differentiate errors and the way we should react to them
                based on http status code. So we either display a popup or
                highlight fields that contain invalid data.
            */
            this.onError = function(model, xhr, options) {
                var self = this;
                
                if (_.isFunction(self.errorCallback)) {
                    self.errorCallback()
                };

                $('.connectionError').remove();
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
                        this.onValidationError(model, xhr, options);
                        break;
                    default:
                        this.showErrorPopup(model, xhr, options);
                        break;
                };
            };
            this.save = function() {
                this._saveAsDraftFlag = false;
                this.model.set('isDraft', false);
                console.log(this.model.toJSON());
                if (this.model.isValid(true)) {
                	this.model.save();
                }
            };
            this.saveDraft = function () {
                this._saveAsDraftFlag = true;
                this.model.set('isDraft', true);
                this.model.save();
            };
            /*
                This method is called when data we sent failed to
                pass through server side validation.
                So we should highlight all fields that contain invalid data
                the same way we would with client-side validation
            */
            this.onValidationError = function(model, xhr) {
                if (xhr.responseJSON !== undefined) {
                    var errors = xhr.responseJSON.errors;
                    if (errors !== undefined) {
                        var errorModels = {};
                        for (var i = 0;  i < errors.length; i++) {
                            //error name send in format model.innerModel.innerModel.. for backbone association models
                            var parsedErrorName = errors[i].fieldName.split('.');
                            var model = this.model;
                            for (var j = 0; j < parsedErrorName.length - 1; j++) {
                                if  (model instanceof Backbone.Collection) {
                                    model = model.at(parseInt(parsedErrorName[j], 10) - 1);
                                }
                                else  {
                                    model = model.get(parsedErrorName[j]);
                                }
                            }
                            //save all invalid models
                            errorModels[model['cid']] = model;
                            model.serverErorrs = model.serverErorrs || {};
                            var modelAttr = parsedErrorName[parsedErrorName.length - 1];
                            //save server errors in format fieldName: error
                            model.serverErorrs[modelAttr] = errors[i].errorMessage;
                        }
                    }
                    //trigger invalid event for all models that haven't pass server side validation
                    _.each(errorModels, function(model, key) {
                        model.trigger('validated', false, model, errors);
                        model.trigger('validated:invalid', false, model, errors);
                    });
                    //call validation for currently showed model
                    //in case of different tabs call validate on a view
                    if (_.isFunction(this.validate)) {
                        this.validate();
                    } else {
                        this.model.validate();
                    }
                }
                 // Remove overlay and change module's state
                this.loaderContainer
                        .removeClass('loading')
                        .addClass('error')
                        .find('.overlay').remove();
            }
            /*
                Show a popup, when error has occured while communicating with the API.
                Popup is shown only for specific errors,
                a list of which you can find in @this.onError() callback
            */
            this.showErrorPopup = function(model, xhr, options) {
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
                } else if (_.isString(errors)) {
                    //parse string as html
                    var htmlObj = $(errors);
                    //show just header if we receive html from server
                    var header = htmlObj.filter('h1');
                    header = header.length === 0 ? htmlObj.filter('title'): header
                    errorMessage = header.length > 0 ? header.text() : errors;
                } else {
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
                    self.save();
                });
                this.loaderContainer.find('.overlay .close').on('click', function(event) {
                    event.preventDefault();
                    // Remove error state and overlay, which contains the error popup
                    self.loaderContainer
                        .removeClass('error')
                        .find('.overlay').remove();
                    Eva.trigger('navigateTo', '/');
                });
            }
            this.showSuccessPopup = function(model, response, options) {
                var self = this;
                // Set attributes to be the empty object by default (in case it happens to be undefined)
                var attributes = this.attributes || {};
                _.extend(attributes, {saveAsDraftFlag: self._saveAsDraftFlag})
                
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
                    if (_.isFunction(self.afterSuccessfulSubmition)) {
                        self.afterSuccessfulSubmition()
                    };
                    Eva.trigger('navigateTo', '/');
                });
            }
            this.showErrorListPopup = function(model, response, options) {
                var self = this;
                // Set attributes to be the empty object by default (in case it happens to be undefined)
                var attributes = this.attributes || {};
                _.extend(attributes, {saveAsDraftFlag: self._saveAsDraftFlag})
                
                $overlay = this.loaderContainer.find('.overlay');
                if ($overlay.length === 0) {
                    this.showSpinner();
                    $overlay = this.loaderContainer.find('.overlay');
                }

                this.loaderContainer.removeClass('loading');
                $overlay.append(this.errorListPopup(_.extend(attributes, response)));

                // Setup event listeners
                this.loaderContainer.find('.overlay .close').on('click', function(event) {
                    event.preventDefault();
                    // Remove error state and overlay, which contains the error popup
                    self.hideSpinner();
                });
            }

            /*
                This is basically init function of this helper.

                It sets up a list of callbacks, that should be triggered
                once event is triggered on a model.
            */
            this.subscribe = function(model) {
                // If model is not set -> do nothing
                if(!model) return;

                this.showLoader = showLoader !== undefined ? showLoader : true;

                // Subscription list
                model.on('request', this.onRequest, this);
                model.on('fetch', this.onFetch, this);
                model.on('save', this.onSave, this);
                model.on('error', this.onError, this);
            }
            
            // Init the subscription
            this.subscribe(this.model);
        };
        
        return Loader;
    }
);
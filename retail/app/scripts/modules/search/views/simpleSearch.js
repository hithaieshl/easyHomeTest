define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'
    // Template
    ,'requirejs-text!modules/search/templates/simpleSearch.html'
    
    //Models
    ,'modules/search/models/simpleSearchModel'
    
    ,'helpers/backbone/loader'
    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,SimpleSearchTemplate
                ,SimpleSearchModel
                ,Loader
    ) {
        var SimpleSearch = Backbone.View.extend({
            tagName: 'form'
            ,className: 'simple search'
            ,template: _.template(SimpleSearchTemplate)
            ,model: null
            ,bindings: {
                 '[name=firstName]':            'firstName'
                ,'[name=lastName]':             'lastName'
                ,'[name=emailOrCustomerNumber]': {
                    observe: ['email', 'customerNumber']
                    ,onGet: function(values, options) {
                        var value = '';
                        var $input = this.$el.find('[name=emailOrCustomerNumber]')
                        if (values[0] !== undefined && values[0] !== null && values[0] !== '') {
                            value = values[0];
                        } else if (values[1] !== undefined && values[1] !== null && values[1] !== ''){
                            value = values[1];
                        }
                        this.validateDoubleFieldValue(value, options);

                        //return any existing model field: email or customerNumber
                        //email has bigger priority
                        return value;
                    }
                    ,onSet: function(value, options) {
                        this.validateDoubleFieldValue(value, options);
                    }
                }
            }
            ,events: {
                 'click     .submitBtn':            'onSubmit'
                ,'click     .expandedSearchBtn':    'showAdditionalFields'
            }
            ,onSubmit: function(event) {
                var self = this;
                event.preventDefault();
                if (this.model.isValid(true) && this.model.isDoubleValueFieldValid()) {
                    this.model.save();
                }
            }
            ,showAdditionalFields: function(event) {
                event.preventDefault();
                Eva.trigger('search:seacrhView:createDetailedSearch', this);
            }
            //logic just for fields that bind to 2 model attributes
            ,onValidate: function(isValid, model, errors) {
                var errorMsg = this.model.getDoubleFieldValidation();
                if (errorMsg) {
                    Backbone.Validation.callbacks.invalid(this, 'emailOrCustomerNumber', errorMsg);
                } else {
                    Backbone.Validation.callbacks.valid(this, 'emailOrCustomerNumber');
                }
                var $btn = this.$el.find('.submitBtn');
                if (isValid && !errorMsg) {
                    $btn.removeAttr('disabled');
                } else {
                    $btn.attr('disabled', 'disabled');
                }
            }
            ,activateValidation: function() {
                Backbone.Validation.bind(this);
                this.model.isValid(true);
            }
            ,validateDoubleFieldValue: function(value, options) {
                if(this.model.preValidate){
                    this.model.invalidateDoubleField(options.observe);

                    if (!this.model.preValidate(options.observe[0], value)) {
                        this.model.setDoubleField(options.observe[0], value);
                    }
                    //check if the second field is valid and if yes set it
                    //to corresponding model attribute
                    if (!this.model.preValidate(options.observe[1], value)) {
                        this.model.setDoubleField(options.observe[1], value);
                    }
                }
            }
            ,render: function() {
                // Render the template
                this.$el.html(this.template);
                // Set validate true for all form elements
                Backbone.Stickit.addHandler({
                     selector: 'input, select'
                    ,setOptions: {
                        validate: true
                    }
                });
                // Initialize stickit with view.bindings and view.model
                this.stickit();
                // Initialize validation of this view model attributes
                Backbone.Validation.bind(this);
                // Return the viewObj onRender to enable chain call
                return this;
            }
            ,initialize: function() {
                this.model = new SimpleSearchModel();
                this.render();
                Loader.apply(this);
                //bind to model validation events
                this.model.bind('validated', this.onValidate, this);
            }
        });

        return SimpleSearch;
    }
);
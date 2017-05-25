define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Template
    ,'requirejs-text!modules/search/templates/detailedSearch.html'

    //Models
    ,'modules/search/models/detailedSearchModel'

    ,'helpers/vanillaMask'
    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,DetailedSearchTemplate
                ,DetailedSearchModel
                ,Mask
    ) {
        var DetailedSearch = Backbone.View.extend({
            tagName: 'form'
            ,className: 'detailed search'
            ,template: _.template(DetailedSearchTemplate)
            ,model: null
            ,seacrhFormView: null
            ,bindings: {
                 '[name=firstName]':        'firstName'
                ,'[name=lastName]':         'lastName'
                ,'[name=email]':            'email'
                ,'[name=customerNumber]':   'customerNumber'
                ,'[name=homePhone]':        'homePhone'
                ,'[name=cellPhone]':        'cellPhone'
                ,'[name=sin]':              'sin'
            }
            ,events: {
                 'click .submitBtn':        'onSubmit'
                ,'click .backBtn':          'onClose'
            }
            ,onClose: function(event) {
                // Prevent form submit on button click
                event.preventDefault();
                // Hide Detailed Search overlay
                this.toggleVisibility(true);
            }
            ,toggleVisibility: function(isActive) {
                if (!isActive) {
                    this.getValuesFromSimpleSearch(this.seacrhFormView.model);
                    // Initialize validation of this view model attributes
                    Backbone.Validation.bind(this);
                    this.model.isValid(true);
                } else {
                    this.setValuesIntoSimpleSearch(this.seacrhFormView.model);
                    this.seacrhFormView.activateValidation();
                }
                this.$el.toggleClass('active');
            }
            ,onSubmit: function(event) {
                event.preventDefault();
                this.seacrhFormView.onSubmit(event);
                if (this.model.isValid()) {
                    this.toggleVisibility(true);
                    Eva.trigger('search:seacrhView:showTagFiltering', this);
                    this.$el.find('.submitBtn').attr('disabled', 'disabled');
                }
            }
            ,onValidated: function(isValid) {
                var $btn = this.$el.find('.submitBtn');
                if (isValid) {
                    $btn.removeAttr('disabled');
                } else {
                    $btn.attr('disabled', 'disabled');
                }
            }
            ,render: function() {
                // Render the template
                this.$el.html(this.template);
                // Initialize mask for Social Insurance Number
                Mask.maskPattern(this.$el.find("[name='sin']")[0], "999-999-999");
                // Initialize mask for phoneNumbers
                Mask.maskPattern(this.$el.find("[name='homePhone']")[0], "(999) 999-9999");
                Mask.maskPattern(this.$el.find("[name='cellPhone']")[0], "(999) 999-9999");
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

            //binding between two models (searchSimple and searchDetailed)
            ,getValuesFromSimpleSearch: function(partialModel) {
                _.each(partialModel.attributes, function(key, item) {
                    this.model.set(item, partialModel.get(item));
                }, this)
            }
            ,setValuesIntoSimpleSearch: function(partialModel) {
                _.each(partialModel.attributes, function(key, item) {
                    this.seacrhFormView.model.set(item, this.model.get(item));
                }, this);
            }

            ,initialize: function(options) {
                this.model = new DetailedSearchModel();
                this.seacrhFormView = options.seacrhFormView;
                this.getValuesFromSimpleSearch(this.seacrhFormView.model);
                this.model.bind('validated', this.onValidated, this);
            }
        });

        return DetailedSearch;
    }
);
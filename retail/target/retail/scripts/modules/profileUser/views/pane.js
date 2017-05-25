// This is a file copied by your subgenerator.
define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    ,'helpers/confirmationPopup'
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
                ,confirmationPopup
    ) {
        var Pane = Backbone.View.extend({
            tagName: 'section'
            ,template: null
            ,events: {
                 'clear': 'onClearHandler'
                ,'click .clearAddress button': 'onAddressClear'
            }
            ,onClearHandler: function() {
                var confirmationPopupInst = new confirmationPopup(
                    'Do you want to clear all profile data?',
                    _.bind(this.onDataClear, this)
                );
                var confirm = confirmationPopupInst.render();
                $('body').append(confirm.el);
            }
            ,onAddressClear: function(event) {
                var self = this;
                var $target = $(event.target);
                var container  = $target.parents('.fieldset')[0];
                var fields = {};
                var $fields = $(container).find('.field input, .field select');
                _.each($fields, function($field) {
                    var fieldName = $field.getAttribute('name');
                    //get model attribute binded to appropriate DOM field
                    var modelName = self.bindings['[name=' + fieldName + ']'];
                    if (_.isObject(modelName)) {
                        modelName = modelName.observe;
                    }
                    fields[modelName] = true;
                });
                this.model.clear(fields);
            }
            ,onDataClear: function() {
                if (_.isObject(this.model)) {
                    //set all readonly fields as a permanent for a model
                    this.model.setPermanentFields(this.getPermanentFields());
                    this.model.clear();
                    this.model.validate();
                } else if (_.isObject(this.collection)) {
                    this.collection.each(function(model, index) {
                        model.clear();
                        model.validate()
                    });
                }
            }
            /**
             * Validate model to show errors that come from server
             */
            ,validate: function() {
                var store = (this.model  || this.collection);
                if (store instanceof Backbone.Model) {
                    var serverErrors = store.serverErorrs;
                    if (serverErrors && Object.keys(serverErrors).length > 0) {
                        store.validate();
                    }
                } else if (store instanceof Backbone.Collection) {
                    store.each(function(model) {
                        var serverErrors = model.serverErorrs;
                        if (serverErrors && Object.keys(serverErrors).length > 0) {
                            model.validate();
                        }
                    })
                }
            }
            ,onValidate: function(isValid, model, errors) {
                console.log('Validation errors:\n' + JSON.stringify(errors));
                if (model.collection && model.collection instanceof Backbone.Collection) {
                    isValid = _.every(model.collection.models, function(model){
                        return model.isValid();
                    })
                } 
                Eva.trigger('Profile:validated', isValid, this);
            }
            ,getPermanentFields: function() {
                var fields = this.$el.find('input[readonly]').map(function(i, el) {
                    return $(el).attr('name');
                });
                return fields;
            }
            ,setPrevData: function() {
                this.model.undo();
            }
            ,render: function(attributes) {
                // Render the primary template
                this.$el.html(this.template(attributes));
                // Set validate true for all form elements
                Backbone.Stickit.addHandler({
                     selector: 'input, select'
                    ,setOptions: {
                        validate: true
                    }
                });
                // Initialize two-way data binding (view <-> model) based on view.bindings map
                this.stickit();
                // Apply validation for this view
                Backbone.Validation.bind(this, {
                  selector: 'name,class'
                });
                // Return the viewObj onRender to enable chain call
                return this;
            }
            ,initialize: function(attributes, options) {
                (this.model || this.collection).on('validated', this.onValidate, this);
                this.render(attributes);
                this.model.validate();
            }
        });

        return Pane;
    }
);
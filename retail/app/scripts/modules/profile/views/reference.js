// This is a file copied by your subgenerator.
define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Template
    ,'requirejs-text!modules/profile/templates/reference.html'
    
    ,'helpers/vanillaMask'

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
                ,referenceTemplate
                ,Mask
    ) {
        var Reference = Backbone.View.extend({
             className: 'fieldset reference'
            ,template: _.template(referenceTemplate)
            ,events: {}
            ,bindings: {
                 '.referenceId':           'id'
                ,'[name=refFirstName]':    'refFirstName'
                ,'[name=refLastName]':     'refLastName'
                ,'[name=refRelationship]': 'refRelationship'
                ,'[name=refPhoneNumber]': {
                     observe: 'refPhoneNumber'
                    ,onGet: function(value) {
                        if(!value) return;
                        return Mask.toPattern(value, "(999) 999-9999");
                    }
                }
            }
            ,initialize: function(attributes) {
                this.model = attributes.model;
                this.render();
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
                // Initialize two-way data binding (view <-> model) based on view.bindings map
                this.stickit();
                // Apply validation for this view
                Backbone.Validation.bind(this);
                // Initialize phoneNumber mask
                Mask.maskPattern(this.$el.find("[name='refPhoneNumber']")[0], "(999) 999-9999");
                // Return the viewObj onRender to enable chain call
                return this;
            }
        });

        return Reference;
    }
);
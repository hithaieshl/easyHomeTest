// This is a file copied by your subgenerator.
define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Template
    ,'requirejs-text!modules/profileUser/templates/footer.html'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,footerTemplate
    ) {
        var Footer = Backbone.View.extend({
            tagName: 'footer'
            ,events: {
                'click .undo' :       'onUndo'
                /* convenience method to autofill profile form */
                ,'click .auto-fill':  'onAutoFill'
                ,'submit':            'onSubmit'
                ,'click .add':        'onAdd'
                ,'click .update':     'onUpdate'
                ,'click .draft-save': 'onDraftSave'
            }
            ,isUndoDisabled: true
            ,onUndo: function(event) {
                var $target = $(event.target);
                $target.attr('disabled', 'disabled');
                this.isUndoDisabled = true;
                this.trigger('Profile:undo');
            }
            ,onSubmit: function(e) {
                // Prevent form submition, if GO button is pressed
                e.preventDefault();
            }
            ,onAutoFill: function() {
                this.trigger('Profile:autofill');
            }
            ,onAdd: function(e) {
                e.preventDefault();
                
                this.trigger('Profile:add');
            }
            ,onUpdate: function(e) {
                e.preventDefault();
                
                this.trigger('Profile:update');
            }
            ,onDraftSave: function() {
                this.trigger('Profile:draftSave');
            }
            ,initialize: function(attributes, options) {
                this.render(attributes);
            }
            ,invalidate: function(isValid) {
                if (this.isUndoDisabled) {
                    this.$el.find('.undo').removeAttr('disabled');
                    this.isUndoDisabled = false;
                }

                if (isValid) {
                    this.$el.find('.update, .add').removeAttr('disabled');
                    this.$el.find('.draft-save').attr('disabled', 'disabled');
                } else {
                    this.$el.find('.update, .add').attr('disabled', 'disabled');
                }
            }
            ,render: function(attributes) {
                var self = this;
                // Render the template
                this.template = _.template(footerTemplate, attributes);
                // Inject the element into the DOM
                this.$el.html(this.template);
                // Return the viewObj onRender to enable chain call
                return this;
            }
        });

        return Footer;
    }
);
// This is a file copied by your subgenerator.
define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Reference view
    ,'modules/profile/views/reference'

    //Parent view
    ,'modules/profile/views/pane'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,ReferenceView
                ,Pane
    ) {
        var _init = Pane.prototype.initialize;
        var _render = Pane.prototype.render;
        var References = Pane.extend({
             tabIndex: 3
            ,className: 'pane references'
            ,initialize: function() {
                this.collection.on('validated', this.onValidate, this);
                this.render();
                this.collection.each (function(model) {
                    model.validate();
                });
                //set all readonly fields as a permanent for a model
                //this.collection.setPermanentFields(this.getPermanentFields());
            }
            ,render: function() {
                var self = this;
                this.collection.each(function(model, index) {
                    // Set an id for each model and compensate for zero-based index
                    model.set('id', index + 1);
                    // Instantiate a reference view with provided model
                    var view = new ReferenceView({ model: model });
                    // Inject the element into the DOM
                    self.$el.append(view.$el);
                });
                // Return the viewObj onRender to enable chain call
                return this;
            }
        });

        return References;
    }
);
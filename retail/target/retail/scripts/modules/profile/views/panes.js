define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Module composer prototype
    ,'prototypes/module.composer'

    // Local dependencies
    //,'modules/profile/models/profile'

    ,'helpers/backbone/loader'

    // Backbone extension for client-side validation
    ,'backbone-validation'

    // Backbone validation callbacks overrides
    ,'helpers/backbone/validation'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
    ) {
        var PanesView = Backbone.View.extend({
             tagName: 'section'
            ,className: 'panes'
            ,activePaneIndex: 0
            ,switchPane: function(index) {
                var self = this;
                // Remove previous pane from the DOM
                this.$el.contents().detach();
                // Add new pane to the DOM
                this.$el.append(this.views[index].$el);
                this.views[index].validate();
                this.activePaneIndex = index;
            }
            ,validateActivePane: function() {
                var index = this.activePaneIndex;
                this.views[index].validate();
            }
            ,initialize: function(attributes, options) {
                this.render(attributes.panes);
            }
            ,render: function(panes) {
                var self = this, paneInstance;
                this.views = [];
                // Iterate through each element in the array,
                // which is a reference to the submoduleClass,
                // instantiate it and append to the page's $el
                _.each(panes, function(pane, index, list) {
                    paneInstance = new pane.constructor(pane.arguments);
                    self.views.push(paneInstance);
                });
                this.$el.append(this.views[0].$el);
            }
        });

        return PanesView;
    }
);
// This is a file copied by your subgenerator.
define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Template
    ,'requirejs-text!modules/profile/templates/orders.html'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,ordersTemplate
    ) {
        var Orders = Backbone.View.extend({
             tagName: 'section'
            ,className: 'pane orders'
            ,template: _.template(ordersTemplate)
            ,events: {}
            ,initialize: function() {
                this.render();
            }
            ,render: function() {
                // Render the template
                this.$el.html(this.template);
                // Return the viewObj onRender to enable chain call
                return this;
            }
        });

        return Orders;
    }
);
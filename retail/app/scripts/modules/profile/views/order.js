// This is a file copied by your subgenerator.
define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Template
    ,'requirejs-text!modules/profile/templates/order.html'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,orderTemplate
    ) {
        var Order = Backbone.View.extend({
            className: 'order'
            ,template: _.template(orderTemplate)
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

        return Order;
    }
);
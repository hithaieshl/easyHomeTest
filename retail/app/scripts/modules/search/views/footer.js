define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Template
    ,'requirejs-text!modules/search/templates/footer.html'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,footerTemplate
    ) {
        var SearchFooterView = Backbone.View.extend({
             tagName: 'footer'
            ,template: _.template(footerTemplate)
            ,events: {
                'click .newCustomerBtn': 'onNavigate'
            }
            ,onNavigate: function(event) {
                event.preventDefault();
                this.trigger('Search:navigateProfile');
            }
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

        return SearchFooterView;
    }
);
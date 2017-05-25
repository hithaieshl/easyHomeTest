define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Template
    ,'requirejs-text!modules/profileLinking/templates/footer.html'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,footerTemplate
    ) {
        var FooterView = Backbone.View.extend({
             tagName: 'footer'
            ,template: _.template(footerTemplate)
            ,events: {
                'click .cancelBtn': 'onCancel'
                ,'click .submitBtn': 'onSubmit'
            }
            ,onCancel: function(event) {
                event.preventDefault();
                this.trigger('profileLinking:completeLinking');
            }
            ,onSubmit: function(event) {
                event.preventDefault();
                this.trigger('profileLinking:saveLinking');
            }
            ,render: function() {
                // Render the template
                this.$el.html(this.template);
                // Return the viewObj onRender to enable chain call
                return this;
            }
            ,enableSubmitBtn: function() {
                this.$el.find('.submitBtn').removeAttr('disabled');
            }
            ,initialize: function() {
                this.render();
            }
        });

        return FooterView;
    }
);
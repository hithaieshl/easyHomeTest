// This is a file copied by your subgenerator.
define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Template
    ,'requirejs-text!modules/auth.tu/templates/footer.html'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,footerTemplate
    ) {
        var Footer = Backbone.View.extend({
             tagName: 'footer'
            ,events: {}
            ,onValidate: function(isValid) {
                (isValid) ?
                    // If model is valid, then remove disabled attribute out of submit button
                    this.$el.find('.submit').removeAttr('disabled') :
                    // Otherwise, if it's invalid set disabled to be true
                    this.$el.find('.submit').attr('disabled', 'disabled');
            }
            ,initialize: function(options) {
             this.lang = options.lang;
                this.render();
            }
            ,render: function() {
                this.template = _.template(footerTemplate, {lang: this.lang});
                // Render the template
                this.$el.html(this.template, this.model);
                // Return the viewObj onRender to enable chain call
                return this;
            }
        });

        return Footer;
    }
);
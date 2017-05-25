// This is a file copied by your subgenerator.
define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Template
    ,'requirejs-text!modules/auth.tu/templates/header.html'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,headerTemplate
    ) {
        var Header = Backbone.View.extend({
             tagName: 'header'
            ,events: {}
            ,initialize: function(options) {
             this.lang = options.lang;
                this.render();
            }
            ,render: function() {
                this.template = _.template(headerTemplate, { lang: this.lang });
                // Render the template
                this.$el.html(this.template);
                // Return the viewObj onRender to enable chain call
                return this;
            }
        });

        return Header;
    }
);
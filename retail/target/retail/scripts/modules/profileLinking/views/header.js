// This is a file copied by your subgenerator.
define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Template
    ,'requirejs-text!modules/profileLinking/templates/header.html'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,headerTemplate
    ) {
        var Header = Backbone.View.extend({
            tagName: 'header'
            ,className: 'pageHeader'
            ,template: _.template(headerTemplate)
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

        return Header;
    }
);
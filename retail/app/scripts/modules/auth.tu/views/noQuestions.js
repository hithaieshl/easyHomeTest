// This is a file copied by your subgenerator.
define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Template
    ,'requirejs-text!modules/auth.tu/templates/noQuestions.html'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,noQuestionsTemplate
    ) {
        var NoQuestions = Backbone.View.extend({
             tagName: 'section'
            ,className: 'noQuestions'
            ,template: _.template(noQuestionsTemplate)
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

        return NoQuestions;
    }
);
define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Local dependencies
    ,'modules/auth.tu/views/question'


    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,QuestionView
    ) {
        var QuestionsView = Backbone.View.extend({
             tagName: 'section'
            ,className: 'questions'
            ,events: {}
            ,initialize: function(attributes, options) {
                this.lang = attributes.lang;
                this.render();
            }
            ,render: function() {
                console.log(this.collection);
                var self = this;
                this.collection.each(function(model, index) {

                    // Instantiate a reference view with provided model
                    var view = new QuestionView({ model: model, lang: self.lang });
                    // Inject the element into the DOM
                    self.$el.append(view.$el);
                });
                // Return the viewObj onRender to enable chain call
                return this;
            }
        });

        return QuestionsView;
    }
);
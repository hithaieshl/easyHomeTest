define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Template
    ,'requirejs-text!modules/search/templates/tags.html'
    
    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,tagsTemplate
    ) {
        var TagFilteringView = Backbone.View.extend({
            className: 'tags'
            ,template: _.template(tagsTemplate)
            ,model: null
            ,seacrhFormView: null
            ,events: {
                'click .close': 'filterResults'
            }
            ,filterResults: function(event) {
                event.preventDefault();
                var target = event.target;
                var $tagEl = $(target).parent();
                var propName = $tagEl.data("name");
                $tagEl.remove();
                this.model.set(propName, '');
                this.seacrhFormView.onSubmit(event);
            }
            ,render: function() {
                // Render the template
                this.$el.html(this.template({
                    tags: this.model.toJSON()
                    ,required: this.model.getRequiredSearchFields()
                }));
                // Return the viewObj onRender to enable chain call
                return this;
            }
            ,initialize: function(options) {
                this.seacrhFormView = options.seacrhFormView;
                this.model = this.seacrhFormView.model;
            }
        });

        return TagFilteringView;
    }
);
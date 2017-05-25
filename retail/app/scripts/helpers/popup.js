define([
     'jquery'
    ,'underscore'
    ,'backbone'
    ], function(
        $
        ,_
        ,Backbone
    ) {
        var Popup = Backbone.View.extend({
             tagName: 'section'
            ,className: 'popup'
            ,events: {
                'click .close': 'onClose'
            }
            ,onClose: function(event) {
                // Prevent form submit
                event.preventDefault();
                // Hide the popup
                this.hide();
            }
            ,show: function() {
                // Render overlay template
                var $overlay = _.template(
                    '<div class="overlay connectionError">' +
                        '<span class="spinner"></span>' +
                    '</div>');
                // Remove previously created overlays from the DOM. Just in case.
                //this.parentView.$el.find('.overlay').remove();

                // Inject overlay into the DOM
                this.parentView.$el.append($overlay);
                // Inject popup into the DOM
                this.parentView.$el.find('.connectionError').append(this.$el);
            }
            ,hide: function() {
                // Remove overlay with popup
                this.parentView.$el.find('.connectionError').remove();
            }
            ,initialize: function(attributes, options) {
                
                this.parentView = attributes.parentView;
                console.log(this.parentView);

                this.render(attributes.template);
            }
            ,render: function(template) {
                // Render the template that was passed from the parentView
                this.template = _.template(template);
                // Inject it into the DOM
                this.$el.html(this.template);
                return this;
            }
        });
        return Popup;
    }
);
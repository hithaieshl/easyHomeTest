define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Template
    ,'requirejs-text!modules/profileLinking/templates/profilePriority.html'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,ProfilePriorityTemplate
    ) {
        var ProfilePriorityView = Backbone.View.extend({
             tag: 'section'
            ,className: 'profilePriority'
            ,template: _.template(ProfilePriorityTemplate)
            ,linkedModel: null
            ,events: {
                'change .profilePriority':  'onProfileSelection'
            }
            ,show: function() {
                this.$el.addClass('active');
            }
            ,onProfileSelection: function(event) {
                var $target = $(event.target);
                var type = $target.val().trim();
                Eva.trigger('profileLinking:prioritize', type);
            }
            ,render: function() {
                // Render the template
                this.$el.html(this.template({profiles: [this.model, this.linkedModel]}));
                // Return the viewObj onRender to enable chain call
                return this;
            }
            ,initialize: function(arguments) {
                this.model = arguments.onlineProfileModel;
                //this.render();
            }
        });

        return ProfilePriorityView;
    }
);
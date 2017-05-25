define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    //Models
    ,'modules/profileLinking/models/match'

    // Template
    ,'requirejs-text!modules/profileLinking/templates/profile.html'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,ProfileModel
                ,ProfileTemplate
    ) {
        var ProfileView = Backbone.View.extend({
             className: 'client'
            ,template: _.template(ProfileTemplate)
            ,model: null
            ,events: {
                'click .primary.info':  'onProfileSelection'
                ,'change .profileLink': 'onProfileLinking'
            }
            ,onProfileSelection: function() {
                this.$el.find('.primary.info, .secondary.info').toggleClass('active');
            }
            ,onProfileLinking: function() {
                var $target = $(event.target);
                Eva.trigger("Profile:match:unselect");
                $target.parents('.primary').addClass('selected');
                Eva.trigger('profileLinking:match', this.model);
            }
            ,render: function() {
                // Render the template
                this.$el.html(this.template(this.model));
                // Return the viewObj onRender to enable chain call
                return this;
            }
            ,initialize: function() {
                this.render();
            }
        });

        return ProfileView;
    }
);
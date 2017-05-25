define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Template
    ,'requirejs-text!modules/profileLinking/templates/matches.html'
    ,'requirejs-text!modules/profileLinking/templates/noMatches.html'

    // Collections
    ,'modules/profileLinking/collections/matches'

    // Views
    ,'modules/profileLinking/views/profile'

    // Xhr state handler
    ,'helpers/backbone/loader'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,MatchesTemplate
                ,NoMatchesTemplate
                ,MatchesCollection
                ,ProfileView
                ,Loader
    ) {
        var ProfileListView = Backbone.View.extend({
             tagName: 'section'
            ,className: 'matches'
            ,template: _.template(MatchesTemplate)
            ,noMatchesTemplate: _.template(NoMatchesTemplate)
            ,model: null
            ,events: {
                'keyup .filter input': 'filter'
            }
            ,filter: function(e) {
                var target = e.target;
                var query = target.value;
                var profiles = this.model.search(query);
                this.updateList(profiles);
            }
            ,updateList: function(profiles) {
                var self = this;
                var $list = self.$el.find('ul');
                $list.html('');
                profiles.each(function(profile) {
                    var profileView  = new ProfileView({model: profile});
                    $list.append(profileView.render().el);
                });
            }
            ,unSelectProfile: function() {
                this.$el.find('.selected').removeClass('selected');
            }
            ,render: function() {
                // Render the template
                if (this.model.length > 0) {
                    this.$el.html(this.template);
                    this.updateList(this.model);
                } else {
                    this.$el.html(this.noMatchesTemplate)
                }
                // Return the viewObj onRender to enable chain call
                return this;
            }
            ,initialize: function() {
                this.render();
                Eva.on("Profile:match:unselect", this.unSelectProfile, this);
            }
        });

        return ProfileListView;
    }
);
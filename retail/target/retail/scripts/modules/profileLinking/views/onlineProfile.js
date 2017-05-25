define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    //Models
    ,'modules/profileLinking/views/profile'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,ProfileView
    ) {
        var OnlineProfileView = ProfileView.extend({
             className: 'client onlineProfile'
            ,events: {
                'click .primary.info':  'onProfileSelection'
            }
            ,renderHeader: function() {
                var $header = $('<header><h2>Online profile</h2></header>');
                this.$el.html($header);
            }
            ,render: function() {
                this.renderHeader();
                // Render the template
                this.$el.append(this.template(this.model));
                // Return the viewObj onRender to enable chain call
                return this;
            }
        });

        return OnlineProfileView;
    }
);
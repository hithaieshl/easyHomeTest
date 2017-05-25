define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // PageRouter prototype
    ,'prototypes/page.router'

    // Index page for this route
    ,'pages/profile/index'
    // Subroutes
    // ...

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,PageRouter
                ,IndexPage
                // ...
    ) {
        var ProfileRouter = Backbone.PageRouter.extend({
            routes: {
                 '': 'injectIndexPage'
                ,':id': 'injectIndexPage'
            }
            ,injectIndexPage: function(id) {
                var self = this;
                // Set the pageView container as an $el for this obj
                this.$el = this.$el || $('.page-wrap');
                // Instantiate ApplicationPageView only once
                if(!this.pageView) this.pageView = new this.options.index({ id: id });
                // Detach all the other contents from the DOM
                // and preserve event binders with .detach()
                this.$el.contents().detach();
                // Inject it into the DOM
                this.$el.append(this.pageView.$el);
                // Trigger pageChange event to notify corresponding view to act
                // appropriately (e.g. close navigation bar)
                Eva.trigger('page:change', this.pageView);
                this.pageView.on('remove', function() {
                    self.pageView = null;
                });
            }
            ,options: {
                index: IndexPage
            }
        });
        return ProfileRouter;
    }
);
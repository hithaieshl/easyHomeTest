define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // PageRouter prototype
    ,'prototypes/page.composer'

    // Index page for this route
    ,'pages/search/link/index'
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
        var LinkRouter = Backbone.PageRouter.extend({
            // We are good to go with the base funcionality,
            // defined in the page.router prototype
            options: {
                index: IndexPage
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
        });
        return LinkRouter;
    }
);
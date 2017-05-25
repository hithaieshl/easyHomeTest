define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // PageRouter prototype
    ,'prototypes/page.router'

    // Index page for this route
    ,'pages/auth/index'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,PageRouter
                ,IndexPage
    ) {
        var AuthRouter = Backbone.PageRouter.extend({
            routes: {
                 '':    'injectIndexPage'
                 ,':id/:lang': 'injectIndexPage'
            }
            ,injectIndexPage: function(id, lang) {
                var self = this;
                // Set the pageView container as an $el for this obj
                this.$el = this.$el || $('.page-wrap');
                // Instantiate ApplicationPageView only once
                if(!this.pageView) this.pageView = new this.options.index({ id: id, lang: lang});
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
        return AuthRouter;
    }
);
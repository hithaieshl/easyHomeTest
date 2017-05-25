define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'
    ,'router'
    ,'fastclick'
    ,'helpers/localStorageManager'
    ,'helpers/idleStateTracker'
    ,'helpers/popup'
    ,'requirejs-text!templates/connectionLostError.html'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,AppRouter
                ,Fastclick
                ,localStorageManager
                ,idleStateTracker
                ,Popup
                ,networkConnectionLost
    ) {
        var App = new (Backbone.View.extend({
            events: {
                // For internal links prevent default and navigate to the corresponding url
                 'click a[data-internal="true"]':   'handleInternalLinks'
                ,'click a[data-internal="false"]':  'handleExternalLinks'
                ,'click .back': 'goBack'
            }
            ,handleInternalLinks: function(e) {
                e.preventDefault();
                var href = $(e.currentTarget).attr('href').toString();
                this.appRouter.navigate(href, { trigger: true });
            }
            ,handleExternalLinks: function(e) {
                e.preventDefault();
                var href = $(e.currentTarget).attr('href').toString();
                var gWindow = window.open(href, '_blank', 'location=yes');
            }
            ,goBack: function(e) {
                window.history.back();
            }
            ,updateOnlineStatus: function(event) {
                var isOnline = navigator.onLine;
                if(!isOnline && this.$el.find('.connectionError').length === 0) {
                    var popup = new Popup({
                        parentView: this
                        ,template: networkConnectionLost
                    });
                    popup.show();
                }
            }
            ,start: function() {
                // To prevent persistance of salesperson name set it to username on application start
                localStorageManager.removeItem('salesperson');
                if (localStorageManager.getItem('username')) {
                    localStorageManager.setItem('salesperson', localStorageManager.getItem('username'));
                }

                idleStateTracker.initialize();

                var self = this;
                // Passed in our Router module and call it's initialize function on instantiation
                this.appRouter = new AppRouter();
                // Remove the 300ms delay between a physical tap and the firing of a click event on mobile browsers
                Fastclick.attach(this.$el.get(0));
                window.addEventListener('offline', function() {self.updateOnlineStatus.call(self)});
            }
        }))({el: document.body});
        return App;
    }
);
define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Helpers
    ,'helpers/common'
    ,'helpers/backbone/sync'
    
    // Environment stats
    ,'config/env'

    // 
    ,'prototypes/page.router'

    // Header Module, that appears on all pages
    ,'modules/header/composer'
    // Home page
    ,'pages/index'
    // Declared subroutes
    ,'pages/search/router'
    //,'pages/search/link/index'
    ,'pages/profile/router'
    ,'pages/login/router'
    //,'pages/login/reset/router'
    ,'pages/auth/router'

    ], function(
        $
        ,_
        ,Backbone
        ,Eva
        ,helpers
        ,backboneSyncHelper
        ,env
        ,Subrouter
        ,HeaderModule
        ,HomePage
        ,SearchPageRouter
        //,SearchLinkPageRouter
        ,ProfilePageRouter
        ,LoginPageRouter
        //,LoginResetPageRouter
        ,AuthPageRouter
    ) {
        var AppRouter = Backbone.Router.extend({
            routes: {
                 '': 'invokeIndexPage'
                ,':pageName(/*subroute)': 'invokePageModule'
            }
            ,data: null
            ,currentPage: null
            ,currentHeader: null
            ,initialize: function(options) {
                this.$el = $('#page-wrap');
                Eva.on('page:change', this.onPageChange, this);
                // Start backbone history to track routes
                this.startHistory();
                // Publish app.initiliazed event for things like google analytics to kick in
                Eva.trigger('app.initialized');
                Eva.on('navigateTo', this.onNavigateTo, this);
                 // Add Header, that is common to all pages
                //this.addDefaultHeader();
            }
            ,startHistory: function() {
                if(!Backbone.History.started) {
                    // var pushState = window.localStorage.getItem('isPhoneGap');
                    Backbone.history.start({ pushState: false });
                }
            }
            ,onNavigateTo: function(href, options, data) {
                this.data = data;
                this.navigate(href, options);
            }
            ,onPageChange: function(page) {
                if (this.currentPage && this.currentPage.shouldBeRemoved && this.currentPage !== page) {
                    //if page is not secured remove it
                    //in other case retail manager popup will be shown and page will be cleared after successful login
                    if (!this.currentPage.isSecurePage) {
                        this.currentPage.remove();
                    }
                    this.currentPage = null;
                }
                this.currentPage = page;
                this.addHeader(this.currentPage.header);
                Eva.trigger(page.pageName + ':setOptions', this.data);
            }
            /*
                We have multiple enviroments that run our application (application, web prod and web dev)
                For the most part, our application behaves the same way across all of them,
                although login functionality is the major exception.
                So on UAT and production we have admin application, which hosts our retail page (~/retail).
                This page is not accessible from the get go, so you have to log into the admin site and only
                then you have access too ~/retail url. Obviosly that login page is hosted by broadleaf application
                and we can't replace it with our module. On the other hand, it does not make sense to ask retail manager
                to log in twice. So we've came up with the following solution:
                    - detect the environment our application is ran by
                    - display login page for application or local dev enviroment (hosted by node web server)
                    - display search page for uat/prod web environment
                    - for uat/prod web environment call 'credentials' API to get retail managers username and password
                    that we need to have access to other APIs

                verifyUserLoggedIn serves to make that last objective to happen
            */
            ,verifyUserLoggedIn: function() {
                var
                     self = this
                    ,url = env.getUrlFor('credentials');
                /*
                    Get username and password(encoded) from the server.
                    
                    Server will check for sessionId in our cookies and
                    serve us with corresponding username and password
                */
                $.get( url, function( data ) {
                    /*
                        Check if username and password are available,
                        store them in localStorage for other components to have access to
                        and navigate to the search page
                    */
                    if (data["username"] && data["password"]) {
                        window.localStorage.setItem("username", data.username);
                        window.localStorage.setItem("password", data.password);
                        self.onNavigateTo('search', { trigger: true });
                    }
                    // Otherwise load login page
                    else self.loadIndexPage();
                })
                // If the request to the API has failed, load login page anyway
                .fail(function() {
                    self.loadIndexPage();
                });
            }
            ,addHeader: function(headerModule) {
                var headerModuleConstructor = headerModule || HeaderModule;
                if (!this.currentHeader || this.currentHeader && headerModuleConstructor.prototype.moduleName !== this.currentHeader.moduleName) {
                    if (window.localStorage.getItem('environment').indexOf("web") > -1) {
                        $('body').addClass('web');
                    }
                    var headerModel = {
                        title: null,
                        isSensitivePage: false
                    }
                    var page = this.currentPage;
                    if (page !== null) {
                        headerModel = {
                             title: page.title || null
                            ,isSensitivePage: page.isSensitivePage || false
                        }
                    }
                    var headerModuleConstructor = headerModule || HeaderModule;
                    var headerModule = new headerModuleConstructor(headerModel);
                    $('body>header').remove();
                    $('body').prepend(headerModule.$el);
                    this.currentHeader = headerModule;
                }
            }
            // Invoke Home Page Module
            ,invokeIndexPage: function() {
                console.log('is phonegap - ' + window.localStorage.getItem('isPhoneGap'));
                // If this is an application environment, then load index page right away
                if (window.localStorage.getItem('isPhoneGap')) {
                    this.loadIndexPage();
                } else {
                    // otherwise (if it's browser env) verify user's credentials
                    this.verifyUserLoggedIn();
                }
            }
            ,loadIndexPage: function() {
                // Instantiate LocationsPageView only once
                if(!this.pageView) this.pageView = new HomePage();
                // Detach all the other contents from the DOM
                // and preserve event binders with .detach()
                this.$el.contents().detach();
                // Inject it into the DOM
                this.$el.append(this.pageView.$el);
                // Trigger pageChange event to notify corresponding view to act
                // appropriately (e.g. close navigation bar)
                Eva.trigger('page:change', this.pageView);
            }
            // Invoke Page Module along with it's nested modules and subroutes
            ,invokePageModule: function(pageName, subroute) {
                // Transform passed in 'module' string to the unified format
                // and create a reference to the object with the name that matches the string
                // Eval the corresponding page router (e.g. ApplicationPageRouter)

                if (pageName === 'android_asset') {
                    this.invokeIndexPage();
                    return;
                }
                var
                     username = window.localStorage.getItem("username")
                    ,password = window.localStorage.getItem("password");

                // If user is not logged in, redirect him to the login page at '' route
                if (username === null || password === null) {
                    console.log('Username and password are not set');
                    this.onNavigateTo('', { trigger: true });
                    return;
                }

                // Check if this Page Module exists
                try {
                    var PageRouter = eval(pageName.toLowerCase().capitalize() + 'PageRouter');
                    // If it does exist, then instantiate it's router
                    this.pageRouter = new PageRouter(
                                            pageName.toLowerCase(),
                                            { createTrailingSlashRoutes: true });
                // If not -> fallback to the 404 page
                } catch(e) {
                    console.log(e, 'Route delegation failed');
                    this.invokeIndexPage();
                    // Detach all the other contents from the DOM
                    // and preserve event binders with .detach()
                    // this.$el.contents().detach();
                    // If the error was instantiated before, then reuse that view
                    // if(!this.errorPageView) this.errorPageView = new ErrorModuleController({ errorCode: '404' });
                    // Then append it to the DOM
                    // this.$el.append(this.errorPageView.$el);
                }
            }
        });

        return AppRouter;
    }
);
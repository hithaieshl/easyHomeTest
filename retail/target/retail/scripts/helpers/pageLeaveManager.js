define([
     'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'
    ,'modules/login.popup/composer'
    ,'helpers/idleStateTracker'
    ,'helpers/logoutPopupState'
    ], function(
        $
        ,_
        ,Backbone
        ,Eva
        ,LoginModule
        ,idleStateTracker
        ,logoutPopupState
    ) {
        var Unloader = function() {
            var self = this;
            var LoginModuleInst = null;
            var forwardCount = 1;
            var whiteListPages = ['auth'];
            self.isSecurePage = true;

            this.showManagerLogin = function() {
                var hash = window.location.hash;
                var isSecurePage = _.find(whiteListPages, function(page) {
                    return hash.indexOf(page) !== -1;
                });
                if (isSecurePage === undefined) {
                    //Show just one popup at a time
                    if (LoginModuleInst === null) {
                        self.showOverlay();
                        LoginModuleInst = new LoginModule({});
                        $('body > .overlay').append(LoginModuleInst.$el);
                    } else {
                        forwardCount++
                    }
                } else {
                    self.unbind();
                    self.remove();
                }
            };
            this.showOverlay = function() {
                var $overlay = _.template(
                        '<div class="overlay">' +
                        '</div>');
                    // Remove previously set state
                    this.$el
                            .find('.overlay').remove();
                    
                    // Add new state and overlay
                    $('body')
                            .addClass('loading')
                            .append($overlay);
            };
            this.hashChange = function(event) {
                if (idleStateTracker.getIdleTimeLimitReached()) {
                    self.showManagerLogin();
                    return;
                }
                if (logoutPopupState.isOpened()) {
                    return; 
                }
                
                forwardCount++;
                Eva.trigger('page:terminate');
                Eva.trigger('page:success');
            };
            this.onNavigate = function() {
                self.terminate();
                Backbone.history.history.go(forwardCount);
            };
            this.terminate = function() {
                this.unbind();
                this.remove();
                LoginModuleInst = null;
                $('body')
                        .removeClass('loading')
                        .find('.overlay').remove();
            };
            this.bind = function() {
                var self = this;
                if (Backbone.history._hasPushState) {
                    Backbone.$(window).on("popstate", this.showManagerLogin);
                } else {
                    setTimeout(function() {
                        Backbone.$(window).on("hashchange", self.hashChange);
                    }, 1000);
                }
            };
            this.unbind = function() {
                if (Backbone.history._hasPushState) {
                    $(window).off("popstate", this.showManagerLogin);
                } else {
                    $(window).off("hashchange", this.hashChange);
                }
            };
            var init = function() {
                this.bind();
                Eva.on('page:terminate', this.terminate, this);
                Eva.on('page:navigate', this.onNavigate, this);
            };
            init.call(this);
        };
        
        return Unloader;
    }
);
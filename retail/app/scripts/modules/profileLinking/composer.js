define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Module composer prototype
    ,'prototypes/module.composer'

    //Views
    ,'modules/profileLinking/views/header'
    ,'modules/profileLinking/views/onlineProfile'
    ,'modules/profileLinking/views/matches'
    ,'modules/profileLinking/views/profilePriority'
    ,'modules/profileLinking/views/footer'
    
    //Models
    ,'modules/profileLinking/models/profileLinkingStore'
    ,'modules/profileLinking/models/linkedProfile'

    ,'helpers/backbone/loader'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,ModuleComposerPrototype
                ,HeaderView
                ,OnlineProfileView
                ,MatchesView
                ,ProfilePriorityView
                ,FooterView
                ,ProfileLinkingStore
                ,linkedProfileModel
                ,Loader
    ) {
        var ProfileLinkingModule = Backbone.ModuleComposer.extend({
             tagName: 'section'
            ,className: 'module profileLinking'
            ,model: null
            ,linkModel: null
            ,initSubmodules: function() {
                var self = this;
                this.submodules = [{
                    constructor: HeaderView
                    ,arguments: { }
                },{
                    constructor: OnlineProfileView
                    ,arguments: {model: self.model.get('onlineProfile')}
                },{
                    constructor: MatchesView
                    ,arguments: {model: self.model.get('matches')}
                },{
                    constructor: ProfilePriorityView
                    ,arguments: {onlineProfileModel: self.model.get('onlineProfile')}
                },{
                    constructor: FooterView
                    ,arguments: {}
                }]
            }
            ,setLinkedProfile: function(model) {
                //enable footer 'link' button
                this.views[4].enableSubmitBtn();
                this.linkModel = new linkedProfileModel({
                    id: this.id
                    ,customerNumber: model.get('customerNumber')
                });
                this.views[3].linkedModel = model;
                this.views[3].render();
                this.views[3].show();
                this.linkModel.on('profileLinking:completeLinking', _.bind(this.onNavigate, this));
            }
            ,setPrioritization: function(value) {
                this.linkModel.set('mainProfileType', value);
            }
            ,onNavigate: function() {
                Eva.trigger('navigateTo', 'login/' + this.model.get('id'), {trigger: true}, this.model.get('onlineProfile').attributes);
            }
            ,saveLinkedProfile: function() {
                this.linkModel.save();
            }
            ,initialize: function(attributes, options) {
                Loader.apply(this);
                // Fire before initialize callback
                this.beforeInit(attributes, options);
                this.pageName = attributes.pageName || '';
                // Fire after initialize callback
                this.afterInit(attributes, options);
            }
            ,afterInit: function(attributes, options) {
                Eva.on('profileLinking:match', this.setLinkedProfile, this);
                Eva.on('profileLinking:prioritize', this.setPrioritization, this);
            }
            ,beforeInit: function(attributes, options) {
                var self = this;
                this.model = new ProfileLinkingStore({ id: this.id });
                this.model.fetch({
                    success: function() {
                        self.render();
                    }
                });
            }
            ,render: function() {
                // Render defined modules
                this.initSubmodules();
                this.invokeSubmodules(this.submodules);
                //bind to footer 'no match' button to complete linking
                this.views[4].on('profileLinking:completeLinking', _.bind(this.onNavigate, this));
                this.views[4].on('profileLinking:saveLinking', _.bind(this.saveLinkedProfile, this));
            }
        });

        return ProfileLinkingModule;
    }
);
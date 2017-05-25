define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Module composer prototype
    ,'prototypes/module.composer'

    //Views
    ,'modules/search/views/simpleSearch'
    ,'modules/search/views/footer'
    ,'modules/search/views/clients'
    ,'modules/search/views/detailedSearch'
    ,'modules/search/views/tagFilteringView'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,ModuleComposerPrototype
                ,SimpleSearch
                ,SearchFooterView
                ,ClientsView
                ,DetailedSearch
                ,TagFilteringView
    ) {
        var SearchModule = Backbone.ModuleComposer.extend({
            tagName: 'section'
            ,className: 'module search'
            ,submodules: [
                {
                    constructor: SimpleSearch
                    ,arguments: {}
                },{
                    constructor: ClientsView
                    ,arguments: {}
                },{
                    constructor: SearchFooterView
                    ,arguments: {}
                }
            ]
            ,searchForm : null
            ,detailedSearchForm: null
            ,clientList: null
            ,footer: null
            ,tagsView : null
            ,showTagFiltering: function(mainSearchView) {
                if (this.tagsView === null) {
                    //decorate searchForm view with tags for filtering
                    this.tagsView = new TagFilteringView({
                        seacrhFormView: mainSearchView
                    });
                    this.$el.find('.search.simple').after(this.tagsView.render().el);
                } else {
                    this.tagsView.render().el;
                }
            }
            ,createDetailedSearch: function(mainSearchView) {
                if (this.detailedSearchForm === null) {
                    //decorate searchForm view with expanded search data
                    this.detailedSearchForm = new DetailedSearch({
                        seacrhFormView: mainSearchView
                    });
                    this.$el.append(this.detailedSearchForm.render().el);
                    // force layout rendering
                    window.getComputedStyle(this.detailedSearchForm.el).top;
                }
                this.detailedSearchForm.toggleVisibility();
            }
            ,onNavigate: function() {
                Eva.trigger('navigateTo', 'profile', {trigger: true}, this.views[0].model.attributes);
            }
            ,afterInit: function(options) {
                Eva.on('search:seacrhView:createDetailedSearch', this.createDetailedSearch, this);
                Eva.on('search:seacrhView:showTagFiltering', this.showTagFiltering, this);
            }
            ,render: function() {
                // Render defined modules
                this.invokeSubmodules(this.submodules);
                //bind to footer 'register new profile'
                this.views[2].on('Search:navigateProfile', _.bind(this.onNavigate, this));
                return this;
            }
        });

        return SearchModule;
    }
);
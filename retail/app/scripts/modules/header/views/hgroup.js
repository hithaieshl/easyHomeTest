define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Model
    ,'modules/header/models/hgroup'

    ,'modules/login.popup/views/logoutPopup'

    // Template
    ,'requirejs-text!modules/header/templates/hgroup.html'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,HgroupModel
                ,LogoutPopup
                ,HgroupTemplate
    ) {
        var HgroupView = Backbone.View.extend({
             tagName: 'hgroup'
            ,model: null
            ,events: {
                'click .js-logout': 'logOut'
            }
            ,initialize: function(attributes) {
                this.model = new HgroupModel(attributes.model);
                this.render();
                // Re-render the view on model's change
                this.model.on('change', this.render, this);
                // Subscribe to page:change event
                // and update page's title
                Eva.on('page:change', this.onPageChange, this);
            }
            ,onPageChange: function(pageView) {
                if (pageView.title && pageView.title !== this.model.get('title')) {
                    this.model.set('title', pageView.title);
                } else if (pageView.headerTemplate) {
                    this.$el.html(pageView.headerTemplate);
                }
            }
            ,logOut: function() {
                var loginView = new LogoutPopup();
            }
            ,render: function() {
                var title = this.model.get('title');
                if (title !== null && title !== undefined) {
                    this.template = _.template(HgroupTemplate, this.model.toJSON());
                    // Render the template
                    this.$el.html(this.template);
                    Eva.trigger('header:headerComposer:show');
                } else {
                    Eva.trigger('header:headerComposer:hide');
                }
                // Return the viewObj onRender to enable chain call
                return this;
            }
        });

        return HgroupView;
    }
);
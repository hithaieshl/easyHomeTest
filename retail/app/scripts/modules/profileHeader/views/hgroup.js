define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Template
    ,'requirejs-text!modules/profileHeader/templates/hgroup.html'
    //Parent class
    ,'modules/header/views/hgroup'
    ,'modules/profileUser/views/tabs'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,HgroupTemplate
                ,HeaderView
                ,TabsView
    ) {
        var HgroupViewMixin = TabsView.extend(HeaderView.prototype);
        var HgroupView = HgroupViewMixin.extend({
            events: {
                'click .js-logout': 'logOut'
                ,'click .tab .title': 'onTabClick'
            }
            ,onSwitchPane: function(newTabIndex) {
                Eva.trigger('Profile:header:switchPane', newTabIndex);
            }
            ,render: function() {
                this.template = _.template(HgroupTemplate, this.model.toJSON());
                // Render the template
                this.$el.html(this.template);
                Eva.trigger('header:headerComposer:show');
                Eva.on('profile:coapplicant:change', this.showCoapplicantTab, this);
                Eva.on('profile:coapplicant:hide', this.hideCoapplicantTab, this);
                Eva.on('Profile:header:validate', this.validate, this);
                this.on('Profile:switchPane', this.onSwitchPane);
                // Return the viewObj onRender to enable chain call
                return this;
            }
            ,showCoapplicantTab: function(isShown) {
                var tabs = this.$el.find('.tab');
                if (isShown) {
                    $(tabs[1]).removeClass('hidden');
                } else {
                    $(tabs[1]).addClass('hidden');
                }
            }
        });

        return HgroupView;
    }
);
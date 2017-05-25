define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Module composer prototype
    ,'prototypes/module.composer'

    // Local dependencies
    ,'modules/header/views/hgroup'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,ModuleComposerPrototype
                ,Header
    ) {
        var HeaderModule = Backbone.ModuleComposer.extend({
            tagName: 'header'
            ,moduleName: 'header'
            ,initSubmodules: function() {
                var self = this;
                this.submodules = [{
                    constructor: Header
                    ,arguments: {
                        model: self.model
                    }
                }]
            }
            ,hide: function() {
                this.$el.addClass('hidden');
            }
            ,show: function() {
                this.$el.removeClass('hidden');
            }
            ,setSensitivity: function(pageView) {
                if (pageView.isSensitivePage) {
                    this.$el.addClass('sensitive');
                } else  {
                    this.$el.removeClass('sensitive');
                }
            }
            ,initialize: function(attributes) {
                this.model = attributes;
                // Subscribe to events
                Eva.on('header:headerComposer:hide', this.hide, this);
                Eva.on('header:headerComposer:show', this.show, this);
                Eva.on('page:change', this.setSensitivity, this);
                // Render the module
                this.render();
            }
            ,render: function() {
                // Define modules to be rendered
                this.initSubmodules();
                // Render these modules
                this.invokeSubmodules(this.submodules);
                this.setSensitivity(this.model);
                return this;
            }
        });

        return HeaderModule;
    }
);
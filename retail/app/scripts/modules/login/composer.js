define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Module composer prototype
    ,'prototypes/module.composer'

    // Local dependencies
    ,'modules/login/views/login'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,ModuleComposerPrototype
                ,Login
    ) {
        var LoginModule = Backbone.ModuleComposer.extend({
            tagName: 'section'
            ,className: 'module login'
            ,moduleName: 'login'
            ,initSubmodules: function() {
                var self = this;
                this.submodules = [
                    // Specify submodules
                    {
                        constructor: Login
                        ,arguments: {}
                    }
                ]
            }
            ,render: function() {
                // Define modules to be rendered
                this.initSubmodules();
                // Render these modules
                this.invokeSubmodules(this.submodules);
                return this;
            }
        });

        return LoginModule;
    }
);
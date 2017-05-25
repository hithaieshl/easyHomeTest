define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Module composer prototype
    ,'prototypes/module.composer'

    // Local dependencies
    ,'modules/customerLogin/views/login'

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
            ,moduleName: 'customerLogin'
            ,initSubmodules: function() {
                var self = this;
                this.submodules = [
                    {
                        constructor: Login
                        ,arguments: {id: self.id}
                    }
                ];
            }
            ,afterInit: function(options) {
                //Backbone.ModuleComposer.prototype.initialize.call(this, options);
            }
            ,render: function() {
                // Define modules to be rendered
                this.initSubmodules();
                // Render these modules
                this.invokeSubmodules(this.submodules);
            }
        });

        return LoginModule;
    }
);
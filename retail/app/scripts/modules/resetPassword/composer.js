define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Module composer prototype
    ,'prototypes/module.composer'

    // Local dependencies
    ,'modules/resetPassword/views/reset'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,ModuleComposerPrototype
                ,Reset
    ) {
        var ResetModule = Backbone.ModuleComposer.extend({
            tagName: 'section'
            ,className: 'module login'
            ,submodules: [
                // Specify submodules
                {
                    constructor: Reset
                    ,arguments: {}
                }
            ]
            ,afterInit: function(options) {
                //Backbone.ModuleComposer.prototype.initialize.call(this, options);
            }
        });

        return ResetModule;
    }
);
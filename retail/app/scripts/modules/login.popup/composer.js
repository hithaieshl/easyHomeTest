define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Module composer prototype
    ,'prototypes/module.composer'

    // Local dependencies
    ,'modules/login.popup/views/login'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,ModuleComposerPrototype
                ,Login
    ) {
        var LoginPopupModule = Backbone.ModuleComposer.extend({
            tagName: 'section'
            ,className: 'module login popup'
            ,moduleName: 'login'
            ,submodules: [
                // Specify submodules
                {
                    constructor: Login
                    ,arguments: {}
                }
            ]
        });

        return LoginPopupModule;
    }
);
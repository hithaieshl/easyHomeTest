define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Local dependencies
    ,'modules/header/composer'
    ,'modules/profileHeader/views/hgroup'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,HeaderComposer
                ,Header
    ) {
        var ProfileHeaderModule = HeaderComposer.extend({
            moduleName: 'profileHeader'
            ,initSubmodules: function() {
                var self = this;
                this.submodules = [{
                    constructor: Header
                    ,arguments: {
                        model: self.model
                    }
                }]
            }
        });

        return ProfileHeaderModule;
    }
);
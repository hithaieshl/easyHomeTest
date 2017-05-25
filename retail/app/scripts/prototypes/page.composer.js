define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
    ) {
        var _remove = Backbone.View.prototype.remove;
        Backbone.PageComposer = Backbone.View.extend({
            tagName: 'section'
            ,className: 'page'
            ,pageName: ''
            ,pageTitle: null
            ,initialize: function() {
                // Render the page with all invoked modules
                this.render();
            }
            // @2do :: refactor based on module.composer invokeSubmodules method
            // so that the module could accept arguments
            ,invokeModules: function(modules) {
                var that = this, moduleInstance;
                this.moduleInstances = [];
                // Iterate through each module in the array,
                // which is a reference to the moduleClass,
                // instantiate it and append to the page's $el
                _.each(modules, function(module, index, list) {
                    var arguments = _.extend( module.arguments, { id: that.id, pageName: that.pageName } );

                    //Check if there's a language coming from router
                    if (that.lang) { arguments = _.extend(arguments, { lang: that.lang }) };

                    moduleInstance = new module.constructor(arguments);
                    that.$el.append(moduleInstance.$el);
                    that.moduleInstances.push(moduleInstance);
                });
            }
            ,render: function() {
                // Invoke Modules that were specified for the page
                // within this.modules array (e.g. this.modules = [Module1, Module 2])
                this.invokeModules(this.modules);
                return this;
            }
            ,remove: function() {
                //trigger remove event to remove reference on this page from router
                this.trigger('remove');
                for (var i = 0; i < this.moduleInstances.length; i++) {
                    this.moduleInstances[i].remove();
                    this.moduleInstances[i].unbind();
                    Eva.off(this.moduleInstances[i]);
                }
                _remove.call(this);
                this.unbind();
                Eva.off(this);
            }
        });
        return Backbone.PageComposer;
    }
);
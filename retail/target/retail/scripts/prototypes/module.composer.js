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
        Backbone.ModuleComposer = Backbone.View.extend({
            tagName: 'section'
            ,className: 'module'
            ,moduleName: ''
            ,invokeSubmodules: function(submodules) {
                var that = this, submoduleInstance;
                this.views = [];
                // Iterate through each element in the array,
                // which is a reference to the submoduleClass,
                // instantiate it and append to the page's $el
                _.each(submodules, function(submodule, index, list) {
                    var arguments = _.extend( submodule.arguments, { id: that.id, pageName: that.pageName });
                    submoduleInstance = new submodule.constructor(arguments);
                    that.views.push(submoduleInstance);
                    that.$el.append(submoduleInstance.$el);
                });
            }
            ,beforeInit: function(attributes, options) {}
            ,initialize: function(attributes, options) {
                this.pageName = attributes.pageName || '';
                
                if (attributes.lang) { this.lang = attributes.lang };
                
                // Fire before initialize callback
                this.beforeInit(attributes, options);
                // Render the module with all invoked modules
                this.render();
                // Fire after initialize callback
                this.afterInit(attributes, options);
            }
            ,afterInit: function(attributes, options) {}
            ,render: function() {
                // Render defined modules
                this.invokeSubmodules(this.submodules);
                // Return this view for method chaining
                return this;
            }
            ,removeModel: function(model) {
                if (model) {
                    this.unbind();
                    Eva.off(this);
                }
            }
            ,remove: function() {
                if (_.isArray(this.views)) {
                    for (var i = 0; i < this.views.length; i++) {
                        this.views[i].remove();
                        this.removeModel(this.views[i].model);
                        this.views[i].unbind();
                        Eva.off(this.views[i]);
                    }
                }
                _remove.call(this);
                this.unbind();
                this.removeModel(this.model);
                Eva.off(this);
            }
        });
        return Backbone.ModuleComposer;
    }
);
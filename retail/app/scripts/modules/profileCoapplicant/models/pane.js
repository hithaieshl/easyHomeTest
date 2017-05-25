define([
    // Primary dependency
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Environment stats
    ,'config/env'


    // 1-1, 1-many, many-1 model relations
    ,'backbone-associations'
], function(
            $
            ,_
            ,Backbone
            ,Eva
            ,Env
) {
    var _unset = Backbone.AssociatedModel.prototype.unset;
    var PaneModel = Backbone.AssociatedModel.extend({
        _originalAttributes: {}
        ,permanentFields: []
        ,setPermanentFields: function(fields) {
            this.permanentFields = fields;
        }
        ,cloneAttributes: function() {
            this._originalAttributes = _.clone(this.attributes)
        }
        ,undo: function() {
            var self = this;
            _.each(this._originalAttributes, function(attr, key) {
                self.set(key, attr);
            });
            self.isValid(true);
        }
        ,clear: function(fields) {
            var defaults = {};
            var self = this;
            _.each(this.permanentFields, function(field, index) {
                if (self.get(field) !== undefined || self[field] !== undefined) {
                    defaults[field] = self.get(field) || self[field];
                }
            });
            var fieldsToClear = fields || this.attributes;
            _.each(this.attributes, function(attr, key) {
                if (key !== "id" && fieldsToClear[key] !== undefined) {
                    _unset.apply(self, [key]);
                }
            })
            this.set(defaults);
            this.isValid(true);
        }
    });

    return PaneModel;
});
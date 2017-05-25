define([
     'jquery'
    ,'underscore'
    ,'backbone'
    ,'backbone-validation'

    ], function(
                $
                ,_
                ,Backbone
                ,Validation
    ) {
        var Validation = function() {
            var self = this;
            this.model.onError = function(model, xhr) {
                var errors = xhr.responseJSON.errors;
                if (errors !== undefined) {
                    for (var i = 0;  i < errors.length; i++) {
                        Backbone.Validation.callbacks.invalid(self, errors[i].fieldName, errors[i].errorMessage);
                    }
                }
                this.model.trigger('validated', false, this.model, errors);
            }
        };
        return Validation;
});
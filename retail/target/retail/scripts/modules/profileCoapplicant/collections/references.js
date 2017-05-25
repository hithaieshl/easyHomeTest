define([
    // Primary dependency
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Environment stats
    ,'config/env'

    ,'modules/profileUser/models/pane.reference'

], function(
            $
            ,_
            ,Backbone
            ,Eva
            ,Env
            ,ReferenceModel
) {
    var References = Backbone.Collection.extend({
        model: ReferenceModel
        ,validationFullNameFields: ['refFirstName', 'refLastName']
        ,validationPhoneFields: ['refPhoneNumber']
        ,errors: {
             1: []
            ,2: []
            ,3: []
        }
        ,onChange: function(changedModel, val, options, validationFields) {
            var self = this;
            //loop through all collection models
            this.each(function(model, index) {
                if (changedModel !== model) {
                    //compare values of fields in changed model and all other models
                    if (_.every(validationFields, function(attr) {
                            return model.get(attr) !== undefined && changedModel.get(attr) !== undefined &&
                                    model.get(attr) !== '' &&
                                   changedModel.get(attr).toLowerCase() === model.get(attr).toLowerCase();
                        })) {
                        //if we have same pairs add errors
                        self.errors[changedModel.id].push(model.id);
                        self.errors[model.id].push(changedModel.id);
                    } else {
                        //remove previously setted errors if any exist from current model and changed model
                        var index = self.errors[changedModel.id].indexOf(model.id);
                        if (index !== -1) {
                            self.errors[changedModel.id].splice(index, 1);
                        }
                        var index = self.errors[model.id].indexOf(changedModel.id);
                        if (index !== -1) {
                            self.errors[model.id].splice(index, 1);
                        }
                    }
                }
            });
            //Concat all models with errors into 1 array
            var errors = [];
            _.each(this.errors, function (error, index){
                errors = errors.concat(error);
            });

            // loop through collection models and trigger appropriate vents
            this.each(function(model, index) {
                if (errors.indexOf(model.get('id')) !== -1) {
                    model.trigger('invalid', validationFields);
                } else {
                    model.trigger('valid', validationFields);
                }
            });
        }
        ,onFullNameChange: function(changedModel, val, options) {
            this.onChange.apply(this, [changedModel, val, options, this.validationFullNameFields])
        }
        ,onPhoneChange: function(changedModel, val, options) {
            this.onChange.apply(this, [changedModel, val, options, this.validationPhoneFields])
        }
        ,initialize: function() {
            var self = this;
            this.on('change:refFirstName change:refLastName', this.onFullNameChange, this);
            this.on('change:refPhoneNumber', this.onPhoneChange, this);
        }
    });

    return References;
});
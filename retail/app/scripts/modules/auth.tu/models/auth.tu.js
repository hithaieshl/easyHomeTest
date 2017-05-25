define([
    // Primary dependency
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Environment stats
    ,'config/env'

    // Related models&collections
    ,'modules/auth.tu/collections/questions'
    ,'modules/auth.tu/models/question'

    // 1-1, 1-many, many-1 model relations
    ,'backbone-associations'

], function(
            $
            ,_
            ,Backbone
            ,Eva
            ,Env
            ,QuestionsCollection
            ,QuestionModel
) {
    var AuthTuModel = Backbone.AssociatedModel.extend({
         urlRoot: Env.getUrlFor('tuAuth')
        ,defaults: {
            questions: []
        }
        ,validationAttr: {}
        ,relations: [
            {
                 type: Backbone.Many
                ,key: 'questions'
                ,relatedModel: QuestionModel
                ,collectionType: QuestionsCollection
            }
        ]
        /**
         * Check if model is valid
         * model is valid if all nested models are valids
         */
        ,isValid: function() {
            var isValid = false;
            isValid = _.every(this.validationAttr, function(attr) {
                return attr;
            });
            return isValid;
        }
        /**
         * Handler for nested model validate event
         */
        ,onValidate: function(isValid, model, errors) {
            //save validation state of current model
            this.validationAttr[model.cid] = isValid;
            //in case current model is valid check if all other nested models are valid as well
            var isModelValid = !isValid ? isValid : this.isValid();
            this.trigger('validated', isModelValid);
        }
        ,onSync: function() {
            var self = this;
            //Bind all nested models validate event and assume that by default all models are invalid
            _.each(this.attributes, function(attribute, key, profileModel) {
                if (attribute instanceof Backbone.Collection) {
                    _.each(attribute.models, function(model) {
                        self.validationAttr[model.cid] = false;
                    });
                    self.on('validated:' + key, self.onValidate, self);
                }
            });
        }
        ,initialize: function() {
            // Make sure validation attributes object is empty
            this.validationAttr = {};
            // Subscribe to model's sync event
            this.on('sync', this.onSync, this);
        }
    });

    return AuthTuModel;
});
define([
    // Primary dependency
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Environment stats
    ,'config/env'

    ,'modules/profileCoapplicant/models/pane.personal'
    ,'modules/profileCoapplicant/models/pane.address'
    ,'modules/profileUser/models/profile'

    // 1-1, 1-many, many-1 model relations
    ,'backbone-associations'

    // Regular expression wrapper
    ,'xregexp'

], function(
            $
            ,_
            ,Backbone
            ,Eva
            ,Env
            ,PersonalModel
            ,AddressModel
            ,ProfileModel
            ,Relations
            ,XRegExp

) {
    var ProfileModel = ProfileModel.extend({
        defaults: {
            personal: {},
            coAppAddress: {}
        },
        _originalAttributes: {},
        relations: [
            {
                type: Backbone.One,
                key: 'personal',
                relatedModel: PersonalModel,
            },
            {
                type: Backbone.One,
                key: 'coAppAddress',
                relatedModel: AddressModel
            }
        ],
        isOptional: true,
        validationAttr: {},
        onCoapplicantChange: function(isRequired) {
            this.isOptional = !isRequired;
        },
        initialize: function() {
            var self = this;
            this.validationAttr = {};
            this._originalAttributes = {};
            this.on('sync', this.onSync, this);
            this.on('save', function() {
                Eva.trigger('Profile:model:saved');
            });
            
            //Eva.on('profile:coapplicant:change', this.onCoapplicantChange, this);

            //Bind all nested models validate event and assume that by default all models are invalid
            _.each(this.attributes, function(nestedModel, key, profileModel) {
                if (nestedModel instanceof Backbone.Model) {
                    self.on('validated:' + key, self.onValidate, self);
                    self.validationAttr[nestedModel.cid] = false;
                } else if (nestedModel instanceof Backbone.Collection) {
                    self.on('validated:' + key, self.onValidate, self);
                    //for collection validation event will be triggered for every model separately
                    nestedModel.each(function(model, key, collection) {
                        self.validationAttr[model.cid] = false;
                    })
                }
            });
        }
    });
    return ProfileModel;
});
define([
    // Primary dependency
    'jquery',
    'underscore',
    'backbone',
    'events',

    // Environment stats
    'config/env',

    'modules/profileUser/models/profile',
    'modules/profileCoapplicant/models/profile',

    // 1-1, 1-many, many-1 model relations
    'backbone-associations',

    // Regular expression wrapper
    'xregexp'

], function(
            $
            ,_
            ,Backbone
            ,Eva
            ,Env
            ,UserModel
            ,CoapplicantModel
            ,Relations
            ,XRegExp)
{
    var ProfileModel = Backbone.AssociatedModel.extend({
        urlRoot: Env.getUrlFor('profile'),
        defaults: {
             user: {},
            coApplicant: {}
        },
        relations: [
            {
                type: Backbone.One,
                key: 'user',
                relatedModel: UserModel
            }, {
                 type: Backbone.One,
                key: 'coApplicant',
                relatedModel: CoapplicantModel
            }
        ],
        validationAttr: {},
        /**
         * Check if model is valid
         * model is valid if all nested models are valid
         */
        isValid: function() {
            var isValid = false;
            isValid = _.every(this.validationAttr, function(attr) {
                return attr;
            });
            return isValid;
        },
        /**
         * Handler for nested model validaYte event
         */
        onValidate: function(isValid, model, errors) {
            //save validation state of current model
            this.validationAttr[model.cid] = isValid;
            //in case current model is valid check if all other nested models are valid as well
            var isModelValid = !isValid ? isValid : this.isValid();
            this.trigger('validated', isModelValid, model, errors);
        },
        onSync: function() {
            var self = this;
            //remove previous validation object, cause cid of every nested model changed
            self.validationAttr = {};
            if (this.get('user')) {
                this.get('user').onSync();
            }
            if (this.get('coApplicant')) {
                this.get('coApplicant').onSync();
            }
            _.each(this.attributes, function(attr, key) {
                if (attr instanceof Backbone.Model) {
                    self.validationAttr[attr.cid] = attr.isValid(true);
                }
                else if (attr instanceof Backbone.Collection) {
                    attr.each(function(model) {
                        self.validationAttr[model.cid] = model.isValid(true);
                    });
                }
            });
            this.isValid();
        },
        save: function(attributes) {
            attributes || (attributes = {});
            attributes = this.convertModel();
            var options = {
        		success: function(model, response) {
        			if (response.customerId) {
        				model.set("id", response.customerId);
        			}
        		},
        		error: function(model, response) {
        			console.log('error');
        		}
        	};
            Backbone.Model.prototype.save.call(this, attributes, options);
        },
        convertModel: function() {
            var data = {};
            data = this.get('user');
            data.set('isDraft', this.get('isDraft'));
            if (this.get('user').get('personal').get('hasCoapplicant')) {
                data.set('coApplicant', this.get('coApplicant'));
            }
            //Merge Unit number and Address field values
            if (this.get('user').attributes.address.get('addrSuite')) {
                var concatenatedAddr = this.get('user').attributes.address.get('addrSuite') + ' ' + this.get('user').attributes.address.get('addrAddress');
                this.get('user').attributes.address.set('addrAddress', concatenatedAddr);
                this.get('user').attributes.address.set('addrSuite', ''); 
            }
            return data;
        },
        validateCoapplicantModel: function(isCoapplicantRequired) {
            var coappCID = this.get('coApplicant').cid;
            if (!isCoapplicantRequired) {
                this.validationAttr[coappCID] = true;
            }
            else {
                this.validationAttr[coappCID] = this.get('coApplicant').isValid()
            }
            this.get('coApplicant').onCoapplicantChange(isCoapplicantRequired);
        },
        parse: function(data) {
            var modifiedObj = {};
            modifiedObj.user = {};
            modifiedObj.user.address = data.address;
            modifiedObj.user.personal = data.personal;
            modifiedObj.user.employment = data.employment;
            modifiedObj.user.references = data.references;
            modifiedObj.coApplicant = data.coApplicant;
            modifiedObj.isDraft = data.isDraft;
            modifiedObj.salesPerson = data.salesPerson;
            return modifiedObj;
        },
        initialize: function() {
            var self = this;
            this.validationAttr = {};
            this._originalAttributes = {};
            this.on('sync', this.onSync, this);
            this.on('save', function() {
                Eva.trigger('Profile:model:saved');
            });
            //this.on('change:user:personal:hasCoapplicant', this.validateModel);
            //Eva.on('profile:coapplicant:change', this.validateModel, this);

            //Bind all nested models validate event and assume that by default all models are invalid
            _.each(this.attributes, function(nestedModel, key, profileModel) {
                if (nestedModel instanceof Backbone.Model) {
                    self.on('validated:' + key, self.onValidate, self);
                    self.validationAttr[nestedModel.cid] = false;
                }
                else if (nestedModel instanceof Backbone.Collection) {
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
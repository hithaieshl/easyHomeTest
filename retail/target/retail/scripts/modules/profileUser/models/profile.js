define([
    // Primary dependency
    'jquery',
    'underscore',
    'backbone',
    'events',

    // Environment stats
    'config/env',

    'modules/profileUser/models/pane.personal',
    'modules/profileUser/models/pane.address',
    'modules/profileUser/models/pane.employment',
    'modules/profileUser/models/pane.reference',
    'modules/profileUser/collections/references',

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
            ,PersonalModel
            ,AddressModel
            ,EmploymentModel
            ,ReferenceModel
            ,ReferencesCollection
            ,Relations
            ,XRegExp

) {
    var ProfileModel = Backbone.AssociatedModel.extend({
         urlRoot: Env.getUrlFor('profile')
        ,defaults: {
             personal: {}
            ,address: {}
            ,employment: {}
            // References collection always consists of 3 models
            ,references: [
                 { id: 0 }
                ,{ id: 1 }
                ,{ id: 2 }
            ]
        }
        ,_originalAttributes: {}
        ,relations: [
            {
                 type: Backbone.One
                ,key: 'personal'
                ,relatedModel: PersonalModel
            },{
                 type: Backbone.One
                ,key: 'address'
                ,relatedModel: AddressModel
            },{
                 type: Backbone.One
                ,key: 'employment'
                ,relatedModel: EmploymentModel
            },{
                 type: Backbone.Many
                ,key: 'references'
                ,relatedModel: ReferenceModel
                ,collectionType: ReferencesCollection
            }
        ]
        ,validationAttr: {}
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
            var isModelValid = false;
            if (this.isOptional == true) {
                isModelValid = true;
            }
            else if (!model.isOptional) {
                isModelValid = !isValid ? isValid : this.isValid();
            }
            this.trigger('validated', isModelValid, this, errors);
        }
        /**
         * Clone all model attributes and save them to _originalAttributes property
         * delegate attributes save to nested models if any exist
        */
        ,cloneAttributes: function(attributes) {
            var self = this;
            _.each(attributes, function(attr, key) {
                if (attr instanceof Backbone.Model) {
                    attr.cloneAttributes();
                } else if (attr instanceof Backbone.Collection) {
                    attr.each(function(model) {
                        model.cloneAttributes();
                    });
                } else if (_.isObject(attr)) {
                    self._originalAttributes[key] = _.clone(attr);
                } else {
                    self._originalAttributes[key] = attr;
                }
            })
        }
        ,setOriginalAttributes: function(attributes) {
            var self = this;
             _.each(attributes, function(attr, key) {
                if (attr instanceof Backbone.Model) {
                    attr.undo();
                } else if (attr instanceof Backbone.Collection) {
                    attr.each(function(model) {
                        model.undo();
                    });
                } else {
                    self.set(key, self._originalAttributes[key]);
                }
            });
        }
        ,onSync: function() {
            var self = this;
            //save all model attributes after every synchronization with server
            this.cloneAttributes(this.attributes);
            //remove previous validation object, cause cid of every nested model changed
            self.validationAttr = {};
            _.each(this.attributes, function(attr, key) {
                if (attr instanceof Backbone.Model) {
                    self.validationAttr[attr.cid] = attr.isValid(true);
                } else if (attr instanceof Backbone.Collection) {
                    attr.each(function(model) {
                        self.validationAttr[model.cid] = model.isValid(true);
                    });
                }
            });
            this.isValid();
        }
        ,undo: function() {
            //set previous attributes that should be the same as on server
            this.setOriginalAttributes(this.attributes);
        }
        ,save: function(attributes, options) {
            attributes || (attributes = {});
            
            //Merge Unit number and Address field values
            if (this.attributes.address.get('addrSuite')) {
                var concatenatedAddr = this.attributes.address.get('addrSuite') + ' ' + this.attributes.address.get('addrAddress');
                this.attributes.address.set('addrAddress', concatenatedAddr);
                this.attributes.address.set('addrSuite', ''); 
            }
            Backbone.Model.prototype.save.call(this, attributes, options);
        }
        ,initialize: function() {
            var self = this;
            this.validationAttr = {};
            this._originalAttributes = {};
            this.on('sync', this.onSync, this);
            this.on('save', function() {
                Eva.trigger('Profile:model:saved');
            });

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
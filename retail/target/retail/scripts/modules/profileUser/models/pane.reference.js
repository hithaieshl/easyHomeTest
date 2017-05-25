define([
    // Primary dependency
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Environment stats
    ,'config/env'

    //Parent model
    ,'modules/profileUser/models/pane'
    
    ,'helpers/vanillaMask'

    // Regular expression wrapper
    ,'xregexp'

    // 1-1, 1-many, many-1 model relations
    ,'backbone-associations'

], function(
            $
            ,_
            ,Backbone
            ,Eva
            ,env
            ,Pane
            ,Mask
) {
    var ReferenceModel = Pane.extend({
        defaults: {
             "refRelationship": ""
            ,"refFirstName": ""
            ,"refLastName": ""
            ,"refPhoneNumber": ""
        }
        ,refFirstNameValid: true
        ,refLastNameValid: true
        ,refPhoneNumberValid: true
        ,refPhoneNumberNotEqualsLandlords: true
        ,validation: {
            // 'firstName': 'John'
            'refFirstName': [{
                 required: true
                ,msg: 'Please enter a first name'
            },{
                 pattern: XRegExp("^((\\p{L}\\p{M}*){2}|(\\p{L}\\p{M}*){1}['`])([- '.`]?(\\p{L}\\p{M}*)['`]?){0,48}\\*?$")
                ,msg: 'Please enter a valid first name'
            },{
                fn: 'validateFullName'
            }]
            // 'lastName': 'Doe'
            ,'refLastName': [{
                 required: true
                ,msg: 'Please enter a last name'
            },{
                 pattern: XRegExp("^((\\p{L}\\p{M}*){2}|(\\p{L}\\p{M}*){1}['`])([- '.`]?(\\p{L}\\p{M}*)['`]?){0,48}\\*?$")
                ,msg: 'Please enter a valid last name'
            },{
                fn: 'validateFullName'
            }]
            // 'relationship': 'friend'
            ,'refRelationship': [{
                 required: true
                ,msg: 'Please enter a type of relationship'
            },{
                 pattern: XRegExp("^((\\p{L}\\p{M}*){2}|(\\p{L}\\p{M}*){1}['`])([- '.`]?(\\p{L}\\p{M}*)['`]?){0,48}\\*?$")
                ,msg: 'Please enter a valid type of relationship'
            }]
            // 'phoneNumber': '(999) 999-9999'
            ,'refPhoneNumber': [{
                 required: true
                ,msg: 'Please enter a phone number'
            },{
                 pattern: XRegExp("^[\\(]{0,1}([0-9]){3}[\\)]{0,1}[ ]?([^0-1]){1}([0-9]){2}[ ]?[-]?[ ]?([0-9]){4}[ ]*((x){0,1}([0-9]){1," +
                    "5}){0,1}$")
                ,msg: 'Please enter a valid phone number'
            },{
                fn: function(value, attr, computedState) {
                    if (!this.refPhoneNumberNotEqualsLandlords) {
                        return 'You can\'t use your landlord\'s phone number';
                    }
                    if (!this.refPhoneNumberValid && value !== '') {
                        return 'Phone number already exists'
                    }
                }
            }]
        }
        ,validateFullName: function(value, attr, computedState) {
            if (!this[attr + 'Valid'] && value !== '') {
                return 'Reference already exists'
            }
        }
        ,validate: function(fields) {
            this.invalidate(fields, true);
        }
        ,invalidate: function(fields, isValid) {
            var self = this;
            _.each(fields, function(field) {
                self[field + 'Valid'] = !!isValid;
            });
            this.isValid(true);
        }
        ,validateRefPhoneNotEqualsLandlords: function(phone) {
            var refPhone = this.get('refPhoneNumber');
            if (refPhone !== '') {
                this.refPhoneNumberNotEqualsLandlords = (phone == this.get('refPhoneNumber')) ? false : true; 
                this.validate()
            }
        }
        ,initialize: function() {
            this.on('invalid', this.invalidate, this);
            this.on('valid', this.validate, this);
            var phoneNumber = this.get('refPhoneNumber');
            var maskedPhone = Mask.toPattern(phoneNumber, "(999) 999-9999");
            this.set('refPhoneNumber', maskedPhone);
            Eva.on('Profile:address:landlordPhoneUpdated', this.validateRefPhoneNotEqualsLandlords, this);
            this.on('change:refPhoneNumber', function() {
               this.trigger('Profile:references:phoneUpdated', this)
            });
        }

    });

    return ReferenceModel;
});
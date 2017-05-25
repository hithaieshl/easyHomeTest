define([
    // Primary dependency
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Environment stats
    ,'config/env'
    // Regular expression wrapper
    ,'xregexp'

], function(
            $
            ,_
            ,Backbone
            ,Eva
            ,env
) {
    var SimpleSearchModel = Backbone.Model.extend({

        defaults: {
             'firstName':       ''
            ,'lastName':        ''
            ,'email':           ''
            ,'customerNumber':  ''
            ,'searchType':      'FULL'
        }

        ,url: env.getUrlFor('fullSearch')
        //separate fields that bind to 2 model fields
        ,doubleValueField: {
            //set to true by default as fields are optional
            isValid: true
            ,msg: 'Please enter valid email or customer number' 
        }
        ,invalidateDoubleField: function(fieldsArr) {
            this.doubleValueField.isValid = false;
            var length = fieldsArr.length;
            for(var i = 0; i < length; i++) {
                this.set(fieldsArr[i], '', {silent:true});
            }
        }
        ,setDoubleField: function(fieldName, value) {
            this.doubleValueField.isValid = true;
            this.set(fieldName, value, {silent: true});
        }
        ,getDoubleFieldValidation: function() {
             if (this.doubleValueField.isValid) {
            //return empty string if is valid
            // the same logic as for Backbone validation
                return '';
            }
            return this.doubleValueField.msg;
        }
        ,isDoubleValueFieldValid: function() {
            return this.doubleValueField.isValid
        }
        ,validation: {
            'firstName': [{
                 required: true
                ,msg: 'Please enter clients first name'
            },{
                 pattern: XRegExp("^((\\p{L}\\p{M}*){2}|(\\p{L}\\p{M}*){1}['`])([- '.`]?(\\p{L}\\p{M}*)['`]?){0,48}\\*?$")
                ,msg: 'Please enter a valid first name'
            }]
            ,'lastName': [{
                 required: true
                ,msg: 'Please enter clients last name'
            },{
                 pattern: XRegExp("^((\\p{L}\\p{M}*){2}|(\\p{L}\\p{M}*){1}['`])([- '.`]?(\\p{L}\\p{M}*)['`]?){0,48}\\*?$")
                ,msg: 'Please enter a valid last name'
            }]
            ,'email': [{
                 required: false
            }, {
                pattern: 'email'
                ,msg: 'Please enter a valid email'
            }]
            ,'customerNumber': [{
                required: false
            }, {
                pattern: XRegExp("^[0-9]{0,9}$")
                ,msg: 'Please enter valid customer #'
            }]
        }
        ,parse: function(data, options)  {
            data = {};
            return data;
        }
        ,getRequiredSearchFields: function() {
            return ['firstName', 'lastName', 'customerType', 'searchType', 'ehCustomer'];
        }
        ,onSync: function(model, xhr) {
            Eva.trigger('search:searchView:updateClients', xhr);
        }
        ,initialize: function() {
            this.on('sync', this.onSync, this);
            Eva.on('Profile:model:saved', function() {
            this.clear().set(this.defaults )}, this);
        }
    });

    return SimpleSearchModel;
});
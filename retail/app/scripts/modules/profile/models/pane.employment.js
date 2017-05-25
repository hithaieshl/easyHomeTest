define([
    // Primary dependency
    'jquery'
    ,'underscore'
    ,'backbone'

    // Environment stats
    ,'config/env'

    //Parent model
    ,'modules/profile/models/pane'

    // 1-1, 1-many, many-1 model relations
    ,'backbone-associations'

    // Regular expression wrapper
    ,'xregexp'

], function(
            $
            ,_
            ,Backbone
            ,env
            ,Pane
) {
    var _pattern = Backbone.Validation.validators.pattern;
    var _charactersWithSpacesPattern = "^(\\p{L}|\\p{M}|[- '.,\\\\/])[\\p{L}|\\p{M}*]+([\\p{L}|\\p{M}*]|[- '.,\\\\/])*$";	

    var EmploymentModel = Pane.extend({
        isFulTimeVisible: false
        ,isPrevWorkDurationVisible: false
        ,validation: {
            // "payment": "3000"
            'empPayment': [{
                 required: true
                ,msg: 'Please specify the payment amount you receive'
            },{
                 pattern: /^[1-9][0-9]*$/
                ,msg: 'Please specify a valid integer number'
            }]
            // "paymentFrequency": "monthly"
            ,'empPaymentFrequency': [{
                 required: true
                ,msg: 'Please specify how often do you get paid?'
            }]
            // "incomeSource": "fullTime"
            ,'empIncomeSource': {
                 required: true
                ,msg: 'Please specify the type of your income'
            }
            // "position": "Mistress of the king"
            ,'empPosition': [{
                    required: function() {
                        return this.isFulTimeVisible;
                    }
                    ,msg: 'Please specify your position'
            }, { 
                fn: function(value, attr, model) {
                    if (this.isFulTimeVisible) {
                        if (_pattern.apply(this, [value, attr, XRegExp(_charactersWithSpacesPattern), model])) {
                            return 'Please enter a valid position'
                        }
                    }
                    return false;
                }
            }]
            // "employer": "The King"
            ,'empEmployer': [{
                required: function() {
                   return this.isFulTimeVisible;
                }
                ,msg: 'Please specify your employer'
            }, {
                fn: function(value, attr, model) {
                    if (this.isFulTimeVisible) {
                        if (_pattern.apply(this, [value, attr, XRegExp(_charactersWithSpacesPattern), model])) {
                            return 'Please specify a valid company name'
                        }
                    }
                    return false;
                }
            }]
            // "address": "King Road. The Palace"
            ,'empAddress': {
                required: function() {
                   return this.isFulTimeVisible;
                }
                ,msg: 'Please specify the address'
            }
            // "city": "The Capital"
            ,'empCity': {
                required: function() {
                   return this.isFulTimeVisible;
                }
                ,msg: 'Please specify the city'
            }
            // "province": "ON"
            ,'empProvince': {
                required: function() {
                   return this.isFulTimeVisible;
                }
                ,msg: 'Please specify the province'
            }
            // "postalCode": "N2K2N1"
            ,'empPostalCode': {
                required: function() {
                   return this.isFulTimeVisible;
                }
                ,msg: 'Please specify the postal code'
            }
            // "phoneNumber": "(999) 999-9999"
            ,'empPhoneNumber': [{
                required: function() {
                   return this.isFulTimeVisible;
                }
                ,msg: 'Please specify your work phone number'
            },{
                fn: function(value, attr, model) {
                    if (this.isFulTimeVisible) {
                        var result = _pattern.apply(this, [value, attr, XRegExp("^[\\(]{0,1}([0-9]){3}[\\)]{0,1}[ ]?([^0-1]){1}([0-9])" +
                            "{2}[ ]?[-]?[ ]?([0-9]){4}[ ]*((x){0,1}([0-9]){1,5}){0,1}$"), model]);
                        if (result) {
                            return 'Please specify a valid phone number';
                        }
                    }
                    return false;
                }
            }]
            // "phoneExtension": "123"
            ,'empPhoneExtension': {
                 required: false
                ,msg: 'Please specify your work phone extension'
            }
            // "supervisorName": "The King"
            ,'empSupervisorName': [{ 
                required: function() {
                    return this.isFulTimeVisible;
                }
                ,msg: 'Please specify your supervisor name'
            }, { 
                fn: function(value, attr, model) {
                    if (this.isFulTimeVisible) { 
                        var result = _pattern.apply(this, [value, attr, XRegExp("^((\\p{L}\\p{M}*){2}|(\\p{L}\\p{M}*){1}['`])([- '.`]?(\\p{L}\\p{M}*)['`]?){0,48}\\*?$"), model]);
                            if (result) {
                            return 'Please specify a valid supervisor name';
                        }
                    }
                    return false;
                }
                ,msg: 'Please enter a valid position'
            }]
            // "supervisorPhoneNumber": "(999) 999-9999"
            ,'empSupervisorPhoneNumber': [{
                required: function() {
                   return this.isFulTimeVisible;
                }
                ,msg: 'Please specify your supervisor phone number'
            },{
                fn: function(value, attr, model) {
                    if (this.isFulTimeVisible) {
                        var result = _pattern.apply(this, [value, attr, XRegExp("^[\\(]{0,1}([0-9]){3}[\\)]{0,1}[ ]?([^0-1]){1}([0-9])" +
                            "{2}[ ]?[-]?[ ]?([0-9]){4}[ ]*((x){0,1}([0-9]){1,5}){0,1}$"), model]);
                        if (result) {
                            return 'Please specify a valid phone number';
                        }
                    }
                    return false;
                }
            }]
            // "workingDurationYears": "0"
            ,'empWorkingDurationYears': [{
                required: function() {
                   return this.isFulTimeVisible;
                }
            }, {
                 fn: function(value, attr, computedState) {
                    if (this.isFulTimeVisible && value === "0" && computedState.empWorkingDurationMonths === "0") {
                        return 'Please choose living duration'
                    }
                }
            }]
            // "workingDurationMonths": "7"
            ,'empWorkingDurationMonths': [{
                required: function() {
                   return this.isFulTimeVisible;
                }
            }, {
                 fn: function(value, attr, computedState) {
                    if (this.isFulTimeVisible && value === "0" && computedState.empWorkingDurationYears === "0") {
                        return 'Please choose living duration'
                    }
                }
            }]
            // "prevWorkingDurationYears": "0"
            ,'empPrevWorkingDurationYears': [{
                required: function() {
                   return this.isFulTimeVisible && this.isPrevWorkDurationVisible;
                }
            }, {
                 fn: function(value, attr, computedState) {
                    if (this.isFulTimeVisible && this.isPrevWorkDurationVisible && value === "0" && computedState.empPrevWorkingDurationMonths === "0") {
                        return 'Please choose living duration'
                    }
                }
            }]
            // "prevWorkingDurationMonths": "7"
            ,'empPrevWorkingDurationMonths': [{
                required: function() {
                   return this.isFulTimeVisible && this.isPrevWorkDurationVisible;
                }
            }, {
                 fn: function(value, attr, computedState) {
                    if (this.isFulTimeVisible && this.isPrevWorkDurationVisible && value === "0" && computedState.empPrevWorkingDurationYears === "0") {
                        return 'Please choose living duration'
                    }
                }
            }]
            // "additionalIncome": "3000"
            ,'empAdditionalIncome': [{
                required: false
            },{
                 pattern: /^[1-9][0-9]*$/
                ,msg: 'Please enter a valid integer number'
            }]
            // "additionalIncomeSource": "grandpa"
            ,'empAdditionalIncomeSource': {
                required: false
            }
        }
    });

    return EmploymentModel;
});
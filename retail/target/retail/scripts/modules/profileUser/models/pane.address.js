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

    // 1-1, 1-many, many-1 model relations
    ,'backbone-associations'

    // Regular expression wrapper
    ,'xregexp'

], function(
            $
            ,_
            ,Backbone
            ,Eva
            ,env
            ,Pane
) {
    var _livingDurationMsg = 'Please choose a living duration';
    var _pattern = Backbone.Validation.validators.pattern;
    var AddressModel = Pane.extend({
        isPrevAddressVisible: false
        ,validation: {
            // "address": "Golden st.10"
            'addrAddress': {
                 required: true
                ,msg: 'Please specify your address'
            }
            // "suite": "5"
            ,'addrSuite': {
                 required: false
            }
            // "city": "Toronto"
            ,'addrCity': {
                 required: true
                ,msg: 'Please specify your city'
            }
            // "province": "ON"
            ,'addrProvince': {
                 required: true
                ,msg: 'Please specify your province'
            }
            // "postalCode": "N2K2N1"
            ,'addrPostalCode': [{
                required: true
                ,msg: 'Please specify your postal code'
            },{
                 pattern: XRegExp("([a-zA-Z]\\d[a-zA-Z]\\s*\\d[a-zA-Z]\\d)")
                ,msg: 'Postal code is not correct'
            }]
            // "isOwner": "false"
            ,'addrIsOwner': {
                required: true
            }
            // "monthlyPayment": "3000"
            ,'addrMonthlyPayment': [{
                 required: true
                ,msg: 'Please enter your monthly payment'
            },{
                fn: function(value, attr, model) {
                    //if owner than mortgage can be 0 else it couldn't
                    if (model.addrIsOwner === "true") {
                        if (_pattern.apply(this, [value, attr, /^(([0-9])|([1-9]\d*))$/, model])) {
                            return 'Plese enter a valid integer number'
                        }
                    } else {
                        if (_pattern.apply(this, [value, attr, /^[1-9]\d*$/, model])) {
                            return 'Plese enter a valid integer number'
                        }
                    }
                }
            }]
            
            // "livingDurationYears": "0"
            ,'addrLivingDurationYears': [{
                fn: function(value, attr, computedState) {
                    if ((value === "0" || !value) && ((computedState.addrLivingDurationMonths === "0") || !computedState.addrLivingDurationMonths)) {
                        return _livingDurationMsg;
                    }
                }
            }]
            // "livingDurationMonths": "7"
            ,'addrLivingDurationMonths': [{
                fn: function(value, attr, computedState) {
                    if ((value === "0" || !value) && ((computedState.addrLivingDurationYears === "0") || !computedState.addrLivingDurationYears)) {
                        return _livingDurationMsg;
                    }
                }
            }]
            // "prevLivingDurationYears": "1"
            ,'addrPrevLivingDurationYears': [{
                required: function() {
                    return this.isPrevAddressVisible;
                }
                ,msg: _livingDurationMsg
            }, {
                fn: function(value, attr, computedState) {
                    if (value === "0" && computedState.addrPrevLivingDurationMonths === "0") {
                        return _livingDurationMsg;
                    }
                }
            }]
            // "prevLivingDurationMonths": "0"
            ,'addrPrevLivingDurationMonths': [{
                required: function() {
                    return this.isPrevAddressVisible;
                }
                ,msg: _livingDurationMsg
            }, {
                 fn: function(value, attr, computedState) {
                    if (value === "0" && computedState.addrPrevLivingDurationYears === "0") {
                        return _livingDurationMsg;
                    }
                }
            }]
            // "prevProvince": "BC"
            ,'addrPrevProvince': {
                required: function() {
                    return this.isPrevAddressVisible;
                }
                ,msg: 'Please enter province'
            }
            // "prevCity": "Montreal"
            ,'addrPrevCity': {
                required: function() {
                    return this.isPrevAddressVisible;
                }
                ,msg: 'Please enter city'
            }
            // "prevAddress": "asdasd"
            ,'addrPrevAddress': {
                required: function() {
                    return this.isPrevAddressVisible;
                }
                ,msg: 'Please enter address'
            }
            // "prevPostalCode": "N2K2N1"
            ,'addrPrevPostalCode': [{
                required: function() {
                    return this.isPrevAddressVisible;
                }
                ,msg: 'Please enter postal code'
            },{
                 pattern: XRegExp("([a-zA-Z]\\d[a-zA-Z]\\s*\\d[a-zA-Z]\\d)")
                ,msg: 'Postal code is not correct'
            }]
        }
        ,initialize: function() {
            var self = this;
            this.on('change:addrLandlordPhoneNumber', function(oldValue, newValue)
            {
               Eva.trigger('Profile:address:landlordPhoneUpdated', newValue)
            });
        }
    });

    return AddressModel;
});
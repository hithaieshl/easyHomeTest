define([
    // Primary dependency
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'
    // Environment stats
    ,'config/env'

    //Parent model
    ,'modules/profileCoapplicant/models/pane'

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
        ,defaults: {
        	'addrSameAs': false
        }
        ,validation: {
        	'addrSameAs' : {
        		required: false
        	}
            // "address": "Golden st.10"
            ,'addrAddress': {
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
define([
    // Primary dependency
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Environment stats
    ,'config/env'

], function(
            $
            ,_
            ,Backbone
            ,Eva
            ,env
) {
    var ClientModel = Backbone.Model.extend({
         url: env.getUrlFor('fullSearch')
        ,checkClientUrl: env.getUrlFor('checkSuspiciousCustomer')
        ,defaults: {
            firstName: ''
            ,lastName: ''
            ,email: ''
            ,cellPhone: ''
            ,addressLine: ''
            ,province: ''
            ,city: ''
            ,customerType: ''
            ,cautions: {}
            ,isStolen: false
            ,isApproved: false
        }
        ,getFirstName: function() {
            return this.get('firstName');
        }
        ,getLastName: function() {
            return this.get('lastName');
        }
        ,getName: function() {
            return this.getFirstName() + ' ' + this.getLastName();
        }
        ,getEmail: function() {
            return this.get('email');
        }
        ,getCellPhone: function() {
            return this.get('cellPhone');
        }
        ,getAddress: function() {
            return this.get('addressLine');
        }
        ,getProvince: function() {
            return this.get('province');
        }
        ,getCity: function() {
            return this.get('city');
        }
        ,hadStolen: function() {
            return this.get('isStolen');
        }
        ,getType: function() {
            return this.get('customerType');
        }
        ,getCautions: function() {
            return this.get('cautions');
        }
        ,getIsApproved: function() {
            return this.get('isApproved');
        }
    });

    return ClientModel;
});
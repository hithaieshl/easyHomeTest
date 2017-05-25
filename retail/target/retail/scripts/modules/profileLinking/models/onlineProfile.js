define([
    // Primary dependency
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Environment stats
    ,'config/env'
    // 1-1, 1-many, many-1 model relations
    ,'backbone-associations'

], function(
            $
            ,_
            ,Backbone
            ,Eva
            ,env
) {
    var OnlineProfileModel = Backbone.AssociatedModel.extend({
        defaults: {
            firstName: ''
            ,lastName: ''
            ,email: ''
            ,cellPhone: ''
            ,addressLine: ''
            ,province: ''
            ,city: ''
            ,isSkipOrStolen: ''
            ,customerType: ''
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
            return this.get('isSkipOrStolen');
        }
        ,getType: function() {
            return this.get('customerType');
        }
    });
    return OnlineProfileModel;
});
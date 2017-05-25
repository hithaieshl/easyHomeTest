define([
    // Primary dependency
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Environment stats
    ,'config/env'

    ,'modules/search/models/simpleSearchModel'

    // Regular expression wrapper
    ,'xregexp'

], function(
            $
            ,_
            ,Backbone
            ,Eva
            ,env
            ,SimpleSearchModel
) {
    var DetailedSearchModel = SimpleSearchModel.extend({

        defaults: {
            'cellPhone':       ''
            ,'homePhone':       ''
            ,'sin':             ''
            ,'customerType':    ''
            //by default full search performed, but it could be changed to  RSSS
            ,'searchType':      'FULL'
        }
        ,validation: {
            'homePhone': [{
                 required: false
            }, {
                pattern: XRegExp("^[\\(]{0,1}([0-9]){3}[\\)]{0,1}[ ]?([^0-1]){1}([0-9]){2}[ ]?[-]?[ ]?([0-9]){4}[ ]*((x){0,1}([0-9]){1,5}){0,1}$")
                ,msg: 'Please enter a valid home phone'
            }]
            ,'cellPhone': [{
                 required: false
            }, {
                pattern: XRegExp("^[\\(]{0,1}([0-9]){3}[\\)]{0,1}[ ]?([^0-1]){1}([0-9]){2}[ ]?[-]?[ ]?([0-9]){4}[ ]*((x){0,1}([0-9]){1,5}){0,1}$")
                ,msg: 'Please enter a valid cell phone'
            }]
            ,'sin': [{
                 required: false
            }, {
                pattern: XRegExp("^[0-9]{3}([-]{1}[0-9]{3}){2}$")
                ,msg: 'Please enter a valid sin'
            }]
        }
        ,getRequiredSearchFields: function() {
            return ['firstName', 'lastName', 'customerType', 'searchType', 'ehCustomer'];
        }
        ,initialize: function() {
            this.validation = _.extend({}, SimpleSearchModel.prototype.validation, this.validation);
            this.defaults =  _.extend({}, SimpleSearchModel.prototype.defaults, this.defaults);
            this.on('sync', this.onSync, this);
        }
    });

    return DetailedSearchModel;
});
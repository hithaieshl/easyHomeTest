define([
    // Primary dependency
    'jquery'
    ,'underscore'
    ,'backbone'

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
            ,env
            ,Pane
) {
    var PersonalModel = Pane.extend({
         minAge: 18
        ,defaults: {
             'firstName': ''
            ,'lastName': ''
            ,'birthDate': null
			,'relationToApplicant':''
            ,'homePhone': ''
            ,'workPhone': ''
			,'workPhoneExt': ''
        }
        ,validation: {
            'firstName': [{
                 required: true
                ,msg: 'Please enter your first name'
            },{
                 pattern: XRegExp("^((\\p{L}\\p{M}*){2}|(\\p{L}\\p{M}*){1}['`])([- '.`]?(\\p{L}\\p{M}*)['`]?){0,48}\\*?$")
                ,msg: 'Please enter a valid first name'
            }]
            ,'lastName': [{
                 required: true
                ,msg: 'Please enter your last name'
            },{
                 pattern: XRegExp("^((\\p{L}\\p{M}*){2}|(\\p{L}\\p{M}*){1}['`])([- '.`]?(\\p{L}\\p{M}*)['`]?){0,48}\\*?$")
                ,msg: 'Please enter a valid last name'
            }]
			,'relationToApplicant':[{
				required: true
				,msg: 'Please enter your relation to applicant'
			},{
				pattern: XRegExp("^((\\p{L}\\p{M}*){2}|(\\p{L}\\p{M}*){1}['`])([- '.`]?(\\p{L}\\p{M}*)['`]?){0,48}\\*?$")
				,msg: 'Please enter a valid relation value'
			}]
            ,'birthDate': [{
                 required: true
                ,msg: 'Please enter your birth date'
            },{
                 pattern: XRegExp('')
                ,msg: 'Please enter your birthdate in the following format yyyy/mm/dd'
            }, {
                fn: function(val, attr, computed) {
                    var minAge = this.minAge;
                    var pickeddate = new Date(val);
                    var validDate = new Date(pickeddate.getFullYear() + minAge,
                        pickeddate.getMonth(), pickeddate.getDate());
                    return validDate <= new Date() ? undefined : 'You should be at least 18 years old'; 
                }
            }]
            ,'homePhone': [{
                //  required: function(val, attr, computed) {
                //     if (computed['cellPhone'] === '' && val !== '') {
                //         return 'Please enter your phone number';
                //     }
                //     return false;
                // }
                 required: true
                ,msg: 'Please enter your home phone number'
            },{
                 pattern: XRegExp("^[\\(]{0,1}([0-9]){3}[\\)]{0,1}[ ]?([^0-1]){1}([0-9]){2}[ ]?[-]?[ ]?([0-9]){4}[ ]*((x){0,1}([0-9]){1," +
                    "5}){0,1}$")
                ,msg: 'Please enter a valid phone number'
            }]
            ,'workPhone': [{
                required: true
                // required: function(val, attr, computed) {
                //     if (computed['homePhone'] === '') {
                //         return 'Please enter your phone number';
                //     }
                //     return false;
                // }
                ,msg: 'Please enter your work phone number'
            },{
                 pattern: XRegExp("^[\\(]{0,1}([0-9]){3}[\\)]{0,1}[ ]?([^0-1]){1}([0-9]){2}[ ]?[-]?[ ]?([0-9]){4}[ ]*((x){0,1}([0-9]){1," +
                    "5}){0,1}$")
                ,msg: 'Please enter a valid phone number'
            }]
			,'workPhoneExt': [{
                required: false
            }]
        }
        ,getMaxBirthDate: function() {
            var minAge = this.minAge;
            var today = new Date();
            var dd = today.getDate();
            //format day - 1 will be 01
            dd = dd >= 10 ? dd : "0" + dd;
            var mm = (today.getMonth() + 1).toString(); //January is 0!
            //format month - 1 will be 01
            mm = mm.length === 2 ? mm : "0" + mm[0];
            var yyyy = today.getFullYear();
            var date = (yyyy - minAge) + '-' + mm + '-' + dd;
            return date;
        }
    });

    return PersonalModel;
});
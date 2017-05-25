// This is a file copied by your subgenerator.
define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Template
    ,'requirejs-text!modules/profileUser/templates/address.html'

    //Parent view
    ,'modules/profileUser/views/pane'
    
    ,'helpers/vanillaMask'

    // Backbone extension for two way data-binding (View<->Model)
    ,'backbone.stickit'

    // Backbone extension for client-side validation
    ,'backbone-validation'

    // Backbone validation callbacks overrides
    ,'helpers/backbone/validation'


    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,addressTemplate
                ,Pane
                ,Mask
    ) {
    
        
        // Validation placed here because it depends on UI state
        var _landlordNameValidation  = [{
                required: true
               ,msg: 'Please enter your landlord\'s name'
            },{
                pattern: XRegExp("^(\\p{L}\\p{M}*){2}([- ]?(\\p{L}\\p{M}*)){0,48}$")
                ,msg: 'Please enter a valid name'
        }];
        var _landlordNumberValidation = [{
            required: true
           ,msg: 'Please enter your landlord\'s phone number'
        },{
             pattern: XRegExp("^[\\(]{0,1}([0-9]){3}[\\)]{0,1}[ ]?([^0-1]){1}([0-9]){2}[ ]?[-]?[ ]?([0-9]){4}[ ]*((x){0,1}([0-9]){1," +
                "5}){0,1}$")
            ,msg: 'Please enter a valid phone number'
        }];

        var _onDataClear = Pane.prototype.onDataClear;
        var _init = Pane.prototype.initialize;
        var _render = Pane.prototype.render;
        var Address = Pane.extend({
            tabIndex: 1
            ,className: 'pane address'
            ,bindings: {
                '[name=addrProvince]': {
                     observe: 'addrProvince'
                    ,selectOptions: {
                        collection: function() {
                            return [
                                 { value: 'AB', label: 'AB'  }
                                ,{ value: 'BC', label: 'BC'  }
                                ,{ value: 'MB', label: 'MB'  }
                                ,{ value: 'NB', label: 'NB'  }
                                ,{ value: 'NL', label: 'NL'  }
                                ,{ value: 'NT', label: 'NT'  }
                                ,{ value: 'NS', label: 'NS'  }
                                ,{ value: 'NU', label: 'NU'  }
                                ,{ value: 'ON', label: 'ON'  }
                                ,{ value: 'PE', label: 'PE'  }
                                ,{ value: 'QC', label: 'QC'  }
                                ,{ value: 'SK', label: 'SK'  }
                                ,{ value: 'YT', label: 'YT'  }
                            ]
                        }
                        ,defaultOption: {
                             label: 'Province'
                            ,value: null
                        }
                    }
                }
                ,'[name=addrCity]': 'addrCity'
                ,'[name=addrAddress]': 'addrAddress'
                ,'[name=addrSuite]': {
                     observe: 'addrSuite'
                    ,onGet: function(value) {
                        var result = (this.mode === 'add') ? value : '';
                        return result;
                    }
                }
                ,'[name=addrPostalCode]': {
                     observe: 'addrPostalCode'
                    ,onGet: function(value) {
                        if(!value) return;
                        return Mask.toPattern(value, "A9A 9A9");
                    }
                }
                ,'[name=addrIsOwner]': {
                     observe: 'addrIsOwner'
                    ,visible: true
                    ,onGet: function(value) {
                        var self = this;
                        self.setRentFieldsRequired(value === 'false');
                        return value;
                    }
                    ,visibleFn: function($el, isVisible, options) {
                        var self = this;
                        var
                            // @2do :: Can't get selected value here, cause it's not set yet
                            // (created a request in backbone.stickit repo to add that param to this function)
                             val = this.model.get('addrIsOwner') || '';
                            // Select the radio button which should be updated
                            // (it's value should match new value)
                            var $input = $el.filter(function() { return $(this).val() == val.toString() })
                            ,$field = $input.closest('.field');

                        function showOwnershipDetails() {
                            // Close previous tab
                            $field.closest('.fieldset').siblings('.details.rental').removeClass('active');
                            // Show new tab
                            $field.closest('.fieldset').siblings('.details.ownership').addClass('active');
                            // Set corresponding input field to be checked
                        }
                        function showRetailDetails() {                       
                            // Close previous tab
                            $field.closest('.fieldset').siblings('.details.ownership').removeClass('active');
                            // Show new tab
                            $field.closest('.fieldset').siblings('.details.rental').addClass('active');
                            // Set corresponding input field to be checked
                        }

                        // Show either ownership or retail details based selected value
                        ( $input.val() === "true" ) ? showOwnershipDetails() : showRetailDetails();
                    }
                }
                ,'[name=addrLandlordName]': 'addrLandlordName'
                ,'[name=addrLandlordPhoneNumber]': {
                     observe: 'addrLandlordPhoneNumber'
                    ,onGet: function(value) {
                        if(!value) return;
                        return Mask.toPattern(value, "(999) 999-9999");
                    }
                }
                ,'[name=addrMonthlyMortgagePayment]': 'addrMonthlyPayment'
                ,'[name=addrMonthlyRentPayment]':     'addrMonthlyPayment'
                ,'[name=addrLivingDuration]': {
                    // Watch two corresponding attributes in the models
                    // and combine their value into one select option
                    observe: ['addrLivingDurationYears', 'addrLivingDurationMonths']
                    // A callback which prepares a formatted version of
                    // the view value before setting it in the model.
                    ,onSet: function(value) {
                        if(value == '-2') return ['0', '0'];
                        if(value == '-1') return ['0', '6'];
                        if(value == '0')  return ['0', '7'];

                        return [ value, '0']
                    }
                    // A callback which returns a formatted version of
                    // the model attribute value that is passed in before
                    // setting it in the bound view element
                    ,onGet: function(values) {
                        var years = values[0] || '0';
                        var months = values[1]
                        
                        if((years == '0') && !months)               return '-2';
                        if((years == '0') && months <= '6')   return '-1';
                        if((years == '0') && months >= '7')   return '0';

                        return years + '';
                    }
                    ,selectOptions: {
                        collection: [
                             { value: '-1', label: 'six months or less' }
                            ,{ value: '0',  label: 'six months or more' }
                            ,{ value: '1',  label: '1 year' }
                            ,{ value: '2',  label: '2 years' }
                            ,{ value: '3',  label: '3 years' }
                            ,{ value: '4',  label: '4 years' }
                            ,{ value: '5',  label: '5 years' }
                            ,{ value: '6',  label: '6 years' }
                            ,{ value: '7',  label: '7 years' }
                            ,{ value: '8',  label: '8 years' }
                            ,{ value: '9',  label: '9 years' }
                            ,{ value: '10', label: '10 or more years' }
                        ]
                        ,defaultOption: {
                             label: 'Please choose duration'
                            ,value: '-2'
                        }
                    }
                    ,visible: true
                    ,visibleFn: function($el, isVisible, options) {
                        // @2do :: Can't get selected value here, cause it's not set yet
                        // (created a request in backbone.stickit repo to add that param to this function)
                        // For now have to retrieve it from the model and write another if statement
                        var
                             years = this.model.get('addrLivingDurationYears') || '0'
                            ,months = this.model.get('addrLivingDurationMonths') || '0'
                            ,prevAddress = $el.closest('.fieldset.currentAddress').siblings('.fieldset.prevAddress');

                        // If the customer lives 6 months or less at
                        // current address than display him a new fieldset with
                        // previous address fields
                        if(years == '0' && months <= '6' && months > '0') {
                            prevAddress.addClass('active');
                            this.model.isPrevAddressVisible = true;
                        } else  {
                            prevAddress.removeClass('active');
                            this.model.isPrevAddressVisible = false;
                        }
                        if (_.isFunction(this.model.isValid)) {
                            var isValid = this.model.isValid(true);
                        }
                    }
                }
                ,'[name=addrPrevlivingDuration]': {
                    // Watch two corresponding attributes in the models
                    // and combine their value into one select option
                    observe: ['addrPrevLivingDurationYears', 'addrPrevLivingDurationMonths']
                    // A callback which prepares a formatted version of
                    // the view value before setting it in the model.
                    ,onSet: function(value) {
                        if(value == '-2')           return ['0', '0'];
                        if(value == '-1')           return ['0', '6'];
                        if(value == '0')            return ['0', '7'];

                        return [ value, '0'];
                    }
                    // A callback which returns a formatted version of
                    // the model attribute value that is passed in before
                    // setting it in the bound view element
                    ,onGet: function(values) {
                        var
                             years = values[0]
                            ,months = values[1];
                        
                        if(!years && !months) return '-2';
                        if((!years || years == '0') && months <= '6') return '-1';
                        if((!years || years == '0') && months >= '7') return '0';

                        return years.toString();
                    }
                    ,selectOptions: {
                        collection: [
                             { value: '-1', label: 'six months or less' }
                            ,{ value: '0',  label: 'six months or more' }
                            ,{ value: '1',  label: '1 year' }
                            ,{ value: '2',  label: '2 years' }
                            ,{ value: '3',  label: '3 years' }
                            ,{ value: '4',  label: '4 years' }
                            ,{ value: '5',  label: '5 years' }
                            ,{ value: '6',  label: '6 years' }
                            ,{ value: '7',  label: '7 years' }
                            ,{ value: '8',  label: '8 years' }
                            ,{ value: '9',  label: '9 years' }
                            ,{ value: '10', label: '10 or more years' }
                        ]
                        ,defaultOption: {
                             label: 'Please choose duration'
                            ,value: '-2'
                        }
                    }
                }
                ,'[name=addrPrevProvince]': {
                     observe: 'addrPrevProvince'
                    ,selectOptions: {
                        collection: [
                                 { value: 'AB', label: 'AB'  }
                                ,{ value: 'BC', label: 'BC'  }
                                ,{ value: 'MB', label: 'MB'  }
                                ,{ value: 'NB', label: 'NB'  }
                                ,{ value: 'NL', label: 'NL'  }
                                ,{ value: 'NT', label: 'NT'  }
                                ,{ value: 'NS', label: 'NS'  }
                                ,{ value: 'NU', label: 'NU'  }
                                ,{ value: 'ON', label: 'ON'  }
                                ,{ value: 'PE', label: 'PE'  }
                                ,{ value: 'QC', label: 'QC'  }
                                ,{ value: 'SK', label: 'SK'  }
                                ,{ value: 'YT', label: 'YT'  }
                        ]
                        ,defaultOption: {
                             label: 'Province'
                            ,value: null
                        }
                    }
                }
                ,'[name=addrPrevCity]':    'addrPrevCity'
                ,'[name=addrPrevAddress]': 'addrPrevAddress'
                ,'[name=addrPrevPostalCode]': {
                     observe: 'addrPrevPostalCode'
                    ,onGet: function(value) {
                        if(!value) return;
                        return Mask.toPattern(value, "A9A 9A9");
                    }
                }
            }
            //fields that populated with autocomplete
            ,autocompleteFields: ['addrAddress', 'addrCity', 'addrProvince', 'addrPostalCode',
                'addrPrevAddress', 'addrPrevCity', 'addrPrevProvince', 'addrPrevPostalCode']
            /**
             * Handler for autocomplete container clicks
             */
            ,onAutocomplete: function(event) {
                var fields = this.autocompleteFields;
                var self = this;
                for (var i = 0; i < fields.length; i++) {
                    //should do timeout to be sure that all fields are already populated with autocomplete data
                    setTimeout(function(field) {
                        var $field = self.$el.find('[name="' + field + '"]');
                        var value = self.$el.find('[name="' + field + '"]').val();
                        //if value differ from the default one trigger change event to perform validation on  field
                        if (value !== '' && value !== undefined) {
                            $field.trigger('change');
                        }
                    }, 1500, fields[i]);
                }
            }
            /**
             * Bind to click events on autocomplete to perform validation after any address was selected
             * autocomplete change fileds values silently without triggering 'change event', so no validation done on the fields
             */
            ,bindAutoComplete: function() {
                $('.pca').off('click');
                $('.pca').on('click', _.bind(this.onAutocomplete, this));
            }
            /**
             * Since Landlord Phone and Name validation is only relevant when Rent option is selected, we add/remove it's validation rules
             */
            ,setRentFieldsRequired: function(isRequired) {
                var self = this;
                if (isRequired) {
                    self.model.validation['addrLandlordPhoneNumber'] = _landlordNumberValidation;
                    self.model.validation['addrLandlordName'] = _landlordNameValidation;
                } else {
                    self.model.validation['addrLandlordPhoneNumber'] = [];
                    self.model.validation['addrLandlordName'] = [];
                }
                if (self.model.validate) {self.model.validate()};
            }
            ,_hideAllRentalDetails: function() {
                var $details = this.$el.find('.rental.details, .ownership.details');
                $details.removeClass('active');
            }
            ,onDataClear: function() {
                _onDataClear.apply(this);
                this._hideAllRentalDetails();
            }
            ,render: function() {
                _render.apply(this, arguments);
                return this;
            }
            ,initialize: function(attributes) {
                this.on('onAfterRender', this.bindAutoComplete, this);
                this.template = _.template(addressTemplate);
                _init.apply(this, [attributes]);
                // Initialize postalCode mask
                Mask.maskPattern(this.$el.find("[name='addrPostalCode']")[0], "A9A 9A9");
                Mask.maskPattern(this.$el.find("[name='addrPrevPostalCode']")[0], "A9A 9A9");
                // Initialize phone masks
                Mask.maskPattern(this.$el.find("[name='addrLandlordPhoneNumber']")[0], "(999) 999-9999");
            }
        });

        return Address;
    }
);
// This is a file copied by your subgenerator.
define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Template
    ,'requirejs-text!modules/profile/templates/employment.html'

    //Parent view
    ,'modules/profile/views/pane'
    
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
                ,employmentTemplate
                ,Pane
                ,Mask
    ) {
        var _init = Pane.prototype.initialize;
        var _render = Pane.prototype.render;
        var Employment = Pane.extend({
             tabIndex: 2
            ,className: 'pane employment'
            ,bindings: {
                '[name=empIncomeSource]': {
                     observe: 'empIncomeSource'
                    ,selectOptions: {
                        collection: [
                             { value: 'fullTime', label: 'Full time' }
                            ,{ value: 'partTime', label: 'Part time' }
                            ,{ value: 'selfEmployed', label: 'Self employed' }
                            ,{ value: 'disability', label: 'Disability' }
                            ,{ value: 'pension', label: 'Pension' }
                            ,{ value: 'socialAssistance', label: 'Social assistance' }
                            ,{ value: 'employmentInsurance', label: 'Employment insurance' }
                        ]
                        ,defaultOption: {
                             label: 'Source of income'
                            ,value: null
                        }
                    }
                    ,visible: true
                    ,visibleFn: function($el, isVisible, options) {
                        var
                             $field = $el.closest('.field')
                            ,employmentType = this.model.get('empIncomeSource');

                        switch( employmentType ) {
                            // Employment types that qualify for full employment form:
                            case 'fullTime': case 'partTime': case 'selfEmployed':
                                this.model.isFulTimeVisible = true;
                                // Close previous tab
                                $field.closest('.fieldset.column').siblings('.short').removeClass('active');
                                // Show new tab
                                $field.closest('.fieldset.column').siblings('.full').addClass('active');
                                break;
                            // All other employment types should fall back to the short form
                            default:
                                this.model.isFulTimeVisible = false;
                                // Close previous tab
                                $field.closest('.fieldset.column').siblings('.full').removeClass('active');
                                // Show new tab
                                $field.closest('.fieldset.column').siblings('.short').addClass('active');
                        }
                        if (_.isFunction(this.model.isValid)) {
                            var isValid = this.model.isValid(true);
                        }
                    }
                }
                ,'[name=empPosition]': 'empPosition'
                ,'[name=empEmployer]': 'empEmployer'
                ,'[name=empPaymentFrequency]': {
                     observe: 'empPaymentFrequency'
                    ,selectOptions: {
                        collection: [
                             { value: 'weekly', label: 'Weekly(e.g. Every Friday)' }
                            ,{ value: 'biWeekly', label: 'Every two weeks(e.g. Every Other Friday)' }
                            ,{ value: 'semiMonthly', label: 'Twice a month(e.g. The 15th and the last day of each month)' }
                            ,{ value: 'monthly', label: 'Monthly(e.g. The last day of each month)' }
                        ]
                        ,defaultOption: {
                             label: 'Payment frequency'
                            ,value: null
                        }
                    }
                }
                ,'[name=empPayment]': 'empPayment'
                ,'[name=empProvince]':             {
                     observe: 'empProvince'
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
                ,'[name=empCity]': 'empCity'
                ,'[name=empPostalCode]': {
                     observe: 'empPostalCode'
                    ,onGet: function(value) {
                        if(!value) return;
                        return Mask.toPattern(value, "A9A 9A9");
                    }
                }
                ,'[name=empAddress]': 'empAddress'
                ,'[name=empPhoneNumber]': {
                     observe: 'empPhoneNumber'
                    ,onGet: function(value) {
                        if(!value) return;
                        return Mask.toPattern(value, "(999) 999-9999");
                    }
                }
                ,'[name=empPhoneExtension]': 'empPhoneExtension'
                ,'[name=empSupervisorName]': 'empSupervisorName'
                ,'[name=empSupervisorPhoneNumber]': {
                     observe: 'empSupervisorPhoneNumber'
                    ,onGet: function(value) {
                        if(!value) return;
                        return Mask.toPattern(value, "(999) 999-9999");
                    }
                }
                ,'[name=empCurrentWorkDuration]': {
                    // Watch two corresponding attributes in the models
                    // and combine their value into one select option
                    observe: ['empWorkingDurationYears', 'empWorkingDurationMonths']
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
                    ,visible: true
                    ,visibleFn: function($el, isVisible, options) {
                        // @2do :: Can't get selected value here, cause it's not set yet
                        // (created a request in backbone.stickit repo to add that param to this function)
                        // For now have to retrieve it from the model and write another if statement
                        var years = this.model.get('empWorkingDurationYears') || '0'
                        var months = this.model.get('empWorkingDurationMonths') || '0'
                        var $previousEmploymentPlace = $el.closest('.fieldset').siblings('.fieldset.previousWorkDuration');

                        // If the customer lives 6 months or less at
                        // current address than display him a new fieldset with
                        // previous address fields
                        if(years == '0' && months <= '6' && months > '0') {
                            $previousEmploymentPlace.addClass('active');
                            this.model.isPrevWorkDurationVisible = true;
                        } else {
                            $previousEmploymentPlace.removeClass('active');
                            this.model.isPrevWorkDurationVisible = false;
                        }
                        if (_.isFunction(this.model.isValid)) {
                            var isValid = this.model.isValid(true);
                        }
                    }
                }
                ,'[name=empPreviousWorkDuration]':       {
                    // Watch two corresponding attributes in the models
                    // and combine their value into one select option
                    observe: ['empPrevWorkingDurationYears', 'empPrevWorkingDurationMonths']
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
                        var
                             years = values[0]
                            ,months = values[1];
                        
                        if(!years && !months) return '-2';
                        if((!years || years == '0') && months <= '6') return '-1';
                        if((!years || years == '0') && months > '6')  return '0';

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
                ,'[name=empAdditionalIncome]': 'empAdditionalIncome'
                ,'[name=empAdditionalIncomeSource]': 'empAdditionalIncomeSource'

            }
            //fields that populated with autocomplete
            ,autocompleteFields: ['empAddress', 'empCity', 'empProvince', 'empPostalCode']
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
                    }, 1000, fields[i]);
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
            ,render: function() {
                _render.apply(this);
                return this;
            }
            /**
             *Limit length of input field
             */
            ,checkLength: function(event, limitNum) {
                var limitField = event.target;
                if (limitField.value.length > limitNum) {
                    limitField.value = limitField.value.substring(0, limitNum);
                } 
            }
            ,initialize: function(attributes) {
                var self = this;
                this.on('onAfterRender', this.bindAutoComplete, this)
                this.template = _.template(employmentTemplate);
                _init.apply(this, [attributes]);
                Mask.maskPattern(this.$el.find("[name='empPostalCode']")[0], "A9A 9A9");
                Mask.maskPattern(this.$el.find("[name='empPhoneNumber']")[0], "(999) 999-9999");
                Mask.maskPattern(this.$el.find("[name='empSupervisorPhoneNumber']")[0], "(999) 999-9999");
                //jquery mask doesn't work for number fields
                this.$el.find("[name='empPhoneExtension']").on('keyup', function(event) {self.checkLength(event, 5)});
            }
        });

        return Employment;
    }
);
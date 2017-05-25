// This is a file copied by your subgenerator.
define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Template
    ,'requirejs-text!modules/profileCoapplicant/templates/address.html'

    //Parent view
    ,'modules/profileCoapplicant/views/pane'
    
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
            ,events: {
               'change [name=addrSameAs]': 'onAddressSameChange'
            }
            ,bindings: {
            	'[name=addrSameAs]' : {
            		observe: 'addrSameAs'
            	},
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
            }
            ,onAddressSameChange: function(event) {
                var $target = $(event.target);
                var value = $target.val();
                this.notifyAddressSameChange(this.model, value);
            }
            ,notifyAddressSameChange: function(model, value) {
                value = value === 'true' ? true : value === 'false' ? false : value;
                var bulkElements = this.$el.find('#bulkItems');
//                var msgItems = bulkElements.find('.msg');
                var fldItems = bulkElements.find('#addrAddressLb, #addrCityLb, #addrProvinceLb, #addrPostalCodeLb');
            	var elements = this.$el.find('#addrAddress, #addrSuite, #addrCity, #addrProvince, #addrPostalCode');
                if (value) {
                	elements.attr('disabled', 'disabled');
//                	msgItems.attr('style', 'display:none');
                	fldItems.removeClass('invalid');
                	fldItems.addClass('valid');
                	model._isValid = true;
                }
                else {
                	elements.removeAttr('disabled');
//                	msgItems.removeAttr('style');
                	fldItems.removeClass('valid');
                	fldItems.addClass('invalid');
                	model._isValid = false;
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
            }
        });

        return Address;
    }
);
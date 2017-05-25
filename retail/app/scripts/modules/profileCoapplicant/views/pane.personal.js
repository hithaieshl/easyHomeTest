// This is a file copied by your subgenerator.
define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Template
    ,'requirejs-text!modules/profileCoapplicant/templates/personal.html'
    
    //Parent view
    ,'modules/profileCoapplicant/views/pane'
    
    // Custom jQuery mask plugin
    ,'helpers/vanillaMask'
    
    ,'datepicker'

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
                ,PersonalTemplate
                ,Pane
                ,Mask
    ) {
        var _init = Pane.prototype.initialize;
        var _render = Pane.prototype.render;
        var _onValidate = Pane.prototype.onValidate;
        var Personal = Pane.extend({
             tabIndex: 0
            ,className: 'pane personal'
            ,isDateChange: false
            ,events: {
                 'clear': 'onClearHandler'
                ,'change [name=birthDate]': 'onDateChange'
                ,'focus [name=birthDate]': 'onDateFocus'
                ,'blur [name=birthDate]': 'onDateBlur'
                ,'change [name=hasCoapplicant]': 'onCoapplicantChange'
            }
            ,bindings: {
                 '[name=firstName]': 'firstName'
                ,'[name=lastName]':  'lastName'
                ,'[name=birthDate]': {
                     observe: 'birthDate'
                     // Change 'yyyy-mm-dd' -> 'mm/dd/yyyy'
                    ,onSet: function(value) {
                        if(!value) return;
                        var
                             oldDateArray = value.split('-')
                            ,years = oldDateArray[0]
                            ,months = oldDateArray[1]
                            ,days = oldDateArray[2]
                            ,newDateArray = [months, days, years];
                            
                            // var $placeholder = this.$el.find('.birthDate .placeholder');
                            // $placeholder.hide();
                            return newDateArray.join('/');
                    }
                    // Change 'mm/dd/yyyy' -> 'yyyy-mm-dd'
                    ,onGet: function(value) {
                        if(!value) return;
                        var
                             oldDateArray = value.split('/')
                            ,months = oldDateArray[0]
                            ,days = oldDateArray[1]
                            ,years = oldDateArray[2]
                            ,newDateArray = [years, months, days];

                        // var $placeholder = this.$el.find('.birthDate .placeholder');
                        // $placeholder.hide();
                        return newDateArray.join('-');
                    }
                }
				,'[name=relationToApplicant]': 'relationToApplicant'
                ,'[name=gender]': 'gender'
                ,'[name=custacct]': {
                    observe: 'custacct'
                    ,visible: true
                    ,visibleFn: function($el, isVisible, options) {
                        var customerNumber = this.model.get('custacct');
                        if(!customerNumber || customerNumber === '') {
                            $el.closest('field').hide();
                        }
                    }
                }
                ,'[name=homePhone]': {
                     observe: 'homePhone'
                    ,onGet: function(value) {
                        if(!value) return;
                        return Mask.toPattern(value, "(999) 999-9999");
                    }
                }
                ,'[name=workPhone]': {
                     observe: 'workPhone'
                    ,onGet: function(value) {
                        if(!value) return;
                        return Mask.toPattern(value, "(999) 999-9999");
                    }
                }
				,'[name=workPhoneExt]': {
                     observe: 'workPhoneExt'
                    ,onGet: function(value) {
                        if(!value) return;
                        return value;
                    }
                }
            }
            ,onDateChange: function(event) {
                // var $target = $(event.target);
                // var value = $target.val();
                // // var maxDate = this.model.getMaxBirthDate();
                // // if (value !== maxDate) {
                    // // this.isDateChange = true;
                // // }
                // var $placeholder = this.$el.find('.birthDate .placeholder');
                // if (value === '') {
                    // $placeholder.show();
                // }else {
                    // $placeholder.hide();
                // }
            }
            ,onDateFocus: function() {
                // var $dateInputs = this.$el.find(".birthDate input");
                // //save previously setted date value
                // this.prevDateVal = $dateInputs.val();
                // var self = this;
                // if (this.prevDateVal === '') {
                    // var maxDate = this.model.getMaxBirthDate();
                    // $dateInputs.val(maxDate);
                // }
            }
            ,onDateBlur: function() {
                // if (!this.isDateChange) {
                    // var $dateInputs = this.$el.find(".birthDate input");
                    // $dateInputs.val(this.prevDateVal);
                // }
                // this.isDateChange = false;
            }
            ,setMaxDate: function() {
                var maxDate = this.model.getMaxBirthDate();
                var $dateInputs = this.$el.find(".birthDate input");
                $dateInputs.attr('max', maxDate);
            }
            ,render: function() {
                _render.apply(this, arguments);
                var maxDate = this.model.getMaxBirthDate();
                this.$el.find('[name=birthDate]').Zebra_DatePicker({
                     header_navigation: ["", ""]
                    ,header_captions: {
                        'days':     'F <span class="year">Y</span>',
                        'months':   '<span class="year">Y</span>',
                        'years':    '<span class="year">Y1</span> - <span class="year">Y2</span>'
                    }
                    ,default_position: 'below'
                    ,direction: -1
                    ,show_icon: false
                    ,start_date: maxDate
                    ,onSelect: function(view, elements) {
                        $(this).trigger('change');
                    }
                    ,onClear: function() {
                        $(this).trigger('change');
                    }
                });
            }
            ,_enableDraftSave: function(enable) {
                var saveBtn = $('.draft-save');
                enable ? saveBtn.prop('disabled', false) : saveBtn.prop('disabled', true);
            }
            ,_validateDraftFields: function() {
                if (this.model.isValid('firstName') 
                && this.model.isValid('lastName') 
                && this.model.isValid('email')
                && this.model.isValid('isTermsAccepted')) {
                    this._enableDraftSave(true);
                    return;
                }
                this._enableDraftSave(false);
            }
            ,onValidate: function(isValid, model, errors) {
                _onValidate.call(this, isValid, model, errors);
                this._validateDraftFields();
            } 
            ,initialize: function(attributes, options) {
                this.isDateChange = false;
                this.template = _.template(PersonalTemplate);
                _init.apply(this, [attributes]);
                // Initialize SIN mask
                Mask.maskPattern(this.$el.find("[name='sin']")[0], "999-999-999");
                // Initialize phone masks
                Mask.maskPattern(this.$el.find("[name='homePhone']")[0], "(999) 999-9999");
                Mask.maskPattern(this.$el.find("[name='workPhone']")[0], "(999) 999-9999");
                this.setMaxDate();
            }
        });

        return Personal;
    }
);
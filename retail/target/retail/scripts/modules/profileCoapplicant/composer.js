define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Module composer prototype
    ,'prototypes/module.composer'

    // Local dependencies
    ,'modules/profileCoapplicant/models/profile'
    ,'modules/profileCoapplicant/models/profileJSON'
    ,'modules/profileCoapplicant/views/tabs'
    ,'modules/profileCoapplicant/views/panes'
    ,'modules/profileCoapplicant/views/pane.personal'
    ,'modules/profileCoapplicant/views/pane.address'
    ,'modules/profileCoapplicant/views/rulesPopup'
    
    // Terms and Conditions template
    ,'requirejs-text!modules/profileCoapplicant/templates/rules.html'

    // Helper for rendering a popup with custom template
    ,'helpers/popup'
    ,'google-analytics'

    // Backbone extension for client-side validation
    ,'backbone-validation'

    // Backbone validation callbacks overrides
    ,'helpers/backbone/validation'

    // RequireJS modules for Async load of Canada Post API
    ,'async'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,ModuleComposerPrototype
                ,ProfileModel
                ,ProfileJSON
                ,TabsView
                ,PanesView
                ,PersonalView
                ,AddressView
                ,RulesPopup
                ,RulesTemplate
                ,Popup
                ,_gaq
    ) {
        var ProfileModule = Backbone.ModuleComposer.extend({
             tagName: 'form'
            ,className: 'module profile'
            ,moduleName: 'profileUser'
            ,tabIndex: 1
            ,events: {
                'click .read':   'readTermsAndConditions'
            }
            ,onFocus: function(event) {
                $target = $(event.target);
                var targetOffest = $target.offset();
                var $pane = $(".panes .pane");
                var paneOffest = $pane.offset();
                var scrollPos = $pane.scrollTop();
                var offset = targetOffest.top + scrollPos - paneOffest.top;
                setTimeout(function() {
                    $(".panes .pane").animate({ scrollTop: offset }, 500);
                }, 500);
            }
            ,initSubmodules: function() {
                var self = this;
                // @2do :: refactor this
                var panes = [{
                        constructor: PersonalView
                        ,arguments: {
                             model: self.model.get('personal')
                            ,mode: self.mode
                        }
                    },{
                        constructor: AddressView
                        ,arguments: {
                             model: self.model.get('coAppAddress')
                            ,mode: self.mode
                        }
                    }
                ]
                this.submodules = [
                    {
                        constructor: TabsView
                        ,arguments: {}
                    },{
                        constructor: PanesView
                        ,arguments: {
                            panes: panes
                        }
                    }
                ];
            }
            ,readTermsAndConditions: function(event) {
                var self = this;
                // Prevent form submit on button click
                event.preventDefault();
                this.rulesView = new RulesPopup({
                     parentView: self
                    ,template: RulesTemplate
                    ,className: 'popup rules'
                });
                this.rulesView.show();
            }
            ,switchPane: function(index) {
                var panes = this.views[1];
                panes.switchPane(index);
            }
            ,validate: function() {
                var panes = this.views[1];
                panes.validateActivePane()
            }
            ,onSubModelValidate: function(isValid, view) {
                if (this.views[1].views.indexOf(view) !== -1) {
                    var index = view.tabIndex;
                    //mark appropriate tab title as valid/invalid
                    this.views[0].validate(isValid, index);
                }
            }
            ,onMainModelValidate: function(isValid) {
                Eva.trigger('ProfileModel:validated', isValid, this);
            }
            ,onTabClear: function(index) {
                var
                     panes = this.views[1]
                    ,pane = panes.views[index];
                
                // Clear the contents of selected pane
                pane.$el.trigger('clear');
            }
            ,onUndo: function() {
                /* undo for separate tab
                    var index = this.views[0].getActiveTabIndex();
                    var panes = this.views[1]
                    var pane = panes.views[index];
                    pane.setPrevData();
                */
                this.model.undo();
            }
            ,setPredifinedModelData: function(data) {
                if (data) {
                    var personalModel = this.model.get('personal');
                    personalModel.set(data);
                    if (personalModel.validate) {personalModel.validate()};
                }
            }
            ,initialize: function(attributes, options) {
                // Assign attributes to the view, so it can be
                // enriched with new data and then parsed into templates
                this.attributes = attributes;

                this.$el.prop('novalidate', true);
                // Set pageName on a module
                this.pageName = attributes.pageName || '';
                if (window.localStorage.getItem('environment').indexOf('app') !== -1) {
                    this.$el.on('focus', 'input', this.onFocus);
                }
                this.render();
                //Eva.on(attributes.pageName + ':setOptions', this.setPredifinedModelData, this);
                //when phone number in reference tab changes - compare it with landlordPhone in address tab 
                Eva.on('Profile:validated', this.onSubModelValidate, this);
                this.model.on('validated', this.onMainModelValidate, this);
            }
             ,autoFillFields: function() {
                this.model.get("personal").set(ProfileJSON["personal"]);
                this.model.get("address").set(ProfileJSON["address"]);
                this.model.get("references").at(0).set(ProfileJSON["references"][0]);
                this.model.get("references").at(1).set(ProfileJSON["references"][1]);
                this.model.get("references").at(2).set(ProfileJSON["references"][2]);
            }
            ,render: function() {
                // Define modules to be rendered
                this.initSubmodules();
                // Render these modules
                this.invokeSubmodules(this.submodules);
                //bind to tabs view clear event
                this.views[0].on('Profile:clear', this.onTabClear, this);
                this.views[0].on('Profile:switchPane', this.switchPane, this);
                
                /* Development only, uncomment to show TUDialog */
                /*this.attributes.isTuAuthRequired = true;
                this.attributes.customerId = 2006900;
                this.showSuccessPopup();*/
            }
        });

        return ProfileModule;
    }
);
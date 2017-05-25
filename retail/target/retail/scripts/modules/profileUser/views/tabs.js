// This is a file copied by your subgenerator.
define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Template
    ,'requirejs-text!modules/profileUser/templates/tabs.html'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,tabsTemplate
    ) {
        var Tabs = Backbone.View.extend({
            tagName: 'nav'
            ,className: 'tabs'
            ,template: _.template(tabsTemplate)
            ,events: {
                'click .clear': 'onClear'
                ,'click .tab .title': 'onTabClick'
            }
            ,previousTabIndex: 0
            ,onTabClick: function(e) {
                var newTab = $(e.currentTarget).closest('.tab');
                var newTabIndex = newTab.index();
                var previousTab = this.$el.find('.tab').eq(this.previousTabIndex);
                
                // If this tab is already selected, then do nothing
                if( this.previousTabIndex === newTabIndex ) return;
                
                // Switch tabs
                previousTab.removeClass('selected');
                newTab.addClass('selected');
                // Store tab index for a future function call
                this.previousTabIndex = newTabIndex;
                this.trigger('Profile:switchPane', newTabIndex);
            }
            ,onClear: function(event){
                // Stop event propagation, so the click
                // would not count as tab change event
                event.stopPropagation();
                var $target = $(event.target);
                var index = $target.parents('.tab').index();
                this.trigger('Profile:clear', index);
            }
            ,validate: function(isValid, index) {
                var $tab = this.$el
                                    .find('.tab')
                                    .eq(index);
                if (isValid) {
                	if ($tab[0].className !== 'tab error hidden') {
                    	$tab.removeClass('error');
                	}
                }
                else {
                	$tab.addClass('error');
                }
            }
            ,getActiveTabIndex: function() {
                var index = this.$el.find('.tab.selected').index();
                return index;
            }
            ,initialize: function() {
                this.render();
            }
            ,render: function() {
                // Render the template
                this.$el.html(this.template);
                // Return the viewObj onRender to enable chain call
                return this;
            }
        });

        return Tabs;
    }
);
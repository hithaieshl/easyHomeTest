define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
    ) {
        var PanesView = Backbone.View.extend({
             tagName: 'section'
            ,className: 'panes'
            ,activePaneIndex: 0
            ,loadcanadaPostApi: function(url, callback) {
                var self = this;
                var head= document.getElementsByTagName('head')[0];
                var script= document.createElement('script');
                script.type= 'text/javascript';
                script.src= url;
                script.onreadystatechange= function () {
                    if (this.readyState == 'complete') callback();
                }
                script.onload = callback;
                head.appendChild(script);
            }
            ,switchPane: function(index) {
                var self = this;
                // Remove previous pane from the DOM
                this.$el.contents().detach();
                // Add new pane to the DOM
                this.$el.append(this.views[index].$el);
                this.views[index].validate();
                this.activePaneIndex = index;
                //load autocomplete after page content is already loaded into DOM
                $('.pca').remove();
                function onCanadaPostApiLoad() {
                    self.views[index].trigger('onAfterRender');
                }
                this.loadcanadaPostApi('https://ws1.postescanada-canadapost.ca/js/addresscomplete-2.00.min.js?key=gn19-ad89-me19-ak93', onCanadaPostApiLoad);
            }
            ,validateActivePane: function() {
                var index = this.activePaneIndex;
                this.views[index].validate();
            }
            ,initialize: function(attributes, options) {
                this.render(attributes.panes);
            }
            ,render: function(panes) {
                var self = this, paneInstance;
                this.views = [];
                // Iterate through each element in the array,
                // which is a reference to the submoduleClass,
                // instantiate it and append to the page's $el
                _.each(panes, function(pane, index, list) {
                    paneInstance = new pane.constructor(pane.arguments);
                    self.views.push(paneInstance);
                });
                this.$el.append(this.views[0].$el);
            }
        });

        return PanesView;
    }
);
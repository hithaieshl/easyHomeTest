define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    //Views
    ,'modules/search/views/client'
    
    //Collections
    ,'modules/search/collections/clients'

    //Templates
    ,'requirejs-text!modules/search/templates/clients.html'
    ,'requirejs-text!modules/search/templates/noMatches.html'
    ,'requirejs-text!modules/search/templates/clientsCounter.html'
    
    ,'helpers/backbone/loader'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,ClientView
                ,ClientCollection
                ,ClientListTemplate
                ,EmptyListTemplate
                ,ClientCounterTemplate
                ,Loader
    ) {
        var ClientListView = Backbone.View.extend({
             tagName: 'section'
            ,className: 'clientList'
            ,model: null
            ,template: _.template(ClientListTemplate)
            ,clientCounterTemplate: _.template(ClientCounterTemplate)
            ,emptyListTemplate: _.template(EmptyListTemplate)
            ,events: {
                'keyup .filter input': 'filterClientList'
            }
            ,filterClientList: function(e) {
                var target = e.target;
                var query = target.value;
                var clients = this.model.search(query);
                this.$el.find('.clientsCounter').html(this.clientCounterTemplate(clients));
                this.updateList(clients);
            }
            ,render: function(clientlist) {
                var clients = clientlist;
                if (clientlist === undefined) {
                    clients = this.model
                }
                // Render the template
                if (clients.length > 0) {
                    this.$el.html(this.template({templateFn: this.clientCounterTemplate, clients: clients}));
                    this.updateList(clients);
                    this.$el.removeClass('noResults');
                } else {
                    this.$el.html(this.emptyListTemplate);
                    this.$el.addClass('noResults');
                }
                // Return the viewObj onRender to enable chain call
                return this;
            }
            ,updateList: function(clients) {
                var self = this;
                var $list = self.$el.find('ul');
                $list.html('');
                clients.each(function(client) {
                    var clientView  = new ClientView({model: client});
                    $list.append(clientView.render().el);
                });
            }
            ,updateClients: function(data) {
                if (_.isArray(data)) {
                    this.model.reset(data);
                }
            }
            ,initialize: function() {
                this.model = new ClientCollection();
                Eva.on('search:clientListView:render', this.render, this);
                Eva.on('search:clientListView:setClients', this.setClients, this);
                Eva.on('search:searchView:updateClients', this.updateClients, this);
                Eva.on('Profile:model:saved', function() {
                    this.updateClients([]);
                }, this);
            }
        });

        return ClientListView;
    }
);
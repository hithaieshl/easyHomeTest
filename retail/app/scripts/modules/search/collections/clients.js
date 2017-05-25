define([
    // Primary dependency
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Environment stats
    ,'config/env'

    // Store Model
    ,'modules/search/models/client'

], function(
            $
            ,_
            ,Backbone
            ,Eva
            ,env
            ,ClientModel
) {
    var ClientsCollection = Backbone.Collection.extend({
        model: ClientModel
        ,url: env.getUrlFor('fullSearch')
        ,options: {
            searchAttributes: [
                'firstName'
                ,'lastName'
                ,'email'
                ,'cellPhone'
                ,'addressLine'
                ,'province'
                ,'city'
            ]
        }
        ,onReset: function(clients, options) {
            if (options.previousModels !== clients.models) {
                Eva.trigger('search:clientListView:render');
            }
        }
        // Search a string in specified attributes of collection's models
        ,search: function(query, options) {
            // If empty string passed in -> do nothing
            if(query === "") return this;
            // Instantiate RexExp object to perform tests with
            var pattern = new RegExp(query, "ig");
            // Merge defaults with optional search settings passed in on function call
            var options = _.extend(this.options, options);
            // Array with search predictions
            var searchResults = [];
            // Filter through collection and return only those models that match the conditions
            // Without wrapping the filter with the underscore function,
            // the filter does not return a collection
            searchResults = this.filter(function(data) {
                // Iterate through searchable attributes
                return _.find(options.searchAttributes, function(element, index, list) {
                    // If there's a match -> push the match into the output array
                    if (data.get(element) !== undefined && data.get(element).search(pattern) != -1) {
                        return true;
                    }
                });
            });
            // Return the array to the caller
            return new this.constructor(searchResults);
        }
        ,initialize: function() {
            this.on('reset', this.onReset);
        }
    });

    return ClientsCollection;
});
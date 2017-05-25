define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Template
    ,'requirejs-text!modules/search/templates/client.html'
    ,'requirejs-text!modules/search/templates/suspiciousTags.html'
    ,'google-analytics'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,ClientTemplate
                ,SuspiciousTagsTemplate
                ,_gaq
    ) {
        var ClientView = Backbone.View.extend({
             tagName: 'li'
            ,className: 'client'
            ,template: _.template(ClientTemplate)
            ,suspiciousTagsTemplate: _.template(SuspiciousTagsTemplate)
            ,events: {
                 'click .primary.info':     'onClientSelection'
                ,'click .checkStatusBtn':   'onCheckClientStatus'
                ,'click .navigationBtn':    'onNavigate'
            }
            ,initialize: function() {
                this.model.on('sync', this.onStatusChange, this);
            }
            ,onStatusChange: function() {
                var $btn = this.$el.find('.checkStatusBtn');
                if (this.model.get('isStolen')) {
                    $btn.addClass('isSuspicious').prop('disabled', true);
                    this.addSuspiciousTags();
                } else {
                    $btn.addClass('notSuspicious').prop('disabled', true);
                }
            }
            ,addSuspiciousTags: function() {
                var tags = this.suspiciousTagsTemplate(this.model.attributes);
                this.$el.find('.secondary').prepend(tags);
            }
            ,onNavigate: function() {
                var 
                     url
                    ,replace
                    ,selectedModel = this.model.attributes;
                    
                _gaq.startTime('easyOrders', 'search and update profile');

                var id = this.model.get('id');
                switch(this.model.getType()) {
                    case 'ONLINE':
                        url = 'search/link/' + id;
                        replace = false;
                    break;
                    case 'LINKED':
                        url = 'login/' + id;
                        replace = true;
                    break;
                    default: 
                        url = 'profile/' + id;
                        replace = false;
                }

                Eva.trigger('navigateTo', url, {replace: replace, trigger: true}, selectedModel);
            }
            ,onCheckClientStatus: function(event) {
                event.stopPropagation();
                
                var $target = $(event.target).parents('.btn');
                this.model.fetch({
                    url: this.model.checkClientUrl
                    ,data: {'customerId': this.model.id}
                    ,success: function() {
                        $target.removeClass('loading');
                    }
                    ,fail : function() {
                        $target.removeClass('loading');
                    }
                });
                $target.addClass('loading');
            }
            ,onClientSelection: function() {
                this.$el.find('.primary.info, .secondary.info').toggleClass('active');
            }
            ,render: function() {
                // Render the template
                this.$el.html(this.template(this.model));
                // Return the viewObj onRender to enable chain call
                return this;
            }
        });

        return ClientView;
    }
);
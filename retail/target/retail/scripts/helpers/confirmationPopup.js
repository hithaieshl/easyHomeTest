define([
     'jquery'
    ,'underscore'
    ,'backbone'
    ], function(
        $
        ,_
        ,Backbone
    ) {
        var ConfirmationPopup = function(text, onAgreeCallback, onDeclineCallback) {
            this.el = $('<div class="overlay"></div>');
            this.text = text;
            this.agreeCallback = onAgreeCallback;
            this.declineCallback = onDeclineCallback;
        };
        ConfirmationPopup.prototype.render = function() {
            var template = _.template(
                    '<section class="confirmationPopup popup">' +
                        '<header><button class="close">Close</button></header>' +
                        '<section class="content">' +
                            '<header>' +
                                '<h1><%- text %></h1>' +
                            '</header>' +
                        '</section>' +
                        '<footer>' +
                            '<button class="button row_1_2 cancel additionalBtn">Cancel</button>' +
                            '<button class="button row_1_2 ok">Clear</button>' + 
                            
                        '</footer>' +
                    '</section>');
            
            $(this.el).append(template({text: this.text}));
            this.bindEvents();
            return this;
        };
        ConfirmationPopup.prototype.remove = function() {
            $(this.el).find('.cancel').off('click');
            $(this.el).find('.ok').off('click');
            $(this.el).remove();
        };
        ConfirmationPopup.prototype.cancelHandler = function(event) {
            event.preventDefault();
            if (_.isFunction(this.declineCallback)) {
                this.declineCallback();
            }
            this.remove();
        };
        ConfirmationPopup.prototype.agreeHandler = function(event) {
            event.preventDefault();
            if (_.isFunction(this.agreeCallback)) {
                this.agreeCallback();
            }
            this.remove();
        };
        ConfirmationPopup.prototype.bindEvents = function() {
            $(this.el).find('.ok').on('click', _.bind(this.agreeHandler, this));
            $(this.el).find('.cancel').on('click', _.bind(this.cancelHandler, this));
            $(this.el).find('.close').on('click', _.bind(this.cancelHandler, this));
        }
        return ConfirmationPopup;
    }
);
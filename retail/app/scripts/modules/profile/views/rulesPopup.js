define([
        'jquery'
        ,'underscore'
        ,'backbone'
        ,'helpers/popup'
    ], function(
        $
        ,_
        ,Backbone
        ,Popup
        ) {
        var RulesPopup = Popup.extend({
            defaults: {
                activeLang: "en"
            }
            ,events: {
                 'click .change-lang': 'getAndChangeLang'
            }
            ,getAndChangeLang: function(ev) {
                var lang = $(ev.target).data('lang');
                this.changeLang(lang);
            }
            ,changeLang: function(lang){
                this.$el.find('.rules').hide();
                this.$el.find('.change-lang').removeClass("active");

                this.$el.find('.change-lang-' + lang).addClass("active");
                this.$el.find('.rules-' + lang).show();
            }
            ,initialize: function(attributes, options){
                Popup.prototype.initialize.call(this, attributes, options);
                this.events = _.extend({}, Popup.prototype.events, this.events);
                this.defaults = _.extend({}, Popup.prototype.defaults, this.defaults);
                this.changeLang(this.defaults.activeLang)
            }
        });
        return RulesPopup;
    }
);
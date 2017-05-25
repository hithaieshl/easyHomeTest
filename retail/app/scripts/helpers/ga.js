define([
    'config/env'
    ,'GAlocalStorage'
    ], function(
        env
        ,ga_storage
    ) {
        var AnalyticsModel = Backbone.Model.extend({
            url: env.getUrlFor('timeTracker')
        });
        var accountId = env.getUrlFor("gaAccount");
        var trackers = {};
        if (window) {
            window.ga_storage = ga_storage; // export as global
        }
        ga_storage._setAccount(accountId);
        ga_storage._setDomain('none');
        ga_storage._trackPageview();
        ga_storage.startTime = function(category, variable) {
            var startTime = new Date().getTime();
            trackers[category + variable] = {};
            trackers[category + variable]["startTime"] = startTime;
            console.log('startTime - ' + startTime);
            return startTime;
        };
        ga_storage.endTime = function(category, variable) {
            var endTime = new Date().getTime();
            if (trackers[category + variable] !== undefined) {
                trackers[category + variable]["endTime"] = endTime;
                console.log('endTime - ' + endTime);
            }
            return endTime;
        };
        ga_storage.sendTime = function(category, variable, customerId, categoryPrefix) {
            var tracker = trackers[category + variable];
            if (tracker !== undefined && tracker.endTime !== undefined && tracker.startTime !== undefined) {
                categoryPrefix = categoryPrefix || '';
                var startTime = tracker.startTime
                var endTime = tracker.endTime
                var timeSpent = endTime - startTime;
                console.log('timeSpent - ' + timeSpent);
                ga_storage._trackTiming(category + categoryPrefix, variable, timeSpent, 'time', 100);
                var model  = new AnalyticsModel({
                     customerId: parseInt(customerId, 10)
                    ,startTime: startTime
                    ,endTime: endTime
                    ,eventType: variable
                });
                model.save();
                console.log('push _trackTiming ' + category + categoryPrefix + ' ' + variable +  ' ' + timeSpent);
                delete trackers[category + variable];
                return true;
            }
            return false;
        };

        return ga_storage;
});
define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'

    // Environment stats
    ,'config/env'
    
    ], function( $, _, Backbone, env ) {

        // Event aggregator
        var Eva = _.extend({}, Backbone.Events);
        Eva.subscribers = {};

        //Wrap default on logic. In this way we have possibility to track all registered events of the appropriate context
        Eva.on = function(eventName, callback, context) {
            //create hash-map off all subscribers (identified by unique cid)
            Eva.subscribers[context.cid] = Eva.subscribers[context.cid] || {};
            var subscribers = Eva.subscribers[context.cid];
            //every subscriber is a hash map of events and array of callbacks to those events
            subscribers[eventName] = subscribers[eventName] === undefined ? [] : subscribers[eventName];
            subscribers[eventName].push(callback);
            Backbone.Events.on.apply(this, [eventName, callback, context]);
        }
        //Wrap default off logic. Give possibility to unbind all eva events of the given context
        //or unbind all callbacks of the given context and event name
        //context is mandatory parameter
        //eventName is optional parameter
        //callback is optional parameter
        Eva.off = function(context, eventName, callback) {
            if (eventName == undefined) {
                Eva.offAll(context);
            } else if (callback === undefined) {
                Eva.offAllHandlers(context, eventName);
            } else {
                Eva.offOne(eventName, callback, context);
            }
        }
        //unbind given callback of the given event of the given context
        //remove callback from the hash map
        //all parameters are mandatory
        Eva.offOne = function(eventName, callback, context) {
            Backbone.Events.off.apply(this, [eventName, callback, context]);
            var callbacks = Eva.subscribers[context.cid][eventName];
            var index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
        }
        //unbind all callbacks of the given event of the given context
        //remove event name from the hash map
        //all parameters are mandatory
        Eva.offAllHandlers = function(context, eventName) {
            var subscriber = Eva.subscribers[context.cid];
            if (subscriber != undefined) {
                var callbacks = subscriber[eventName];
                for (var i = 0; i < callbacks.length; i++) {
                    Eva.offOne(eventName, callbacks[i], context);
                }
                delete subscriber[context.cid][eventName];
            }
        }
        //unbind all events the given context
        //remove subscriber from the hash map
        //all parameters are mandatory
        Eva.offAll = function(context) {
            var subscriber = Eva.subscribers[context.cid];
            if (subscriber != undefined) {
                for (var event in subscriber) {
                    var callbacks = subscriber[event];
                    for (var i = 0; i < callbacks.length; i++) {
                        Eva.offOne(event, callbacks[i], context);
                    }
                }
                delete subscriber[context.cid];
            }
        }
        // Make Eva available locally for easier debugging
        if(env.name === 'local') window.Eva = Eva;

        return Eva;
    }
);
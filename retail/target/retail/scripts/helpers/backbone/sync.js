define([
     'jquery'
    ,'underscore'
    ,'backbone'
    // Environment stats
    ,'config/env'
    ,'helpers/localStorageManager'
    ], function(
        $
        ,_
        ,Backbone
        ,env
        ,localStorageManager
    ) {
        Backbone._sync = Backbone.sync;
        document.addEventListener("resume", onResume, false);
        var isResume = false;
        function onResume() {
            isResume = true;
        }
        function sync(method, model, options, error) {
            if (model.url !== undefined || options.url !== undefined) {
                var username, password;
                if (model.isLogin) {
                    username = model.get("j_username");
                    password = model.get("j_password");
                    salesperson = model.get("j_salesperson") || username;
                } else {
                    username = localStorageManager.getItem("username");
                    password = localStorageManager.getItem("password");
                    salesperson = (localStorageManager.getItem("salesperson").length) ? localStorageManager.getItem("salesperson")[0] : username;
                }
                options = options || {};
                var url = options.url || model.url;
                if (_.isFunction(url)) {
                    url = options.url ? options.url() : model.url();
                }
                
                var urlParameters = [];
                if (username !== null && password !== null) {
                    urlParameters = urlParameters.concat([{'j_username': username}, {'j_password': password}, {'j_salesperson': salesperson}]);
                };
                if (options.lang) { urlParameters.push({'lang': options.lang}) };
                
                if (urlParameters.length) {
                    options.url = url + '?';
                    urlParameters.forEach(function(item, i) {
                        var key = Object.keys(item)[0];
                        var value = item[key];
                        
                        options.url += key + '=' + value + '&';
                    })
                }
                // remove trailing $ sign
                options.url = options.url.replace(/&+$/, "");
            }
            return Backbone._sync(method, model, options);
        }
        Backbone.sync = function(method, model, options, error) {
            if (isResume) {
                $.ajax({
                    url: env.getUrlFor('baseUrl'),
                    success: function() {
                        // Make Ajax request to server and compare with local state
                        sync(method, model, options, error);
                        isResume = false;
                    }
                });
                model.trigger('request');
            } else {
                sync(method, model, options, error);
            }
        };

        Backbone.Model.prototype.fetch = function(options) {
            options = options ? _.clone(options) : {};
            if (options.parse === void 0) options.parse = true;
            var model = this;
            var success = options.success;
            options.success = function(resp) {
                if (!model.set(model.parse(resp, options), options)) return false;
                if (success) success(model, resp, options);
                model.trigger('sync', model, resp, options);
                model.trigger('fetch', model, resp, options);
            };
            wrapError(this, options);
            return this.sync('read', this, options);
        };

        Backbone.Model.prototype.save = function(key, val, options) {
            var attrs, method, xhr, attributes = this.attributes;

            // Handle both `"key", value` and `{key: value}` -style arguments.
            if (key == null || typeof key === 'object') {
                attrs = key;
                options = val;
            } else {
                (attrs = {})[key] = val;
            }

            options = _.extend({validate: true}, options);

            // If we're not waiting and attributes exist, save acts as
            // `set(attr).save(null, opts)` with validation. Otherwise, check if
            // the model will be valid when the attributes, if any, are set.
            if (attrs && !options.wait) {
                if (!this.set(attrs, options)) return false;
            }
            else {
                if (!this._validate(attrs, options)) return false;
            }

            // Set temporary attributes if `{wait: true}`.
            if (attrs && options.wait) {
                this.attributes = _.extend({}, attributes, attrs);
            }

            // After a successful server-side save, the client is (optionally)
            // updated with the server-side state.
            if (options.parse === void 0)
            	options.parse = true;
            var model = this;
            var success = options.success;
            options.success = function(resp) {
                // Ensure attributes are restored during synchronous saves.
                model.attributes = attributes;
                var setModelSuccess = true;
                if (!resp || !resp.errors || resp.errors.length == 0) {
                    var serverAttrs = model.parse(resp, options);
                    if (options.wait) {
                    	serverAttrs = _.extend(attrs || {}, serverAttrs);
                    }
                	setModelSuccess = model.set(serverAttrs, options);
                    if (_.isObject(serverAttrs) && !setModelSuccess) {
                        return false;
                    }
                    if (success) {
                       success(model, resp, options);
                    }
                    model.trigger('sync', model, resp, options);
                }
                model.trigger('save', model, resp, options);
            };
            wrapError(this, options);

            method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
            if (method === 'patch') options.attrs = attrs;
            xhr = this.sync(method, this, options);

            // Restore attributes.
            if (attrs && options.wait) this.attributes = attributes;

            return xhr;
        };

        // Wrap an optional error callback with a fallback error event.
        var wrapError = function(model, options) {
            var error = options.error;
            options.error = function(resp) {
                if (error) error(model, resp, options);
                model.trigger('error', model, resp, options);
            };
        };
    }
);
define([
     'jquery'
    ,'underscore'
    ], function(
                $
                ,_
    ) {
       /* Reason for creating this manager was to abstract away adding/geting salespersons from array (LS doesn't support arrays) */
        var LocalStorageManager = function() {
            this._getSalespersonArray = function() {
                if (window.localStorage.getItem('salesperson')) {
                    var parsed = JSON.parse(localStorage['salesperson']);
                    if (Array.isArray(parsed)) {
                        return parsed;
                    } else {
                        return [];
                    }
                } else {
                    return [];
                }
            }
            this.setItem = function(key, value) {
                if (key === 'salesperson') {    
                    var salespersonArray = this._getSalespersonArray();
                    
                    var valueAlreadyStored = _.some(salespersonArray, function(c) {
                        return c == value; 
                    });
                    if (valueAlreadyStored) return;
                    
                    salespersonArray.unshift(value);
                    /* only 1 salesperson cached currently, because sync.js always loaded first from array (wrong) */
                    var trimmed = salespersonArray.slice(0, 1)
                    window.localStorage.setItem('salesperson', JSON.stringify(trimmed));
                } else {
                    window.localStorage.setItem (key, value);
                }
            }
            this.getItem = function(key) {
                if (key === 'salesperson') {
                    return this._getSalespersonArray();
                } else {
                    return window.localStorage.getItem(key);
                }
            }
            this.removeItem = function(key) {
                if (key === 'salesperson') {
                    window.localStorage.setItem('salesperson', JSON.stringify([]));
                } else {
                    window.localStorage.removeItem(key);
                }
            }
        }

       return new LocalStorageManager();
    }
);
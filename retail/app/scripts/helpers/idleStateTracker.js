/** Track periods of user inactivity while using App and perform actions after specified time outs **/
define([
     'jquery'
    ,'underscore'
    ,'helpers/localStorageManager'
    ], function(
        $
        ,_
        ,localStorageManager
    ) {
        var IdleStateTracker = {
            _idleTime: 0,
            _idleTimeLimit: 10,
            _idleTimeLimitReached: false,
            _idleTimeout: null,

            initialize: function() {
                var self = this;
                $(document).ready(function () {
                    self.start();

                    //Zero the idle timer on mouse movement.
                    $(this).mousemove(function (e) {
                        self._idleTime = 0;
                    });
                    $(this).keypress(function (e) {
                        self._idleTime = 0;
                    });
                });
            },
            getIdleTimeLimitReached: function() {
                return this._idleTimeLimitReached;
            },
            stop: function() {
                var self = this;
                clearTimeout(self._idleTimeout);
                 self.resetIdleTimeLimitReached();
            },
            start: function() {
                var self = this;
                function step() {
                    self._idleTime += 1;
                    if (self._idleTime >= self._idleTimeLimit) {
                        self._idleTimeLimitReached = true;
                    }
                    self._idleTimeout = setTimeout(step, 60000);
                }
                step();
            },
            // call this after new Credentials get saved to Local Storage
            resetIdleTimeLimitReached: function() {
                this._idleTimeLimitReached = false;
            }
        }
       return IdleStateTracker;
    }
);
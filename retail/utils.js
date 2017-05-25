// Get local external ip address
exports.getLocalIpAddress = function () {

    var
        // Local ip address that we're trying to calculate
        address
        // Provides a few basic operating-system related utility functions (built-in)
        ,os = require('os')
        // Network interfaces
        ,ifaces = os.networkInterfaces();


    // Iterate over interfaces ...
    for (var dev in ifaces) {

        // ... and find the one that matches the criteria
        var iface = ifaces[dev].filter(function(details) {
            return details.family === 'IPv4' && details.internal === false;
        });

        if(iface.length > 0) address = iface[0].address;
    }

    // Return the result
    return address;
};
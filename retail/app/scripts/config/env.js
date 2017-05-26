define([], function() {
    var env = {
        config: {
            
            
            // Production environment
            prod: {
                 desktopProtocol: "https"
                ,desktopBaseUrl: "admin.easyhome.ca"
                ,baseUrl: "https://admin.easyhome.ca"
                ,desktopRedirectionBustParameter: "referral=mobile"
                ,profile: "https://admin.easyhome.ca/api/customer"
                ,fullSearch: "https://admin.easyhome.ca/api/customer/fullsearch"
                ,credentials: "https://admin.easyhome.ca/retail/getCredentials"
                ,customerLogin: "https://admin.easyhome.ca/api/customer"
                ,checkPassword: "https://admin.easyhome.ca/api/customer/checkPassword"
                ,link: "https://admin.easyhome.ca/api/customer/link"
                ,customerSendResetEmail: "https://admin.easyhome.ca/api/customer/sendResetPasswordEmail"
                ,customerResetPassword: "https://admin.easyhome.ca/api/customer/resetPassword"
                ,managerLogin: "https://admin.easyhome.ca/api/manager/login"
                ,login: "https://admin.easyhome.ca/api/customer/login"
                ,tuAuth: "https://admin.easyhome.ca/api/tu/questions"
                ,timeTracker: "https://admin.easyhome.ca/api/customer/trackProfileStatistic"
                ,checkSuspiciousCustomer: "https://admin.easyhome.ca/api/customer/checkstolen"
                ,gaAccount: "UA-41454434-1"
            }
        }
        // Figure out which urlSet should be used with this application instance
        ,getUrlSet: function() {
            var
                 urlSet
                // Get environment name from a localStorage, where it should be set before app instantiation (_index.html)
                ,environment = window.localStorage.getItem('environment');

            // environment <-> urlSet mapping
            // switch(environment) {
            //     // Browser based environments
            //     // case "webDev": urlSet = "dev"; break;
            //     // case "webUat": urlSet = "uat"; break;
            //     case "webProd": urlSet = "prod"; break;
            //     // Application environments
            //     // case "appDev": urlSet = "dev"; break;
            //     // case "appUat": urlSet = "uat"; break;
            //     case "appProd": urlSet = "prod"; break;

            //     default: urlSet = "prod";
            //     //throw Error('environment property is not set in localStorage. Please check "~/app/_index.html" file');
            // }
            urlSet = "prod";
            return urlSet;
        }
        ,getUrlFor: function(key) {
            // Check if the requested url is available for that particular environment
            if(!this.config[this.urlSet].hasOwnProperty(key)) { throw('Unknown url requested: ' + key ); }
            return this.config[this.urlSet][key];
        }
        ,getBaseConfig: function() {
            return {
                 baseUrl: env.getUrlFor('baseUrl')
                ,desktopProtocol: env.getUrlFor('desktopProtocol')
                ,desktopBaseUrl: env.getUrlFor('desktopBaseUrl')
                ,desktopRedirectionBustParameter: env.getUrlFor('desktopRedirectionBustParameter')
            }
        }
        ,init: function() {
            this.urlSet = this.getUrlSet();
        }
    };
    // Initialize the module
    env.init();

    return env;
});
require.config({
     baseUrl: "scripts"
    ,paths: {
        /*
            Backbone MV library + plugins

            backbone.stickit is used for two way data binding between
            view and model. Typically is used to sync input value with
            the corresponding attribute in the model.

            backbone.subroute is used for managing complex routes and
            delegating responsibility for handling view management to
            a corresponding subrouter. This lets us to keep primary router neat.

            backbone-validation allows us to validate forms. Backbone team does not
            want to impose a particular way of handling validation, so they
            let this decision to be made by a developer. Backbone-validation provides
            a particular vision of how validation of the model should work, which suites us well.

            backbone-associations provides us with model to model relations
            (1-to-1, 1-to-many and many-to-many)
        */
         "backbone": "../vendors/backbone/backbone"
        ,"backbone.stickit": "../vendors/backbone.stickit/backbone.stickit"
        ,"backbone.subroute": "../vendors/backbone.subroute/backbone.subroute"
        ,"backbone-validation": "../vendors/backbone-validation/dist/backbone-validation-amd"
        ,"backbone-associations": "../vendors/backbone-associations/backbone-associations"
        /*
            Underscore is a primary dependency for Backbone,
            which carries a lot of utility methods and template engine
        */
        ,"underscore": "../vendors/underscore/underscore"
        /*
            RequireJS + Plugins

            RequireJS is an AMD library, which we use for
            it's primary purpose (writing modular javascript)

            requirejs-text is for async load of templates,
            that are returned as strings
        */
        ,"requirejs": "../vendors/requirejs/require"
        ,"requirejs-text": "../vendors/requirejs-text/text"
        ,"async": "../vendors/requirejs-plugins/src/async"
        /*
            jQuery + Plugins
            
            jQuery is also a primary dependency for Backbone
            and is used primarily as DOM interface

            jQueryMask is a plugin that helps incorporate a specific
            format into input field. As of now, we use it only for
            phone numbers entry.
        */
        ,"jquery": "../vendors/jquery/dist/jquery"
        
        ,"GAlocalStorage": "GALocalStorage-master/GALocalStorage"
        //,"jqueryMask": "../vendors/jQuery-Mask-Plugin/jquery.mask"
        ,"mask": "../vendors/vanilla-masker/src/vanilla-masker"
        /*
            Vanilla javascript plugins

            XRegExp is used for unicode support of an entry
            that we match against a particular regular expression.

            Fastclick removes 300ms delay between the touchstart event
            and the moment when 'click' event gets fired. Basically it allows
            us to use click event throughout the app without worring about
            it's behaviour on mobile devices
        */
        ,"xregexp": "../vendors/xregexp/xregexp-all"
        ,"fastclick": "../vendors/fastclick/lib/fastclick"
        ,"google-analytics": "helpers/ga" // this is your local copy
        ,"datepicker": "Zebra_Datepicker/public/javascript/zebra_datepicker.src"
        /*
            Other plugins that are currently available,
            but we don't need them at this point. If they stay commented out,
            then they won't be a part of the final optimized for distribution
            code base
        */
        
        // depend: "../vendors/requirejs-plugins/src/depend",
        // font: "../vendors/requirejs-plugins/src/font",
        // goog: "../vendors/requirejs-plugins/src/goog",
        // image: "../vendors/requirejs-plugins/src/image",
        // json: "../vendors/requirejs-plugins/src/json",
        // mdown: "../vendors/requirejs-plugins/src/mdown",
        // noext: "../vendors/requirejs-plugins/src/noext",
        // propertyParser: "../vendors/requirejs-plugins/src/propertyParser",
        // text: "../vendors/requirejs-plugins/lib/text",
    }
    ,shim: {
         jquery: {
             exports: "$"
        }
        ,underscore: {
             exports: "_"
        }
        // ,backbone: {
             // deps: [ "jquery", "underscore" ]
            // ,exports: "Backbone"
        // }
        // ,backboneStickit: {
             // deps: [ "backbone" ]
        // }
        // ,"backbone-associations": {
             // deps: [ "backbone" ]
        // }
        ,xregexp: {
             exports: "XRegExp"
        }
        ,app: {
            deps: [ "jquery", "underscore", "backbone", "requirejs-text" ]
        }
        ,"google-analytics":  {
            exports: "ga_storage"
        }
        ,"GAlocalStorage": {
            exports: "ga_storage"
        }
        ,"mask": {
            exports: "VanillaMasker"
        }
    }
    ,waitSeconds: 50000
    ,urlArgs: "bust=1391074803991"
});

require([
    // Load our app module and pass it to our definition function
    'app'
    ], function(App) {
        App.start(); // The 'app' dependency is passed in as "App"
    }
);
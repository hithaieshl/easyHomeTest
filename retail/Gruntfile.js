module.exports = function (grunt) {
    var
        pkg     = grunt.file.readJSON('package.json')
        // Import usefull utility methods
        ,utils  = require('./utils.js')
        // Load all grunt tasks
        ,tasks  = require('matchdep').filter('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        // Set environment specific properties
        env: {
            options: {
                 VERSION:           pkg.version
            }
            ,webDev: {
                 NODE_ENV:          'webDev'
            }
            ,webUat: {
                 NODE_ENV:          'webUat'
            }
            ,webProd: {
                 NODE_ENV:          'webProd'
            }
            ,appDev: {
                 NODE_ENV:          'appDev'
            }
            ,appUat: {
                 NODE_ENV:          'appUat'
            }
            ,appProd: {
                 NODE_ENV:          'appProd'
            }
        }
        // Generate index.html on the fly, based on environment settings
        ,preprocess: {
            source: {
                 src:               'app/_index.html'
                ,dest:              'app/index.html'
            }
            ,optimized: {
                 src:               'app/_index.html'
                ,dest:              'dist/webapp/index.html'
            }
        }
        // Clean target directories
        ,clean: {
             source:    [ /* Nothing to clean, since dev environment is using source directory to run */ ]
            ,optimized: [ 'dist/webapp/', 'build' ]
        }
        ,copy: {
             source:    [ /* Nothing to copy */ ]
            ,optimized: {
                files: [{ 
                     expand:    true
                    ,flatten:   true
                    ,src:       'app/images/*'
                    ,dest:      'dist/webapp/images'
                },{
                     expand:    true
                    ,flatten:   true
                    ,src:       'app/fonts/*'
                    ,dest:      'dist/webapp/fonts'
                }]
            }
        }
        // Compile all scripts and their dependencies into a single file using r.js
        ,requirejs: {
            source: {
                // 
            }
            ,optimized: {
                options: {
                     almond:            true
                    ,wrap:              true
                    ,findNestedDependencies: true
                    ,include:           [ 'config/main' ]
                    ,insertRequire:     [ 'config/main' ]
                    ,name:              '../vendors/almond/almond'
                    ,baseUrl:           'app/scripts'
                    ,mainConfigFile:    'app/scripts/config/main.js'
                    ,out:               'dist/webapp/scripts/package.js'
                }
            }
        }
        // Run predefined tasks whenever watched file patterns are added, changed or deleted
        ,watch: {
            scripts: {
                // Files to watch
                files: [ '/app/scripts/*.js' ]
                // Tasks to run on file change
                ,tasks: []
            }
            ,styles: {
                options: {
                    livereload: true
                }
                // Files to watch
                ,files: [ '**/*.less' ]
                // Tasks to run on file change
                ,tasks: [ 'less:source', 'autoprefixer:source' ]
            }
        }
        // Remotely debug mobile application built with phonegap
        ,weinre: {
            options: {
                 httpPort: 8080
                ,boundHost: utils.getLocalIpAddress()
                ,verbose: false
                ,debug: false
                ,readTimeout: 5
                ,deathTimeout: 15
            }
        }
        // Parse CSS and add vendor prefixes to CSS rules using values from the Can I Use.
        ,autoprefixer: {
            options: {
                browsers: [ "last 5 version", "> 1%", 'android 4' ]
            }
            ,source: {
                src: 'app/styles/package.css'
            }
            ,optimized: {
                src: 'dist/webapp/styles/package.css'
            }
        }
        // Compile LESS files to CSS
        ,less: {
            source: {
                options: {
                  paths: ['app/styles']
                }
                ,files: {
                  'app/styles/package.css': 'app/styles/package.less'
                }
            }
            ,optimized: {
                options: {
                   paths: ["app/styles/*"]
                  ,cleancss: true
                }
                ,files: {
                  'dist/webapp/styles/package.css': 'app/styles/package.less'
                }
            }
        }
        // Serve the files of the project on specified port and hostname
        ,connect: {
            options: {
                 port: 80
                ,hostname: 'localhost'
                ,middleware: function (connect) {
                    var mountFolder = function (connect, dir) {
                        return connect.static(require('path').resolve(dir));
                    };
                    var pushStateHook = function (url) {
                        var
                             path = require('path')
                            // Need to be added into package.json
                            ,request = require('request');
                        return function (req, res, next) {
                            var ext = path.extname(req.url);
                            if ((ext == "" || ext === ".html") && req.url != "/")
                              req.pipe(request(url)).pipe(res);
                            else next();
                        };
                    };
                    return [
                         pushStateHook("http://localhost")
                        ,mountFolder(connect, '.tmp')
                        ,mountFolder(connect, this.data.options.base)
                    ];
                }
            }
            ,dev: {
                options: {
                     base: 'app'
                    ,directory: 'app'
                }
            }
            ,uat: {
                options: {
                     base: 'dist/webapp'
                    ,directory: 'dist/webapp'
                }
            }
            ,prod: {
                options: {
                     base: 'dist/webapp'
                    ,directory: 'dist/webapp'
                }
            }
        }
        // Deploy apk files to ftp server
        ,sftp: {
             dev: {}
            ,uat: {
                files: {
                    './': 'build/platforms/android/bin/EasyOrders-release.apk'
                }
                ,options: {
                     path: ''
                    ,host: 's000959.mobicontrolcloud.com'
                    ,port: '22'
                    ,srcBasePath: 'build/platforms/android/bin/'
                    ,username: 'UAT_home'
                    ,password: 'D0lla7$'
                    ,createDirectories: true
                    ,directoryPermissions: parseInt(777, 8)
                    ,showProgress: true
                }
            }
            ,prod: {
                files: {
                    './': 'build/platforms/android/bin/EasyOrders-release.apk'
                }
                ,options: {
                     path: ''
                    ,host: 's000959.mobicontrolcloud.com'
                    ,port: '22'
                    ,srcBasePath: 'build/platforms/android/bin/'
                    ,username: 'cloud-sftp'
                    ,password: 'Ne6Aprax'
                    ,createDirectories: true
                    ,directoryPermissions: parseInt(777, 8)
                    ,showProgress: true
                }
            }
        }
        // Run shell commands through grunt
        ,shell: {
            // Copy an app to the device/emulator
            appInstall: {
                options: {}
                ,command: 'adb install build/platforms/android/bin/' + grunt.option("name") + '-release.apk'
            }
        }
        // Build and run hybrid applications with Apache Cordova (Phonegap)
        ,phonegap: {
            config: {
                 root: 'dist/webapp'
                ,cordova: 'phonegap'
                // Parse dynamic properties into config.xml template
                ,config: {
                     template: 'phonegap/config.xml'
                    ,data: {
                         id: 'com.phonegap.' + "<%= grunt.option(\"name\") %>"
                        ,version: pkg.version
                        ,name: "<%= grunt.option(\"name\") %>"
                    }
                }
                ,path: 'build'
                ,plugins: [
                    './phonegap/plugins/org.apache.cordova.inappbrowser'
                ]
                ,platforms: [ 'android' ]
                ,maxBuffer: 200
                ,verbose: true
                ,releases: 'dist'
                // Must be set for ios to work. Should return the app name.
                ,name: function() {
                    return grunt.option("name");
                }
                ,releaseName: function(){
                    return(grunt.option("name") + '-' + pkg.version);
                }
                // Android-only integer version to increase with each release.
                // See http://developer.android.com/tools/publishing/versioning.html
                ,versionCode: function(){ return(1) }
                ,key: {
                     store: 'android.keystore'
                    ,alias: 'easyhome'
                    ,aliasPassword: function(){
                      // Prompt, read an environment variable, or just embed as a string literal
                      return('easyhome');
                    }
                    ,storePassword: function() {
                      // Prompt, read an environment variable, or just embed as a string literal
                      return('easyhome');
                    }
                }
                ,icons: {
                    android: {
                         ldpi:  'phonegap/assets/icon-96-xhdpi.png'
                        ,mdpi:  'phonegap/assets/icon-96-xhdpi.png'
                        ,hdpi:  'phonegap/assets/icon-96-xhdpi.png'
                        ,xhdpi: 'phonegap/assets/icon-96-xhdpi.png'
                    }
                }
                ,screens: {
                    android: {
                         ldpi: 'phonegap/assets/screen-xhdpi-portrait.png'
                        ,ldpiLand: 'phonegap/assets/screen-xhdpi-landscape.png'
                        ,mdpi: 'phonegap/assets/screen-xhdpi-portrait.png'
                        ,mdpiLand: 'phonegap/assets/screen-xhdpi-landscape.png'
                        ,hdpi: 'phonegap/assets/screen-xhdpi-portrait.png'
                        ,hdpiLand: 'phonegap/assets/screen-xhdpi-landscape.png'
                        ,xhdpi: 'phonegap/assets/screen-xhdpi-portrait.png'
                        ,xhdpiLand: 'phonegap/assets/screen-xhdpi-landscape.png'
                    }
                }
            }
        }
        ,version: {
            major: {
                options: {
                    release: 'major'
                    ,pkg: 'package.json'
                }
                ,src: [ 'package.json', 'bower.json', 'phonegap/config.json' ]
            }
            ,minor: {
                options: {
                    release: 'minor'
                    ,pkg: 'package.json'
                }
                ,src: [ 'package.json', 'bower.json', 'phonegap/config.json' ]
            }
            ,patch: {
                options: {
                    release: 'patch'
                    ,pkg: 'package.json'
                }
                ,src: [ 'package.json', 'bower.json', 'phonegap/config.json' ]
            }
        }
    });

    // taskSet :: for building application source files
        /*
            Build source files

            TBW...
        */
        grunt.registerTask('set_config', 'Set a global variable.', function(name, val) {
            global[name] = val;
            grunt.option(name, global.name);
        });
        grunt.registerTask('build:source', [
            // Clean the target directory
            'clean:source'
            // Copy files within specified directory into target directory
            ,'copy:source'
            // Compile source less files and copy package.css to the target directory
            ,'less:source'
            // Process final css file by adding vendor prefixes
            ,'autoprefixer:source'
            // Compile an index.html file for development and put it into the target directory
            ,'preprocess:source'
            // Increment a 0.0.x version of the app, throughout all config files
            ,'version:patch'
        ]);

        /*
            Build and optimize source files

            Builds web application's assets for these to become suitable for distribution.
            Basically we squeeze down all of the javascript files with templates
            into a single file called package.js.
            The very same thing happens to less files,
            they end up being a part of the one and only package.css file.
            We also smartly process the index.html file for it to include dependencies
            based on new environment and copy everything we've generated to the target directory.
        */
        grunt.registerTask('build:optimized', [
            // Clean the target directory
            'clean:optimized'
            // Copy files within specified directory into target directory
            ,'copy:optimized'
            // Compile source less files and copy package.css to the target directory
            ,'less:optimized'
            // Process final css file by adding vendor prefixes
            ,'autoprefixer:optimized'
            // Compile an index.html file for development and put it into the target directory
            ,'preprocess:optimized'
            // Fetch all dependencies and uglify everything into a single package.js file
            ,'requirejs:optimized'
            // Increment a 0.0.x version of the app, throughout all config files
            ,'version:patch'
        ]);
    // end of taskSet


    // taskSet :: for building web based version of the app

        // Build a development version
        grunt.registerTask('build:web:dev', [
            // Set environment that will define a urlSet (env.js)
            'env:webDev'
            // Build source files
            ,'build:source'
        ]);

        // Build a UAT version
        grunt.registerTask('build:web:uat', [
            // Set environment that will define a urlSet (env.js)
            'env:webUat'
            // Build and optimize source files
            ,'build:optimized'
        ]);

        // Build a Prod version
        grunt.registerTask('build:web:prod', [
            // Set environment that will define a urlSet (env.js)
            'env:webProd'
            // Build and optimize source files
            ,'build:optimized'
        ]);
    // end of taskSet

    // taskSet :: for running web based version of the app

        // Build a development version
        grunt.registerTask('run:web:dev', [
            // Build a development version of static resources
            'build:web:dev'
            // Start a local webserver
            ,'connect:dev'
            // Watch target directory and perform specified tasks, whenever file changes
            ,'watch'
        ]);

        // Build a UAT version
        grunt.registerTask('run:web:uat', [
            // Build a UAT version of static resources
            'build:web:uat'
            // Start a local webserver
            ,'connect:uat'
            // Watch target directory and perform specified tasks, whenever file changes
            ,'watch'
        ]);

        // Build a Prod version
        grunt.registerTask('run:web:prod', [
            // Build a PROD version of static resources
            'build:web:prod'
            // Start a local webserver
            ,'connect:prod'
            // Watch target directory and perform specified tasks, whenever file changes
            ,'watch'
        ]);
    // end of taskSet

    // taskSet :: for running android application

        /*
            Build application
            (don't run directly, use build:app:*env instead)
        */
        grunt.registerTask('build:app', [
            // Build phonegap app
            'phonegap:build'
            // Build an apk file
            ,'phonegap:release'
        ]);

        /*
            Run an application.
            If device lookup will be unsuccessful,
            then the app will be copied onto Android virtual machine
            and launched automatically. For this virtual machine should
            be configured through android virtual device manager (avd)
        */
        grunt.registerTask('run:app', [
            // Copy an app to a device/emulator
            'phonegap:run'
        ]);
        
        // Build dev version of the app signed with DEBUG certificate
        grunt.registerTask('build:app:dev', [
            'set_config:name:easyOrdersDev'
            // Set environment that will define a urlSet (env.js)
            ,'env:appDev'
            // Build source files
            ,'build:optimized'
            // Build, copy and run the app to the device
            ,'build:app'
        ]);

        // Build uat version of the app signed with legitimate easyhome certificate
        grunt.registerTask('build:app:uat', [
            'set_config:name:easyOrdersUAT'
            // Set environment that will define a urlSet (env.js)
            ,'env:appUat'
            // Build and optimize source files
            ,'build:optimized'
            // Build, copy and run the app to the device
            ,'build:app'
        ]);

        // Build prod version of the app signed with legitimate easyhome certificate
        grunt.registerTask('build:app:prod', [
            'set_config:name:easyOrders'
            // Set environment that will define a urlSet (env.js)
            ,'env:appProd'
            // Build and optimize source files
            ,'build:optimized'
            // Build, copy and run the app to the device
            ,'build:app'
        ]);
    // end of taskSet


    // taskSet :: for application deployment

        // Deploy an apk file to User Acceptance Testing environment
        grunt.registerTask('deploy:app:uat', [
            'sftp:uat'
        ]);

        // Deploy an apk file to production
        grunt.registerTask('deploy:app:prod', [
            'sftp:prod'
        ]);
    // end of taskSet

    
};
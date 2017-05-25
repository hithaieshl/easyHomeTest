// This is a file copied by your subgenerator.
define([
    // Primary dependencies
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Template
    ,'requirejs-text!modules/auth.tu/templates/question.html'

    // Backbone extension for two way data-binding (View<->Model)
    ,'backbone.stickit'

    // Backbone extension for client-side validation
    ,'backbone-validation'

    ], function(
                $
                ,_
                ,Backbone
                ,Eva
                ,QuestionTemplate
    ) {
        var QuestionView = Backbone.View.extend({
             className: 'question fieldset column'
            ,events: {}
            ,bindings: {
                '[name=answer]':        {
                     observe: 'answer'
                    // Generate answers out ...
                    ,selectOptions: {
                        collection: function() {
                            return this.model.get('choices');
                        }
                        ,defaultOption: {
                             label: ''
                            ,value: null
                        }
                    }
                }
            }
            ,initialize: function(options) {
                this.lang = options.lang;
                var defaultOptionTxt = (options.lang == 'fr') ? 'Veuillez sélectionner votre réponse' : 'Please select your answer';
                this.bindings['[name=answer]'].selectOptions.defaultOption.label = defaultOptionTxt;
                this.render();
            }
            ,render: function() {
                this.template = _.template(QuestionTemplate, $.merge(this.model.toJSON(), {lang: this.lang}));
                // Render the template
                this.$el.html(this.template);
                // Set validate true for all form elements
                Backbone.Stickit.addHandler({
                     selector: 'select'
                    ,setOptions: {
                        validate: true
                    }
                });
                // Initialize two-way data binding (view <-> model) based on view.bindings map
                this.stickit();
                // Apply validation for this view
                Backbone.Validation.bind(this);
                // Return the viewObj onRender to enable chain call
                return this;
            }
        });

        return QuestionView;
    }
);
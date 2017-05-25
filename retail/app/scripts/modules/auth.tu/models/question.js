define([
    // Primary dependency
    'jquery'
    ,'underscore'
    ,'backbone'

    // Environment stats
    ,'config/env'

    // 1-1, 1-many, many-1 model relations
    ,'backbone-associations'

], function(
            $
            ,_
            ,Backbone
            ,env
) {
    var QuestionModel = Backbone.AssociatedModel.extend({
        validation: {
            'answer': {
                required: true
            }
        }
    });

    return QuestionModel;
});
define([
    // Primary dependency
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'events'

    // Environment stats
    ,'config/env'

    ,'modules/auth.tu/models/question'

], function(
            $
            ,_
            ,Backbone
            ,Eva
            ,env
            ,QuestionModel
) {
    var Questions = Backbone.Collection.extend({
        model: QuestionModel
    });

    return Questions;
});
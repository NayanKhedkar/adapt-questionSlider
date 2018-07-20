define([
    'core/js/adapt',
    './questionSliderView',
    './questionSliderModel'
], function(Adapt, QuestionSliderView, QuestionSliderModel) {

    return Adapt.register("questionSlider", {
        view: QuestionSliderView,
        model: QuestionSliderModel
    });

});

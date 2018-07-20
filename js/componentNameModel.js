define([
    'core/js/models/questionModel'
], function(QuestionModel) {

    var QuestionSliderModel = QuestionModel.extend({

        /**
         * Used to restore the user's answers when revisiting the page or course
         */
        restoreUserAnswers: function() {
            if (!this.get("_isSubmitted")) {
                return;
            }

            // The user answer is retrieved here
            // This value can then be used to set individual answers on items
            var userAnswer = this.get("_userAnswer");
            this.updateSubItemState(userAnswer);
            this.setQuestionAsSubmitted();
            this.markQuestion();
            this.setScore();
            this.setupFeedback();
        },

        updateSubItemState: function(userAnswer) {
            var items = this.get('_items');
            _.each(items, function(item, index) {
                _.each(item._subItems, function(subItem, subIndex) {
                    subItem._selectedAnswer = userAnswer.pop() === 1 ? 'true' : 'false';
                }, this);
            }, this);

        },

        /**
         * Used to check if the user is allowed to submit the question
         * @returns {boolean}
         */
        canSubmit: function() {
            var items = this.get('_items');
            var selected = [];
            _.each(items, function(item, index) {
                selected.push(_.every(item._subItems, function(subItem) {
                    return subItem._isSelected;
                }));
            }, this);
            var completedSlide = _.without(selected, false);
            return completedSlide.length !== 0 && completedSlide.length == items.length;
        },

        /**
         * This evaluates the user's answer and stores the value
         * This value can then be used later on e.g. by the view to show the user's answer
         */
        storeUserAnswer: function() {
            // Expand on this to retrieve the user's answer as a single value
            this.set("_userAnswer", this.getSelectedAnswer());
        },

        getSelectedAnswer: function() {
            var items = this.get('_items');
            var selectedAnswer = [];
            _.each(items, function(item, index) {
                _.each(item._subItems, function(subItem) {
                    selectedAnswer.push(subItem._selectedAnswer === 'true' ? 1 : 0);
                }, this);
            }, this);
            return selectedAnswer;
        },

        /**
         * Used to establish if the question is correct or not
         * @returns {boolean}
         */
        isCorrect: function() {

        },

        /**
         * Used to set the score based upon the _questionWeight
         */
        setScore: function() {
            // You may wish to expand on the following
            var questionWeight = this.get('_questionWeight');
            var score = this.get('_isCorrect') ? questionWeight : 0;
            this.set('_score', score);
        },

        /**
         * Used by the question to determine if the question is incorrect or partly correct
         * @returns {boolean}
         */
        isPartlyCorrect: function() {},

        /**
         * Resets the stored user answer
         */
        resetUserAnswer: function() {},
    });

    return QuestionSliderModel;

});

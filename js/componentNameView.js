define([
    'core/js/views/questionView'
], function(QuestionView) {

    var QuestionSliderView = QuestionView.extend({

        events: {
            'click .next': 'onNextClick',
            'click .previous': 'onPreviousClick',
            'click .progress': 'onProgressClick',
            'change .question-slide input': 'onItemSelected'
        },

        onNextClick: function(event) {
            if ((this._activeIndex + 1) >= this.itemCount) {
                return;
            }
            if (this.isLocked(this._activeIndex)) return;
            this._activeIndex++;
            this.moveSlide();
            this.lockedStep();
        },

        onPreviousClick: function(event) {
            if ((this._activeIndex - 1) < 0) {
                return;
            }
            this._activeIndex--;
            this.moveSlide();
        },

        isLocked:function(index){
          return !this.$('[data-slideindex='+index+']').find('.question-slide').hasClass('completed');
        },

        onProgressClick: function(event) {
            var index = $(event.currentTarget).attr('data-index');
            if(this._activeIndex <= +index){
                if (this.isLocked(this._activeIndex)) return;
            }
            this._activeIndex = parseInt(index);
            this.moveSlide();
        },

        onItemSelected: function(event) {
            var $slide =this.$(event.currentTarget).closest('.slide-item');
            var curId = this.$(event.currentTarget).closest('.sub-item-row').data('rbtnid');
            var index =+$slide.data('slideindex');
            this.model.get('_items')[index]._subItems[curId]._isSelected = true;
            this.model.get('_items')[index]._subItems[curId]._selectedAnswer = event.currentTarget.value;
            this.model.get('_items')[index]._subItems[curId]._selectedId = +event.currentTarget.dataset.inputid;
            if(this.checkIfAllOptionsSelected(index)){
                $slide.find('.question-slide').addClass('completed');
                this.unLockedStep();
            }
        },

        checkIfAllOptionsSelected: function(curSlideIndex) {
            var subItem = this.model.get('_items')[curSlideIndex]._subItems;
            return _.every(subItem, function(item) {
                return item._isSelected;
            });
        },

        moveSlide: function() {
            var offset = 100 / this.itemCount * this._activeIndex * -1;
            var value = 'translateX(' + offset + '%)';

            this.prefixHelper(this.imageSliderElm, 'Transform', value);
            this.prefixHelper(this.titleSliderElm, 'Transform', value);
            this.imageSliderElm.style.transform = value;
            this.titleSliderElm.style.transform = value;
            this.controllButtons();
            this.controllIndicators();
        },

        controllButtons: function() {
            var showPrevBtn = true;
            var showNextBtn = true;

            if (this._activeIndex === 0) {
                showPrevBtn = false;
            }
            if (this._activeIndex >= (this.itemCount - 1)) {
                showNextBtn = false;
            }

            this.$el.toggleClass('show-next', showNextBtn);
            this.$el.toggleClass('show-prev', showPrevBtn);
        },

        controllIndicators: function() {
            this.$('.indicator').find('.progress').removeClass('selected');
            this.$('.indicator').find('[data-index="' + this._activeIndex + '"]').addClass('selected');
        },
        lockedStep: function() {
            if (this.model.get('_isLockedStep')) {
                this.$('.slider-button.next').addClass('lockedStep');
            }
        },

        unLockedStep: function() {
            var $nextBtn = this.$('.slider-button.next');
            if ($nextBtn.hasClass('lockedStep')) {
                $nextBtn.removeClass('lockedStep');
            }
        },

        prefixHelper: function(elm, prop, val) {
            elm.style["webkit" + prop] = val;
            elm.style["moz" + prop] = val;
            elm.style["ms" + prop] = val;
            elm.style["o" + prop] = val;
        },

        /**
         * Used to disable the question during submit and complete stages
         */
        disableQuestion: function() {
            this.$('.questionSlider input').attr('disabled', true);
        },

        /**
         * Used to enable the question during submit and complete stages
         */
        enableQuestion: function() {},

        /**
         * Used to reset the question when revisiting the component
         * @param {string} [type] - the type of reset e.g. hard/soft
         */
        resetQuestionOnRevisit: function(type) {},

        setAllItemsEnabled: function(isEnabled) {

        },

        /**
         * Used by question components instead of preRender
         */
        setupQuestion: function() {
            this.registerPartialHelper();
            this._activeIndex = 0;

            this.itemCount = this.model.get('_items').length;
            this.model.set('_totalWidth', 100 * this.itemCount);
            this.model.set('_itemWidth', 100 / this.itemCount);
        },

        /**
         * Used by question components instead of postRender
         */

        onQuestionRendered: function() {
            this.imageSliderElm = this.$('.questionSlider')[0];
            this.titleSliderElm = this.$('.title-slider')[0];
            this.controllButtons();
            this.controllIndicators();
            this.lockedStep();
            this.moveSlide();
            this.setReadyStatus();
        },

        /**
         * Called when the user clicks submit and this.model.canSubmit() returns false
         * Not necessary but you
         */
        onCannotSubmit: function() {},

        /**
         * This is important and should give the user visual feedback on how they answered the question
         * Normally done through ticks and crosses by adding classes
         */
        showMarking: function() {},

        /**
         * Resets the look and feel of the component
         * This could also include resetting item data
         * This is triggered when the reset button is clicked so it shouldn't be a full reset
         */
        resetQuestion: function() {},

        /**
         * Displays the correct answer to the user
         */
        showCorrectAnswer: function() {},

        /**
         * Displays the user's answer and hides the correct answer
         * Should use the values stored in this.storeUserAnswer
         */
        hideCorrectAnswer: function() {},

        registerPartialHelper:function(){
           //User these partials as {{>header}} anywhere in the templates
            var template = Handlebars.templates["questionSlide"];
            //var template='<h2>{{first_name}} {{last_name}}</h2><div class="phone">{{phone}}</div><div class="email"><a href="mailto:{{email}}">{{email}}</a></div><div class="since">User since {{member_since}}</div></div>';
            Handlebars.registerPartial('slide', template);
        },
        /**
         * Used by adapt-contrib-spoor to get the user's answers in the format
         * required by the cmi.interactions.n.student_response data field
         * @returns {string} a string representation of the user's answer
         */
        getResponse: function() {},

        /**
         * Used by adapt-contrib-spoor to get the type of this question in the
         * format required by the cmi.interactions.n.type data field.
         * Please note the answer will not store correctly unless this function returns a valid string
         * @returns {string} one of the following: choice, matching, numeric, fill-in
         */
        getResponseType: function() {}

    });

    return QuestionSliderView;

});

(function ($) {

  /**
   * Globals
   */
  var D = document;
  var W = window;
  var B = D.getElementsByTagName('BODY')[0];
  var $m = $('#main');
  var slideAttr = 'data-slide';
  var transitionEnd = 'webkitTransitionEnd otransitionend' +
    'oTransitionEnd msTransitionEnd transitionend';

  /**
   * Main slide init
   */
  this.Slideshow = function () {
    var self = this;

    self.slide = 0;
    self.$slides = $('div[' + slideAttr + ']');
    self.changingSlide = false;
    self.slideRefs = {};
    // self.slidePositions = {};
    // self.slideRotations = {};

    self.$slides.each(function () {
      var $s = $(this);
      var sNum = $s.attr(slideAttr);
      var newRotation;
      var newTransRotate;

      // Init the slide data object
      self.slideRefs[sNum] = {};

      if (sNum === '0') { // Intro (first) slide, just set everything to 0
        self.slideRefs[sNum].position = [0, 0];
        self.slideRefs[sNum].rotation = 0;
      } else { // Any slide except the first
        // self.slidePositions[sNum] = [
        //   $s.css('left').replace("px", ""),
        //   $s.css('top').replace("px", "")
        // ];
        self.slideRefs[sNum].position = [
          $s.offset().left,
          $s.offset().top - 100
        ];
        newRotation = $s.attr('data-rotate');
        self.slideRefs[sNum].rotation = parseInt(newRotation);

        newTransRotate = 'rotate(' + newRotation + 'deg)';
        $s.css({
          msTransform: newTransRotate,
          webkitTransform: newTransRotate,
          transform: newTransRotate
        })
      }
    });
  };

  /**
   * Next slide
   * @method next
   */
  Slideshow.prototype.next = function () {
    var self = this;

    // Don't go above number of slides
    if (self.slide < (self.$slides.length - 1)) {
      self.changeSlide(self.slide + 1);
    } else {
      return false;
    }
  };

  /**
   * Previous slide
   * @method prev
   */
  Slideshow.prototype.prev = function () {
    var self = this;

    // Don't go below slide 0
    if (self.slide > 0) {
      self.changeSlide(self.slide - 1);
    } else {
      return false;
    }
  };

  /**
   * Jump to an arbitrary slide
   * @method changeSlide
   * @param  {Int, String}    newSlide - Slide reference to jump to
   */
  Slideshow.prototype.changeSlide = function (newSlide) {
    var self = this;
    var slidePos;
    var slideRot;
    var newTranslate;
    var newWindowRotate;

    // Only change if not currently changing & if slide is valid
    if (!self.changingSlide && self.slideRefs.hasOwnProperty(newSlide.toString())) {
      self.slide = parseInt(newSlide);
      self.changingSlide = true;

      // When transition complete, reset changingSlide
      $m.one(transitionEnd, function () {
        self.changingSlide = false;
      });

      slidePos = self.slideRefs[newSlide].position;
      slideRot = self.slideRefs[newSlide].rotation;

      newTranslate = 'translate(-' + slidePos[0] + 'px, -' + slidePos[1] + 'px)';

      $m.css({
        msTransform: newTranslate,
        webkitTransform: newTranslate,
        transform: newTranslate
      });

      // Calculate the new HTML rotation
      if (slideRot < 0) {
        // Negative rotation
        slideRot -= 3;
      } else if (slideRot > 0) {
        // Positive rotation
        slideRot += 3;
      }

      newWindowRotate = 'rotate(' + (slideRot * -1) + 'deg)';

      $(B).css({
        msTransform: newWindowRotate,
        webkitTransform: newWindowRotate,
        transform: newWindowRotate
      });
    } else {
      return false;
    }
  };

  /**
   * Return a slide with the given ref, or the currently active ref
   * @method getSlide
   * @param  {Int, String}    ref - The slide ref to retieve
   */
  Slideshow.prototype.getSlide = function (ref) {
    var self = this;
    var ref = ref || self.slide;

    return $('div[' + slideAttr + '=' + ref + ']');
  };

  /**
   * Extract the transform rotation from an element
   * @method getRotationDegrees
   * @param  {Object}         obj - jQuery selector object
   */
  function getRotationDegrees(obj) {
    var values;
    var a;
    var b;
    var angle;
    var matrix = obj.css("-webkit-transform") ||
      obj.css("-moz-transform") ||
      obj.css("-ms-transform") ||
      obj.css("-o-transform") ||
      obj.css("transform");

    if (matrix !== 'none') {
      values = matrix.split('(')[1].split(')')[0].split(',');
      a = values[0];
      b = values[1];
      angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    } else {
      angle = 0;
    }
    return (angle < 0) ? angle += 360 : angle;
  }

})(jQuery);


/**
 * Document ready
 */
$(document).ready(function () {

  // Init slideshow
  var slideshow = new Slideshow();

  // Keypress filters / handlers
  var pressed = {
    next: function (keycode) {
      // Spacebar, enter, left arrow
      return [32, 13, 39].indexOf(parseInt(keycode)) > -1;
    },
    prev: function (keycode) {
      // Right arrow
      return [37].indexOf(parseInt(keycode)) > -1;
    }
  };

  // Keypress event listener
  $(document).keydown(function (e) {
    if (pressed.next(e.which)) {
      slideshow.next();
    } else if (pressed.prev(e.which)) {
      slideshow.prev();
    }
  });

});

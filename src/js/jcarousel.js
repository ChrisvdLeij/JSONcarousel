/* jCarousel: code by Chris van der Leij */

// selfId invoking function
(function ($) {
    "use scrict";

    $.fn.jCarousel = function (options) {

        // settings for the slider
        var settings = $.extend({
            jsonUrl: null,
            itemMargin: 0,
            animationSpeed: 300,
            autoPlay: false,
            intervalSpeed: 4000
        }, options);

        // iterate over the plugin object(s)
        return this.each(function () {

            // save the id of the plugin selector
            var selfId = '#' + this.id;

            // add class for styling of the slider
            $(selfId).addClass('j-carousel');

            // if jsonUrl and jsonObj are both filled, show error msg
            if (settings.jsonObj && settings.jsonUrl) {
                $(selfId).html('Please choose for a jsonObj or a jsonUrl');

            } // check if JSON url is filled and process the data
            else if (settings.jsonUrl) {
                $.getJSON(settings.jsonUrl)
                    .done(function (data) {
                        // pass the JSON data to the renderJsonSlide function
                        renderJsonSlides(data);
                    })
                    // Show an error msg when the JSON fails and output the error in the console
                    .fail(function (jqxhr, textStatus, error) {
                        $(selfId).html('Failed to load the JSON url');
                        console.log(jqxhr, textStatus, error);
                    });
            } // check if JSON object is filled and process the data
            else if (settings.jsonObj) {
                // pass the JSON data to the renderJsonSlide function
                renderJsonSlides(settings.jsonObj);
            } else {
                // show an error msg wgen the jsonUrl is empty
                $(selfId).html('Please pass a jsonUrl or jsonObj to the plugin');
            }

            // Render the HTML in the given ID
            function renderJsonSlides(jsonData) {

                // loop over the data and add each slide (li) to given ID
                var slides = "";
                $.each(jsonData, function () {
                    slides += '<li>' +
                        '<a href="' + this.link + '">' +
                        '<img src="' + this.enclosure._url + '"> ' +
                        '<div class="content">' +
                        '<h1>' + this.title + '</h1>' +
                        '<div class="description">' +
                        this.description +
                        '</div>' +
                        '</div>' +
                        '</a>' +
                        '</li>';
                });

                $(selfId).html('<ul>' + slides + '</ul>');

                // set off the slider when the static slides are placed in the slider
                initSlider();
            }

            function initSlider() {
                centerFirstSlide();
                positionSlides();

                // re-position the slides on window resize for responsiveness
                $(window).on('resize', function () {
                    positionSlides();
                });

                renderControls();
                bindEvents();
                // autoPlay();
            }

            function centerFirstSlide() {
                // find the amount of slides
                var slideCount = $(selfId).find('ul li').length;

                // get the half of the slideCount and prepend the half before the first slide
                var halfSlideCount = (slideCount / 2) - 1;
                for (var i = 0; i < halfSlideCount; i++) {
                    // i + 1 because CSS nth-last-of-type selector starts with 1 instead of 0
                    $(selfId + ' ul li:nth-last-of-type(' + (i + 1) + ')').prependTo(selfId + ' ul');
                }

                setActiveSlide();
            }

            function positionSlides() {
                var sliderWrapperWidth = $(selfId).width();
                var slideCount = $(selfId).find('ul li').length;
                var slideWidth = $(selfId).find('ul li').width();
                var slideHeight = $(selfId).find('ul li').outerHeight(true);
                var slideMargin = settings.itemMargin;
                var slideWidthMargin = slideWidth + (slideMargin * 2);
                var sliderUlWidth = slideCount * slideWidthMargin;

                // set the height of the slider depending on a slide
                $(selfId).css("height", slideHeight);

                // set the slide margin
                $(selfId).find('ul li').css({
                    marginLeft: slideMargin,
                    marginRight: slideMargin
                });

                var centerSlides;

                // check if the slides are even
                var evenSlideCount = (slideCount % 2 === 0);
                if (evenSlideCount) {

                    // If the slides are even, calculate the half of the slides total minus the slider wrapper and
                    // minus one slide (because of the uneven number)
                    centerSlides = (sliderUlWidth / 2) - (sliderWrapperWidth / 2) - (slideWidthMargin / 2);
                } else {

                    // calculate the half of the slides total minus the slider wrapper
                    centerSlides = (sliderUlWidth / 2) - (sliderWrapperWidth / 2);
                }

                // Align the slides
                $(selfId).find('ul').css({
                    width: sliderUlWidth,
                    marginLeft: -centerSlides
                });
            }

            function renderControls() {
                $(selfId).append('<button class="btn-prev"> < </button>' +
                    '<button class="btn-next"> > </button>');
            }

            // bindEvents in a separate function for a better overview
            function bindEvents() {
                $(selfId).find('.btn-next').on('click', function () {
                    nextSlide();
                });

                $(selfId).find('.btn-prev').on('click', function () {
                    prevSlide();
                });

                $(selfId).keydown(function (e) {
                    // left arrow key
                    if (e.keyCode == 37) {
                        prevSlide();
                    } // right arrow key
                    else if (e.keyCode == 39) {
                        nextSlide();
                    }
                });

                if (settings.autoPlay) {
                    autoPlay();

                    $(selfId).on({
                        mouseenter: function () {
                            stopAutoPlay();
                        },
                        mouseleave: function () {
                            autoPlay();
                        }
                    });
                }
            }

            function autoPlay() {
                // set an interval on the selector plugin. Bind data for clearing later on.
                $(selfId).data('timer', setInterval(function () {
                    // only excecute function when the document is active
                    if (document.hasFocus()) {
                        nextSlide();
                    }
                }, settings.intervalSpeed));
            }

            function stopAutoPlay() {
                // stop the interval
                clearInterval($(selfId).data('timer'));
            }

            function prevSlide() {
                var slideWidthMargin = $(selfId).find('ul li').outerWidth(true);
                $(selfId).find('ul').animate({
                    left: +slideWidthMargin
                }, settings.animationSpeed, function () {

                    // prepend the last slide as first when the animation is done
                    $(selfId + ' ul li:last-child').prependTo(selfId + ' ul');
                    $(selfId).find('ul').css('left', '');
                    setActiveSlide();
                });
            }

            function nextSlide() {
                var slideWidthMargin = $(selfId).find('ul li').outerWidth(true);
                $(selfId).find('ul').animate({
                    left: -slideWidthMargin
                }, settings.animationSpeed, function () {

                    // append the last slide as first when the animation is done
                    $(selfId).find('ul li:first-child').appendTo(selfId + ' ul');
                    $(selfId).find('ul').css('left', '');
                    setActiveSlide();
                });
            }

            function setActiveSlide() {
                $(selfId).find('ul li').removeClass('active');
                var slideCount = $(selfId).find('ul li').length;

                // determine the middle slide and round it up
                var middleSlide = Math.round(slideCount / 2);

                // add active class the the middle slide
                $(selfId).find('ul li:nth-child(' + middleSlide + ')').addClass('active');
            }
        });
    };
}(jQuery));

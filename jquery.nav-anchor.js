;(function(){

    function scrollToEvent(base) {
        return function(e) {
            e.preventDefault();

            var $this = $(this); // Anchor el
            var href = $this.attr('href');
            var $name = $('a[name="' + href.substring(1) + '"]');

            if ( $(href).length ){

                // onSlide callback
                if ( base.options.onSlide && typeof( base.options.onSlide ) === 'function' ) {
                    base.options.onSlide( base );
                };

                // End onSlide callback
                base.$el.animate({
                    scrollTop: $(href).offset().top + base.options.offsetTop
                }, base.options.speed, base.options.easing);

            } else if ( $name.length ){

                // onSlide callback
                if ( base.options.onSlide && typeof( base.options.onSlide ) === 'function' ) {
                    base.options.onSlide( base );
                };

                // End onSlide callback
                base.$el.animate({
                    scrollTop: $name.offset().top + base.options.offsetTop
                }, base.options.speed, base.options.easing);

            }
        }
    }

    function scrollScope(base) {
        base.$el.find('.active').removeClass('active');
        var $anchorList = base.$el.find('.scrollto');
            index = 0,
            judge = true;
        var top = $(window).scrollTop();
        $anchorList.each(function(i) {
            if ($(this).offset().top + base.options.offsetTop - base.options.offsetCompatible > top && judge) {
                index = i - 1;
                judge = false;
            }
        });
        if (index < 0) {
            index = 0;
        }
        if (judge && $anchorList.length) {
            index = $anchorList.length - 1;
        }
        base.$el.find('a[href^="#"]').eq(index).addClass('active');
    }

    $.navAnchor = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        var htmlEl = document.getElementsByTagName('html');
        var bodyEl = document.body;
        // If the user selects body, make sure to use 'html, body' for
        // cross browser compatibility reasons
        base.el  = el;
        base.$el = (el === htmlEl || el === bodyEl) ? $('html, body') : $(el);
        base.$el.data('navAnchor', base); // Add a reverse reference to the DOM object

        function _constructor() {
            // Check for navAnchor disable
            if (options === false) {
                base.$el.find('a[href^="#"]').off('click.navAnchor');
                return;
            };

            // Extend options with user preferences
            base.options = $.extend({}, $.navAnchor.defaults, options);

            // onInit callback
            if ( base.options.onInit && typeof( base.options.onInit ) === 'function' ) {
                base.options.onInit( base );
            };
            // End onInit callback

            if (!base.options.performance) {
                base.$el.on('click', 'a[href^="#"]', scrollToEvent(base));
            } else {
                base.$el.find('a[href^="#"]').on('click.navAnchor', scrollToEvent(base));
            }

            if (base.options.active) {
                scrollScope(base);
                $(window).scroll(function() {
                    scrollScope(base);
                });
            }

            if (location.hash && base.options.anchor) {
                var top = base.$el.find(location.hash).offset().top;
                setTimeout(function() {
                    base.$el.scrollTop(top + base.options.offsetTop);
                }, 20);
            }
        }; // _constructor

        // Run initializer
        _constructor();
    };

    $.navAnchor.defaults = {
        easing: 'swing',   // String: Anything other than "swing" or "linear" requires the easing.js plugin
        offsetTop: 0,      // Int: Top offset for anchor scrollto position. Can be positive or negative
        offsetCompatible: 0,  //Compatible safari
        speed: 400,       // Int: The speed, in miliseconds, it takes to complete a slide
        onInit: null,      // Function: Callback function on plugin initialize
        onSlide: null,     // Function: Callback function that runs just before the page starts animating
        performance: false, // Boolean: Toggles between click and delegate events.
        active: true,
        anchor: true,
    };

    $.fn.navAnchor = function(options){
        return this.each(function(){
            (new $.navAnchor(this, options));
        });
    };
})();

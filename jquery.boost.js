/**
 * jQuery.Boost
 * http://github.com/htmlhero/jQuery.boost
 *
 * Created by Andrew Motoshin
 * http://htmlhero.ru
 *
 * Version: 0.0.1
 * Requires: jQuery 1.8+
 *
 */

;(function ($) {

	// Get transitionEnd vendor event name
	var supportedEvent = (function () {

		var el = document.createElement('div'),
			names = {
				'WebkitTransition': 'webkitTransitionEnd',
				'MozTransition': 'transitionend',
				'OTransition': 'oTransitionEnd',
				'transition': 'transitionend'
			};

		for (var name in names){
			if (typeof el.style[name] !== 'undefined') {
				return names[name];
			}
		}

		return false;

	}());

	// Replace left and top properties to translateX and translateY
	var replaceProps = function (style) {

		if (!supportedEvent) {
			return style;
		}

		var val;

		for (var prop in style) {

			val = style[prop];

			if (typeof val === 'number') {
				val += (val === 0) ? '' : 'px';
			}

			if (prop === 'left') {
				style.transform = 'translateX(' + val + ')';
				delete style[prop];
			} else if (prop === 'top') {
				style.transform = 'translateY(' + val + ')';
				delete style[prop];
			}

		}

		return style;

	};

	// Set styles without animation
	var noAnim = function (el, style) {

		style = replaceProps(style);
		el.css(style);

	};

	// Set styles with animation
	var doAnim = function (el, style, delay, time, easing, callback) {

		// Check arguments
		if (typeof easing === 'undefined') {
			easing = 'linear';
		} else if (typeof easing === 'function') {
			callback = easing;
			easing = 'linear';
		}

		if (typeof callback !== 'function') {
			callback = function () {};
		}

		replaceProps(style);

		// Check transition support
		if (supportedEvent) {

			style.transitionDelay = delay + 'ms';
			style.transitionDuration = time + 'ms';
			style.transitionTimingFunction = easing;

			el.css(style);

			el.one(supportedEvent, function (e) {
				transitionClean(el);
				callback.call(this, e);
			});

		} else {

			if (easing === 'ease-in-out') {
				easing = 'swing';
			}

			el.delay(delay).animate(style, time, easing, callback);

		}

	};

	// Clean up after transition
	var transitionClean = function (el) {

		var style = {
			transitionDelay: '',
			transitionDuration: '',
			transitionTimingFunction: ''
		};

		el.css(style);

	};

	// jQuery connection
	$.fn.boost = function (style, delay, time, easing, callback) {

		if (arguments.length === 1) {
			noAnim(this, style);
		} else if (arguments.length > 1) {
			doAnim(this, style, delay, time, easing, callback);
		}

		return this;

	};

})(jQuery);
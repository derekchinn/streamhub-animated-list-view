define(["streamhub-sdk", "jquery", "inherits"], function(Sdk, $, Inherits) {
	
	/**
	 * A module that provides animations for new content that's comes in
	 * 
	 * @constructor
	 * @augments ListView
	 * @param {Object} opts Typical configuration object that you'd pass to any
	 * Livefyre view.
	 * @param {DOM Object} opts.el The target containing element for all pieces
	 * of content to flow into.
	 * @param {String} opts.animation The type of animation you want applied to
	 * content that streams in. Options are "slide-down", "fade-in", and "pulse".
	 * If you decide to have a "pulse" effect applied, you can also choose the
	 * color that's pulsed with the "pulseColor" option.
	 * @param {String} [opts.pulseColor=#2C8EE0] This is an optional param that
	 * allows you to select the color of the pulse. It accepts any color code
	 * representation that a normal CSS rule would take (hex, RGBA, etc.). If
	 * the param is supplied and the animation type is not set to "pulse", it
	 * will be ignored.
	 */
	var AnimatedListView = function (opts) {
		/*
		 * {
		 * 	  el: document.getElementById("example"),
		 * 	  animation: "pulse",
		 *    pulseColor: "#2C8EE0"
		 * } 
		 */
		Sdk.Views.ListView.call(this, opts);
		
		this._opts = opts || {};
		this._animation = opts.animation;
		this._pulseColor = opts.pulseColor;
		this._animate = new AnimatedListView.animate();
	};
	Inherits(AnimatedListView, Sdk.Views.ListView);
	
	AnimatedListView.prototype.add = function() {
		var content = Sdk.Views.ListView.prototype.add.apply(this, arguments);
		return content;
	};
	
	/**
	 * This method gets called at every time a piece of content needs to get
	 * inserted into the DOM
	 *
	 * @override
	 * @private
	 * @param {ContentView} contentView a piece of content to add to the 
	 * containing view
	 */
	AnimatedListView.prototype._insert = function (contentView) {
        var newContentViewIndex,
            $previousEl;

        // Push and sort. #TODO Insert in sorted order
        if (this.contentViews.indexOf(contentView) === -1) {
            this.contentViews.push(contentView);
        }
        this.contentViews.sort(this.comparator);

        newContentViewIndex = this.contentViews.indexOf(contentView);

        contentView.$el.hide();
        if (newContentViewIndex === 0) {
            // Beginning!
            contentView.$el.prependTo(this.el);
        } else {
            // Find it's previous contentView and insert new contentView after
            $previousEl = this.contentViews[newContentViewIndex - 1].$el;
            contentView.$el.insertAfter($previousEl);
        }
        switch (this._animation){
        	case "slide-down":
        		contentView.$el.slideDown("slow");
        		break;
        	case "fade-in":
        		contentView.$el.fadeIn(800);
        		break;
        	case "pulse":
        		var color = this._pulseColor ? this._pulseColor : "#2C8EE0";
        		contentView.$el.show();
        		this._animate.pulse(contentView.$el, color);
        		break;
        	default:
        		contentView.$el.show();
        		break;
        }
        
    };
    
    AnimatedListView.animate = function(){};
    
    /**
     * The pulse animation.
     * 
     * @private
     * @param {JQuery Object} $el The element to apply the CSS rule to
     * @param {String} color A valid CSS color code for the pulse to be.
     */
    AnimatedListView.animate.prototype.pulse = function ($el, color) {
    	/* How large the box shadow will be in pixels. Also controls
    	 * the number of steps in the animation.
    	 */ 
    	var MAX_RADIUS = 5;
    	
    	// Grow the shadow out.
    	for (var i = 1; i <= MAX_RADIUS; i++) {
    		var css = color + " 0px 0px 10px " + i + "px";
    		this._pulseStep(i, $el, css, MAX_RADIUS);
    	}
    	
    	// Shrink the shadow in.
    	for (var i = MAX_RADIUS; i >= 1; i--) {
    		var css = color + " 0px 0px 10px " + i + "px";
    		this._pulseStep(-i, $el, css, MAX_RADIUS);
    	}
    };
    
    /**
     * "Constructs" a single step of the pulse animation. Compatable with >IE9,
     * >FF4, >Safari5, >Opera10.5, >iOS5.0, >Android4.0
     * 
     * @private
     * @param {Integer} step An integer representing the current step you're on.
     * This can be positive or negative. If negative, it'll assume you're
     * intention is to shrink the shadow and will calculate an appropriate time
     * to execute the step.
     * @param {JQuery Object} $el The target element to apply the CSS rule to.
     * @param {String} css The box-shadow CSS to apply.
     * @param {Integer} maxSteps The maximum number of steps in the entire
     * process. This is usually synonymous with the radius of the box-shadow.
     */
    AnimatedListView.animate.prototype._pulseStep = function (step, $el, css, maxSteps) {
    	// How much time to wait between a timeout call.
    	var PAUSE = 50;
    	// How long from this point in time to schedule the timeout
    	var timeout = step > 0 ? step * PAUSE : (2 * maxSteps + step) * PAUSE;
    	setTimeout(function() { $el.css("box-shadow", css); }, timeout);
    	
    	/*
    	 * If we're on the last animation of the "shrinking" step, we need to
    	 * schedule an addition step to remove the style completely. That is
    	 * what this is for.
    	 */
    	if (step == -1) {
    		setTimeout(function() { $el.css("box-shadow", ""); }, 2 * maxSteps * PAUSE);
    	}
    };
    
	return AnimatedListView;
});
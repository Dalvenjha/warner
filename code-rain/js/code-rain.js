/*!
 * Code Rain v1.0.0
 * (c) CreativeTier
 * contact@creativetier.com
 * http://www.creativetier.com
 */

/**
 * Contains utility functions.
 */
function CodeRain_Utils() {
	"use strict";

	/**
	 * The current function instance.
	 * @type {CodeRain_Utils}
	 */
	var root = this;

	/**
	 * The current version.
	 * @type {String}
	 */
	var VERSION = "1.0.0";


	/**
	 * Initializes the function.
	 * @constructor
	 */
	function init() {}

	/**
	 * Returns the current version number.
	 * @return {String} The version number.
	 * @method
	 */
	this.version = function() {
		return VERSION;
	};

	/**
	 * Verifies if the supplied value is defined.
	 * @param {*} value - The value to verify.
	 * @return {Boolean} If the value is defined.
	 * @method
	 */
	this.isset = function(value) {
		return !(typeof value === "undefined");
	};

	/**
	 * Converts a string to a number.
	 * @param {String} value - The string to convert.
	 * @return {Number} The converted number.
	 * @method
	 */
	this.getInt = function(value) {
		return parseInt(value, 10);
	};

	/**
	 * Returns a random number between the given interval.
	 * If n2 is not set, the interval is 0 - n1.
	 * @param {Number} n1 - The first number.
	 * @param {Number} n2 - The second number.
	 * @return {Number} The random number.
	 * @method
	 */
	this.random = function(n1, n2) {
		if (root.isset(n2)) {
			return Math.floor(Math.random() * (n2 - n1 + 1) + n1);
		} else {
			return Math.floor(Math.random() * n1);
		}
	};

	/**
	 * Merges the properties of object2 into object1 and returns the combined object.
	 * @param {Object} object1 - The first object.
	 * @param {Object} object2 - The second object.
	 * @param {Object} The combined object.
	 * @method
	 */
	this.extend = function(object1, object2) {
		return object2;
	};

	/**
	 * Displays a message in the browser console.
	 * @param {String} message - The message to be displayed.
	 * @param {String} type - The type of the message: error, warn or log (default).
	 * @method
	 */
	this.log = function(message, type) {
		message = "CodeRain: " + message;

		if (window.console) {
			if (type === "error") {
				console.error(message);
			} else if (type === "warn") {
				console.warn(message);
			} else {
				console.log(message);
			}
		}
	};

	// Initializes the function.
	init();
}
// Creates a global variable through which the utility functions can be called.
var CodeRainUtils = new CodeRain_Utils();

/**
 * Creates the content of the template page.
 * @param {Object} settings - The page settings.
 */
function CodeRain_Template(settings) {
	"use strict";

	/**
	 * The current function instance.
	 * @type {CodeRain_Template}
	 */
	var root = this;

	/**
	 * The rain effect object.
	 * @type {CodeRain_RainEffect}
	 */
	var rain;

	/**
	 * The message object;
	 * @type {CodeRain_Message}
	 */
	var message;

	/**
	 * The message that appears on right click.
	 * @type {CodeRain_ContextMessage}
	 */
	var contextMessage;

	
	/**
	 * Initializes the function.
	 * @constructor
	 */
	function init() {
		if (settings.rain) {
			rain = new CodeRain_RainEffect(settings.rain);
		}

		if (settings.message) {
			message = new CodeRain_Message(settings.message);
		}

		if (settings.contextMessage) {
			contextMessage = new CodeRain_ContextMessage(settings.contextMessage);
		}

		resize(false);

		window.addEventListener("resize", onWindowResize);
	}

	/**
	 * Runs when the browser window is resized.
	 * @param {Event} event - The window resize event.
	 */
	function onWindowResize(event) {
		resize();
	}

	/**
	 * Resizes the content.
	 * @param {Boolean} resizeComp - If to resize the components as well (@default true).
	 */
	function resize(resizeComp) {
		if (typeof resizeComp === "undefined") {
			resizeComp = true;
		}

		if (!resizeComp) {
			return;
		}

		if (rain) {
			rain.resize();
		}

		if (message) {
			message.position();
		}
	}

	/**
	 * Destroy the content.
	 * @method
	 */
	this.destroy = function() {
		if (rain) {
			rain.destroy();
		}

		if (message) {
			message.destroy();
		}

		if (contextMessage) {
			contextMessage.destroy();
		}

		window.removeEventListener("resize", onWindowResize);
	};

	// Initializes the function.
	init();
}

/**
 * The function of the rain effect.
 * @param {Object} options - The given options.
 * @param {Boolean} autoStart - If the effect should start automatically (@default true).
 */
function CodeRain_RainEffect(options, autoStart) {
	"use strict";

	// Sets the default value of the parameter.
	if (typeof autoStart === "undefined") {
		autoStart = true;
	}

	/**
	 * The current function instance.
	 * @type {CodeRain_RainEffect}
	 */
	var root = this;

	/**
	 * The default settings.
	 * @type {Object}
	 */
	var defaults = {};

	/**
	 * The settings.
	 * @type {Object}
	 */
	var settings = CodeRainUtils.extend(defaults, options);

	/**
	 * The main HTML element.
	 * @type {Element}
	 */
	var main = document.getElementById(settings.elementId);

	/**
	 * The first canvas element.
	 * @type {Element}
	 */
	var canvas = main.children[0];

	/**
	 * The 2d context of the first canvas.
	 * @type {Object}
	 */
	var context = canvas.getContext("2d");

	/**
	 * The second canvas element.
	 * @type {Element}
	 */
	var canvas2 = main.children[1];

	/**
	 * The 2d context of the second canvas.
	 * @type {Object}
	 */
	var context2 = canvas2.getContext("2d");

	/**
	 * The current width of the rain element.
	 * @type {Number}
	 */
	var curWidth = null;

	/**
	 * The current height of the rain element.
	 * @type {Number}
	 */
	var curHeight = null;

	/**
	 * The list of characters.
	 * @type {Array}
	 */
	var characters;

	/**
	 * The length of the characters array.
	 * @type {Number}
	 */
	var charLength;

	/**
	 * The number of columns.
	 * @type {Number}
	 */
	var columns;

	/**
	 * The number of rows.
	 * @type {Number}
	 */
	var rows;

	/**
	 * The list of drops.
	 * @type {Array}
	 */
	var drops = [];

	/**
	 * The rain interval.
	 * @type {Number}
	 */
	var interval;

	/**
	 * If the effect is playing.
	 * @type {Boolean}
	 */
	var playing = false;


	/**
	 * Initializes the function.
	 * @constructor
	 */
	function init() {
		characters = settings.characters.split("");
		charLength = characters.length;

		root.resize();

		if (autoStart) {
			root.start();
		}
	}

	/**
	 * Resizes the object.
	 * @method
	 */
	this.resize = function() {
		if (curWidth === main.offsetWidth && curHeight === main.offsetHeight) {
			return;
		}

		curWidth = main.offsetWidth;
		curHeight = main.offsetHeight;

		canvas.width = main.offsetWidth;
		canvas.height = main.offsetHeight;

		if (settings.highlightFirstChar) {
			canvas2.width = main.offsetWidth;
			canvas2.height = main.offsetHeight;
		}

		columns = canvas.width / settings.columnWidth;
		rows = canvas.height / settings.rowHeight;

		initDrops();
	};

	/**
	 * Sets the initial position of the drops.
	 */
	function initDrops() {
		var i;

		switch (settings.direction) {
			case "top-bottom":
				for (i = 0; i < columns; i++) {
					if (typeof drops[i] === "undefined") {
						drops[i] = rows + 1;
					}
				}
				break;
		}
	}

	/**
	 * Starts the effect.
	 * @method
	 */
	this.start = function() {
		if (!settings.showStart) {
			fillCanvas();
		}

		interval = setInterval(rain, settings.interval);
		
		playing = true;
	};

	/**
	 * Stops the effect.
	 * @param {Boolean} clear - If to clear the canvas (@default false).
	 * @method
	 */
	this.stop = function(clear) {
		clearInterval(interval);

		if (clear) {
			root.clear();
		}

		playing = false;
	};

	/**
	 * Draws the effect.
	 */
	function rain() {
		var i, c;

		context.fillStyle = settings.overlayColor;
		context.fillRect(0, 0, canvas.width, canvas.height);

		context.fillStyle = settings.textColor;
		context.font = settings.fontSize + "px " + settings.font;

		if (settings.highlightFirstChar) {
			context2.clearRect(0, 0, canvas2.width, canvas2.height);
			context2.font = settings.fontSize + "px " + settings.font;
		}

		for (i = 0; i < columns; i++) {
			c = characters[CodeRainUtils.random(charLength)];

			context.fillText(c, settings.columnWidth * i, settings.rowHeight * drops[i]);

			if (settings.highlightFirstChar) {
				context2.fillStyle = settings.highlightFirstChar;
				context2.fillText(c, settings.columnWidth * i, settings.rowHeight * drops[i]);
			}

			if (drops[i] > rows && Math.random() > 0.975) {
				drops[i] = 0;
			}

			drops[i]++;
		}
	}

	/**
	 * Fills the canvas at the start.
	 */
	function fillCanvas() {
		for (var i = 0; i < 150; i++) {
			rain();
		}
	}

	/**
	 * Clears the canvas.
	 * @method
	 */
	this.clear = function() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		
		if (settings.highlightFirstChar) {
			context2.clearRect(0, 0, canvas2.width, canvas2.height);
		}
	};

	/**
	 * Verifies if the effect is currently playing.
	 * @return {Boolean} If the effect is playing.
	 * @method
	 */
	this.isPlaying = function() {
		return playing;
	};

	/**
	 * Destroy the object.
	 * @method
	 */
	this.destroy = function() {
		root.stop(true);

		canvas.width = null;
		canvas.height = null;

		if (settings.highlightFirstChar) {
			canvas2.width = null;
			canvas2.height = null;
		}
	};

	// Initializes the function.
	init();
}

/**
 * The message box.
 * @param {Object} options - The given options.
 */
function CodeRain_Message(options) {
	"use strict";

	/**
	 * The current function instance.
	 * @type {CodeRain_Message}
	 */
	var root = this;

	/**
	 * The default settings.
	 * @type {Object}
	 */
	var defaults = {};

	/**
	 * The settings.
	 * @type {Object}
	 */
	var settings = CodeRainUtils.extend(defaults, options);

	/**
	 * The main HTML element.
	 * @type {Element}
	 */
	var main = document.getElementById(settings.elementId);

	/**
	 * The text effect.
	 * @type {CodeRain_TextEffect[n]}
	 */
	var textEffect;


	/**
	 * Initializes the function.
	 * @constructor
	 */
	function init() {
		switch (settings.textEffect.effect) {
			case 1:
				textEffect = new CodeRain_TextEffect1(main, settings.textEffect);
				break;
		}
		
		textEffect.onChange = root.position;

		root.position();

		if (settings.replayOnClick) {
			main.addEventListener("click", root.replay);
		}

		main.classList.add("cr-show");
	}

	/**
	 * Positions the element.
	 * @method
	 */
	this.position = function() {
		main.style.left = Math.round((window.innerWidth - main.offsetWidth) / 2) + "px";
		main.style.top = Math.round((window.innerHeight - main.offsetHeight)  / 2) + "px";
	};

	/**
	 * Replays the text effect.
	 * @method
	 */
	this.replay = function() {
		if (!textEffect.isPlaying()) {
			textEffect.replay();
		}
	};

	/**
	 * Destroy the object.
	 * @method
	 */
	this.destroy = function() {
		textEffect.destroy();

		main.style.left = "auto";
		main.style.top = "auto";

		if (settings.replayOnClick) {
			main.removeEventListener("click", root.replay);
		}

		main.classList.remove("cr-show");
	};

	// Initializes the function.
	init();
}

/**
 * The message that appears on right click.
 * @param {Object} options - The given options.
 * @param {String} targetId - The target element for the right-click ID (optional).
 */
function CodeRain_ContextMessage(options, targetId) {
	"use strict";

	/**
	 * The current function instance.
	 * @type {CodeRain_ContextMessage}
	 */
	var root = this;

	/**
	 * The default settings.
	 * @type {Object}
	 */
	var defaults = {};

	/**
	 * The settings.
	 * @type {Object}
	 */
	var settings = CodeRainUtils.extend(defaults, options);

	/**
	 * The target element for the right-click.
	 * @type {Element}
	 */
	var target;

	/**
	 * The main HTML element.
	 * @type {Element}
	 */
	var main = document.getElementById(settings.elementId);

	/**
	 * The width of the element.
	 * @type {Number}
	 */
	var width;

	/**
	 * The height of the element.
	 * @type {Number}
	 */
	var height;

	/**
	 * The text effect.
	 * @type {CodeRain_TextEffect[n]}
	 */
	var textEffect;

	/**
	 * If the context menu is currently open.
	 * @type {Boolean}
	 */
	var isOpen = false;


	/**
	 * Initializes the function.
	 * @constructor
	 */
	function init() {
		switch (settings.textEffect.effect) {
			case 1:
				textEffect = new CodeRain_TextEffect1(main, settings.textEffect, settings.link, false);
				break;
		}

		width = main.offsetWidth;
		height = main.offsetHeight;

		if (typeof targetId === "undefined") {
			target = document;
		} else {
			target = document.getElementById(targetId);
		}
		target.addEventListener("contextmenu", onContextMenu);

		document.addEventListener("click", onOutsideClick);
	}

	/**
	 * Runs when the context menu is opened.
	 * @param {Event} event - The contextmenu event.
	 */
	function onContextMenu(event) {
		root.show(event.clientX, event.clientY);
		event.preventDefault();
	}

	/**
	 * Runs when clicking outside of the custom context menu.
	 * @param {Event} event - The click event.
	 */
	function onOutsideClick(event) {
		root.hide();
	}

	/**
	 * Shows the message.
	 * @param {Number} mouseX - The x position of the mouse.
	 * @param {Number} mouseY - The y position of the mouse.
	 * @method
	 */
	this.show = function(mouseX, mouseY) {
		var x, y;

		if (mouseX + width > window.innerWidth) {
			x = mouseX - width;
		} else {
			x = mouseX;
		}

		if (mouseY + height > window.innerHeight) {
			y = mouseY - height;
		} else {
			y = mouseY;
		}

		main.style.left = x + "px";
		main.style.top = y + "px";

		main.classList.add("cr-show");

		textEffect.start();

		isOpen = true;
	};

	/**
	 * Hides the message.
	 * @method
	 */
	this.hide = function() {
		if (isOpen) {
			main.classList.remove("cr-show");
			textEffect.stop();
			isOpen = false;
		}
	};

	/**
	 * Destroys the object.
	 * @method
	 */
	this.destroy = function() {
		textEffect.destroy();

		main.style.left = "auto";
		main.style.top = "auto";

		main.classList.remove("cr-show");

		target.removeEventListener("contextmenu", onContextMenu);

		document.removeEventListener("click", onOutsideClick);
	};

	// Initializes the function.
	init();
}

/**
 * The text effect 1.
 * @param {Element} element - The main HTML element.
 * @param {Object} options - The given options.
 * @param {Boolean} autoStart - If the effect should start automatically (@default true).
 */
function CodeRain_TextEffect1(element, options, autoStart) {
	"use strict";

	// Sets the default value of the parameter.
	if (typeof autoStart === "undefined") {
		autoStart = true;
	}

	/**
	 * The current function instance.
	 * @type {CodeRain_TextEffect1}
	 */
	var root = this;

	/**
	 * The default settings.
	 * @type {Object}
	 */
	var defaults = {};

	/**
	 * The settings.
	 * @type {Object}
	 */
	var settings = CodeRainUtils.extend(defaults, options);

	/**
	 * The main HTML element.
	 * @type {Element}
	 */
	var main = element;

	/**
	 * The list of characters.
	 * @type {Array}
	 */
	var characters;

	/**
	 * The length of the characters array.
	 * @type {Number}
	 */
	var charLength;

	/**
	 * The list of characters needed to display.
	 * @type {Number}
	 */
	var targetChars;

	/**
	 * The length of the target chars array.
	 * @type {Number}
	 */
	var tarCharLength;

	/**
	 * The list of currently completed characters.
	 * @type {Array}
	 */
	var curChars = [];

	/**
	 * The index of the current character.
	 * @type {Number}
	 */
	var charIndex = -1;

	/**
	 * The effect interval.
	 * @type {Number}
	 */
	var interval;

	/**
	 * The timeout for reapeating the repeat.
	 * @type {Number}
	 */
	var repeatTimeout;

	/**
	 * If the effect is in the preview state.
	 * @type {Boolean}
	 */
	var preview = true;

	/**
	 * The interval counter.
	 * @type {Number}
	 */
	var tick = 0;

	/**
	 * If the effect is playing.
	 * @type {Boolean}
	 */
	var playing = false;

	/**
	 * A function to be called when the message content is changed.
	 * @type {Function}
	 */
	this.onChange = null;


	/**
	 * Initializes the function.
	 * @constructor
	 */
	function init() {
		characters = settings.characters.split("");
		charLength = characters.length;

		targetChars = settings.message.split("");
		tarCharLength = targetChars.length;

		addHiddenText();

		if (autoStart) {
			root.start();
		}
	}

	/**
	 * Initially adds the text as hidden to have the element the correct final size.
	 */
	function addHiddenText() {
		var text = "";
		
		text += '<span style="visibility: hidden;">';

		if (settings.wrappers) {
			text += settings.wrappers[0];
		}

		if (settings.link) {
			text += '<a href="' + settings.link.url + '" target="' + settings.link.target + '">';
		}
		
		text += settings.message;

		if (settings.link) {
			text += '</a>';
		}
		
		if (settings.wrappers) {
			text += settings.wrappers[1];
		}

		text += '</span>';

		main.innerHTML = text;
	}

	/**
	 * Starts the effect.
	 * @method
	 */
	this.start = function() {
		if (playing) {
			root.stop();
		}

		interval = setInterval(write, settings.interval);

		playing = true;

		if (settings.replay) {
			stopRepeatTimer();
		}
	};

	/**
	 * Stops the effect.
	 * @method
	 */
	this.stop = function() {
		clearInterval(interval);

		reset();

		playing = false;
	};

	/**
	 * Replays the effect.
	 * @method
	 */
	this.replay = function() {
		if (playing) {
			root.stop();
		}
		root.start();
	};

	/**
	 * Starts the repeat timer.
	 */
	function startRepeatTimer() {
		repeatTimeout = setTimeout(root.start, settings.replay * 1000);
	}

	/**
	 * Stops the repeat timer.
	 */
	function stopRepeatTimer() {
		clearTimeout(repeatTimeout);
	}

	/**
	 * Writes the text content.
	 */
	function write() {
		var i, n;
		var text = "";

		if (preview && tick === settings.pendingTicks || !preview && tick === settings.characterTicks) {
			curChars[charIndex] = targetChars[charIndex];
			charIndex++;
			tick = 0;
			preview = false;
		}

		tick++;

		if (settings.wrappers) {
			text += settings.wrappers[0];
		}

		if (settings.link) {
			text += '<a href="' + settings.link.url + '" target="' + settings.link.target + '">';
		}

		n = curChars.length;
		for (i = 0; i < n; i++) {
			text += curChars[i];
		}

		if (n < tarCharLength) {
			text += '<span style="color: ' + settings.pendingColor + ';">';

			for (i = n; i < tarCharLength; i++) {
				if (settings.highlightChar && !preview && i === n) {
					text += '<span style="color: ' + settings.highlightChar + ';">';
				}

				text += characters[CodeRainUtils.random(charLength)];

				if (settings.highlightChar && !preview && i === n) {
					text += '</span>';
				}
			}

			text += '</span>';
		}

		if (settings.link) {
			text += '</a>';
		}

		if (settings.wrappers) {
			text += settings.wrappers[1];
		}

		main.innerHTML = text;

		if (root.onChange) {
			root.onChange();
		}

		if (charIndex === tarCharLength) {
			root.stop();

			if (settings.replay) {
				startRepeatTimer();
			}
		}
	}

	/**
	 * Resets the effect props.
	 */
	function reset() {
		curChars = [];
		charIndex = -1;
		tick = 0;
		preview = true;
	}

	/**
	 * Verifies if the effect is currently playing.
	 * @return {Boolean} If the effect is playing.
	 * @method
	 */
	this.isPlaying = function() {
		return playing;
	};

	/**
	 * Destroy the object.
	 * @method
	 */
	this.destroy = function() {
		root.stop();

		main.innerHtml = "";

		if (settings.replay) {
			stopRepeatTimer();
		}
	};

	// Initializes the function.
	init();
}
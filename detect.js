/**
 * Detect - Get data from the browser, format it, profit
 *
 * @since  1.0.0
 * @type {Object}
 */
var Detect = function(options){
	return this.do(options);
}

Detect.prototype = {
	/**
	 * [_Navigator Copy of the window.navigator object so we can add/remove things if necessary]
	 * @since  1.0.0
	 * @type {Object}
	 */
	_Navigator: window.navigator,

	/**
	 * [_Browser Object that contains commonly required strings from the UA]
	 * NOTE: accessing directly will give you incorrect data, use Detect.browser() 
	 * to access this data instead
	 * 
	 * @since 1.0.0
	 * @type {Object}
	 */
	_Browsers: {
		UNKNOWN: {name: 'unknown', engine: 'unknown', version: '0.0.0'},
		CHROME_WEBKIT: {name: 'chrome', engine: 'webkit', version: '0.0.0'},
		CHROME_BLINK: {name: 'chrome', engine: 'blink', version: '0.0.0'},
		FIREFOX: {name: 'firefox', engine: 'gecko', version: '0.0.0'},
		OPERA_PRESTO: {name: 'opera', engine: 'presto', version: '0.0.0'}, //currently not tested for
		OPERA_BLINK: {name: 'opera', engine: 'blink', version: '0.0.0'}, //currently not tested for
		SAFARI: {name: 'safari', engine: 'webkit', version: '0.0.0'},
		IE: {name: 'ie', engine: 'trident', version: '0.0.0'},
	},

	/**
	 * [_OS User's operating system text placeholders]
	 * @since  1.0.0
	 * @type {Object}
	 */
	_OS: {
		UNKNOWN: 'Unknown',
		MAC: 'Mac',
		WINDOWS: 'Windows',
		LINUX: 'Linux',
	},

	/**
	 * [do Sets the _Browser and _OS variables]
	 * @param {object} options [Setup options: format]
	 * @since  1.0.0
	 * @return {object} [Aggregated data from both this.browser and this.os]
	 */
	do: function(options){
		return { //nope all of this is
			os: this.os(),
			browser: this.browser(),
			plugins: this.plugins(options),
		}
	},

	/**
	 * [browser Determine the user's browser]
	 * @param {object} options [Any required settings]
	 * @since  1.0.0
	 * @return {object}
	 */
	browser: function(options){
		var parts = this._Navigator.userAgent.split(/\s*[;)(]\s*/),
			output = this._Browsers.UNKNOWN,
			os = this.os();

		//safari/webkit
		if(/^Version/.test(parts[5]) && /Safari/.test(parts[5])){
			switch(os){
				case this._OS.MAC:
					this._Browsers.SAFARI.version = parts[5].split(' ')[0].substring(8); break;

				default:
					this._Browsers.SAFARI.version = parts[5].split(' ')[0].substring(7);

			}

			output = this._Browsers.SAFARI;
		}

		//chrome/webkit
		if(/^Chrome/.test(parts[5]) && /^AppleWebKit/.test(parts[3])){
			switch(os){
				case this._OS.MAC:
					this._Browsers.CHROME_WEBKIT.version = parts[5].split(' ')[0].substring(8); break;

				default:
					this._Browsers.CHROME_WEBKIT.version = parts[5].split(' ')[0].substring(7);
			}

			output = this._Browsers.CHROME_WEBKIT;
		}

		//chrome/blink
		//They claim they're not going to change the UA in Chrome/Blink 
		//but I don't believe them so instead of waiting for them to secretly
		//change something I'll just assume that anything >=28 is Blink and <28
		//is Webkit
		if(/^Chrome/.test(parts[5]) && /^AppleWebKit/.test(parts[3])){
			this._Browsers.CHROME_BLINK.version = parts[5].substring(7, 19);

			if(parseInt(this._Browsers.CHROME_BLINK.version) >= 28) { //version 28 is first public release with Blink instead of Webkit
				output = this._Browsers.CHROME_BLINK;
			}
		}

		//firefox/gecko
		if(/^(Gecko|Firefox)/.test(parts[4]) || /^(Gecko|Firefox)/.test(parts[5])){ //Linux UA has 6, Windows has 5
			switch(os){
				case this._OS.LINUX:
					this._Browsers.FIREFOX.version = parts[5].split(' ')[1].substring(8); break;

				case this._OS.WINDOWS:
					this._Browsers.FIREFOX.version = parts[4].split(' ')[1].substring(8); break;
			}
			
			output = this._Browsers.FIREFOX;
		}

		//ie/trident
		if(/^MSIE/.test(parts[2])){
			this._Browsers.IE.engine = parts[5].split('/')[0]; //we can get a little more specific here, so why not
			this._Browsers.IE.version = parts[5].split('/')[1];

			output = this._Browsers.IE;
		}

		return output;
	},

	/**
	 * [os Determine the user's operating system]
	 * @param {object} options [Any required settings]
	 * @since  1.0.0
	 * @return {string}
	 */
	os: function(options){
		var parts = this._Navigator.userAgent.split(/\s*[;)(]\s*/),
			output = this._OS.UNKNOWN;

		switch(this._Navigator.platform.toLowerCase().split(' ')[0] || parts[3].toLowerCase()){
			case 'macintel':
			case 'macppc':
				output = this._OS.MAC;
			break;

			case 'win32':
				output = this._OS.WINDOWS;
			break;

			case 'linux':
				output = this._OS.LINUX;
			break;
		}

		return output;
	},

	/**
	 * [plugins Determine what plugins, if any, the browser is running]
	 * @param {object} options [Any required settings]
	 * @since  1.0.0
	 * @return {object}
	 * 
	 * TODO: add functionality to this function
	 */
	plugins: function(options){
		var output = {};

		if(navigator.plugins || navigator.plugins.length > 1){
			output.content = [];

			if(options.format){
				//HTML
				for(var i = 0; i < navigator.plugins.length; i++){
					var plugin = navigator.plugins[i];

					if(plugin.name)
						output.content.push('<li>Name: <strong>'+ plugin.name +'</strong></li>');
					if(plugin.description)
						output.content.push('<li>Description: <strong>'+ plugin.description +'</strong></li>');
				}
				output = output.content.join(' ');
			}else {
				//object
				for(var i = 0; i < navigator.plugins.length; i++){
					var plugin = navigator.plugins[i];

					output.content.push({name: plugin.name, description: plugin.description, slug: this._slug(plugin.name)});
				}
			}
		}
		
		return output;
	},

	/**
	 * [_slug Generate a slug that is easier to remember than the real plugin name]
	 * @param  {string} plugin [Plugin name to process]
	 * @return {string}
	 */
	_slug: function(plugin){
		return plugin.split(' ').join('_').toLowerCase();
	}
};


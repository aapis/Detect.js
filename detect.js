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
		UNKNOWN: {name: 'Unknown', bits: 'x86'},
		MAC: {name: 'Mac', bits: 'x86'},
		WINDOWS: {name: 'Windows', bits: 'x86'},
		LINUX: {name: 'Linux', bits: 'x86'},
	},

	/**
	 * [do Sets the _Browser and _OS variables]
	 * @param {object} options [Setup options: format]
	 * @since  1.0.0
	 * @return {object} [Aggregated data from both this.browser and this.os]
	 */
	do: function(options){
		var output = {
			os: this.os(),
			browser: this.browser(),
			plugins: this.plugins(options),
		};

		if(options.addClasses){
			this._addClasses(output);
		}

		return output;
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
			os = this.os().system;

		//safari/webkit
		if(/^Version/.test(parts[5]) && /Safari/.test(parts[5])){
			switch(os){
				case this._OS.MAC.system:
					this._Browsers.SAFARI.version = parts[5].split(' ')[0].substring(8); break;

				default:
					this._Browsers.SAFARI.version = parts[5].split(' ')[0].substring(8);

			}

			output = this._Browsers.SAFARI;
		}

		//chrome/webkit
		if(/^Chrome/.test(parts[5]) && /^AppleWebKit/.test(parts[3])){
			switch(os){
				case this._OS.MAC.system:
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
				case this._OS.LINUX.system:
					this._Browsers.FIREFOX.version = parts[5].split(' ')[1].substring(8); break;

				case this._OS.WINDOWS.system:
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
			output = {system: this._OS.UNKNOWN.name, bits: this._OS.UNKNOWN.bits};
			bits = this.bits();

		switch(this._Navigator.platform.toLowerCase().split(' ')[0] || parts[3].toLowerCase()){
			case 'macintel':
			case 'macppc':
				output.system = this._OS.MAC.name;
				output.bits = (bits ? bits : this._OS.MAC.bits); break;

			case 'win32':
				output.system = this._OS.WINDOWS.name;
				output.bits = (bits ? bits : this._OS.WINDOWS.bits); break;

			case 'linux':
				output.system = this._OS.LINUX.name;
				output.bits = (bits ? bits : this._OS.LINUX.bits); break;
		}

		return output;
	},

	/**
	 * [bits Determine the CPU architecture - x86 or x64]
	 * Note: some browsers don't broadcast the system architecture 
	 * so this will make it's best guess
	 * 
	 * @since  1.0.0
	 * @return {mixed} [bool|string]
	 */
	bits: function(){
		var parts = this._Navigator.userAgent.split(/\s*[;)(]\s*/),
			output = '';
		
		switch(this._Navigator.platform.toLowerCase().split(' ')[0] || parts[3].toLowerCase()){
			case 'macintel':
				output = 'x64'; break;

			case 'macppc':
				output = 'x86'; break;

			//not tested yet
			case 'win32': 
				output = (parts[2].match(/wow64/i) ? 'x64' : 'x86'); break;

			//not tested yet
			case 'linux': break;
		}

		return output;
	},

	/**
	 * [plugins Determine what plugins, if any, the browser is running]
	 * @param {object} options [Any required settings]
	 * @since  1.0.0
	 * @return {object}
	 */
	plugins: function(options){
		var output = {};

		if(this._Navigator.plugins || this._Navigator.plugins.length > 1){
			output.content = [];

			if(options.format){
				//HTML
				for(var i = 0; i < this._Navigator.plugins.length; i++){
					var plugin = this._Navigator.plugins[i];

					if(plugin.name)
						output.content.push('<li>Name: <strong>'+ plugin.name +'</strong></li>');
					if(plugin.description)
						output.content.push('<li>Description: <strong>'+ plugin.description +'</strong></li>');
				}
				output = output.content.join(' ');
			}else {
				//object
				for(var i = 0; i < this._Navigator.plugins.length; i++){
					var plugin = this._Navigator.plugins[i];

					output.content.push({name: plugin.name, description: plugin.description, slug: this._slug(plugin.name)});
				}
			}
		}
		
		return output;
	},

	/**
	 * [_addClasses Add classes to the body element if options.addBodyClasses is true]
	 *
	 * @param {object} options [Values the script detected]
	 * @since  1.0.0
	 * @return {void}
	 */
	_addClasses: function(options){
		var output = '';

		for(var prop in options){
			if(typeof options[prop] === 'object'){
				for(var iprop in options[prop]){
					document.body.classList.add(iprop +'-'+ options[prop][iprop].toLowerCase());
				}
			}
		}
	},

	/**
	 * [_slug Generate a slug that is easier to remember than the real plugin name]
	 * @param  {string} plugin [Plugin name to process]
	 * @return {string}
	 */
	_slug: function(plugin){
		return plugin.split(' ').join('_').toLowerCase();
	},

	PluginUtility: {
		isPluginInstalled: function(plugin_slug){
			//in_array
		},

		getPluginVersion: function(plugin_slug){
			//pass
		},
	},
};


/**
 * Detect - Get data from the browser, format it, profit
 *
 * @since  1.0.0
 * @type {Object}
 */
var Detect = function(options){
	//set options to either a default or the chosen value
	options = options || {};
	options.format = !!options.format;
	options.addClasses = !!options.addClasses;
	options.classPrefix = options.classPrefix || 'default';
	options.ignore = {
		plugins: !!options.ignore.plugins,
		os: !!options.ignore.os,
		browser: !!options.ignore.browser
	};
	
	//instantiate utility object
	this.utils = new Detect.Utils(this);

	//expose utilities publically
	window.dj_utils = this.utils;

	return this.do(options);
};

	/**
	 * Static version number
	 * 
	 * @since 1.0.0
	 * @type {Object}
	 */
	Detect.prototype._Version = '1.2.0';

	/**
	 * Reference the window.navigator object so we can add/remove things if necessary
	 *
	 * @since  1.0.0
	 * @type {Object}
	 */
	Detect.prototype._Navigator = window.navigator || {};

	/**
	 * All the functions that return a useful value run a regex statement, so
	 * lets run it globally once instead of 3 times
	 *
	 * @since  1.0.0
	 * @type {array}
	 */
	Detect.prototype._navParts = [];

	/**
	 * Sets the _Browser and _OS variables
	 *
	 * @param {object} options
	 * @since  1.0.0
	 * @return {object} [Aggregated data from this.browser, this.os and this.plugins]
	 */
	Detect.prototype.do = function(options){
		this._navParts = this._Navigator.userAgent.split(/\s*[;)(]\s*/);

		var output = {};
		
		if(false === options.ignore.plugins)
			output.plugins = new Detect.Plugins(options);

		if(false === options.ignore.os)
			output.os = new Detect.OS(this);

		if(false === options.ignore.browser)
			output.browser = new Detect.Browser();

		if(false === options.ignore.supports)
			output.supports = new Detect.Supports();

		// if(options.addClasses)
		// 	this.addClasses(options, output);
		
		return output;
	};

	/**
	 * Determine what plugins, if any, the browser is running
	 *
	 * @param {object} options [Any required settings]
	 * @since  1.0.0
	 * @return {object}
	 */
	Detect.prototype.plugins = function(options){
		var output = {};

		if(this._Navigator.plugins && this._Navigator.plugins.length > 1){
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

					output.content.push({name: plugin.name, description: plugin.description, slug: this.utils.slug(plugin.name)});
				}
			}
		}
		
		return output;
	};

	/**
	 * Determine the CPU architecture - 32 or 64
	 * Note: some browsers don't broadcast the system architecture 
	 * so this will make it's best guess
	 * 
	 * @since  1.0.0
	 * @return {mixed} [bool|string]
	 */
	Detect.prototype.bits = function(){
		var knownBits = this._Navigator.platform.toLowerCase().split(' ')[1],
			output = (/(86|64)/.test(knownBits) ? '64' : '32');

		switch(this._Navigator.platform.toLowerCase().split(' ')[0] || this._navParts[3].toLowerCase()){
			case 'macintel':
				output = '64'; break;

			case 'macppc':
				output = '32'; break;

			//not tested yet
			case 'win32': 
				output = (this._navParts[2].match(/wow64/i) ? '64' : '32'); break;

			//not tested yet
			case 'linux': 
				output = '64'; break; //currently an assumption
		}

		return output;
	};

	/**
	 * Add classes to the body element if options.addBodyClasses is true
	 *
	 * @param {object} options
	 * @param {object} ref [The object we use to determine the proper class names]
	 * @since  1.0.0
	 * @return {void}
	 */
	Detect.prototype.addClasses = function(options, ref){
		var useDefault = (options.classPrefix === 'default');

		for(var prop in ref){
			if(ref[prop] && typeof ref[prop] === 'object'){
				for(var iprop in ref[prop]){
					if(ref[prop][iprop]){ //ignore undefined or null values
						var html_el = document.querySelector('html');

						if(typeof ref[prop][iprop] === 'string'){ //system, architecture, browser name, browser engine, etc
							if(useDefault){
								html_el.classList.add(iprop +'-'+ ref[prop][iprop].toLowerCase());	
							}else {
								html_el.classList.add(options.classPrefix + iprop +'-'+ ref[prop][iprop].toLowerCase());
							}
						}else { //plugin array
							for(var i = 0, plgs = ref[prop][iprop]; i < plgs.length; i++){
								if(useDefault){
									html_el.classList.add(this.utils.sanitize('plugin-'+ plgs[i].slug.toLowerCase()));
								}else {
									html_el.classList.add(this.utils.sanitize(options.classPrefix + 'plugin-'+ plgs[i].slug.toLowerCase()));
								}
							}
						}
					}
				}
			}
		}
	};

	/**
	 * Detect support for common web technologies like websockets and indexedDB
	 * 
	 * @since  1.3.0
	 * @return {object}
	 */
	Detect.prototype.supports = function(){
		return {};
	};

	/**
	 * Determine the user's browser by matching various identifying properties
	 * against known values 
	 */
	Detect.Browser = function(){
		return this.parse_browser_info();
	};

		/**
		 * Browser brand: Unknown
		 *
		 * @since 1.3.0
		 */
		Detect.Browser.prototype.Unknown = function(){
			this.name = "unknown";
			this.engine = "unknown";
			this.version = "0.0.0";
			this.short_version = 0;
		};

			Detect.Browser.prototype.Unknown.prototype.setVersion = function(version){
				if(version)
					this.version = version; //format into long version
			};

			Detect.Browser.prototype.Unknown.prototype.setEngine = function(engine){
				if(engine)
					this.engine = engine;
			};

		/**
		 * Browser brand: Apple Safari
		 *
		 * @since 1.3.0
		 */
		Detect.Browser.prototype.Safari = function(){
			this.name = "safari";
			this.engine = "webkit";
			this.version = "0.0.0";
			this.short_version = 0;
		};

			Detect.Browser.prototype.Safari.prototype.setVersion = function(version){
				if(version){
					this.version = version; //format into long version
				}else {
					//determine version dynamically
					var _ua = window.navigator.userAgent,
						_ver = _ua.match(/Version\/[0-9-.]+/);

					this.version = _ver[0].match(/[0-9-.]+/)[0];
				}
			};

			Detect.Browser.prototype.Safari.prototype.setEngine = function(engine){
				if(engine)
					this.engine = engine;
			};

		/**
		 * Browser brand: Google Chrome
		 *
		 * @since 1.3.0
		 */
		Detect.Browser.prototype.Chrome = function(){
			this.name = "chrome";
			this.engine = "blink";
			this.version = "0.0.0";
			this.short_version = 0;
		};

			Detect.Browser.prototype.Chrome.prototype.setVersion = function(version){
				if(version){
					this.version = version; //format into long version
				}else {
					//determine version dynamically
					var _ua = window.navigator.userAgent,
						_ver = _ua.match(/Chrome\/[0-9-.]+/);

					this.version = _ver[0].match(/[0-9-.]+/)[0];
				}
			};

			Detect.Browser.prototype.Chrome.prototype.setEngine = function(engine){
				if(engine)
					this.engine = engine;
			};

		/**
		 * Browser brand: Mozilla Firefox
		 *
		 * @since 1.3.0
		 */
		Detect.Browser.prototype.Firefox = function(){
			this.name = "firefox";
			this.engine = "gecko";
			this.version = "0.0.0";
			this.short_version = 0;
		};

			Detect.Browser.prototype.Firefox.prototype.setVersion = function(version){
				if(version){
					this.version = version; //format into long version
				}else {
					//determine version dynamically
					var _ua = window.navigator.userAgent,
						_ver = _ua.match(/Firefox\/[0-9-.]+/);

					this.version = _ver[0].match(/[0-9-.]+/)[0];
				}
			};

			Detect.Browser.prototype.Firefox.prototype.setEngine = function(engine){
				if(engine)
					this.engine = engine;
			};

		/**
		 * Browser brand: Microsoft Internet Explorer
		 *
		 * @since 1.3.0
		 */
		Detect.Browser.prototype.InternetExplorer = function(){
			this.name = "internet_explorer";
			this.engine = "trident";
			this.version = "0.0.0";
			this.short_version = 0;
		};

			Detect.Browser.prototype.InternetExplorer.prototype.setVersion = function(version){
				if(version){
					this.version = version; //format into long version
				}else {
					//determine version dynamically
					var _ua = window.navigator.userAgent,
						_ver = _ua.match(/MSIE\/[0-9-.]+/);

					this.version = _ver[0].match(/[0-9-.]+/)[0];
				}
			};

			Detect.Browser.prototype.InternetExplorer.prototype.setEngine = function(engine){
				if(engine)
					this.engine = engine;
			};

		/**
		 * Determine the user's browser
		 *
		 * TODO: Is this required?  Might be able to simplify/remove this method
		 * @param {object} options [Any required settings]
		 * @since  1.3.0
		 * @return {object}
		 */
		Detect.Browser.prototype.parse_browser_info = function(){
			var output = new this.Unknown();

			//safari/webkit
			if(/Version/.test(window.navigator.userAgent) && /Safari/.test(window.navigator.userAgent)){
				var Safari = new this.Safari();
					Safari.setVersion();

				output = Safari;
			}

			//chrome/blink
			if(/Chrome/.test(window.navigator.userAgent) && /AppleWebKit/.test(window.navigator.userAgent)){
				var Chrome = new this.Chrome();
					Chrome.setVersion();

				output = Chrome;
			}

			//firefox/gecko
			if(/(Firefox)/.test(window.navigator.userAgent)){
				var Firefox = new this.Firefox();
					Firefox.setVersion();
				
				output = Firefox;
			}

			if(/iPad/.test(window.navigator.userAgent)){
				var MobileSafari = new this.MobileSafari();
					MobileSafari.setVersion();

				output = MobileSafari;
			} 

			//ie/trident
			if(/MSIE/.test(window.navigator.userAgent)){
				var InternetExplorer = new this.InternetExplorer();
					InternetExplorer.setVersion();

				output = InternetExplorer;
			}

			//opera
			if(/Opera/.test(window.navigator.userAgent)){
				var Opera = new this.Opera();
					Opera.setVersion();

				output = Opera; //preliminary support
			}

			//populate short version property
			//output.short_version = this.utils.shortVersion(output.version);			

			return output;
		};

	/**
	 * [OS description]
	 * @param {[type]} parent [description]
	 */
	Detect.OS = function(parent){
		return this.parse_os_info(parent);
	};

		/**
		 * User's operating system text placeholders
		 *
		 * @since  1.3.0
		 * @type {Object}
		 */
		Detect.OS.prototype.UNKNOWN = function(bits){
			this.system = "UNKNOWN";
			this.architecture = (bits ? bits : 32);
		};

		Detect.OS.prototype.MAC = function(bits){
			this.system = "Mac";
			this.architecture = (bits ? bits : 32);
		};

		Detect.OS.prototype.WINDOWS = function(bits){
			this.system = "Windows";
			this.architecture = (bits ? bits : 32);
		};

		Detect.OS.prototype.LINUX = function(bits){
			this.system = "Linux";
			this.architecture = (bits ? bits : 32);
		};

		/**
		 * Determine the user's operating system
		 *
		 * @param {object} parent The Detect object
		 * @since  1.3.0
		 * @return {string}
		 */
		Detect.OS.prototype.parse_os_info = function(parent){
			var output = new this.UNKNOWN(),
				bits = parent.bits();

			switch(window.navigator.platform.toLowerCase().split(' ')[0]){
				case 'macintel':
				case 'macppc':
					output = new this.MAC(bits); break;

				case 'win32':
					output = new this.WINDOWS(bits); break;

				case 'linux':
					output = new this.LINUX(bits); break;
			}

			return output;
		};

	Detect.Plugins = function(){
		
	};

	Detect.Supports = function(){
		
	};

/**
 * A set of utility plugins for working with installed plugins
 * 
 * @since  1.2.0
 * @param {object} context [The Detect object]
 * @type {Object}
 */
Detect.Utils = function(output){
	/**
	 * Reference to the Detect object
	 *
	 * @type {object} The Detect object
	 */
	this.ref = output;

	/**
	 * Error strings
	 * @type {Object}
	 */
	this._errors = {
		NOT_FOUND: '%s Not Found',
	};
}

	/**
	 * Determine if a plugin is installed
	 *
	 * @param  {string}  plugin_slug [The slug to compare each installed plugin against]
	 * @since  1.0.0
	 * @return {Boolean}
	 */
	Detect.Utils.prototype.isInstalled = function(plugin_slug){
		var found = 0;

		if(plugin_slug && typeof this.ref.plugins === 'object'){
			for(var i = 0, plgs = this.ref.plugins.content; i < plgs.length; i++){
				if(plugin_slug === plgs[i].slug){
					found++;
				}
			}
		}

		return (found > 0);
	};

	/**
	 * Determine the version of a specified plugin
	 *
	 * @param  {string} plugin_slug [The slug to compare each installed plugin against]
	 * @since  1.0.0
	 * @return {mixed}
	 */
	Detect.Utils.prototype.getVersion = function(plugin_slug){
		var pattern = new RegExp("\d+(\d+)?", 'g');

		if(this.isInstalled(plugin_slug)){
			//if there is a version string in either the name or the description, we will use it
			if(pattern.test(plgs[i].name) || pattern.test(plgs[i].description)){
				return plgs[i].description.match(pattern).join('.');
			}
		}

		return this.sprintf(this._errors.NOT_FOUND, 'Plugin');
	};

	/**
	 * Generate a slug that is easier to remember than the real plugin name
	 *
	 * @param  {string} plugin [Plugin name to process]
	 * @since  1.0.0
	 * @return {string}
	 */
	Detect.Utils.prototype.slug = function(plugin){
		return plugin.split(' ').join('_').toLowerCase();
	};

	/**
	 * Sanitize plugin names to remove things like symbols and vesion numbers
	 * 
	 * @param  {string} plugin [Plugin name to process]
	 * @since  1.0.0
	 * @return {string}
	 */
	Detect.Utils.prototype.sanitize = function(plugin){
		var pattern = new RegExp('[a-zA-Z-_]+', 'gi');
		
		return pattern.exec(plugin);
	};

	/**
	 * Returns the major revision number from the long version string
	 * 
	 * @param  {string} longVersion
	 * @since  1.2.0
	 * @return {number}
	 */
	Detect.Utils.prototype.shortVersion = function(longVersion){
		if(_short = longVersion.split(".")[0])
			return parseInt(_short);
	};

	/**
	 * Format a string 
	 * TODO: more dynamic formatting
	 * 
	 * @since 1.0.0
	 * @return {String}
	 */
	Detect.Utils.prototype.sprintf = function(src, repl){
		return src.replace('%s', repl);
	};


/**
 * Testing for all possible user agents to ensure accuracy.  For development
 * purposes only!
 *
 * @since  1.2.0
 * @param  {object} context [The Detect object]
 * @return {object}
 */
Detect.Tests = function(){
	this.tests = {
		//tests to run (each one a function)
	};
};

	Detect.Tests.prototype.run = function(){

	};
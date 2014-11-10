/**
 * Detect - Get data from the browser, format it, profit
 *
 * @since  1.0.0
 * @type {Object}
 */
var Detect = function(config){
	//set options to either a default or the chosen value
	options = config || {};
	options.add_classes = !!config.add_classes;
	options.ignore = {
		plugins:  Detect.Utils.in_array("plugins", config.ignore),
		os:       Detect.Utils.in_array("os", config.ignore),
		browser:  Detect.Utils.in_array("browser", config.ignore),
		supports: Detect.Utils.in_array("supports", config.ignore),
	};

	return this.generate_output(options);
};

	/**
	 * Static version number
	 * 
	 * @since 1.0.0
	 * @type {Object}
	 */
	Detect.prototype._Version = '1.3.0';

	/**
	 * Creates and populates the properties of the Detect object
	 *
	 * @param {object} options
	 * @since  1.0.0
	 * @return {object} Aggregated data object
	 */
	Detect.prototype.generate_output = function(options){
		var output = {};
		
		if(false === options.ignore.plugins)
			output.plugins = new Detect.Plugins();

		if(false === options.ignore.os)
			output.os = new Detect.OS();

		if(false === options.ignore.browser)
			output.browser = new Detect.Browser();

		if(false === options.ignore.supports)
			output.supports = new Detect.Supports();

		if(options.add_classes)
			this.add_classes();
		
		return output;
	};

	/**
	 * Add classes to the body element if options.addBodyClasses is true
	 *
	 * @param {object} options
	 * @param {object} ref [The object we use to determine the proper class names]
	 * @since  1.3.0
	 * @return {void}
	 */
	Detect.prototype.add_classes = function(){
		var html_el = document.querySelector('html');

		for(var prop_1 in this.output){
			if(this.output[prop_1]){
				for(var prop_2 in this.output[prop_1]){
					switch(typeof this.output[prop_1][prop_2]){
						case "string":
							html_el.classList.add(prop_2 +"-"+ this.output[prop_1][prop_2].toLowerCase());
						break;

						case "number":
							html_el.classList.add(prop_2 +"-"+ this.output[prop_1][prop_2]);
						break;

						//plugin list
						case "object":				
							html_el.classList.add(Detect.Utils.slug('plugin-'+ this.output[prop_1][prop_2].name));
						break;
					}
				}
			}
		}
	};

	/**
	 * Determine the user's browser by matching various identifying properties
	 * against known values 
	 */
	Detect.Browser = function(){
		this.version = "0.0.0";
		this.short_version = 0;

		return this.parse_browser_info();
	};

		/**
		 * Set browser version properties either manually or dynamically
		 * 
		 * @since  1.3.2
		 * @param {string} version  The desired version number.  Optional.
		 */
		Detect.Browser.prototype.set_version = function(version){
			if(version){
				this.version = version;
			}else {
				//determine version dynamically
				var _ua = window.navigator.userAgent,
					_ver = _ua.match(this.regex);

				if(_ver[0])
					this.version = _ver[0].match(/[0-9-.]+/)[0];
			}

			//also set the major version number
			this.set_short_version();
		};

		/**
		 * Returns the major revision number from the long version string
		 * 
		 * @param  {string} version
		 * @since  1.3.2
		 * @return {number}
		 */
		Detect.Browser.prototype.set_short_version = function(version){
			if(version){
				this.short_version = version;
			}else {
				var _short = this.version.split(".")[0];

				if(_short)
					this.short_version = parseInt(_short);
			}
		}

		/**
		 * Browser brand: Unknown
		 *
		 * @since 1.3.0
		 */
		Detect.Browser.prototype.Unknown = function(){
			this.name = "unknown";
			this.engine = "unknown";
			this.regex = new RegExp();
		};

		Detect.Browser.prototype.Unknown.prototype = Detect.Browser.prototype;

		/**
		 * Browser brand: Apple Safari
		 *
		 * @since 1.3.0
		 */
		Detect.Browser.prototype.Safari = function(){
			this.name = "safari";
			this.engine = "webkit";
			this.regex = /Version\/[0-9-.]+/;
		};

		Detect.Browser.prototype.Safari.prototype = Detect.Browser.prototype;

		/**
		 * Browser brand: Apple Mobile Safari
		 *
		 * @since 1.3.1
		 */
		Detect.Browser.prototype.MobileSafari = function(){
			this.name = "mobile_safari";
			this.engine = "webkit";
			this.regex = /Version\/[0-9-.]+/;
		};

		Detect.Browser.prototype.MobileSafari.prototype = Detect.Browser.prototype;

		/**
		 * Browser brand: Google Chrome
		 *
		 * @since 1.3.0
		 */
		Detect.Browser.prototype.Chrome = function(){
			this.name = "chrome";
			this.engine = "blink";
			this.regex = /Chrome\/[0-9-.]+/;
		};

		Detect.Browser.prototype.Chrome.prototype = Detect.Browser.prototype;

		/**
		 * Browser brand: Mozilla Firefox
		 *
		 * @since 1.3.0
		 */
		Detect.Browser.prototype.Firefox = function(){
			this.name = "firefox";
			this.engine = "gecko";
			this.short_version = 0;
			this.regex = /Firefox\/[0-9-.]+/;
		};

		Detect.Browser.prototype.Firefox.prototype = Detect.Browser.prototype;

		/**
		 * Browser brand: Microsoft Internet Explorer
		 *
		 * @since 1.3.0
		 */
		Detect.Browser.prototype.InternetExplorer = function(){
			this.name = "internet_explorer";
			this.engine = "trident";
			this.regex = /rv\:[0-9-.]+/;
		};

		Detect.Browser.prototype.InternetExplorer.prototype = Detect.Browser.prototype;

		/**
		 * Determine the user's browser
		 *
		 * @since  1.3.0
		 * @return {Detect.Browser}
		 */
		Detect.Browser.prototype.parse_browser_info = function(){
			var output = new this.Unknown(),
				_ua = window.navigator.userAgent;

			//safari/webkit
			if(/Version/.test(_ua) && /Safari/.test(_ua)){
				output = new this.Safari();
			}

			//chrome/blink
			if(/Chrome/.test(_ua) && /AppleWebKit/.test(_ua)){
				output = new this.Chrome();
			}

			//firefox/gecko
			if(/(Firefox)/.test(_ua)){
				output = new this.Firefox();
			}

			if(/iPad/.test(_ua) || /iPhone/.test(_ua)){
				output = new this.MobileSafari();
			} 

			//ie
			if(/Trident/.test(_ua)){
				output = new this.InternetExplorer();
			}

			//opera
			if(/Opera/.test(_ua)){
				output = new this.Opera();
			}

			output.set_version();

			//don't need to expose output.regex to the final object, delete it
			delete output.regex;

			return output;
		};

	/**
	 * Determine the user's operating system and system architecture
	 */
	Detect.OS = function(){
		this.architecture = 32;
		this.version = 0;
		this.version_regex = new RegExp();

		return this.parse_os_info();
	};

		/**
		 * The default OS
		 *
		 * @since  1.3.0
		 * @type {Object}
		 */
		Detect.OS.prototype.Unknown = function(){
			this.system = "Unknown";
		};

		Detect.OS.prototype.Unknown.prototype = Detect.OS.prototype;

		/**
		 * OSX object prototype
		 *
		 * @since  1.3.0
		 * @type {Object}
		 */
		Detect.OS.prototype.Mac = function(){
			this.system = "Mac";
			this.version_regex = /Mac\ OS\ X\ [0-9-_]+/; 
		};

		Detect.OS.prototype.Mac.prototype = Detect.OS.prototype;

		/**
		 * Windows object prototype
		 *
		 * @since  1.3.0
		 * @type {Object}
		 */
		Detect.OS.prototype.Windows = function(){
			this.system = "Windows";
		};

		Detect.OS.prototype.Windows.prototype = Detect.OS.prototype;

		/**
		 * Linux object prototype
		 *
		 * @since  1.3.0
		 * @type {Object}
		 */
		Detect.OS.prototype.Linux = function(){
			this.system = "Linux";
		};

		Detect.OS.prototype.Linux.prototype = Detect.OS.prototype;

		/**
		 * Android OS object prototype
		 *
		 * @since  1.3.1
		 * @type {Object}
		 */
		Detect.OS.prototype.Android = function(){
			this.system = "Android";
		};

		Detect.OS.prototype.Android.prototype = Detect.OS.prototype;

		/**
		 * iOS object prototype
		 *
		 * @since  1.3.1
		 * @type {Object}
		 */
		Detect.OS.prototype.iOS = function(){
			this.system = "iOS";
		};

		Detect.OS.prototype.iOS.prototype = Detect.OS.prototype;

		/**
		 * Determine the user's operating system
		 *
		 * @since  1.3.0
		 * @return {Detect.OS}
		 */
		Detect.OS.prototype.parse_os_info = function(){
			var output = new this.Unknown(),
				_platform = window.navigator.platform.toLowerCase().split(' ');

			switch(_platform[0]){
				case "macintel":
					output = new this.Mac();
					output.set_architecture(64);
					output.set_version();
					break;

				case "macppc":
					output = new this.Mac(); 
					output.set_architecture(32);
					break;

				case "win32":
					output = new this.Windows(); 
					output.set_architecture(window.navigator.userAgent.match(/wow64/i) ? 64 : 32);
					break;

				case "linux":
					output = new this.Linux();
					output.set_architecture(/(86|64)/.test(_platform[1]) ? 64 : 32);
					break;

				case "ipad":
				case "iphone":
					output = new this.iOS(); 
					output.set_architecture(/(86|64)/.test(_platform[1]) ? 64 : 32); //TODO: test/fix this
					break;

				default:
					output.set_architecture(/(86|64)/.test(_platform[1]) ? 64 : 32);
			}

			//if there is a second part to the platform string, use it to get
			//more specific
			if(_platform[1]){
				if(_platform[1].match(/^arm/)){
					output = new this.Android();
					output.set_architecture(/(86|64)/.test(_platform[1]) ? 64 : 32); // TODO: test/fix this
				}
			}

			//don't need to expose this to the world, delete it from the object
			delete output.version_regex;

			return output;
		};

		/**
		 * Set the value of this.architecture
		 * 
		 * @since  1.3.3
		 * @return {void}
		 */
		Detect.OS.prototype.set_architecture = function(arch){
			if(arch && typeof arch == "number")
				this.architecture = arch;
		};

		/**
		 * Determine the specific OS version, sets the value of this.version
		 *
		 * @since  1.3.3
		 * @return {void}
		 */
		Detect.OS.prototype.set_version = function(){
			var _ua = window.navigator.userAgent,
				_os = null;

			if(_os = _ua.match(this.version_regex)){ //OSX, extract version number
				this.version = this.format_version(_os[0]);
			}
		};

		/**
		 * Format the version number so it's standard for all platforms
		 *
		 * @since  1.3.3
		 * @param  {String} version Raw version number to format
		 * @return {String}
		 */
		Detect.OS.prototype.format_version = function(version){
			//convert underscores to periods then strip out everything but
			//the numbers and any periods
			return version.replace(/_/g, ".").match(/[0-9-.]+/)[0];
		};

	/**
	 * Determine what plugins, if any, the browser is running
	 *
	 * @since  1.3.0
	 * @return {object}
	 */
	Detect.Plugins = function(){
		if(window.navigator.plugins && window.navigator.plugins.length > 1){
			for(var i = 0; i < window.navigator.plugins.length; i++){
				var plugin = window.navigator.plugins[i];

				this[Detect.Utils.slug(plugin.name)] = {name: plugin.name, description: plugin.description}
			}
		}
		
		return this;
	};

	/**
	 * Detect support for commonly used libraries like localstorage, websockets, 
	 * etc
	 *
	 * @since 1.3.0
	 */
	Detect.Supports = function(){
		var _libs = [
			"indexedDB", 
			"WebSocket", 
			"localStorage", 
			"classList", 
			"addEventListener", 
			"querySelector",
		];

		for(var lib in _libs){
			this[_libs[lib]] = (!!window[_libs[lib]] || !!document.body[_libs[lib]]);

			//throw errors for missing features
			if(!window[_libs[lib]] && !document.body[_libs[lib]]){
				console.error(Detect.Utils.format_error("LIB_NOT_FOUND", _libs[lib]));
			}
		}

		return this;
	};

	/**
	 * A set of utility plugins for working with installed plugins
	 * 
	 * @since  1.2.0
	 * @type {Object}
	 */
	Detect.Utils = {
		/**
		 * Error strings
		 * 
		 * @type {Object}
		 */
		_errors: {
			NOT_FOUND: "%s Not Found",
			LIB_NOT_FOUND: "%s is not supported by this browser",
		},
	};

		/**
		 * Determine if a plugin is installed
		 *
		 * @param  {string}  plugin_slug [The slug to compare each installed plugin against]
		 * @since  1.3.0
		 * @return {Boolean}
		 */
		Detect.Utils.is_installed = function(plugin_slug){
			var found = 0;

			if(plugin_slug && typeof window.navigator.plugins === 'object'){
				for(var i = 0, plgs = window.navigator.plugins; i < plgs.length; i++){
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
		 * @since  1.3.0
		 * @return {mixed}
		 */
		Detect.Utils.get_version = function(plugin_slug){
			var pattern = new RegExp("\d+(\d+)?", 'g');

			if(this.is_installed(plugin_slug)){
				//if there is a version string in either the name or the description, we will use it
				if(pattern.test(plgs[i].name) || pattern.test(plgs[i].description)){
					return plgs[i].description.match(pattern).join('.');
				}
			}

			return this.format_error("NOT_FOUND", "Plugin");
		};

		/**
		 * Generate a slug that is easier to remember than the real plugin name
		 *
		 * @param  {string} plugin [Plugin name to process]
		 * @since  1.0.0
		 * @return {string}
		 */
		Detect.Utils.slug = function(plugin){
			return plugin.split(' ').join('_').toLowerCase();
		};

		/**
		 * Sanitize plugin names to remove things like symbols and vesion numbers
		 * 
		 * @param  {string} plugin [Plugin name to process]
		 * @since  1.0.0
		 * @return {string}
		 */
		Detect.Utils.sanitize = function(plugin){
			var pattern = new RegExp('[a-zA-Z-_]+', 'gi');
			
			return pattern.exec(plugin);
		};

		/**
		 * Format a string
		 * TODO: more dynamic formatting
		 * 
		 * @since 1.0.0
		 * @return {String}
		 */
		Detect.Utils.sprintf = function(src, repl){
			return src.replace('%s', repl);
		};

		/**
		 * Determine if a key is present within an array
		 *
		 * @since  1.3.0
		 * @param  {string} needle   Value to search for
		 * @param  {mixed} haystack  Object or array to search
		 * @return {boolean}
		 */
		Detect.Utils.in_array = function(needle, haystack){
			if(typeof haystack === "object"){
				return haystack.indexOf(needle) > -1;
			}

			return false;
		};

		/**
		 * Use built-in error types to generate custom error strings
		 *
		 * @since  1.3.0
		 * @param  {string} type  Error type, must match something in this._errors
		 * @param  {string} repl  String replacement
		 * @return {string}
		 */
		Detect.Utils.format_error = function(type, repl){
			return this.sprintf(this._errors[type], repl);
		};
		
# Detect.js

Like the title says.  Fairly accurate browser detection, though I only had a chance to test it on Windows (Chrome/Firefox) and Linux (Chrome/Firefox).

## Examples

```
var info = new Detect({format: false});

To view the full object, console.log(info)

output: 
{
	browser: {
		short_version: browserShortVersion,
		name         : "browserName",
		engine       : "browserEngine", 
		version      : "browserVersion",
	},
	
	os: {
		architecture: systemBits,
		system: "systemName",
	},

	plugins: {
		[INSTALLED_PLUGINS_LIST]
	},

	supports: {
		[BROWSER_SUPPORTS_FEATURE_LIST]
	},
}
```

## Options

<table>
	<tr>
		<th>Key</th>
		<th>Value</th>
		<th>Type</th>
		<th>Default</th>
	</tr>
	<tr>
		<td>add_classes</td>
		<td>Add detected browser and system information to the class list of the HTML node.</td>
		<td>bool</td>
		<td>true</td>
	</tr>
	<tr>
		<td>ignore</td>
		<td>(plugins|os|browser|supports) - Remove the respective element from the output.</td>
		<td>object</td>
		<td>N/A</td>
	</tr>
</table>
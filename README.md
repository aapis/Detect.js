# Detect.js

Like the title says.  Fairly accurate browser detection, though I only had a chance to test it on Windows (Chrome/Firefox) and Linux (Chrome/Firefox).

## Examples

```
var info = new Detect({format: false});

To view the full object, console.log(info)

output: 
{
	browser: {
		name: 'browserName',
		engine: 'browserEngine', 
		version: 'browserVersion',
	},
	
	os: {
		bits: 'systemBits',
		system: 'systemName',
	},

	plugins: {
		content: [INSTALLED_PLUGIN_ARRAY]
	}
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
		<td>format</td>
		<td>Format for output in the browser (TRUE) or output to console (FALSE)</td>
		<td>bool</td>
		<td>false</td>
	</tr>
	<tr>
		<td>addClasses</td>
		<td>Add detected browser and system information to the class list of the HTML node.</td>
		<td>bool</td>
		<td>true</td>
	</tr>
	<tr>
		<td>classPrefix</td>
		<td>Add a prefix to classes on the body node, if the `addClasses` option is set to true.</td>
		<td>string</td>
		<td>default</td>
	</tr>
	<tr>
		<td>installPluginUtility</td>
		<td>Set whether or not to install the plugin utilities functions.</td>
		<td>bool</td>
		<td>true</td>
	</tr>
	<tr>
		<td>installTests</td>
		<td>Flag to install the testing utilities.</td>
		<td>bool</td>
		<td>false</td>
	</tr>
	<tr>
		<td>noPlugins</td>
		<td>Remove plugins from the output object (and don't add those classes to the HTML element).</td>
		<td>bool</td>
		<td>false</td>
	</tr>
	<tr>
		<td>noOS</td>
		<td>Remove OS data from the output object.</td>
		<td>bool</td>
		<td>false</td>
	</tr>
	<tr>
		<td>noBrowser</td>
		<td>Remove browser data from the output object.</td>
		<td>bool</td>
		<td>false</td>
	</tr>
</table>
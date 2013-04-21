# DetectBrowser

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
	<th>
		<td>Key</td>
		<td>Type</td>
		<td>Value</td>
		<td>Default</td>
	</th>
	<tr>
		<td>format</td>
		<td>bool</td>
		<td>Format for output in the browser (TRUE) or output to console (FALSE)</td>
		<td>false</td>
	</tr>
	<tr>
		<td>addClasses</td>
		<td>bool</td>
		<td>Add detected browser and system information to the class list of the body node.</td>
		<td>true</td>
	</tr>
	<tr>
		<td>classPrefix</td>
		<td>string</td>
		<td>Add a prefix to classes on the body node, if the `addClasses` option is set to true.</td>
		<td>default</td>
	</tr>
</table>
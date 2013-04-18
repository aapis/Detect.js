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
	os: 'OS',
	plugins: {
		content: [INSTALLED_PLUGIN_ARRAY]
	}
}
```

## Options

<table>
	<tr>
		<td>Key</td>
		<td>Value</td>
	</tr>
	<tr>
		<td>format</td>
		<td>{bool} Format for output in the browser (TRUE) or output to console (FALSE)</td>
	</tr>
</table>
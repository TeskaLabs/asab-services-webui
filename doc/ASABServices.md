# ASAB Services

ASAB WebUI Services is a page with a list of available instances. It use a websocket connection, so the data are propagated realtime.

## Setup

In `config` file, define ASAB Services as a service:

```
module.exports = {
	app: {

		...

	},
	webpackDevServer: {
		port: 3000,
		proxy: {
			'/api/asab_remote_control': {
				target: 'http://localhost:8086',
				ws: true,
				pathRewrite: {'^/api/asab_remote_control' : ''}
			},
		}
	}
}
```

In the top-level `index.js` of your ASAB UI application, load the ASAB services module

```
const modules = [];

...

import ServicesModule from '../asab-services-webui/src/modules/services';
modules.push(ServicesModule);

...

ReactDOM.render((
	<HashRouter>
		<Application modules={modules} defaultpath="/" configdefaults={ConfigDefaults}/>
	</HashRouter>
), document.getElementById('app'));
```

The module will be displayed as a subitem of `Maintenance` in the sidebar navigation.

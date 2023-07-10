import React from 'react';
import ReactDOM from 'react-dom';
import { Application } from 'asab-webui';
import { HashRouter } from 'react-router-dom';

// Configuration
let ConfigDefaults = {
	title: "ASAB Services",
	vendor: "TeskaLabs",
	website: "https://teskalabs.com",
	email: "info@teskalabs.com",
	brandImage: {
		light: {
			full: "media/logo/header-logo-full.svg",
			minimized: "media/logo/header-logo-minimized.svg",
		},
		dark: {
			full: "media/logo/header-logo-full-dark.svg",
			minimized: "media/logo/header-logo-minimized-dark.svg"
		}
	},
	sidebarLogo: {
		dark: {
			full: "media/logo/sidebar-logo-full.svg",
			minimized: "media/logo/sidebar-logo-minimized.svg"
		},
		light: {
			full: "media/logo/sidebar-logo-full-dark.svg",
			minimized: "media/logo/sidebar-logo-minimized-dark.svg"
		}
	},
	i18n: {
		fallbackLng: 'en',
		supportedLngs: ['en', 'cs'],
		debug: false,
		nsSeparator: false
	}
};

const modules = [];

// The load event is fired when the whole page has loaded. Adds classes which sets the styles
window.addEventListener('load', (event) => {
	document.body.classList.add('loaded')
})

// Load default modules
import I18nModule from 'asab-webui/modules/i18n';
modules.push(I18nModule);

import TenantModule from 'asab-webui/modules/tenant';
modules.push(TenantModule);

import AuthModule from 'asab-webui/modules/auth';
modules.push(AuthModule);

import AboutModule from 'asab-webui/modules/about';
modules.push(AboutModule);

// Load custom modules
import ServicesModule from './modules/services';
modules.push(ServicesModule);

// Render
ReactDOM.render((
	<HashRouter>
		<Application modules={modules} defaultpath="/services" configdefaults={ConfigDefaults}/>
	</HashRouter>
), document.getElementById('app'));

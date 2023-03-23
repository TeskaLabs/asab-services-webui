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
	brand_image: {
		full: "media/logo/header-full.svg",
		minimized: "media/logo/header-minimized.svg",
	},
	sidebarLogo: {
		full: "media/logo/sidebarlogo-full.svg",
		minimized: "media/logo/sidebarlogo-minimized.svg"
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
import HomeModule from './modules/home';
modules.push(HomeModule);

import ServicesModule from './modules/services';
modules.push(ServicesModule);

// Render
ReactDOM.render((
	<HashRouter>
		<Application modules={modules} defaultpath="/home" configdefaults={ConfigDefaults}/>
	</HashRouter>
), document.getElementById('app'));

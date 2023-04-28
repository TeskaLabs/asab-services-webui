import React, { Component, lazy } from 'react';
import Module from 'asab-webui/abc/Module';
const ServicesContainer = lazy(() => import("./containers/ServicesContainer"));
const InstanceDetailContainer = lazy(() => import("./containers/InstanceDetailContainer"));

import "./containers/services.scss";

export default class ServicesModule extends Module {
	constructor(app, name) {
		super(app, "ASABServicesModule");

		app.Router.addRoute({
			path: "/services",
			exact: true,
			name: "Services",
			component: ServicesContainer,
			resource: 'asab:service:access'
		});

		app.Router.addRoute({
			path: "/services/instance/:instance_id",
			exact: true,
			name: "Instance detail",
			component: InstanceDetailContainer,
			resource: 'asab:service:access'
		});

		// Check presence of Maintenance item in sidebar
		let items = app.Navigation.getItems()?.items;
		let isMaintenancePresent = false;
		items.forEach(itm => {
			// If Maintenance present, then append Microservices as a Maintenance subitem
			if (itm?.name == "Maintenance") {
				itm.children.push({
					name: "Services",
					url: "/services",
					icon: "cil-list",
					resource: 'asab:service:access'
				});
				isMaintenancePresent = true;
			}
		})

		// If Maintenance not present in sidebar navigation, add a Maintenance item
		if (!isMaintenancePresent) {
			app.Navigation.addItem({
				name: 'Maintenance',
				icon: "cil-apps-settings",
				children: [
					{
						name: "Services",
						url: "/services",
						icon: "cil-list",
						resource: 'asab:service:access'
					}
				]
			});
		}
	}
}

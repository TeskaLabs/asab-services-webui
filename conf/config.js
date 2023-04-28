module.exports = {
	app: {
	},
	devConfig: {
		MOCK_USERINFO: { // Simulate userinfo
			"email": "dev@dev.de",
			"phone": "123456789",
			"username": "Dev",
			"resources": ["authz:superuser"],
			"roles": ["default/Admin"],
			"sub": "devdb:dev:1abc2def3456",
			"tenants": ["default"]
		},
	},
	webpackDevServer: {
		port: 3020,
		proxy: {
			'/api/seacat-auth': {
				target: "http://localhost:8080",
				pathRewrite: { '^/api/seacat_auth': ''}
			},
			'/api/asab-remote-control': {
				target: "http://localhost:8083",
				ws: true,
				pathRewrite: {'^/api/asab-remote-control': ''}
			},
			'/api/asab-remote-control-1': {
				target: "http://localhost:8084"
			},
			'/api/asab-library-1': {
				target: "http://localhost:8084"
			},
			'/api/asab-config-1': {
				target: "http://localhost:8084"
			},
		}
	}
}

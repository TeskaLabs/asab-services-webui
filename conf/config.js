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
		port: 3010,
		proxy: {
			'/api/seacat_auth': {
				target: "http://localhost:8080",
				pathRewrite: { '^/api/seacat_auth': ''}
			},
			'/api/asab_remote_control ': {
				target: "http://localhost:8083",
				pathRewrite: {'^/api/asab_remote_control': ''}
			},
		}
	}
}

const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (req, res) => {
	let target = ''
	if (req.url.startsWith('/api')) {
		target = 'https://netease-cloud-music-api-eta-lilac.vercel.app/'
	}
	createProxyMiddleware({
		target,
		changeOrigin: true,
		pathRewrite: {
			'^/api/': '/'
		}
	})(req, res)
}
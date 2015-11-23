module.exports = {
	db: "mongodb://localhost/mea2n-ts",
	httpPort: process.env.PORT || 3030,
	httpsPort: process.env.HTTPS_PORT || 3443,
	redis: {
		httpPort: 6379,
		host: "localhost"
	},
};
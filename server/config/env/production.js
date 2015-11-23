module.exports = {
	db: "mongodb://chip82:bigbull82@ds041623.mongolab.com:41623/mea2n-ts",
	httpPort: process.env.PORT || 80,
	httpsPort: process.env.HTTPS_PORT || 3443,
	redis: {
		httpPort: 6379,
		host: "localhost"
	},
}
   
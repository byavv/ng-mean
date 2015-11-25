module.exports = function (app) {
	//api
	require("./user.routes")(app);
	
	app.route('*').get((req, res) => { res.render('index'); });	
	
};

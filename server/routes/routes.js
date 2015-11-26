module.exports = function (app) {
	//api
	require("./user.routes")(app);
	//default	
	app.route('*').get((req, res) => { res.render('index'); });		
};

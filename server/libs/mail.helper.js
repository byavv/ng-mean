var nodemailer = require("nodemailer");


exports.sendResetMail = function (to, from, content, options, done) {
	var smtpTransport = nodemailer.createTransport(options);
	var mailOptions = {
		to: to,
		from: from,
		subject: 'Password Reset',
		html: content
	};
	smtpTransport.sendMail(mailOptions, (err) => {
		return done(err);
	});
}
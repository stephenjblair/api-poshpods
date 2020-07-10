const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
// const creds = require('./config');

const app = express();
app.use(cors());
app.use(express.json());
app.get('/', (req, res) => res.send('Ready to gooooo'));
/* app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
}); */

const transport = {
	service: "Godaddy",
	auth: {
		user: process.env.USER,
		pass: process.env.PASS,
	},
};

const transporter = nodemailer.createTransport(transport);

transporter.verify(error => {
	if (error) {
		console.log(error);
	} else {
		console.log('Server is ready to take messages');
	}
});

app.post('/send', (req, res, next) => {
	const { name } = req.body;
	const { email } = req.body;
	const { number } = req.body;
	const { message } = req.body;
	const content = `name: ${name} \n email: ${email} \n number: ${number} \n message: ${message} `;

	const mail = {
		from: name,
		to: 'hello@poshpods.com', // Change to email address that you want to receive messages on
		subject: 'New Message from Contact Form',
		text: content,
	};

	transporter.sendMail(mail, err => {
		if (err) {
			console.log(err)
			res.json({
				msg: 'fail',
			});
		} else {
			console.log('win')
			res.json({
				msg: 'success',
			});
		}
		transporter.sendMail(
			{
				from: 'hello@poshpods.com',
				to: email,
				subject: 'Posh Pods Enquiry',
				text: `Thank you for contacting us!\n\nForm details\nName: ${name}\n Email: ${email}\n Message: ${message}`,
				attachments: [
					{
						path: './PoshPodsBrochure.pdf',
					},
				],
			},
			function (error, info) {
				if (error) {
					console.log(error);
				} else {
					console.log(`Message sent: ${info.response}`);
				}
			},
		);
	});
});

app.listen(3333, () => console.log('this is listening on port 3000'));

module.exports = app;

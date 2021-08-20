require('dotenv').config();
const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { v4: uuid4 } = require('uuid');
const File = require('../models/file');
const { relative } = require('path');

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, 'uploads/'),
	filename: (req, file, cb) => {
		const uniqueName = `${Date.now()}-${Math.round(
			Math.random() * 1e9
		)}${path.extname(file.originalname)}`;
		cb(null, uniqueName);
	},
});
let upload = multer({
	storage: storage,
	limits: { fileSize: 1000000 * 100 }, //100MB
}).single('myfile');

router.post('/', async (req, res) => {
	//Store file
	upload(req, res, async (err) => {
		// validate fields
		if (!req.file) {
			return res.status(500).send({ error: 'All fields are required' });
		}
		if (err) {
			return res.status(500).send({ error: err.message });
		}

		if (req.file) {
			//Store into database
			const file = new File({
				filename: req.file.filename,
				size: Number(req.file.size),
				uuid: uuid4(),
				path: req.file.path,
			});

			const response = await file.save();
			return res
				.status(200)
				.send({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
		}
	});
});

router.post('/send', async (req, res) => {
	const { uuid, emailTo, emailFrom } = req.body;
	//validate request
	if (!uuid || !emailTo || !emailFrom) {
		return res.status(422).send({ error: 'All fields are required' });
	}

	//Get Data from Database
	const file = await File.findOne({ uuid: uuid });
	if (file.sender) {
		return res.status(422).send({ error: 'Email already  sent' });
	}
	file.sender = emailFrom;
	file.reciever = emailTo;
	const response = await file.save();
	//send Email
	const sendMail = require('../services/emailService');
	sendMail({
		from: emailFrom,
		to: emailTo,
		subject: 'Inshare file sharing',
		text: `${emailFrom} shared a file with you`,
		html: require('../services/emailTemplate')({
			emailFrom,
			downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
			size: parseInt(file.size / 1000) + 'KB',
			expires: '24hrs',
		}),
	});
	return res.send({ success: true });
});

module.exports = router;

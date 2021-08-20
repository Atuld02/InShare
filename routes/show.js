const router = require('express').Router();
const File = require('../models/file');

router.get('/:uuid', async (req, res) => {
	try {
		const file = await File.findOne({ uuid: req.params.uuid });
		if (!file) {
			return res.render('download', { error: 'Link has been expired' });
		} else {
			return res.render('download', {
				uuid: file.uudi,
				filename: file.filename,
				fileSize: file.size,
				downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
				//http://localhost:5000/files/download/sfsdg-sdfgss-454fsd
			});
		}
	} catch (err) {
		return res.render('download', { error: 'Something went Wrong' });
	}
});

module.exports = router;

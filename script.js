const File = require('./models/file');
const fs = require('fs');
const connectDB = require('./config/db');
connectDB();

const fetchData = async () => {
	const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); //convert 24 hrs into milisecond and connvert in date format
	const files = await File.find({ createdAt: { $lt: pastDate } });
	if (files.length) {
		for (const file of files) {
			try {
				fs.unlinkSync(file.path); //remove from uploads folder
				await file.remove();
				console.log(`successfully deleted ${file.filename}`);
			} catch (error) {
				console.log(`Error while detelting file ${error}`);
			}
		}
		console.log('Jo Done');
	}
};
fetchData().then(process.exit);

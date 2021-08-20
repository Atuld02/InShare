require('dotenv').config();

const mongoose = require('mongoose');

function connectDB() {
	//Database Connection
	mongoose
		.connect(process.env.MONGO_CONNECTION_URL, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true,
			useFindAndModify: true,
		})
		.catch((err) => console.log('err', err));
	const connection = mongoose.connection;
	connection
		.once('open', () => {
			console.log('Database Connected');
		})
		.catch((err) => {
			console.log('Database Connection failed');
		});
}

module.exports = connectDB;

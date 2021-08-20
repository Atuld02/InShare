const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
connectDB();

//Template engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
//Router import
app.get('/', () => console.log('server is up'));

app.use(express.static('public'));
app.use(express.json());

//Cors
app.use(cors());
//Routes
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));

app.listen(PORT, () => {
	console.log(`listening on Port ${PORT}`);
});

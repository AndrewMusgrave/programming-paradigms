const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express();
const router = require('./routes/routes');
const path = require('path')

mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/blogcomments')
mongoose.connect('mongodb://localhost/blogcomments');

app.use(morgan('dev'));
app.use(cors());
// app.use(bodyParser.json({ type: '*/*' }));
// app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
router(app);

const port = process.env.PORT || 3090;
app.listen(port)
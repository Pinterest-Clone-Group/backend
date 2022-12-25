const express = require('express');
const routes = require('./routes/index.route');
require('dotenv').config();
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT;

// body parsing
app.use(express.json());
app.use(cookieParser());

// api router
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(PORT, 'Server is running');
});
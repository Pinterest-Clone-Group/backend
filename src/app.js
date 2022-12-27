const express = require('express');
const routes = require('./routes/index');
const cors = require('cors');
require('dotenv').config();
const {
    errorHandler,
    errorLogger,
} = require('./middlewares/error-handler.middleware');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT;

// body parsing
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// api router
app.use('/api', routes);

// error handler
app.use([errorHandler, errorLogger]);

app.listen(PORT, () => {
    console.log(PORT, 'Server is running');
});

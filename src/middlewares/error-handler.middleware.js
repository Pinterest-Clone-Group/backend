const errorLogger = (error, request, response, next) => {
    console.error(error); // error logging with winston module
    next(error);
};

const errorHandler = (error, req, res, next) => {
    console.log(error);
    if (error.name.includes('Sequelize')) {
        res.status(500).json({ errorMessage: 'Internal Server Error' });
    }
    res.status(error.status || 400).json({
        errorMessage: error.message || 'Unknwon Error.',
    });
};

module.exports = { errorLogger, errorHandler };
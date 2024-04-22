const accessLogStream = require('../logging.js');

// Log error and pass error to next error handling middleware 
async function logError(err, req, res, next) {
    accessLogStream.write(`${err.name}\n${err.message}\n${err.stack}\n`);
    next(err);
}

// For admin routes return error in response
async function adminError(err, req, res, next) {
    // Request was not authenticated -> pass to the generic error handler
    if (!req.admin) {
        return next(err);
    }

    if (err.name === 'DatabaseError') {
        res.status(400);
    }
    else {
        res.status(500);
    }

    res.json({name: err.name, message: err.message, stack: err.stack});
    res.end();
}

// Other routes return generic error
async function userError(err, req, res, next) {
    res.status(500);
    res.json({code: Response.SERVER_ERROR});
    res.end();
}

module.exports = {
    logError,
    adminError,
    userError
}

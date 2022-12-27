// No Parameter/missing value
class InvalidParamsError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status || 400;
        this.name = 'InvalidParamsError';
        if (!message) this.message = 'Invalid Data';
    }
}

// Validation Error
class ValidationError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status || 400;
        this.name = 'ValidationError';
        if (!message) this.message = 'Unknown Error';
    }
}

// User Auth Error
class AuthenticationError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status || 403;
        this.name = 'AuthenticationError';
        if (!message) this.message = 'Login Required to access';
    }
}

module.exports = { InvalidParamsError, ValidationError, AuthenticationError };

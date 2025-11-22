const CustomError = require("./CustomError");

class NotFoundError extends CustomError{
    constructor(){
        super("Not Found");
    }

    statusCode(){
        return 404;
    }
}

module.exports = NotFoundError;
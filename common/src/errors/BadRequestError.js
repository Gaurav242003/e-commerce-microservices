const CustomError = require("./CustomError");

class BadRequestError extends CustomError{
    constructor(message){
        super(message);
    }

    statusCode(){
        return 400;
    }
}

module.exports = BadRequestError;
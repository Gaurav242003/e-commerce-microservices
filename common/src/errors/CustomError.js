class CustomError extends Error{
    constructor(messsage){
        super(messsage);
        this.name = this.constructor.name;
    }

    statusCode(){
        return 500;
    }

    serializeErrors() {
        return [{message: this.message}];
    }
}

module.exports = CustomError;
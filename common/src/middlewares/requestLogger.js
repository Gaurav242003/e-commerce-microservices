const { v4: uuidv4 } = require("uuid");
const logger = require("../logger");

function requestLogger(req, res, next){
    const requestId = uuidv4();
    req.headers["x-request-id"] = requestId;

    logger.info({
        requestId,
        method: req.method,
        url: req.url
    });

    next();
}

module.exports = requestLogger;
const ErrorHandler = require("../utils/errorHandeler");

module.exports = (err, req, res, next) => {
    
    err.statusCode = err.statusCode || 500 ;
    err.message = err.message || "Internal Server error";


    /* Wrong MongoDb Id Error */

    if(err.name === "CastError"){
        const message = `Resource Not Found Or Id . Invalid : ${err.path}`;
         err = new ErrorHandler(message , 400)
    }


    /* Mongooose Duplicate Error */

    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message , 400)
    }

    /* Wrong JWT error */

    if(err.name === "JsonWebTokenError"){
        const message = `Json Web Token is invalid, try again`;
        err = new ErrorHandler(message , 400)
    }

    /* JWT Expire Error */

    if(err.name === "TokenExpiredError"){
        const message = `Json Web Token is Expired, try again`;
        err = new ErrorHandler(message , 400)
    }


    res.status(err.statusCode).json({
        success : false, 
        // error : err,
        message : err.message,
        // stackError : err.stack
    })
}

const ErrorHander = require("../utils/errorHandeler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModels");

/* To check wheather the user is before singn up or not and what conent should be shown to customer. */

const isAuthenticatedUser = catchAsyncError( async(req,res,next) => {

    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHander("Please Login to access this resource",401));
    }

    const decodedData = jwt.verify( token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);

    next();

});

const authorizeRoles =  (...roles) => {

    return (req,res,next) => {

    if(!roles.includes(req.user.role)){
        return next(new ErrorHander(`Role : ${req.user.role} is not allowed to access this resources.`,403));
        }
    next();

    }
};

module.exports = { isAuthenticatedUser, authorizeRoles };
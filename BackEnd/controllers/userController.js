const User = require("../models/userModels");
const ErrorHander = require("../utils/errorHandeler");
const catchAsyncError = require("../middleware/catchAsyncError");
const e = require("express");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const { finished } = require("nodemailer/lib/xoauth2");





/* Register a User  */

exports.registerUser = catchAsyncError( async (req,res,next) => {

    const { name, email, password} = req.body;
    const newUser = await User.create( {
        name,
        email,
        password,
        avatar : {
            public_id : "this is sample Image",
            url : "profileUrl"
        },
    });

    
    const token = newUser.getJWTToken();

    const SaveNewUser = await newUser.save();

    // res.status(201).json({
    //     success : true,
    //     SaveNewUser,
    //     token,
    // })

    sendToken(SaveNewUser,201,res);

});

/* For Login User Details */

exports.loginUser = catchAsyncError( async(req,res,next) => {

    const { email, password} = req.body;

    /* checking if User had given password and email */

    if(!email || !password){
        return next(new ErrorHander("Please Enter Email and Password",400));
    }
    
    const findUser = await User.findOne({ email })
    .select("+password");

    if(!findUser){
        return next(new ErrorHander("Invalid Email or Password",401))
    }

    const isPasswordMatch = await findUser.comparePassword(password);

    if(!isPasswordMatch){
        return next(new ErrorHander("Invalid Email or Password",401))
    }
    
    // const token = findUser.getJWTToken();

    // res.status(200).json({
    //     success : true,
    //     token,
    // })

    sendToken(findUser,200,res);

});



/*--- Log Out --- */

exports.logOut = catchAsyncError( async(req,res,next) => {

    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly : true
    })
    res.status(200).json({
        success : true,
        message : "LogOut Successfully"
    });

});


/* For ForGot Password */

exports.forgotPassword = catchAsyncError( async(req,res,next) => {

    const {email} = req.body;

    if(!email){
        return next(new ErrorHander("Please Enter your Email-Id",400))
    }
    
    const findUser = await User
        .findOne({ email })
        .select("+password");

    if(!findUser){
        return next(new ErrorHander("Please Enter Valid Email address",404))
    }

    const resetToken = findUser.getResetPasswordToken();

    await findUser.save({validateBeforeSave : false});

    /* Now Sending Email to User for verification of User */

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n\n If you have not requested this email then please ignore it.`;

    try{

        await sendEmail({
            email : findUser.email,
            subject : `${process.env.WEBSITE_NAME} Password Recovery Email`,
            message,
        });

        res.status(200).json({
            success : true,
            message : `Email has been Sent to your ${findUser.email} Successfully`
        });

    }catch (error) {

        findUser.resetPasswordToken = undefined;
        findUser.resetPasswordExpire = undefined;

        await findUser.save({validateBeforeSave : false});

        return next(new ErrorHander(`Email is not Verified and with this Error code or message ${error.message}`,500));
    }

});

/* For Reset Password */


exports.resetPassword = catchAsyncError( async(req,res,next) => {

    /* Creating Token hash */
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
    
    const findUserWithToken = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire : { $gt : Date.now() },
    });

    if(!findUserWithToken){
        return next(new ErrorHander("Reset password Token is invalid or has been expired ",400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHander("Password Does not Match",400));
    }

    findUserWithToken.password = req.body.password;

    findUserWithToken.resetPasswordToken = undefined;
    findUserWithToken.resetPasswordExpire = undefined;

    await findUserWithToken.save();

    sendToken(findUserWithToken,200,res);
});


/* Get All User Details --Admin*/

exports.getAllUserDetails = catchAsyncError( async( req,res,next) => {

    const Users = await User.find();

    res.status(200).json({
        success:true,
        Users
    })

});

/* Get single User Details --Admin*/

exports.getSingleUserAdmin = catchAsyncError( async( req,res,next) => {

    const userDetail = await User.findById(req.params.id);

    if(!userDetail){
        return next(new ErrorHander("User Not Found",400));
    }

    res.status(200).json({
        success : true,
        userDetail
    })

});


/* Get single user Detail */

exports.getUserDetail = catchAsyncError( async( req,res,next) => {

    const userDetail = await User.findById(req.user.id);

    res.status(200).json({
        success : true,
        userDetail
    })

});

/* update User password */

exports.updateUserPassword = catchAsyncError( async( req,res,next) => {

    const userDetail = await User.findById(req.user.id).select("+password");
    
    const isPasswordMatched =  await userDetail.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHander("Your old Password is not Matched",400));
    }

    if( req.body.newPassword !== req.body.newConfirmPassword){
        return next(new ErrorHander("Password should  be Match",400));
    }

    userDetail.password = req.body.newPassword;

    await userDetail.save();

    sendToken(userDetail,200,res);

}); 

/* update User Profile */

exports.updateUserProfile = catchAsyncError( async( req,res,next) => {

    const newUserData = {
        name : req.body.name,
        email : req.body.email,
        phoneNumber : req.body.phoneNumber,
    }

    // We will add Cloudinary later for avatar

    const userDetail = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new : true,
        runValidators : true,
        userFindAndModify : false,
    });
    
    res.status(200).json({
        success: true
    });
}); 

/* Update User Role -- Admin or User */

exports.updateUserRole = catchAsyncError( async( req,res,next) => {

    // const newUserData = {
    //     name : req.body.name,
    //     email : req.body.email,
    //     phoneNumber : req.body.phoneNumber,
    // }

    // We will add Cloudinary later for avatar

    const userDetail = await User.findByIdAndUpdate(req.params.id, {role : req.body.role }, {
        new : true,
        runValidators : true,
        userFindAndModify : false,
    });

    if(!userDetail){
        return next(new ErrorHander("User Not Found -- Please Enter Correct Id",400));
    }
    
    res.status(200).json({
        success: true
    });
}); 


/* Delete User -- Admin  */

exports.deleteProfile = catchAsyncError( async( req,res,next) => {


    const userDetail = await User.findById(req.params.id);

    if(!userDetail){
        return next(new ErrorHander("User Not Found -- Please Enter Correct Id",400));
    }

    await User.findByIdAndRemove(req.params.id);
    
    res.status(200).json({
        success: true,
        message : "User Deleted Successfully",
    });
}); 
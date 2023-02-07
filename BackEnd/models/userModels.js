const mongoose = require("mongoose");
const validator = require("validator");


/* Some UsefulThing to Require */
const bycrpt = require("bcryptjs"); /* Use for to Encrypt Password  */
const jwt = require("jsonwebtoken"); 
const crypto = require("crypto");

const profileSchema = new mongoose.Schema( {
    name : {
        type : String,
        required : [true, "Please Enter your Name"]
    },
    email : {
        type : String,
        required : [true, "Please Enter your Email Id "],
        unique : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Please Enter Valid Email Adress")
            }
        }
    },
    password : {
        type : String,
        required : [true, "Please Enter your Password"],
        select : false,

    },
    phoneNumber : {
        type : Number,
        required : [true, "Please Enter your PhoneNumber"],
        minLength : [2, "Mobile Number Must Be Greater than 2 Digit"],
        maxLength : [10, "Mobile Number Must Be lesser than 10 Digit"],
        default : 0011000100
    },
    avatar : {
        public_id  : {
            type : String,
            required : true,
        },
        url : {
            type : String,
            required : true,
        },
    },
    role : {
        type : String,
        default : "user"
    },

    resetPasswordToken : {
        type : String
    },
    
    resetPasswordExpire : {
        type : Date
    }
    
}); 


/* For Encryption Password and keys */

profileSchema.pre("save", async function(next){

    if(!this.isModified("password")){
        next();
    } 
    this.password = await bycrpt.hash(this.password,10);
    
});

/*   JWT TOKEN   */

profileSchema.methods.getJWTToken = function(){
    return ( jwt.sign({ id : this._id } , process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRE,
    }))
    // return jwt.sign({id:this._id})
}


/* Compare Password */

profileSchema.methods.comparePassword = async function(enteredPassword){
    return (await bycrpt.compare(enteredPassword, this.password));
    // const dw = await bycrpt.compare(enteredPassword, this.password)
    // console.log(bycrpt.compare(enteredPassword, this.password));
};



/* Reset Password */ /* IF user forget password then to reset that password */

profileSchema.methods.getResetPasswordToken =  function(){

    // gernating token

    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hashing and add to userSchema

    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 *60 *1000

    return resetToken;
};




const User = new mongoose.model("User",profileSchema);

module.exports = User;
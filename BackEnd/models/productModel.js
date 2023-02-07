const mongoose = require("mongoose");


const productSchema = new mongoose.Schema( {
    productName : {
        type : String,
        trim : true,
        required : [true , "Please Enter Product Name"]
    },
    decription : {
        type : String , 
        required : [true , "Please Enter Product Description"]
    },
    price : {
        type : Number,
        required : [true , "Please Enter Product Price"],
        maxLength : [6 , "Price Cant be so high" ]
    },
    ratings : {
        type : Number,
        default : 0
    },
    images : [
        {
        public_id : {
            type : String ,
            required : true
        },
        url : {
            type : String ,
            required : true
        }
        }
    ],
    category : {
        type : String, 
        required : [true , "Please Enter the Category Of Product"],
    },
    Stock : {
        type : Number, 
        required : [true , "Please Enter the Stock of Product"],
        maxLength : [ 5 , "Please enter Correct Stock available with you "],
        default : 1
    },
    numOfReviews : {
        type : Number,
        default : 0
    },
    reviews : [
        {   
            user : {
                type : mongoose.Schema.ObjectId,
                ref : "User",
                required : true,
        
            },
            name : {
                type : String,
                required : [true , "Please Enter your Name"]
            },
            rating : {
                type : Number, 
                default : 0
            },
            Comment : {
                type : String ,
                required : [true , "Please write Atleast Something About cant be Blank."]
            }
        }
    ],
    user : {
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true,

    },
    createdAt : {
        type : Date,
        default : Date.now()
    }

});




const Product =  new mongoose.model("Product" , productSchema );
module.exports = Product ;

const Product = require("../models/productModel");
const ErrorHander = require("../utils/errorHandeler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiSearch = require("../utils/searchApi");
const User = require("../models/userModels");



/* To Get All Product */

exports.getAllProducts = catchAsyncError(async(req ,res) => {


    /* Pagination */
    const resultPerPage = 3;
    const productCount =  await Product.countDocuments();

    /* For Searching the Details of Products */
    const apiSearchData = new ApiSearch(Product.find() , req.query)
    .search()
    .filter()
    .pagination(resultPerPage);

    const getAllProductsData = await apiSearchData.query;

    res.status(200).json({
        success : true,
        getAllProductsData,
        productCount
    })
    
    // res.status(200).send(getAllData);
});



/* To get Single Product */

exports.singleProduct = catchAsyncError(async(req,res,next) => {

    // const id = req.params._id;
    

    const productDetail = await Product.findById(req.params.id);
    
    // console.log(productDetail)
    
    if(!productDetail){
            return next(new ErrorHander("Product Not Found" , 404));
    }
    
    res.status(200).json({
        success : true,
        productDetail
    });
});



/* for single Product */

// exports.SingleProduct = async(req,res,next) => {

//     const _id = req.params.id;

//     const getSingleProduct = await Product.findById(_id);

//     res.status(200).json({
//         success : true, 
//         getSingleProduct
//     })

// };




/*  For Create Product --Admin  */
exports.createProduct  = catchAsyncError(async(req,res,next) => {

    /* This is done because to add the which admin user has upload this products */
    req.body.user = req.user.id;

    const newProduct = await Product.create(req.body);

    res.status(201).json({
        success : true,
        newProduct
    });

});


/*  Create a New review or Updating a old Review both can be done by single function  */

exports.createProductReview  = catchAsyncError(async(req,res,next) => {


    const {rating, Comment, productId} = req.body

    const review = {
            user : req.user._id, 
            name : req.user.name,
            rating : Number(rating),
            Comment : Comment,
        };
    
    const findProduct = await Product.findById(productId); 

    const isReviewed = findProduct.reviews.find( (rev) => rev.user.toString() === req.user.id.toString() );

    if(isReviewed){

        findProduct.reviews.forEach( (rev) => {
            if(rev.user.toString() === req.user._id.toString()){
                (rev.rating = rating),
                (rev.Comment = Comment);
            }
        });     
    }
    else{
        findProduct.reviews.push(review);
        findProduct.numOfReviews = findProduct.reviews.length;
    }

    let average=0;

    findProduct.reviews.forEach( (rev) =>{

        average = average + rev.rating; 

    });
    
    findProduct.ratings = (average/(findProduct.reviews.length));


    await findProduct.save({
        validateBeforeSave : false,
    });

    res.status(201).json({
        success : true,
        findProduct
    });

});


/* Update Product --Admin */

exports.updateProduct  = catchAsyncError(async(req,res,next) => {

    let _id = req.params.id;

    let productDetail = await Product.findById(_id);

    if(!productDetail){
            return next(new ErrorHander("Product Not Found" , 404));
    }


    let UpdateProduct = await Product.findByIdAndUpdate(_id ,req.body,{
        new : true ,
        runValidators : true,
        useFindAndModify : false 
    });

    res.status(200).json({
        success : true,
        UpdateProduct
    });
});


/* For Delete Product --Admin */
exports.deleteProduct  = catchAsyncError(async(req,res,next) => {

    let _id = req.params.id;

    let productDetail = await Product.findById(_id);

    if(!productDetail){
        return next(new ErrorHander("Product Not Found" , 404));
    }


    await productDetail.remove();

    res.status(200).json({
        success : true,
        message : " Product Delete Successfully"
    });
});


/* To Get All Product(single) Reviews */


exports.getProductReview  = catchAsyncError(async(req,res,next) => {

    const findProduct = await Product.findById(req.query.id); 

    if(!findProduct){
        return next(new ErrorHander("Product Not Found",400));
    }

    res.status(201).json({
        success : true,
        reviews : findProduct.reviews
    });

});

exports.deleteReview = catchAsyncError( async(req,res,next) => {

    const findProduct = await Product.findById(req.query.productId);
    
    if(!findProduct){
        return next(new ErrorHander("Product Not Found",400));
    }

    const reviews = findProduct.reviews.filter(
        (rev) => rev._id.toString() !== req.query.id.toString()
    );

    let average=0;

    reviews.forEach( (rev) =>{

        average = average + rev.rating; 

    });
    
    const ratings = (average/(reviews.length));

    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId,
        {
        reviews,
        numOfReviews,
        ratings
    },
    {
        new : true,
        runValidators : true,
        useFindAndModify : false,
    }
);


    res.status(201).json({
        success : true,
        message : "review delete Successfully"
    });
});














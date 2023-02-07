const Express = require("express");
const { get } = require("mongoose");
const router = Express.Router();


// router.get("/", (req,res) => {
//     req.query.keyword
// })

const { getAllProducts, createProduct, updateProduct, deleteProduct, singleProduct, createProductReview, getProductReview } = require("../controllers/productController");
const {isAuthenticatedUser, authorizeRoles} = require("../middleware/auth");
const { route } = require("./userRoutes");


router.route("/products")
.get(getAllProducts); 

router.route("/admin/product/new")
.post(isAuthenticatedUser,authorizeRoles("admin"),createProduct);  

router.route("/admin/product/:id")
.put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct)
.delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct)

router.route("/product/:id").get(singleProduct);

router.route("/review").put(isAuthenticatedUser,createProductReview);


router.route("/reviews").get(isAuthenticatedUser,getProductReview);


// router.route("/product/:id").get(SingleProduct);    

// router.route("/product/:id").get(singleProduct);  

// router.route("/product/:id").delete(deleteProduct);  



module.exports  = router ;
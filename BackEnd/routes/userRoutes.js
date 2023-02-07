const Express = require("express");
const router = Express.Router();
const { registerUser, loginUser, logOut, forgotPassword, resetPassword, getUserDetail, getAllUserDetails, updateUserPassword, updateUserProfile, getSingleUserAdmin, updateUserRole, deleteProfile } = require("../controllers/userController");
const {isAuthenticatedUser, authorizeRoles} = require("../middleware/auth");


/* New User */
router.route("/register").post(registerUser);

/* Login Details */
router.route("/login").get(loginUser);

/* User Detail */
router.route("/me").get(isAuthenticatedUser,getUserDetail);

/* Forget Password */
router.route("/password/forgot").post(forgotPassword);

/* Forget Password */
router.route("/password/reset/:token").put(resetPassword);

/* LogOut */
router.route("/logout").get(logOut);

/* update User Password */
router.route("/password/update").put(isAuthenticatedUser,updateUserPassword);

/* update User Profile */
router.route("/me/update").put(isAuthenticatedUser,updateUserProfile);

/* get All Users Details  -- Admin */
router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUserDetails);

/* get single Users Details  -- Admin */
router.route("/admin/user/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getSingleUserAdmin);


/* Delete User Profile */
router.route("/admin/user/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateUserRole);

/* get single Users Details  -- Admin */
router.route("/admin/user/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProfile);








module.exports = router;
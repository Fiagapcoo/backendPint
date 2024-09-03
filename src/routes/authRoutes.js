const express = require("express");
const {
  validation,
  validation_noenc,
} = require("../controllers/jwt_middlewareController");
const router = express.Router();
const authController = require("../controllers/authController");
//const passport = require("../config/passport-setup");

router.post("/register", authController.register);
router.post("/setup-password", validation, authController.setupPassword);
router.patch(
  "/change-password",
  validation,
  authController.updatePassword
);
router.post("/login", authController.login_web);
router.post("/login_mobile", authController.login_mobile);
/* @DEPRECATED
router.post("/login_google", authController.login_google);
*/
router.post("/login_sso", authController.login_SSO);

router.get("/get-user-by-token", validation, authController.getUserByToken);
router.post("/refresh-token", authController.refreshToken);
//router.put('/update-last-access', validation, authController.updateLastAccess);
router.post("/change-password", validation, authController.updatePassword);

router.post("/request-password-reset", authController.startRecoveryPassword);
router.post("/password-reset", authController.resetPassword);


router.patch("/store-fcm-token", validation ,authController.updateFcmToken);

/*
// Google Auth
router.get('/google', passport.authenticate('google', {  //it knows it has to active the google strategy in passport-setup
  scope: ['profile', 'email'] // what we want to retrieve from the user profile (in an array)
}));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.redirect(`${process.env.CLIENT_URL}/?token=${token}`);
});

// Facebook Auth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), (req, res) => {
  const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.redirect(`${process.env.CLIENT_URL}/?token=${token}`);
});
*/
module.exports = router;

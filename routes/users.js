const express = require('express');
const router = express.Router();
const passport = require('passport');
// const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users')



router.route('/signUp')
    .get(users.renderSignUp)
    .post(catchAsync(users.signUp));

router.route('/otpVerify')
    .get(users.renderOtpVerify)
    .post(users.otpVerify);

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true }), users.login);

router.route('/confirmCp')
    .get(users.renderConfirmCp)
    .post(users.confirmCp);

router.route('/changePassword')
    .get(users.renderChangePassword)
    .post(users.changePassword);


router.get('/auth/google', users.google)


router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/', failureFlash: true, successFlash: true }), users.googleCallBack)

router.get('/logout', users.logout);

module.exports = router;
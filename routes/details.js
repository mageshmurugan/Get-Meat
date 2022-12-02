const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');

const details = require('../controllers/details')

const { isLoggedIn } = require('../middleware');


// router.route('/buyMeat')
//     .get(isLoggedIn, details.renderBuyMeat)

// router.route('/buyMeat')
//     .post(isLoggedIn, details.buyMeat);

router.route('/confirm')
    .get(isLoggedIn, details.renderConfirm);
// .post(isLoggedIn, catchAsync(details.confirm));

router.route('/address')
    .get(isLoggedIn, details.renderAddress)
    .post(isLoggedIn, details.address);


module.exports = router;

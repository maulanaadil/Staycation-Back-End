const router = require('express').Router();
const apiController = require('../controllers/apiController');
const { upload } = require('../middlewares/multer');

// ENDPOINT SIGN IN
router.get('/landing-page', apiController.landingPage);
router.get('/detail-page/:id', apiController.detailPage);
router.post('/booking-page', upload, apiController.bookingPage);

// FOR MOBILE
router.get('/home-page', apiController.homePage);
router.get('/detail-page-mobile/:id', apiController.detailPageMobile);

module.exports = router;

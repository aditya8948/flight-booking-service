const express = require('express');

const router = express.Router();

const {infoController} = require('../../controllers');
const bookingRoutes  = require('./booking_routes');


router.get('/info' , infoController.info);

router.use('/booking', bookingRoutes);
    

module.exports = router ;
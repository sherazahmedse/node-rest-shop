const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user.js');

router.post('/signup' , (req,res,next) => {
    console.log('User Sign up'); 

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: req.body.password
    });

});


router.get('/' , (req,res,next) => {});


module.exports = router;
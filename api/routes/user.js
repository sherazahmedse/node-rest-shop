const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const User = require('../models/user.js');

router.post('/signup' , (req,res,next) => {
    console.log('User Sign up'); 

    bcrypt.hash( req.body.password,10,(err ,hash)=> {
        if(err){
            return res.status(500).json({
                error: err
            });
        }
        else{
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
            });
            user.save().then().catch()
        
        }
    });


});


router.get('/' , (req,res,next) => {});


module.exports = router;
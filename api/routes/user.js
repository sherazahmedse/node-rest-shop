const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const User = require('../models/user.js');

router.post('/signup' , (req,res,next) => {
    console.log('User Sign up'); 

    console.log('CHECKING IF USER EMAIL IS AVAILABLE'); 
    
    User.findOne({email : req.body.email})
    .then(result=> {
        console.log('User found : ' , result);
        if(result) {
            return res.status(409).json({
                message: "User With an eamil already exists"
            });
        }
        else 
        {
            console.log('SAVING USER');
            bcrypt.hash( req.body.password,10,(err ,hash)=> {
                if(err) { 
                    return res.status(500).json({
                        error: err
                    });
                }
                else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                    .then(result => {
                        console.log(result)
                        return res.status(201).json({
                            message: "User Created",
                        });
                    })
                    .catch(err => { 
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            });
        }
    })





});

router.get('/' , (req,res,next) => {
    
    console.log('Get All Users');
    User.find()
    .select('_id email')
    .exec()
    .then(users => {

        const response = {
            count: users.lenght,
            users: users.map(user => {
                return {
                    _id: user._id,
                    email: user.email,
                } 
            }) 
        }    

        return res.status(200).json(response);
    })
    .catch(err => {
        return res.status(500).json({
            error: err
        })
    });


});

router.delete('/:userId' , (req,res,next) => {
    
    console.log('Deleting User');
    console.log('First Check if User exists');
    const id = req.params.userId;
    
    User.findById(id).
    select('_id email')
    .then(user => {
        if(user) { 
            console.log('User Exits');
            User.remove({_id : user._id})
            .exec()
            .then( result => {
                return res.status(200).json({
                    message: "User Deleted",
                    deletedUser: user
                }); 
            })
            .catch(err => {
                return res.status(500).json( {
                    error: err
                });
            })
        }
        else {
            console.log('User Does not exists');
            return res.status(404).json({
                message: "User Does Not Exists"
            })
        }
    })
    .catch(err => { 
        return res.status(500).json({
            error: err
        })
    });

    
});


module.exports = router;
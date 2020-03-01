const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');


exports.user_get_all = (req,res,next) => {
    
    console.log('Get All Users');
    User.find()
    .select('_id email password')
    .exec()
    .then(users => {

        const response = {
            count: users.lenght,
            users: users.map(user => {
                return {
                    _id: user._id,
                    email: user.email,
                    password : user.password
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


} 

exports.user_deleteOne = (req,res,next) => {
    
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

    
} 

exports.user_signup =  (req,res,next) => {
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





}

exports.user_login = (req,res,next) => {
    console.log('Logging user in');
    
    console.log('Check if user with this email exists');
    
    User.findOne({email: req.body.email})
    .exec()
    .then(user => {
        if(!user) {
            return res.status(401).json({
                message: "Auth Failed"
            })
        } 
        console.log('Check hash');
        console.log('req.body.password' , req.body.password);
        console.log('user.password' , user.password);

        bcrypt.compare(req.body.password,user.password ,(err,result) => {
            
            if(err) {
                console.log('err => ', err)
                return res.status(401).json({
                    message: "Auth Failed"
                });
            }
            if(result) {
                // GIVE TOKEN
                console.log('ASDASDASDASD');

                const token = jwt.sign(
                    {                           // PAYLOAD 
                        email: user.email,
                        userId: user._id
                    },
                    process.env.JWT_KEY,      // Secret Key  
                    // {                         // OPTIONS
                    //     expriesIn: "1h",
                    // }
                )
                return res.status(200).json({
                    message: "Auth Successful",
                    token: token
                })
            }
            console.log('at the end => ', err)
            res.status(401).json({
                message: "Auth Failed"
            })
        });
    })
    .catch(err => {
        return res.status(500).json({
            error: err
        })
    });
}
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models//product');

router.get('/' , (req,res,next) => {
    console.log("Getting All Orders ");
 
    Order.find()
    .select("_id product quantity")
    .populate("product" , "name")
    .exec()
    .then( orders => {

        const response = {
            count : orders.length ,
            orders : orders.map(order => {
                return {
                    _id : order._id,
                    product : order.product,
                    quantity : order.quantity,
                    request: {
                        type : "GET", 
                        url : "http://localhost:4000/orders/" + order._id
                    } 
                } 
            })
        }; 

        res.status(200).json(response);
    })
    .catch(err => {
        res.status(500).json({
            error : err
        })
    } );
});

router.get('/:orderId' , (req,res,next) => {    
    
    const id = req.params.orderId;
   
    Order.findById(id)
    .select("product _id quantity")
    .populate("product")
    .exec()
    .then(order => {
        if(!order) {
            res.status(404).json({
                message: "Order Not Found"
            });
        }
        res.status(200).json({
            order : order
        });
    })
    .catch(err => {
        res.status(200).json({
            error: err
        });
    });
    
});

router.post('/' , (req,res,next) => {

    Product.findById(req.body.productId)
    .then( product => {

        if(!product){
            return res.status(404).json({
                message: "Prodcut Not Found"
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            product: req.body.productId,
            quantity: req.body.quantity,
        });    
        
        return order.save();
    })
    .then(result=>{
        res.status(201).json({
            message : "order was created",
            orderCreated : {
                id: result._id,
                product: result.product,
                quantity: result.quantity
            } ,
            request: {
                type : "GET", 
                url : "http://localhost:4000/orders/"+ result._id
            } 
        }); 
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error : err}); 
    });
});

router.delete('/:orderId' , (req,res,next) => {
    const id = req.params.orderId;
    Order.findById(id)
    .then(order => {
        if(!order){
            res.status(404).json({
                message: "Order Was not Found"
            })
        }
        return Order.remove({_id: id}).exec();
    })
    .then(result => {
        res.status(200).json({
            message: "Order Was Deleted"
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }); 
});



module.exports = router;
const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');


router.get('/', (req,res,next)=> {
    console.log('Getting All Products');
    Product.find()
    .exec()
    .then(documents => {
        console.log('All Found Documnet = > ' , documents);
        res.status(200).json(documents);
    })
    .catch(err => {
        console.log('err -> ', err);
        res.status.json({
            error: err
        });
    });

});

router.get('/:productId' , (req,res,next) => {
    const id = req.params.productId; 
    console.log('Getting the Product By ID => ' , id);

    Product.findById(id)
    .exec()
    .then(document => {
        console.log('document => ', document);
        if(document){
            res.status(200).json(document);
        }
        else{
            res.status(404).json({
                message: "No Valid Entry Found for the id => " + id
            })
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });  
    });
});

router.post('/', (req,res,next)=> {

    console.log('Saving Product');

    const product = new Product({
        _id : new mongoose.Types.ObjectId(), 
        name: req.body.name, 
        price: req.body.price
    });
    

    product.save().then(result=>{
        res.status(201).json({
            message : "Saved Product",
            createdProduct : result
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });

});

router.patch('/:productId' , (req,res,next) => {
    console.log('Updating Product');
    console.log('req.body ' , req.body);

    const id = req.params.productId;
    const updateOps = {};

    console.log('for each ');
    for(const ops of     req.body)
    {
        console.log('ops => ', ops);
        updateOps[ops.propName] = ops.value;  
    }

    

    Product.update(
        {_id : id} , 
        updateOps
    ).exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            error : err 
        })
    });

});

router.delete('/:productId' , (req,res,next) => {
    
    const id = req.params.productId;

    Product.remove({_id : id})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error : err
        });
    }); 


 });

module.exports = router;
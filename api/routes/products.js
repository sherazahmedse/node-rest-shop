const express = require('express');
const router = express.Router();

router.get('/', (req,res,next)=> {
    res.status(200).json({
        message : "Handling GET request on /products"
    });
});

router.get('/:productId' , (req,res,next) => {
    const id = req.params.productId; 
    if(id == 'special'){
        res.status(200).json({
            message: "You discovered the special product"
        })
    }
    else {
        res.status(200).json( {
            message: "You have passed an ID"   
        });
    } 
});


router.post('/', (req,res,next)=> {
    res.status(201).json({
        message : "Handling POST request on /products"
    });
});

router.patch('/:productId' , (req,res,next) => {
   res.status(200).json({
       message : "updated product"
   });
});

router.delete('/:productId' , (req,res,next) => {
    res.status(200).json({
        message : "deleted product"
    });
 });

module.exports = router;
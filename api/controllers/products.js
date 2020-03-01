const Product = require('../models/product');
const mongoose = require('mongoose');

exports.products_get_all =  (req,res,next)=> {
    console.log('Getting All Products');
    Product.find()
    .select("name price _id productImage")
    .exec()
    .then(documents => {
        const response = {
            count: documents.length , 
            products: documents.map(doc => {
                return {
                    name : doc.name,
                    price : doc.price, 
                    _id : doc.id , 
                    productImage: doc.productImage,
                    request : {
                        type : "GET", 
                        url : "http://localhost:4000/products/" + doc.id
                    } 
                }
            })
        } 

        console.log('All Found Documnet = > ' , response);
        res.status(200).json(response);
    })
    .catch(err => {
        console.log('err -> ', err);
        res.status(500).json({
            error: err
        });
    });

}

exports.products_get_productByID =(req,res,next) => {
    const id = req.params.productId; 
    console.log('Getting the Product By ID => ' , id);

    Product.findById(id)
    .select("name _id price productImage")
    .exec()
    .then(document => {
        if(document){
            res.status(200).json({
                product : document,
                request : {
                    type : "GET", 
                    url : "http://localhost:4000/products/"
                }
            });
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
}

exports.products_create = (req,res,next)=> {

    console.log(req.file);

    console.log('Saving Product');

    const product = new Product({
        _id : new mongoose.Types.ObjectId(), 
        name: req.body.name, 
        price: req.body.price,
        productImage: req.file.path
    });
    
 
    product.save().then(result=>{
        res.status(201).json({
            message : "Saved Product",
            request : {
                name : result.name,
                price : result.price, 
                _id : result.id , 
                request : {
                    type : "GET", 
                    url : "http://localhost:4000/products/" + result.id
                } 
            }
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });

}

exports.products_update = (req,res,next) => {
    console.log('Updating Product');
    console.log('req.body ' , req.body);

    const id = req.params.productId;
    const updateOps = {};

    console.log('for each ');
      
    // req.body.forEach(ops => {
    //     console.log('ops => ', ops);
    //     updateOps[ops.propName] = ops.value;  
    // });
    
    for(const ops of req.body)
    {
        console.log('ops => ', ops);
        updateOps[ops.propName] = ops.value;  
    }

    

    Product.update(
        {_id : id} , 
        updateOps
    ).exec()
    .then(result => {
        res.status(200).json({  
            message : "Product Updated",
            request: {
                type : "GET",
                url : "http://localhost:4000/products/" + id
            }
        });
    })
    .catch( err => {
        console.log(err);
        res.status(500).json({
            error : err 
        })
    });

}

exports.products_delete =  (req,res,next) => {
    
    const id = req.params.productId;
    Product.findById(id)
    .select("_id")
    .exec()
    .then(doc => {
        console.log(doc);
        if(doc) 
        {
            Product.remove({_id : id})
            .exec()
            .then(result => {
                res.status(200).json({
                    message : "Product Deleted",
                    request: {
                        type : "POST",
                        url : "http://localhost:4000/products/" ,
                        body : {
                            name : "String" , price : "Number"
                        }
                    }
                });
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    error : err
                });
            }); 
        } 
        else {
            res.status(500).json({
                message : "No Product Found",
                request: {
                    type : "POST",
                    url : "http://localhost:4000/products/" ,
                    body : {
                        name : "String" , price : "Number"
                    }
                }
            });
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            message: "Product Not Found",
            error : err
        });
    }); 
 }

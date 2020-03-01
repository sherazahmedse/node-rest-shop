const express = require('express');
const router = express.Router();
const multur = require('multer');
const checkAuth = require('../middleware/check-auth');

const productController = require('../controllers/products');

const storage = multur.diskStorage({
    destination: function(req,file,cb) {
        cb(null,"./upload/")
    },
    filename: function(req,file,cb){
        cb(null,new Date().toISOString()+file.originalname);
    },
});

const fileFilter = (req, file ,cd ) => {
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png" )
    {
        cd(null,true);
    }
    else
    {
        cd(null,false);
    }
}

const upload = multur({
    storage : storage , 
    limits : {fileSize: 1024 * 1024 * 5 } ,
    fileFilter : fileFilter
});

// Unprotected route
router.get('/', productController.products_get_all);

// Unprotected route
router.get('/:productId' ,productController.products_get_productByID );

// Protected route
router.post('/',checkAuth ,upload.single('productImage') , productController.products_create);

// Protected route
router.patch('/:productId' ,checkAuth, productController.products_update);


// Protected route
router.delete('/:productId' ,checkAuth, productController.products_delete);

module.exports = router;
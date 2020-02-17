
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://node-shop:'
    + process.env.MONGO_ATLAS_PW +
    '@cluster0-pmvml.mongodb.net/test?retryWrites=true&w=majority');

app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());



app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-headers', 'Origin,X-Requested-With, Content-Type, Accept, Authorization');

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});



const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

app.use('/products', productRoutes);
app.use('/orders',ordersRoutes);

app.use((req,res,next) => {
  
    const error = new Error('Not Found');
    error.status = 404;
    next(error);

});

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error : {
            message: error.message
        }
    });
});


module.exports = app;
const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const orderController = require('../controllers/orders');

// Protected route
router.get('/',checkAuth , orderController.orders_get_all);

// Protected route
router.get('/:orderId' ,checkAuth, orderController.orders_get_orderById);

// Protected route
router.post('/',checkAuth ,orderController.orders_create_order);

// Protected route
router.delete('/:orderId' ,checkAuth, orderController.orders_delete_order);


module.exports = router;
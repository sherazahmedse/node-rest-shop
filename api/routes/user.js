const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth')

router.get('/' , UserController.user_get_all);

router.delete('/:userId', checkAuth,  UserController.user_deleteOne);

router.post('/signup' ,UserController.user_signup);

router.post('/login',UserController.user_login );

module.exports = router;
const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');
const { verifyToken } = require('../middleware/auth');

router.post('/login', authController.login);
router.get('/check', verifyToken ,authController.check);

module.exports = router;
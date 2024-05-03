const express = require('express');
const { register, login } = require('../controllers/authControllers');
const upload = require('../middleware/multer.middleware');


const router = express.Router();

router.post('/register',upload.single('avatar'), register);
router.post('/login',login)

module.exports = router
const express = require('express');
const { register, login, getAllUser } = require('../controllers/authControllers');
const upload = require('../middleware/multer.middleware');
const fetchUser = require('../middleware/fetchUser.middleware');


const router = express.Router();

router.post('/register',upload.single('avatar'),register);
router.post('/login',login)
router.get('/get-all-user' , fetchUser , getAllUser)

module.exports = router
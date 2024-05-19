const express = require('express');
const { newMessage, getAllMessage } = require('../controllers/messageController');
const upload = require('../middleware/multer.middleware');

const router = express.Router();

router.post('/add',upload.single('file') , newMessage);
router.post('/get/:id' , getAllMessage);

module.exports = router
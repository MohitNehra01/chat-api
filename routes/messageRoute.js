const express = require('express');
const { newMessage, getAllMessage } = require('../controllers/messageController');

const router = express.Router();

router.post('/add' , newMessage);
router.post('/get/:id' , getAllMessage);

module.exports = router
const express = require('express');
const { newConversation, getConversation } = require('../controllers/conversationController');

const router = express.Router();


router.post('/add',newConversation)
router.post('/get',getConversation)

module.exports = router
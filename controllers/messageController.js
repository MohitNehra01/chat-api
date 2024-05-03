const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const AppError = require('../utils/error.utils')


const newMessage = async (req, res, next) => {
    try {
        const { conversationId, senderId, receiverId, text, type } = req.body;

        if (!conversationId || !senderId || !receiverId || !text || !type) {
            return next(new AppError("all field is required", 400))
        }

        const newMessage = await Message.create({
            conversationId, senderId, receiverId, text, type
        })

        await Conversation.findByIdAndUpdate(conversationId, {
            message: text
        })

        return res.status(200).json({
            success: true,
            msg: 'Message has been sent successfully'
        })

    } catch (error) {
        return next(new AppError(error.message, 500))
    }
}

const getAllMessage = async (req, res, next) => {
    try {

        const conversationId = req.params.id;

        if (!conversationId) {
            return next(new AppError('need conversation id', 400));
        }

        const allMessage = await Message.find({ conversationId })

        return res.status(200).json({ success: true, msg: allMessage })

    } catch (error) {
        return next(new AppError(error.message, 500))
    }
}

module.exports = { newMessage , getAllMessage };
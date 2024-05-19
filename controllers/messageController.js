const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");

const AppError = require('../utils/error.utils')
const cloudinary = require('cloudinary')
const fs = require('fs/promises')
const path = require('path');

const newMessage = async (req, res, next) => {
    try {
        const { conversationId, senderId, receiverId, text, type } = req.body;

        if (!conversationId || !senderId || !receiverId || !text || !type) {
            return next(new AppError("all field is required", 400))
        }

        const findConversation = await Conversation.findOne({
            _id: conversationId,
            members: { $all: [senderId, receiverId] }
        });
        if (!findConversation) {
            return next(new AppError('conversation is not set', 400))
        }
        if (!req.file) {

            const newMessage = await Message.create({
                conversationId, senderId, receiverId, text, type
            })
        }
        else {

            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: 'messenger/files',
                    chunk_size: 50000000, // 50 mb size
                    resource_type: 'auto',
                    use_filename: true,   // Use the original filename
                    unique_filename: false, // Do not add random characters to the filename

                });

                console.log(result)

                const extName = path.extname(req.file.originalname).toString();
                let typ = 'text';
                if (extName === '.jpg' || extName === '.png' || extName === 'jpeg') {
                    typ = 'image';
                }
                else if (extName === '.pdf') {
                    typ = 'pdf'
                }
                else if (extName === '.mp3') {
                    typ = 'music'
                }
                else if (extName === '.mp4') {
                    typ = 'vedio'
                }
                else {
                    typ = 'file'
                }
                if (result) {

                    const newMessage = await Message.create({
                        conversationId, senderId, receiverId, text: result.secure_url, type: typ
                    })

                }


                fs.rm(`uploads/${req.file.filename}`)

            } catch (error) {
                console.log(error)
                return next(new AppError(`File not upload , please try again ${error.message}`, 500))
            }
        }


        await Conversation.findByIdAndUpdate(conversationId, {
            message: req.file ? 'file' : text
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

module.exports = { newMessage, getAllMessage };
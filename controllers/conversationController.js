const Conversation = require("../models/conversation.model");
const AppError = require('../utils/error.utils')

const newConversation = async(req,res,next)=>{
     
    try {
         
        const {senderId , receiverId} = req.body;
        
        if(!senderId || !receiverId){
            return next(new AppError('All field is required',400));
        }

        let conversation = await Conversation.findOne({
            members:{$all : [senderId , receiverId]}
        })

        if(conversation){
            return res.status(200).json('conversation already exists');
        }

        conversation = await Conversation.create({
            members:[senderId , receiverId]
        })

        return res.status(200).json('conversation saved successfully')


    } catch (error){
        return next(new AppError(error.message , 500))
    }
}

const getConversation = async (req, res,next)=>{
    try {
         const {senderId , receiverId} = req.body;
         if(!senderId || !receiverId){
            return next(new AppError('All field is required',400));
        }

        let conversation = await Conversation.findOne({
            members:{
                $all:[senderId , receiverId]
            }
        })

        if(!conversation){
            return next(new AppError('this conversation does not exist',400));
        }
          
        return res.status(200).json({
            success: true,
            conversation
        })

    } catch (error) {
        return next(new AppError(error.message,500));
    }
}

module.exports = {newConversation , getConversation}
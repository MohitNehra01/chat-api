
const User = require('../models/user');
const emailValidator = require('email-validator')
const AppError = require('../utils/error.utils');
const { cookie } = require('express-validator');
const cloudinary = require('cloudinary')
const fs = require('fs/promises')

const cookieOption = {
    maxAge: 4 * 24 * 60 * 60 * 1000, // 4days
    httpOnly: true,
    // secure: true
}

const register = async (req, res, next) => {

    try {

        const { name, email, password, confirmPassword } = req.body

        if (!name || !email || !password || !confirmPassword) {
            return next(new AppError('All fields are required', 400))

        }

        if (password !== confirmPassword) {
            return next(new AppError('password and Confirm Password must be same', 400));
        }

        const validEmail = emailValidator.validate(email);

        if (!validEmail) {
            return next(new AppError('Please provide a valid email id'), 400);
        }

        let user = await User.findOne({ email });

        if (user) {
            return next(new AppError('this user is already exist , please try with new email', 400));
        }

        // create a new user
        user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: email,
                secure_url: 'https://www.gla.ac.in/Uploads/image/662imguf_dommy.jpg'
            }
        })

        // user registration failed
        if (!user) {
            return next(new AppError('User registration failed , Please try again', 400))
        }

        const token = await user.jwtToken();

        res.cookie('auth_token', token, cookieOption)

        console.log('File', req.file)

        if (req.file) {
            try {

                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: 'messenger/dp',
                    width: 250,
                    height: 250,
                    gravity: 'faces',
                    crop: 'fill',
                    use_filename: true,   // Use the original filename
                    unique_filename: false, // Do not add random characters to the filename
                })

                console.log(result);
                if (result) {
                    user.avatar.public_id = result.public_id;
                    user.avatar.secure_url = result.secure_url;


                    // remover from server

                    fs.rm(`uploads/${req.file.filename}`)
                }
            } catch (error) {

                return next(new AppError(`File not upload , please try again ${error.message}`, 500))
            }
        }

        await user.save();
        user.password = undefined;


        return res.status(200).json({ success: true, msg: 'Successfuly created new account', user: user, auth_token: token })



    } catch (error) {
        return next(new AppError(error.message, 500))
    }
}

const login = async (req, res, next) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new AppError('All Field are required', 400));
        }

        let user = await User.findOne({ email }).select('+password');

        // check user exist

        if (!user) {
            return next(new AppError('invalid credentials', 401))
        }

        // check password campare

        if (! await user.passwordCompare(password)) {
            return next(new AppError('invalid credentials', 401))
        }
        user.password = undefined;
        let token = await user.jwtToken();

        res.status(200).cookie('auth_token', token, cookieOption).json({ success: true, msg: 'User loggedin successfuly', user, auth_token: token })


    } catch (error) {
        return next(new AppError(error.message, 500))
    }
}

const getAllUser = async (req, res, next) => {
    try {
        let users = await User.find();

        return res.status(200).json({ success: true, users })

    } catch (error) {
        return next(new AppError('Failed to fetch  Users'), 500)
    }
}

module.exports = { register, login, getAllUser }
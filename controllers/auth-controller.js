const asyncHandler = require('express-async-handler')
const User = require('../model/user-model')
const Auth = require("../model/auth-model")
const bcrypt = require('bcrypt')
const generateToken = require('../config/generateToken')
const sendEmail = require('../controllers/email-controller')
const { StatusCodes } = require('http-status-codes')

// code generation
function uniqueCode() {
    const characters = '0123456789';
    let randomString = '';

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}

const signUp = asyncHandler(async(req, res) => {
    const { user_name, email, password } = req.body
    try {

        if (!user_name) {
            return res.status(422).json({ err: "Username is required" })

        }

        if (!email) {
            return res.status(422).json({ err: "Email is required" })

        }
        if (!password) {
            return res.status(422).json({ err: "Password is requierd" })
        }

        const userExist = await User.findOne({ email: { $regex: new RegExp(email, 'i') } })
        if (userExist) {
            return res.status(400).json({ err: "Email already taken!" })
        }

        const new_user = await User.create(req.body)

        if (!new_user) {
            return res.status(500).json({ err: 'Error creating new user' })
        }

        const new_auth = await Auth.create({
            userId: new_user._id,
            password: password,
            uniqueCode: uniqueCode()

        })

        if (!new_auth) {
            return res.status(500).json({ msg: "Error updating auth collection" })
        }

        sendEmail("Welcome to Poma", { user_name: new_user.user_name, info: "Welcome to Poma. ", code: '' }, email)


        return res.status(200).json({ msg: 'User created successufly', user: new_user, })



    } catch (err) {
        return res.status(500).json({ err: 'Internal server error' })
    }
})

const signIn = asyncHandler(async(req, res) => {
    const { email, password } = req.body;

    try {
        if (!email) {
            return res.status(422).json({ err: 'Email is required' });
        }

        if (!password) {
            return res.status(422).json({ err: 'Password is required' });
        }

        const user_exist = await User.findOne({ email });

        if (!user_exist) {
            return res.status(StatusCodes.NOT_FOUND).json({ err: 'Incorrect email, check email and try again.' });
        }

        const user_id = user_exist._id;

        const find_auth = await Auth.findOne({ userId: user_id });

        if (find_auth && (await bcrypt.compare(password, find_auth.password))) {

            return res.status(StatusCodes.OK).json({ msg: 'Login successful', user: user_exist });
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({ err: 'Incorrect password, check password and try again!!!' });
        }
    } catch (err) {
        console.error('Error in signIn:', err);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err: 'Internal server error' });
    }
});



module.exports = { signIn, signUp }
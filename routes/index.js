const express = require('express')
const router = express.Router()
const { signUp, signIn, recoverPassword, recoveryCode, recoveryCodeVerify } = require('../controllers/auth-controller')

router.route("/signup").post(signUp)

router.route("/login").post(signIn)

module.exports = router
import express from 'express'
import { registerValidate } from '../validation/registerSchema.js'
import { validate } from '../middleware/validate.js'
import { loginValidate } from '../validation/loginSchema.js'
import auth from '../middleware/authentication.js'


// memanggil controller about
import {
    registration, login, refresh, logout, deleteAccountUser
} from '../controller/authController.js'

const router = express.Router()

// ENDPOINT API

// Auth
router.post('/login', validate(loginValidate), login)

// Registration
router.post('/registration', validate(registerValidate), registration)

// logout
router.post('/logout', auth, logout)

// refreshtoken
router.post('/refresh', refresh);

// delete account
router.delete('/user', auth, deleteAccountUser);


export default router 
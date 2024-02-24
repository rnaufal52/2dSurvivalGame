import express from 'express'
import upload from '../validation/uploadSchema.js'
import handleMulterError from '../middleware/uploadHandle.js'
import auth from '../middleware/authentication.js'


// panggil controller highscore
import {
    GetProgress,
    UpdateProgress
} from '../controller/progressController.js'

const router = express.Router()

// Endpoint API

// get highscore
router.get('/proggressgame', auth, GetProgress)

// update highscore
router.put('/proggressgame', auth, upload.single('file'), handleMulterError, UpdateProgress)

export default router 
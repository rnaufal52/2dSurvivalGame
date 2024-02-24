import express from 'express'
import { highScoreValidate } from '../validation/highscoreSchema.js'
import { validate } from '../middleware/validate.js'
import auth from '../middleware/authentication.js'


// panggil controller highscore
import {
    // CreateHighScore,
    GetHighScore,
    updateHighScore
} from '../controller/highscoreController.js'

const router = express.Router()

// Endpoint API

// post data
// router.post('/highscore', auth, validate(highScoreValidate), CreateHighScore)

// get highscore
router.get('/highscore', auth, GetHighScore)

// update highscore
router.put('/highscore', auth, validate(highScoreValidate), updateHighScore)

export default router 
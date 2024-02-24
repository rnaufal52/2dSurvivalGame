// import modul yang digunakan
import express from 'express'
// update
import path from 'path';
import { fileURLToPath } from 'url';
import auth from './middleware/authentication.js'
// end update
import * as dotenv from 'dotenv' //untuk env
import logs from './middleware/logs.js' //
import authRoute from './route/authRoute.js'
// import userRoute from './route/userRoute.js'
import highscoreRoute from './route/highscoreRoute.js'
import progressRoute from './route/progressRoute.js'
// import highscorenoauthRoute from './route/highscorenoauthRoute.js'


dotenv.config()

const app = express()
const port = process.env.PORT || 5000

// middleware 
app.use(express.json());  //berupa json
app.use(express.urlencoded({ extended: false }));  //berupa url decoded
app.use(logs)

// routes
app.use(authRoute)
// app.use(userRoute)
app.use(highscoreRoute)
app.use(progressRoute)
// app.use(highscorenoauthRoute)

// akses file .json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/public', auth, express.static(path.join(__dirname, '../public')));




////////////
app.listen(`${port}`, () => {
    console.log(`Server berjalan di port ${port}`)
})
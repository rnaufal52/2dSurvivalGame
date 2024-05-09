// import modul yang digunakan
import express from 'express'
import * as dotenv from 'dotenv' //untuk env
import logs from './middleware/logs.js' //
import authRoute from './route/authRoute.js'
import highscoreRoute from './route/highscoreRoute.js'
import progressRoute from './route/progressRoute.js'


dotenv.config()

const app = express()
const port = process.env.PORT || 5000

// middleware 
app.use(express.json());  //berupa json
app.use(express.urlencoded({ extended: false }));  //berupa url decoded
app.use(logs)

// routes
app.use(authRoute)
app.use(highscoreRoute)
app.use(progressRoute)




app.listen(`${port}`, () => {
    console.log(`Server berjalan di port ${port}`)
})

import { registrationAuthModel, loginAuthModel, logoutAuthModel, deleteAccount } from '../models/authModel.js'
import { createHighScoreModel, deleteHighScore } from '../models/highscoreModel.js'
import { createProgressModel, getProgressModelByToken, DeleteProgress } from '../models/progressGameModel.js'
import bcrypt from 'bcrypt'
import { nanoid } from "nanoid"
import * as dotenv from 'dotenv'
import fs from 'fs'
import jwt from 'jsonwebtoken'

dotenv.config()

// registrasi
const registration = async (req, res) => {
    const { body } = req
    const user_id = nanoid(16)
    const highscore_id = nanoid(16)
    const progressgame_id = nanoid(16)
    // ganti nanti dengan link cloud
    const savefile = `public/savefile/inventorySave.json`
    const dates = new Date()
    const highscore = "0"
    try {
        const [user] = await loginAuthModel(body)
        // Check username apakah ada atau tidak
        if (user.length !== 0) {
            return res.status(400).json({
                code: 400,
                status: 'BAD REQUEST',
                message: {
                    'name': [],
                    'username': ['Username is already register'],
                    'password': []
                },
                data: null,
            })
        }

        // encrypt password
        const hashedPassword = await hashPassword(body.password)
        const [data] = await registrationAuthModel(body, user_id, dates, hashedPassword)

        // Generate token
        const loguser = { id: user_id, username: body.username }
        const accessTokenExpiresIn = 60 * 60; // 60 menit dalam detik
        const refreshTokenExpiresIn = 60 * 24 * 60 * 60; // 60 hari dalam detik

        const accessToken = jwt.sign(loguser, process.env.SECRET_KEY, { expiresIn: accessTokenExpiresIn });
        const refreshToken = jwt.sign(loguser, process.env.REFRESH_TOKEN_KEY, { expiresIn: refreshTokenExpiresIn });

        const currentTimestamp = Math.floor(Date.now() / 1000); // Waktu saat ini dalam detik

        res.json({
            code: 200,
            status: "OK",
            message: 'Registration is successful',
            data: {
                accessToken: accessToken,
                accessTokenExpiresAt: currentTimestamp + accessTokenExpiresIn, // Waktu kedaluwarsa access token
                refreshToken: refreshToken,
                refreshTokenExpiresAt: currentTimestamp + refreshTokenExpiresIn, // Waktu kedaluwarsa refresh token
                username: body.username
            }
        })
        const [datahs] = await createHighScoreModel(highscore, highscore_id, user_id, dates)
        const [datapg] = await createProgressModel(progressgame_id, user_id, savefile, "2")
    } catch (error) {
        res.status(500).json({
            code: 500,
            status: 'INTERNAL SERVER ERROR',
            message: error,
            data: null,
        })
    }
}

// hash password
const hashPassword = async (password) => {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
}

// login
const login = async (req, res) => {
    const { body } = req
    try {
        const [user] = await loginAuthModel(body)
        // Check username apakah ada atau tidak
        if (user.length === 0) {
            return res.status(400).json({
                code: 400,
                status: 'BAD REQUEST',
                message: 'Username not correct',
                data: null,
            })
        }

        const isMatch = await bcrypt.compare(body.password, user[0].password)
        if (!isMatch) {
            // Password tidak cocok
            return res.status(400).json({
                code: 400,
                status: 'BAD REQUEST',
                message: 'Password not correct',
                data: null,
            })
        } else {
            // Generate token
            const loguser = { id: user[0].user_id, username: user[0].username }
            const accessTokenExpiresIn = 60 * 60; // 60 menit dalam detik
            const refreshTokenExpiresIn = 60 * 24 * 60 * 60; // 60 hari dalam detik

            const accessToken = jwt.sign(loguser, process.env.SECRET_KEY, { expiresIn: accessTokenExpiresIn });
            const refreshToken = jwt.sign(loguser, process.env.REFRESH_TOKEN_KEY, { expiresIn: refreshTokenExpiresIn });

            const currentTimestamp = Math.floor(Date.now() / 1000); // Waktu saat ini dalam detik

            res.json({
                code: 200,
                status: "OK",
                message: 'Registration is successful',
                data: {
                    accessToken: accessToken,
                    accessTokenExpiresAt: currentTimestamp + accessTokenExpiresIn, // Waktu kedaluwarsa access token
                    refreshToken: refreshToken,
                    refreshTokenExpiresAt: currentTimestamp + refreshTokenExpiresIn, // Waktu kedaluwarsa refresh token
                    username: user[0].username
                }
            })
        }
    } catch (error) {
        res.status(500).json({
            code: 500,
            status: 'INTERNAL SERVER ERROR',
            message: error,
            data: null,
        })
    }
}

const refresh = async (req, res) => {
    const refreshToken = req.body.refreshToken

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token not found' })
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate refresh token' })
        }

        const user = { id: decoded.id, username: decoded.username }

        const accessTokenExpiresIn = 60 * 60; // 60 menit dalam detik
        const accessToken = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: accessTokenExpiresIn });

        const currentTimestamp = Math.floor(Date.now() / 1000); // Waktu saat ini dalam detik

        res.json({
            code: 200,
            status: "OK",
            message: 'Refresh token successfully',
            data: {
                accessToken: accessToken,
                accessTokenExpiresAt: currentTimestamp + accessTokenExpiresIn, // Waktu kedaluwarsa access token
            },
        })
    })
}

const deleteAccountUser = async (req, res) => {
    const user_id = req.user_id
    try {

        // hapus data progress
        // ambil data progress kemudian hapus
        const [previousProgress] = await getProgressModelByToken(user_id);
        // Cek apakah ada progress yang perlu dihapus
        if (previousProgress && previousProgress[0] && previousProgress[0].savefile &&
            previousProgress[0].savefile != "public/savefile/inventorySave.json") {
            await fs.promises.unlink(previousProgress[0].savefile);
        }
        const [datass] = await DeleteProgress(user_id)

        // hapus data highscore
        const [datas] = await deleteHighScore(user_id)
        // hapus data user
        const [data] = await deleteAccount(user_id)

        res.json({
            code: 200,
            status: "OK",
            message: 'Account deleted successfully',
            data: null,
        });
    }
    catch
    {
        res.status(500).json({
            code: 500,
            status: 'INTERNAL SERVER ERROR',
            message: error,
            data: null,
        })
    }
}

// logout
const logout = async (req, res) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1]
            const [data] = await logoutAuthModel(token)
            res.json({
                code: 200,
                status: "OK",
                message: 'Logout successfully',
                data: null,
            })
        } else {
            res.json({
                code: 422,
                status: "Unprocessable Entity",
                message: 'Token required',
                data: null,
            })
        }
    } catch {
        res.status(500).json({
            code: 500,
            status: 'INTERNAL SERVER ERROR',
            message: error,
            data: null,
        })
    }
}


export {
    registration,
    login,
    refresh,
    logout,
    deleteAccountUser
}
'use strict'
import { getProgressModelByToken, UpdateProgressModel } from '../models/progressGameModel.js'
import * as dotenv from 'dotenv'
import { nanoid } from "nanoid"
import { Storage } from '@google-cloud/storage'
import path from 'path';

dotenv.config()

const pathKey = path.resolve('./serviceaccountkey.json')

// cloud storage connect
const storage = new Storage({
    projectId: 'apigameastralpursuit',
    keyFilename: pathKey
})

// nama bucket
const bucketName = 'astral-pursuit-progressfiles'

// show progress
const GetProgress = async (req, res) => {
    const user_id = req.user_id
    try {
        const [data] = await getProgressModelByToken(user_id)
        res.json({
            code: 200,
            status: 'OK',
            message: 'Success grab data progress',
            data: data,
        })

    } catch (error) {
        res.status(500).json({
            code: 500,
            status: 'INTERNAL SERVER ERROR',
            message: error,
            data: null,
        })
    }
}

// put highscore
const UpdateProgress = async (req, res) => {
    try {
        // mengambil user id
        const user_id = req.user_id

        // check jika tidak ada file yang diupload
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' })
        }
        const { buffer, mimetype } = req.file;

        // Membuat nama file dan path penyimpanan
        const extension = mimetype.split('/')[1];
        const fileName = `${nanoid()}.${extension}`;
        const bucket = storage.bucket(bucketName)
        const file = bucket.file(fileName)

        // Upload file to bucket
        await file.save(buffer, {
            metadata: {
                contentType: mimetype,
            },
        })
        await file.makePublic()

        const fileUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`

        // Mengambil data progress sebelumnya untuk mendapatkan nama file JSON yang akan dihapus
        const [previousProgress] = await getProgressModelByToken(user_id);

        // Update file save
        const [data] = await UpdateProgressModel(user_id, fileUrl, req.body.chapter)
        if (data.affectedRows === 0) {
            res.status(404).json({
                code: 404,
                status: 'NOT FOUND',
                message: 'Data not found',
                data: null,
            })
        } else {
            // Menghapus file sebelumnya jika ada
            await handlePreviousFileDeletion(previousProgress[0].savefile);

            res.json({
                code: 200,
                status: "OK",
                message: 'update progress data is success',
                data: null,
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


const handlePreviousFileDeletion = async (previousFileUrl) => {
    try {
        // Memeriksa apakah URL file sebelumnya adalah URL yang harus dijaga
        if (previousFileUrl == 'https://storage.cloud.google.com/astral-pursuit-progressfile/inventorySave.json') {
            console.log('Previous file is protected and will not be deleted')
            return
        }
        // Mendapatkan nama file dari URL
        const fileName = previousFileUrl.split('/').pop()
        // Menghapus file dari Google Cloud Storage
        const bucket = storage.bucket(bucketName)
        const file = bucket.file(fileName)
        await file.delete()
        console.log('File deleted successfully')
    } catch (error) {
        console.error('Error deleting file:', error)
    }
};

export {
    GetProgress,
    UpdateProgress
}

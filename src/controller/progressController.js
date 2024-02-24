import { getProgressModelByToken, UpdateProgressModel } from '../models/progressGameModel.js'
import * as dotenv from 'dotenv'
import fs from 'fs'
import { nanoid } from "nanoid"

dotenv.config()

// show progress
const GetProgress = async (req, res) => {
    const { body } = req
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
        const filePath = `public/saveFile/${fileName}`;

        // Mengambil data progress sebelumnya untuk mendapatkan nama file JSON yang akan dihapus
        const [previousProgress] = await getProgressModelByToken(user_id);

        // update file save
        const [data] = await UpdateProgressModel(user_id, filePath, req.body.chapter)
        if (data.affectedRows === 0) {
            res.status(404).json({
                code: 404,
                status: 'NOT FOUND',
                message: 'Data not found',
                data: null,
            })
        } else {
            // menghapus file yang sudah di upload
            await handlePreviousFileDeletion(previousProgress);
            // membuat file baru
            fs.writeFileSync(filePath, buffer);
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

const handlePreviousFileDeletion = async (previousProgress) => {
    if (previousProgress && previousProgress[0] && previousProgress[0].savefile &&
        previousProgress[0].savefile != "public/savefile/inventorySave.json") {
        await deletePreviousFile(previousProgress[0].savefile);
    }
};

const deletePreviousFile = async (previousFilePath) => {
    try {
        // Menambahkan pengecekan eksistensi file sebelum menghapus
        const isFileExists = await fs.promises.access(previousFilePath, fs.constants.F_OK)
            .then(() => true)
            .catch(() => false);

        if (isFileExists) {
            await fs.promises.unlink(previousFilePath);
            console.log('File deleted successfully');
        } else {
            console.log('File does not exist');
        }
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};

export {
    GetProgress,
    UpdateProgress
}
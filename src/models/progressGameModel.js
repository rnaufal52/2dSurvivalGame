import dbPool from '../config/connection.js'

// post 
const createProgressModel = (progressgame_id, user_id, savefile, chapter) => {

    const SQLQuery = "INSERT INTO progressgame (progressgame_id, user_id, savefile, chapter) VALUES (?, ?, ?, ?)"
    const values = [progressgame_id, user_id, savefile, chapter]

    return dbPool.execute(SQLQuery, values)
}

// TODO
// get progress by token
const getProgressModelByToken = (user_id) => {
    const SQLQuery =
        "SELECT * FROM progressgame WHERE user_id = ?";
    const values = [user_id];

    return dbPool.execute(SQLQuery, values);
}
// update progress by token
const UpdateProgressModel = (user_id, savefile, chapter) => {
    const SQLQuery =
        "UPDATE progressgame SET saveFile=?, chapter=? WHERE user_id=?";
    const values = [savefile, chapter, user_id];

    return dbPool.execute(SQLQuery, values);
}

// delete progress
const DeleteProgress = (user_id) => {
    const SQLQuery = "Delete From progressgame WHERE user_id=?"
    const values = [user_id]

    return dbPool.execute(SQLQuery, values)
}

export {
    createProgressModel,
    getProgressModelByToken,
    UpdateProgressModel,
    DeleteProgress
}
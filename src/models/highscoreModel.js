import dbPool from '../config/connection.js'

// post 
const createHighScoreModel = (highscore, highscore_id, user_id, dates) => {

    const SQLQuery = "INSERT INTO highscore (highscore_id, user_id, score, created_at, updated_at) VALUES (?, ?, ?, ?, ?)"
    const values = [highscore_id, user_id, highscore, dates, dates]

    return dbPool.execute(SQLQuery, values)
}

// get highscore by token dan peringkat
const getHighScoreModel = (user_id) => {
    const SQLQuery = `
        SELECT
            u.username,
            h.score,
            (SELECT COUNT(*) + 1 FROM highscore WHERE score > h.score) AS ranking
        FROM
            highscore h
        JOIN
            user u ON h.user_id = u.user_id
        WHERE
            h.user_id = ?;
    `;
    const values = [user_id];

    return dbPool.execute(SQLQuery, values);
}


// get highscore by token
const getHighScoreModelByToken = (user_id) => {
    const SQLQuery =
        "SELECT * FROM highscore WHERE user_id = ?";
    const values = [user_id];

    return dbPool.execute(SQLQuery, values);
}

const deleteHighScore = (user_id) => {
    const SQLQuery = "Delete From highscore WHERE user_id=?"
    const values = [user_id]

    return dbPool.execute(SQLQuery, values);
}


// get top 5 highscore
const getTopHighScoreModel = () => {
    const SQLQuery = `
        SELECT
            u.username,
            h.score,
            (SELECT COUNT(*) + 1 FROM highscore WHERE score > h.score) AS ranking
        FROM
            highscore h
        JOIN
            user u ON h.user_id = u.user_id
        ORDER BY
            h.score DESC
        LIMIT
            5;
    `;
    return dbPool.execute(SQLQuery);
}


// put highscore
const updateHighScoreModel = (body, user_id, dates) => {

    const SQLQuery = "UPDATE highscore SET score=?, updated_at=? WHERE user_id=?"
    const values = [body.score, dates, user_id]

    return dbPool.execute(SQLQuery, values)
}

export {
    createHighScoreModel,
    getHighScoreModelByToken,
    getHighScoreModel,
    getTopHighScoreModel,
    updateHighScoreModel,
    deleteHighScore
}
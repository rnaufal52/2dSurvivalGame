import dbPool from '../config/connection.js'

// register
const registrationAuthModel = (body, user_id, dates, hashedPassword) => {

    const SQLQuery = "INSERT INTO user (user_id, name, username, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
    const values = [user_id, body.name, body.username, hashedPassword, dates, dates]

    return dbPool.execute(SQLQuery, values)
}

// logins
const loginAuthModel = (body) => {
    const SQLQuery = "SELECT * From user WHERE username=?"
    const values = [body.username]

    return dbPool.execute(SQLQuery, values)
}

// delete account
const deleteAccount = (user_id) => {
    const SQLQuery = "Delete From user WHERE user_id=?"
    const values = [user_id]

    return dbPool.execute(SQLQuery, values)
}

// logout
const logoutAuthModel = (token) => {
    const SQLQuery = "Insert INTO blacklist (token) Values(?)"
    const values = [token]

    return dbPool.execute(SQLQuery, values)
}

// check token
const logoutCheck = async (token) => {
    const SQLQuery = "SELECT * From blacklist Where token=?"
    const values = [token]

    return dbPool.execute(SQLQuery, values)
}

export {
    registrationAuthModel,
    loginAuthModel,
    logoutAuthModel,
    logoutCheck,
    deleteAccount
}
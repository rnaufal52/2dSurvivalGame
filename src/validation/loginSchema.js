import Joi from "joi"

// rules validasi
const loginValidate = Joi.object({
    username: Joi.string()
        .required(),
    password: Joi.string()
        .required()
}).options({ abortEarly: false })

export { loginValidate }
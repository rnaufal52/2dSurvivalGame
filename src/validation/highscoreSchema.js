import Joi from "joi"

// rules validasi
const highScoreValidate = Joi.object({
    score: Joi.string()
        .max(10)
        .required(),
}).options({ abortEarly: false })

export { highScoreValidate }
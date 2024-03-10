const joi = require('joi')

// Input validation
const postBookValidation = (book) => {
    const schema = joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        author: joi.string().required(),
        image: joi.string(),
        rating: joi.number().required(),
    })

    return schema.validate(book)
}

const postReviewValidation = (review) => {
    const schema = joi.object({
        reviewerid: joi.string().required(), // username reviewer
        review: joi.string().required(),
        rating: joi.number().required()
    })

    return schema.validate(review)
}

module.exports = {
    postBookValidation, 
    postReviewValidation
}
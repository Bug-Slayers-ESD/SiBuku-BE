import joi from 'joi';

// Book Input validation
export const postBookValidation = (book) => {
    const schema = joi.object({
      title: joi.string().required(),
      description: joi.string().required(),
      author: joi.string().required(),
      image: joi.string(),
      rating: joi.number().required(),
    })
  
    return schema.validate(book)
}

export const postReviewValidation = (review) => {
    const schema = joi.object({
        bookId: joi.number().required(),
        reviewer: joi.string().required(), // username reviewer
        review: joi.string().required(), // review message
        rating: joi.number().required()
    })

    return schema.validate(review)
}
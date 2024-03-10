const { postReviewValidation } = require('../validations/input_validations.js')

const { sendCreated,
    sendError,
    sendNotFound,
    sendSuccess
} = require('../helpers/responses.js')

const {
    getBookReviewsService, 
    postAddBookReviewService,
    updateBookReviewService,
    deleteBookReviewService,
 } = require('../services/book_review_services.js')

const getAllBookReviews = async (req, res) => {
    try {
        const result = await getBookReviewsService(req)
        
        if (result == null || result.length == 0) sendNotFound(res, 'Books review not found!')
        else return sendSuccess(res, 'Success', result)
    } catch (error) {
        console.error(error)
        return sendError(res, 'Internal server error!')
    }
}

const postAddBookReview = async (req, res) => {
    try {
        const { error } = postReviewValidation(req.body)
        if (error) return sendError(res, error.details[0].message, 400)

        const result = await postAddBookReviewService(req)
        return sendCreated(res, 'Review added!', result)
    } catch (error) {
        console.error(error)
        return sendError(res, 'Internal server error!')
    }
}

const updateBookReview = async (req, res) => {
    try {
        const { error } = postReviewValidation(req.body)
        if (error) return sendError(res, error.details[0].message, 400)

        const result = await updateBookReviewService(req)
        return sendSuccess(res, 'Review updated!', result)
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal server error!');
    }
}

const deleteBookReview = async (req, res) => {
    try {
        const result = await deleteBookReviewService(req, res)
        return sendSuccess(res, 'Review deleted!', result)
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal server error!');
    }
}

module.exports = {
    getAllBookReviews,
    postAddBookReview,
    updateBookReview,
    deleteBookReview
}
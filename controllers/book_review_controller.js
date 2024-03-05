const { postReviewValidation } = require('../validations/input_validations.js')
const { book, book_review } = require('../models/index.js');

const { sendCreated,
    sendError,
    sendNotFound,
    sendSuccess
} = require('../helpers/responses.js')

const getAllBookReviews = async (req, res) => {
    try {
        const findBookById = req.params.id;

        const isFound = await book.findOne({
            where: {
                id: findById
            }
        });

        if (!isFound) return sendNotFound(res, 'Book not found!');
        else {
            const data = await book_review.findAll({
                where: {
                    bookid: findBookById
                },
            });

            return sendSuccess(res, 'Success', { data });
        }
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal server error!');
    }
}

const postAddBookReview = async (req, res) => {
    try {
        const findBookById = req.params.id;
        const { reviewer, review, rating } = req.body;

        const { error } = postReviewValidation(req.body);
        if (error) return sendError(res, error.details[0].message, 400);

        const isFound = await book.findOne({
            where: {
                id: findById
            }
        });

        if (!isFound) return sendNotFound(res, 'Book not found!');
        else {
            const data = await book_review.create(
                bookid = findBookById,
                reviewer,
                review,
                rating,
            );

            return sendCreated(res, 'Review Created!', { data });
        }
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal server error!');
    }
}

const updateBookReview = async (req, res) => {
    try {
        const findBookById = req.params.id;
        const findReviewById = req.params.review_id;

        const isFound = await book.findOne({
            where: {
                id: findBookById
            }
        });

        const isReviewFound = await book_review.findAll({
            where: {
                id: findReviewById
            },
        });

        if (!isFound && !isReviewFound) return sendNotFound(
            res, 'No book and review are found!'
        );
        else if (!isFound) return sendNotFound(
            res, 'Book not found, cannot update review!'
        );
        else if (!isReviewFound) return sendNotFound(
            res, 'Book found, but the review is not found!'
        );
        else {
            const { reviewer, review, rating } = req.body;
            const { error } = postReviewValidation(req.body);
            if (error) return sendError(res, error.details[0].message, 400);

            const data = await book_review.update({
                reviewer,
                review,
                rating,
            }, {
                where: {
                    id: findReviewById,
                    bookid: findBookById
                }
            });

            return sendSuccess(res, 'Review Updated!', { data });
        }
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal server error!');
    }
}

const deleteBookReview = async (req, res) => {
    try {
        const findBookById = req.params.id;
        const findReviewById = req.params.review_id;

        const isFound = await book.findOne({
            where: {
                id: findBookById
            }
        });

        const isReviewFound = await book_review.findAll({
            where: {
                id: findReviewById
            },
        });

        if (!isFound && !isReviewFound) return sendNotFound(res, 'No book and review are found!');
        else if (!isFound) return sendNotFound(res, 'Book not found, cannot update review!');
        else if (!isReviewFound) return sendNotFound(res, 'Book found, but the review is not found!');
        else {
            const data = await book_review.destroy({
                where: {
                    id: findById,
                    bookid: findReviewById
                },
            });

            return sendSuccess(res, 'Review Deleted!', { data });
        }
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
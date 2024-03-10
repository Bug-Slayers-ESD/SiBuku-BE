const { book, book_review } = require('../models/index.js');
const { sendNotFound } = require('../helpers/responses.js');

const getBookReviewsService = async (req) => {
    const findByBookId = req.params.book_id

    const isFound = await book.findOne({
        where: {
            id: findByBookId
        }
    })

    if (isFound) {
        const data = await book_review.findAll({
            where: {
                bookid: findByBookId
            }
        })

        return data
    }
}

const postAddBookReviewService = async (req) => {
    const findBookById = req.params.book_id
    const { reviewerid, review, rating } = req.body

    const isFound = await book.findOne({
        where: {
            id: findBookById
        }
    })

    if (!isFound) {
        return sendNotFound(res, 'Book not found!')
    } else {
        await book_review.create(
            {
                bookid: findBookById,
                reviewerid,
                review,
                rating
            }
        )

        console.log(`${reviewerid} ${review} ${rating}`)
        return req.body
    }
}

const updateBookReviewService = async (req) => {
    const findBookById = req.params.book_id
    const findReviewById = req.params.review_id
    const { reviewer, review, rating } = req.body;

    const isFound = await book.findOne({
        where: {
            id: findBookById
        }
    })

    const isReviewFound = await book_review.findAll({
        where: {
            id: findReviewById
        },
    })

    if (!isFound && !isReviewFound) {
        return sendNotFound(res, 'No book and review are found!')
    } else if (!isFound) {
        return sendNotFound(res, 'Book not found, cannot update review!')
    } else if (!isReviewFound) {
        return sendNotFound(res, 'Book found, but the review is not found!')
    } else {
        await book_review.update({
            reviewer,
            review,
            rating,
        },
            {
                where: {
                    id: findReviewById,
                    bookid: findBookById
                }
            }
        )

        return req.body
    }
}

const deleteBookReviewService = async (req, res) => {
    const findBookById = req.params.book_id
    const findReviewById = req.params.review_id

    const isFound = await book.findOne({
        where: {
            id: findBookById
        }
    })

    const isReviewFound = await book_review.findAll({
        where: {
            id: findReviewById
        },
    })

    if (!isFound && !isReviewFound) {
        return sendNotFound(res, 'No book and review are found!')
    } else if (!isFound) {
        return sendNotFound(res, 'Book not found, cannot delete review!')
    } else if (!isReviewFound) {
        return sendNotFound(res, 'Book found, but the review is not found!')
    } else {
        const data = await book.destroy({
            where: {
                id: findById
            },
        });

        if (data != null) {
            return isReviewFound
        } else {
            return sendNotFound(res, 'Failed to delete!');
        }
    }
}

module.exports = {
    getBookReviewsService,
    postAddBookReviewService,
    updateBookReviewService,
    deleteBookReviewService,
}
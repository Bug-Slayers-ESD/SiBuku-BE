const express = require('express')
const path = require('path')
const fs = require('fs')
const fileUpload = require('express-fileupload')

const {
  getAllBooks,
  getSpecificBookById,
  postAddBook,
  updateBook,
  deleteBook
} = require('../controllers/book_controller.js')

const {
  getAllBookReviews,
  postAddBookReview,
  updateBookReview,
  deleteBookReview
} = require('../controllers/book_review_controller.js')

const router = express.Router()
const _filename = __filename;
const _dirname = path.dirname(_filename);

router.use(express.static(path.join(_dirname, '/public')));
router.use(fileUpload())

// ============= CATALOGUE API =============
router.get('/books', getAllBooks)
router.get('/books/:id', getSpecificBookById)
router.post('/books', postAddBook)
router.put('/books/:id', updateBook)
router.delete('/books/:id', deleteBook)

// ============= REVIEW API =============
router.get('/books/:book_id/reviews', getAllBookReviews)
router.post('/books/:book_id/reviews', postAddBookReview)
router.put('/books/:book_id/reviews/:review_id', updateBookReview)
router.delete('/books/:book_id/reviews/:review_id', deleteBookReview)

module.exports = router;
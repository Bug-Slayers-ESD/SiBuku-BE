const {
    sendCreated,
    sendError,
    sendNotFound,
    sendSuccess
} = require('../helpers/responses.js')

const { imageValidations } = require('../validations/image_validations.js')
const { postBookValidation } = require('../validations/input_validations.js')

const {
    getAllBookService,
    getSpecificBookService,
    postBookService,
    updateBookService,
    deleteBookService,
} = require('../services/book_services.js')

const getAllBooks = async (req, res) => {
    try {
        const result = await getAllBookService(req);

        if (result == null || result.length == 0) sendNotFound(res, 'Books not found!');
        else return sendSuccess(res, 'Success', result);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal server error!');
    }
}

const getSpecificBookById = async (req, res) => {
    try {
        const result = await getSpecificBookService(req, res);

        if (result == null) sendNotFound(res, 'Book not found!');
        else return sendSuccess(res, 'Success', result);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal server error!');
    }
}

const postAddBook = async (req, res) => {
    try {
        const { error } = postBookValidation(req.body);
        if (error) sendError(res, error.details[0].message, 400);

        const imageValidate = imageValidations(req)
        if (imageValidate.error) return sendError(res, imageValidate.message, 400);

        const result = await postBookService(req);
        return sendCreated(res, 'Book Created!', result);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal server error!');
    }
}

const updateBook = async (req, res) => {
    try {
        const { error } = postBookValidation(req.body);
        if (error) sendError(res, error.details[0].message, 400);

        const imageValidate = imageValidations(req)
        if (imageValidate.error) return sendError(res, imageValidate.message, 400); 

        const result = await updateBookService(req);
        return sendSuccess(res, 'Book updated!', result);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal server error!');
    }
}

const deleteBook = async (req, res) => {
    try {
        const result = await deleteBookService(req, res);
        return sendSuccess(res, 'Book deleted!', result);
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal server error!');
    }
}

module.exports = {
    getAllBooks,
    getSpecificBookById,
    postAddBook,
    updateBook,
    deleteBook,
}
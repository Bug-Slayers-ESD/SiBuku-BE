const { postBookValidation } = require('../validations/input_validations.js')
const { book } = require('../models/index.js');

const {
    sendCreated,
    sendError,
    sendNotFound,
    sendSuccess
} = require('../helpers/responses.js')

const getAllBooks = async (req, res) => {
    try {
        const findByTitle = req.query.title;

        if (findByTitle) {
            const data = await book.findOne({
                where: {
                    title: findByTitle
                }
            });

            if (data == null) sendNotFound(res, 'Book not found!');
            return sendSuccess(res, 'Success', { data });
        }

        const data = await book.findAll();

        if (data == null) sendNotFound(res, 'Book not found!');
        return sendSuccess(res, 'Success', { data });
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal server error!');
    }
}

const getSpecificBookById = async (req, res) => {
    try {
        const findById = req.params.id;

        const data = await book.findOne({
            where: {
                id: findById
            }
        });

        if (data == null) sendNotFound(res, 'Book not found!');
        return sendSuccess(res, 'Success', { data });
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal server error!');
    }
}

const postAddBook = async (req, res) => {
    try {
        const { title, description, author, rating } = req.body;
        const image = req.files.image;

        const formatFilename = title.toLowerCase().replace(/[\s!@#$%^&*()_+={}\[\];:'",.<>?\/\\|`~-]/g, '');
        const filename = `${formatFilename}.jpg`;

        image.mv(path.join(__dirname, '../public/image', filename));

        const { error } = postBookValidation(req.body);
        if (error) sendError(res, error.details[0].message, 400);

        const data = await book.create({
            title,
            description,
            author,
            image: `/image/${filename}`,
            rating,
        });

        return sendCreated(res, 'Book Created!', { data });
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal server error!');
    }
}

const updateBook = async (req, res) => {
    try {
        const findById = req.params.id;
        const { title, description, author, rating } = req.body;

        var image = '';
        const oldFilename = `${title.toLowerCase().replace(/[\s!@#$%^&*()_+={}\[\];:'",.<>?\/\\|`~-]/g, '')}.jpg`;
        const newImage = req.files.image;

        if (newImage) {
            try {
                fs.unlinkSync(path.join(__dirname, '../public/image', oldFilename));
            } catch (err) {
                console.error(err);
            }

            const formatFilename = title.toLowerCase().replace(/[\s!@#$%^&*()_+={}\[\];:'",.<>?\/\\|`~-]/g, '');
            const filename = `${formatFilename}.jpg`;

            newImage.mv(path.join(__dirname, '../public/image', filename));
            image = `/image/${filename}`;
        }

        const { error } = postBookValidation(req.body);
        if (error) return sendError(res, error.details[0].message, 400);

        const isFound = await book.findOne({
            where: {
                id: findById
            }
        });

        if (!isFound) return sendNotFound(res, 'Book not found!');
        else {
            const data = await book.update({
                title: title,
                description: description,
                author: author,
                image: image,
                rating: rating,
            },
                {
                    where: {
                        id: findById
                    },
                });

            return sendSuccess(res, 'Book Updated!', { data });
        }
    } catch (error) {
        console.error(error);
        return sendError(res, 'Internal server error!');
    }
}

const deleteBook = async (req, res) => {
    try {
        const findById = req.params.id;
        const isFound = await book.findOne({
            where: {
                id: findById
            }
        });

        if (!isFound) return sendNotFound(res, 'Book not found!');
        else {
            const data = await book.destroy({
                where: {
                    id: findById
                },
            });

            return sendSuccess(res, 'Book deleted!', { data });
        }
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
    deleteBook
}
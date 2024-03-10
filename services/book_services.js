const { book } = require('../models/index.js');
const { imageSaver } = require('../helpers/imagesaver.js');
const { sendNotFound } = require('../helpers/responses.js');

const getAllBookService = async (req) => {
    const findByTitle = req.query.title

    const data = await book.findAll();

    if (findByTitle) {
        const data = await book.findOne({
            where: { title: findByTitle }
        })

        return data
    }

    return data;
}

const getSpecificBookService = async (req) => {
    const findById = req.params.id

    const data = await book.findOne({
        where: { id: findById }
    })

    return data
}

const postBookService = async (req) => {
    const { title, description, author, rating } = req.body
    const slug = title.toLowerCase().replace(/[\s!@#$%^&*()_+={}\[\];:'",.<>?\/\\|`~-]/g, '')

    const imagePath = await imageSaver(req.files.image, slug)
    const data = await book.create({
        title,
        description,
        author,
        image: imagePath,
        rating,
    })

    return data
}

const updateBookService = async (req) => {
    const findById = req.params.id
    const { title, description, author, rating } = req.body

    const slug = title.toLowerCase().replace(/[\s!@#$%^&*()_+={}\[\];:'",.<>?\/\\|`~-]/g, '')
    const imagePath = await imageSaver(req.files.image, slug)

    const isFound = await book.findOne({
        where: {
            id: findById
        }
    })

    if (isFound) {
        await book.update({
            title,
            description,
            author,
            image: imagePath,
            rating,
        },
            {
                where: { id: findById },
            }
        )

        return req.body
    }
}

const deleteBookService = async (req, res) => {
    const findById = req.params.id;

    const isFound = await book.findOne({
        where: {
            id: findById
        }
    });

    const data = await book.destroy({
        where: {
            id: findById
        },
    });

    if (data != null && isFound) {
        return isFound
    } else {
        return sendNotFound(res, 'Book not found!');
    }
}

module.exports = {
    getAllBookService,
    getSpecificBookService,
    postBookService,
    updateBookService,
    deleteBookService,
}
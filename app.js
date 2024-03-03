const express = require('express')
const path = require('path')
const cors = require('cors')
const joi = require('joi')
const fs = require('fs')
const fileUpload = require('express-fileupload')
const { sendCreated, sendError, sendNotFound, sendSuccess } = require('./response/response.js')

const app = express()
const port = 3000

const _filename = __filename;
const _dirname = path.dirname(_filename);

app.use(express.static(path.join(_dirname, '/public')));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(fileUpload())
app.use(cors())

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
      reviewer: joi.string().required(), // username reviewer
      review: joi.string().required(),
      rating: joi.number().required()
  })

  return schema.validate(review)
}

// ============= TESTING =============
app.get('/', (req, res) => {
  res.send('Book-App REST API!')
})

// ============= CATALOGUE API =============
app.get('/books', async (req, res) => {
  try {
    const { book } = require('./models');
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
})

app.get('/books/:id', async (req, res) => {
  try {
    const { book } = require('./models');
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
})

app.post('/books', async (req, res) => {
  try {
    const { book } = require('./models');
    const { title, description, author, rating } = req.body;
    const image = req.files.image;

    const formatFilename = title.toLowerCase().replace(/[\s!@#$%^&*()_+={}\[\];:'",.<>?\/\\|`~-]/g, '');
    const filename = `${formatFilename}.jpg`;

    image.mv(path.join(__dirname, 'public/image', filename));

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
})

app.put('/books/:id', async (req, res) => {
  try {
    const { book } = require('./models');
    const findById = req.params.id;
    const { title, description, author, rating } = req.body;

    var image = '';
    const oldFilename = `${title.toLowerCase().replace(/[\s!@#$%^&*()_+={}\[\];:'",.<>?\/\\|`~-]/g, '')}.jpg`;
    const newImage = req.files.image;

    if (newImage) {
      try {
        fs.unlinkSync(path.join(__dirname, 'public/image', oldFilename));
      } catch (err) {
        console.error(err);
      }

      const formatFilename = title.toLowerCase().replace(/[\s!@#$%^&*()_+={}\[\];:'",.<>?\/\\|`~-]/g, '');
      const filename = `${formatFilename}.jpg`;

      newImage.mv(path.join(__dirname, 'public/image', filename));
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
})

app.delete('/books/:id', async (req, res) => {
  try {
    const { book } = require('./models');
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
})

// ============= REVIEW API =============
app.get('/books/:id/reviews', async (req, res) => {
  try {
    const { book_review } = require('./models');
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
})

app.post('/books/:id/reviews', async (req, res) => {
  try {
    const { book_review } = require('./models');
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
})

app.put('/books/:id/reviews/:review_id', async (req, res) => {
  try {
    const { book, book_review } = require('./models');

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
}) 

app.delete('/books/:id/reviews/:review_id', async (req, res) => {
  try {
    const { book, book_review } = require('./models');

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
})

// ============= START API =============
app.listen(port, () => {
  console.log(`SIBUKU API listening on port ${port}`)
})
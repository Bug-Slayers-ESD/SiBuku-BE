import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public", "image"));
  },
  filename: (req, file, cb) => {
    console.log(file.originalname);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("SiBuku REST API!");
});

// ============= CATALOGUE API =============
let booklist = [
  {
    id: "91hss012nasrs",
    title: "Bumi Manusia",
    description:
      "Roman Tetralogi Buru mengambil latar belakang dan cikal bakal nation Indonesia di awal abad ke-20. Dengan membacanya waktu kita dibalikkan sedemikian rupa dan hidup di era membibitnya pergerakan nasional mula-mula, juga pertautan rasa, kegamangan jiwa, percintaan, dan pertarungan kekuatan anonim para srikandi yang mengawal penyemaian bangunan nasional yang kemudian kelak melahirkan Indonesia modern.",
    author: "Pramoedya Ananta Toer",
    image: `/public/image/bumi-manusia.jpg`,
    rating: 2,
  },
  {
    id: "18f29js1189f",
    title: "Pulang",
    description:
      '"Aku tahu sekarang, lebih banyak luka di hati bapakku dibanding di tubuhnya. Juga mamakku, lebih banyak tangis di hati Mamak dibanding di matanya." Sebuah kisah tentang perjalanan pulang, melalui pertarungan demi pertarungan, untuk memeluk erat semua kebencian dan rasa sakit."',
    author: "Tere Liye",
    image: `/public/image/pulang.jpg`,
    rating: 5,
  },
  {
    id: "v3g5892k02u",
    title: "Kosmos",
    description:
      "Buku Kosmos pada dasarnya merupakan buku ilmu pengetahuan, tetapi dengan gaya yang khas, kita dapat melihat bahwa ilmu pengetahuan dapat menjadi santapan masyarakat luas. Buku ini tidak hanya berguna untuk memperluas cakrawala kita, tetapi juga mengajak kita untuk menghayati dan mencintai penemuan ilmiah.",
    author: "Carl Sagan",
    image: `/public/image/kosmos.jpg`,
    rating: 3,
  },
];

app.get("/books", (req, res) => {
  try {
    res.json({ booklist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/public/image/:filename", (req, res) => {
  try {
    const { filename } = req.params;
    console.log(filename);
    res.sendFile(path.join(__dirname, "public", "image", filename));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/books", upload.single("image"), (req, res) => {
  try {
    const id = uuidv4();
    console.log(req.file, req.body);
    const { title, description, author, rating } = req.body;

    const createdBook = {
      id,
      title,
      description,
      author,
      image: `/public/image/${req.file.filename}`,
      rating: parseInt(rating),
    };

    booklist.push(createdBook);
    res.status(201).json({ message: "Book Created!", booklist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/books/:id", upload.single("image"), (req, res) => {
  try {
    const findById = req.params.id;
    const { title, description, author, rating } = req.body;
    const filter = booklist.find((book) => book.id === findById);

    if (!filter) res.status(404).json({ message: "Book not found!" });

    const newImage = req.file;
    if (newImage) {
      try {
        fs.unlinkSync(
          path.join(__dirname, "public", "image", newImage.filename)
        );
      } catch (err) {
        console.error(err);
      }

      filter.image = `/public/image/${newImage.filename}`;
    }

    filter.title = title;
    filter.description = description;
    filter.author = author;
    filter.rating = rating;

    res.json({ message: "Book Updated!", booklist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

app.delete("/books/:id", (req, res) => {
  try {
    const findById = req.params.id;
    const bookExists = booklist.some((book) => book.id === findById);

    if (!bookExists) {
      return res.status(404).json({ message: "Book not found!" });
    }

    booklist = booklist.filter((book) => book.id !== findById);

    res.json({ message: "Book Deleted!", booklist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// ============= REVIEW API =============
let userReview = [
  {
    userId: "1234567890",
    username: "bl57bh4g4",
    bookId: "91hss012nasrs",
    review: "Buku yang luar biasa! Sangat inspiratif dan membuka wawasan.",
  },
  {
    userId: "0987654321",
    username: "janedoe",
    bookId: "18f29js1189f",
    review: "Cerita yang menyentuh hati dan penuh makna.",
  },
  {
    userId: "65bj5",
    username: "johndoe",
    bookId: "v3g5892k02u",
    review: "Buku sains yang mudah dipahami dan menarik.",
  },
];

app.get("/reviews", (req, res) => {
  try {
    res.json({ userReview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/reviews", (req, res) => {
  try {
    console.log(req.body);

    const { username, bookId, review } = req.body;
    const userId = uuidv4();

    const createdReview = {
      userId,
      username,
      bookId,
      review,
    };
    userReview.push(createdReview);
    res.status(201).json({ message: "Review Created!", userReview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/reviews/:userId", (req, res) => {
  try {
    const { username, bookId, review } = req.body;
    const { userId } = req.params;

    const filter = userReview.find((review) => review.userId === userId);

    if (!filter) res.status(404).json({ message: "Review not found!" });

    filter.username = username;
    filter.bookId = bookId;
    filter.review = review;

    res.json({ message: "Review Updated!", userReview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/reviews/:id", (req, res) => {
  try {
    const { id } = req.params;
    const reviewExists = userReview.find((review) => review.userId === id);
    console.log(id);

    if (!reviewExists) res.status(404).json({ message: "Review not found!" });

    userReview = userReview.filter((review) => review.userId !== id);

    res.json({ message: "Review Deleted!", userReview });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
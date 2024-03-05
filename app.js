const express = require('express')
const cors = require('cors')
const fs = require('fs')
const fileUpload = require('express-fileupload')
const router = require('./routes/router.js')

const app = express()
const port = 3000

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(router)

// ============= TESTING =============
app.get('/', (req, res) => {
  res.send('Book-App REST API!')
})

// ============= START API =============
app.listen(port, () => {
  console.log(`SIBUKU API listening on port ${port}`)
})
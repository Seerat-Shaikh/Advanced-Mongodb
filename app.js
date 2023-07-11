const express = require('express')
const { getDb, connectToDb } = require('./db')
const { ObjectId } = require('mongodb')

// init app & middleware
const app = express()
app.use(express.json())

// db connection
let db

//----- Connecting to Mongodb -----
connectToDb((err) => {
  if(!err){
    app.listen('3000', () => {
      console.log('app listening on port 3000')
    })
    db = getDb() //returning db
  }
})


// routes
// ----- Cursor & Fetching Data ------
app.get('/books', (req, res) => {
   
  // current page
  const page = req.query.p || 0  //if page parameter doesn't have value then value should be 0 (first page)
  const booksPerPage = 3

  let books = []

  db.collection('books')  //cursor toArray forEach
    .find()
    //it will fetch 100 documents first than will fetch other documents by pressing it
    .sort({author: 1}) //sorting alphabetically
    .skip(page * booksPerPage) //it will not show first fetch 3 documnets it will show another 3 documents after that
    .limit(booksPerPage)
    .forEach(book => books.push(book))
    .then(() => {
      res.status(200).json(books) //sending back to json client
    })
    .catch(() => {
      res.status(500).json({error: 'Could not fetch the documents'})
    })
})


//----- Finding Single Documnets -------- 
app.get('/books/:id', (req, res) => {

  if (ObjectId.isValid(req.params.id)) {

    db.collection('books')
      .findOne({_id: new ObjectId(req.params.id)})
      .then(doc => {
        res.status(200).json(doc)
      })
      .catch(err => {
        res.status(500).json({error: 'Could not fetch the document'})
      })
      
  } else {
    res.status(500).json({error: 'Could not fetch the document'})
  }

})


// ---- Handling Post Requests -----
app.post('/books', (req, res) => {
  const book = req.body

  db.collection('books')
    .insertOne(book)
    .then(result => {
      res.status(201).json(result)
    })
    .catch(err => {
      res.status(500).json({err: 'Could not create new document'})
    })
})

// ---- Deleting ------
app.delete('/books/:id', (req, res) => {

  if (ObjectId.isValid(req.params.id)) {

  db.collection('books')
    .deleteOne({ _id: new ObjectId(req.params.id) })
    .then(result => {
      res.status(200).json(result)
    })
    .catch(err => {
      res.status(500).json({error: 'Could not delete document'})
    })

  } else {
    res.status(500).json({error: 'Could not delete document'})
  }
})


// ----- Patching ----
app.patch('/books/:id', (req, res) => {
  const updates = req.body

  if (ObjectId.isValid(req.params.id)) {

    db.collection('books')
      .updateOne({ _id: new ObjectId(req.params.id) }, {$set: updates})
      .then(result => {
        res.status(200).json(result)
      })
      .catch(err => {
        res.status(500).json({error: 'Could not update document'})
      })

  } else {
    res.status(500).json({error: 'Could not update document'})
  }
})

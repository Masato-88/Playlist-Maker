/* Require modules
--------------------------------------------------------------- */
const express = require('express')
const router = express.Router()


/* Require the db connection, and models
--------------------------------------------------------------- */
const db = require('../models')


/* Routes
--------------------------------------------------------------- */
// Index Route (GET/Read): Will display all songs
router.get('/', function (req, res) {
    db.Song.find({})
        .then(songs => res.json(songs))
})


// Show Route (GET/Read): Will display an individual song document
// using the URL parameter (which is the document _id)
router.get('/:id', function (req, res) {
    db.Song.findById(req.params.id)
        .then(song => res.json(song))
        .catch(() => res.send('404 Error: Page Not Found'))
})


/* Export these routes so that they are accessible in `server.js`
--------------------------------------------------------------- */
module.exports = router

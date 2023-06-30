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
        .then(songs => {
            res.render('song-index', {
                songs: songs
            })
        })
})


// New Route (GET/Read): This route renders a form 
// which the user will fill out to POST (create) a new location
router.get('/new', (req, res) => {
    res.send('You\'ve hit the new route!')
})


// Show Route (GET/Read): Will display an individual song document
// using the URL parameter (which is the document _id)
router.get('/:id', function (req, res) {
    db.Song.findById(req.params.id)
        .then(song => {
            res.render('song-details', {
                song: song
            })
        })
        .catch(() => res.send('404 Error: Page Not Found'))
})

// Create Route (POST/Create): This route receives the POST request sent from the new route,
// creates a new pet document using the form data, 
// and redirects the user to the new pet's show page
router.post('/', (req, res) => {
    db.Song.create(req.body)
        .then(song => res.json(song))
})



/* Export these routes so that they are accessible in `server.js`
--------------------------------------------------------------- */
module.exports = router

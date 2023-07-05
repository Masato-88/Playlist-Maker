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
            res.render('songs/song-index', {
                songs: songs
            })
        })
})


// New Route (GET/Read): This route renders a form 
// which the user will fill out to POST (create) a new location
router.get('/new', (req, res) => {
    res.render('songs/new-form')
})


// Show Route (GET/Read): Will display an individual song document
// using the URL parameter (which is the document _id)
router.get('/:id', function (req, res) {
    db.Song.findById(req.params.id)
        .then(song => {
            res.render('songs/song-details', {
                song: song
            })
        })
        .catch(() => res.send('404 Error: Page Not Found'))
})

// Create Route (POST/Create): This route receives the POST request sent from the new route,
// creates a new song document using the form data, 
// and redirects the user to the new song's show page
router.post('/', (req, res) => {
    db.Song.create(req.body)
        .then(song => res.redirect('/songs/' + song._id))
})

// Edit Route (GET/Read): This route renders a form
// the user will use to PUT (edit) properties of an existing song
router.get('/:id/edit', (req, res) => {
    db.Song.findById(req.params.id)
        .then(song => res.render('songs/edit-form', {song: song}))
})

// Update Route (PUT/Update): This route receives the PUT request sent from the edit route, 
// edits the specified pet document using the form data,
// and redirects the user back to the show page for the updated location.
router.put('/:id', (req, res) => {
    db.Song.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )
        .then(song => res.redirect('/songs/' + song._id))
})

// Destroy Route (DELETE/Delete): This route deletes a song document 
// using the URL parameter (which will always be the song document's ID)
router.delete('/:id', (req, res) => {
    db.Song.findByIdAndRemove(req.params.id)
        .then(song => res.redirect('/songs'))
})


/* Export these routes so that they are accessible in `server.js`
--------------------------------------------------------------- */
module.exports = router

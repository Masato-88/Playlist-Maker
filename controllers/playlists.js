/* 
---------------------------------------------------------------------------------------
NOTE: Remember that all routes on this page are prefixed with `localhost:3000/playlists`
---------------------------------------------------------------------------------------
*/


/* Require modules
--------------------------------------------------------------- */
const express = require('express')
// Router allows us to handle routing outisde of server.js
const router = express.Router()


/* Require the db connection, and models
--------------------------------------------------------------- */
const db = require('../models')


/* Routes
--------------------------------------------------------------- */
// Index Route (All Playlists): 
// GET localhost:3000/playlists/
router.get('/', (req, res) => {
	db.Song.find({}, { playlists: true, _id: false })
        .then(songs => {
		    // format query results to appear in one array, 
		    // rather than an array of objects containing arrays 
	    	const flatList = []
	    	for (let song of songs) {flatList.push(...song.playlists)}
	    	res.render('playlists/index', {plays: flatList})
		})
});

// New Route: GET localhost:3000/playlists/new
router.get('/new/:songId', (req, res) => {
    dp.Song.findById(req.params.songId)
    .then(song => {
        if (song) {
            res.render('playlists/new-playlist', {song: song}) 
        } else {
            res.send('404 Error: Page Not Found')
        }
        
    })
})

// Create Route: POST localhost:3000/playlists/
router.post('/create/:songId', (req, res) => {
    db.Song.findByIdAndUpdate(
        req.params.songId,
        { $push: { applications: req.body } },
        { new: true }
    )
        .then(() => res.redirect('/songs/' + req.params.songId))
});

// Show Route: GET localhost:3000/playlists/:id
router.get('/:id', (req, res) => {
    db.Song.findOne(
        { 'playlists._id': req.params.id },
        { 'playlists.$': true, _id: false }
    )
        .then(song => {
	        // format query results to appear in one object, 
	        // rather than an object containing an array of one object
            res.render('playlists/playlist-details', { play: song.playlists[0] })
        })
});

// Destroy Route: DELETE localhost:3000/applications/:id
router.delete('/:id', (req, res) => {
    db.Song.findOneAndUpdate(
        { 'playlists._id': req.params.id },
        { $pull: { playlists: { _id: req.params.id } } },
        { new: true }
    )
        .then(song => res.redirect('/songs/' + song._id))
});


/* Export these routes so that they are accessible in `server.js`
--------------------------------------------------------------- */
module.exports = router

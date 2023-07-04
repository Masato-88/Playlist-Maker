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
// Index Route (All Applications): 
// GET localhost:3000/playlists/
router.get('/', (req, res) => {
	db.Song.find({}, { applications: true, _id: false })
        .then(songs => {
		    // format query results to appear in one array, 
		    // rather than an array of objects containing arrays 
	    	const flatList = []
	    	for (let song of songs) {
	        	flatList.push(...song.playlists)
	    	}
	    	res.json(flatList)
		}
	)
});

// New Route: GET localhost:3000/playlists/new
router.get('/new/:songId', (req, res) => {
    res.send('You\'ve reached the new route. You\'ll be making a new playlist for song ' + req.params.songId)
})

// Create Route: POST localhost:3000/playlists/
router.post('/create/:songId', (req, res) => {
    db.Song.findByIdAndUpdate(
        req.params.songId,
        { $push: { applications: req.body } },
        { new: true }
    )
        .then(song => res.json(song))
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
            res.json(song.playlists[0])
        })
});

// Destroy Route: DELETE localhost:3000/applications/:id
router.delete('/:id', (req, res) => {
    db.Song.findOneAndUpdate(
        { 'playlists._id': req.params.id },
        { $pull: { playlists: { _id: req.params.id } } },
        { new: true }
    )
        .then(song => res.json(song))
});


/* Export these routes so that they are accessible in `server.js`
--------------------------------------------------------------- */
module.exports = router

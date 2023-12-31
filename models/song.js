// Require the Mongoose package
const mongoose = require('mongoose');
const playlistSchema = require('./playlist.js')

// Create a schema to define the properties of the songs collection
const songSchema = new mongoose.Schema({
    name: { type: String, required: true },
    artist: { type: String, required: true },
    photo: { type: String, required: true },
    album: { type: String, required: true },
    timeLength: {type: String, required: false },
    // the applications array can only accept objects that match the criteria specified
    // in the applicationSchema. In other words, the applications array can only accept applications
	playlists: [playlistSchema]
});

// Export the schema as a Monogoose model. 
// The Mongoose model will be accessed in `models/index.js`
module.exports = mongoose.model('Song', songSchema);
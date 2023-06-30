// Require the Mongoose package
const mongoose = require('mongoose');

// Create a schema to define the properties of the pets collection
const songSchema = new mongoose.Schema({
    name: { type: String, required: true },
    artist: { type: String, required: true },
    photo: { type: String, required: true },
    timeLength: {type: String, required: true }
});

// Export the schema as a Monogoose model. 
// The Mongoose model will be accessed in `models/index.js`
module.exports = mongoose.model('Song', songSchema);
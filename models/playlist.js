const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    playlistName: {
        type: String,
        required: true
    },
    playlistDescription: {
        type: String,
        required: false
    }
})


module.exports = plalistSchema;
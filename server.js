/* Require modules
--------------------------------------------------------------- */
require('dotenv').config()
const path = require('path');
const express = require('express');
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");


/* Require the routes in the controllers folder
--------------------------------------------------------------- */
const songsCtrl = require('./controllers/songs')


/* Require the db connection, models, and seed data
--------------------------------------------------------------- */
const db = require('./models');


/* Create the Express app
--------------------------------------------------------------- */
const app = express();


/* Configure the app (app.set)
--------------------------------------------------------------- */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


/* Middleware (app.use)
--------------------------------------------------------------- */
/* Configure the app to refresh the browser when nodemon restarts
--------------------------------------------------------------- */
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
    // wait for nodemon to fully restart before refreshing the page
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

app.use(express.static('public'))
app.use(connectLiveReload());


/* Mount routes
--------------------------------------------------------------- */
app.get('/', function (req, res) {
    res.send('Tunelist')
});
// When a GET request is sent to `/seed`, the songs collection is seeded
app.get('/seed', function (req, res) {
    // Remove any existing songs
    db.Song.deleteMany({})
        .then(removedSongs => {
            console.log(`Removed ${removedSongs.deletedCount} songs`)
            // Seed the songs collection with the seed data
            db.Song.insertMany(db.seedSongs)
                .then(addedSongs => {
                    console.log(`Added ${addedSongs.length} `)
                    res.json(addedSongs)
                })
        })
});


// This tells our app to look at the `controllers/songs.js` file 
// to handle all routes that begin with `localhost:3000/songs`
app.use('/songs', songsCtrl)


/* Tell the app to listen on the specified port
--------------------------------------------------------------- */
app.listen(process.env.PORT, function () {
    console.log('Express is listening to port', process.env.PORT);
});

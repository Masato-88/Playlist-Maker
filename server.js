/* Require modules
--------------------------------------------------------------- */
require('dotenv').config()
const path = require('path');
const express = require('express');
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const methodOverride = require('method-override');


/* Require the routes in the controllers folder
--------------------------------------------------------------- */
const songsCtrl = require('./controllers/songs')
const playlistsCtrl = require('./controllers/playlists')


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
// Detect if running in a dev environment
if (process.env.ON_HEROKU === 'false') {
    // Configure the app to refresh the browser when nodemon restarts
    const liveReloadServer = livereload.createServer();
    liveReloadServer.server.once("connection", () => {
        // wait for nodemon to fully restart before refreshing the page
        setTimeout(() => {
        liveReloadServer.refresh("/");
        }, 100);
    });
    app.use(connectLiveReload());
}


// Body parser: used for POST/PUT/PATCH routes: 
// this will take incoming strings from the body that are URL encoded and parse them 
// into an object that can be accessed in the request parameter as a property called body (req.body).
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Allows us to interpret POST requests from the browser as another request type: DELETE, PUT, etc.
app.use(methodOverride('_method'));


/* Mount routes
--------------------------------------------------------------- */
app.get('/', function (req, res) {
    db.Song.find({})
        .then(songs => {
            res.render('home', {
                songs: songs
            })
        })
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

// Render the About page
app.get('/about', function (req, res) {
    res.render('about')
});


// This tells our app to look at the `controllers/songs.js` file 
// to handle all routes that begin with `localhost:3000/songs`
app.use('/songs', songsCtrl)

// This tells our app to look at the `controllers/playlists.js` file 
// to handle all routes that begin with `localhost:3000/playlist`
app.use('/playlists', playlistsCtrl)


// The "catch-all" route: Runs for any other URL that doesn't match the above routes
app.get('*', function (req, res) {
    res.send('404 Error: Page Not Found')
});


/* Tell the app to listen on the specified port
--------------------------------------------------------------- */
app.listen(process.env.PORT, function () {
    console.log('Express is listening to port', process.env.PORT);
});

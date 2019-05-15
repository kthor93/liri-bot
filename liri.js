require("dotenv").config();

const keys = require("./keys");
const axios = require("axios");
const moment = require("moment");
const Spotify = require("node-spotify-api");
const fs = require("fs");

const userCommand = process.argv[2];
const userArgument = process.argv[3];

switch (userCommand) {
    case "concert-this":
        concertThis(userArgument);
        break;
    case "spotify-this-song":
        spotifyThisSong(userArgument);
        break;
    case "movie-this":
        movieThis(userArgument);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
    default:
        console.log("Please enter a valid command.");
}

function concertThis(artist) {
    const queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(queryURL).then(function (response) {
        const events = response.data;

        events.forEach(function (event) {
            return console.log(`
                Venue Name: ${event.venue.name}
                Venue Location: ${event.venue.city}, ${event.venue.region}, ${event.venue.country}
                Venue Date: ${moment(event.venue.date)}
            `);
        })
    }).catch(function (error) {
        console.log(error);
    })
}

function spotifyThisSong(song) {
    const spotify = new Spotify(keys.spotify);

    spotify.search({ type: "track", query: song }).then(function (response) {
        const song = response.tracks.items[0];

        return console.log(`
            Artist: ${song.artists[0].name}
            Song: ${song.name}
            Album: ${song.album.name}
            Preview Song: ${song.preview_url}
        `);
    }).catch(function (err) {
        console.log(err.message);
    })
}

function movieThis(movie) {
    const queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    axios.get(queryURL).then(function (response) {
        return console.log(response);
    });
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err.message);
        } else {
            return console.log(data);
        }
    })
}
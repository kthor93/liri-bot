require("dotenv").config();

const keys = require("./keys");
const axios = require("axios");
const moment = require("moment");
const Spotify = require("node-spotify-api");
const fs = require("fs");

startLiri(process.argv[2], process.argv.slice(3).join(" "));

function startLiri(userCommand, userArgument) {
    switch (userCommand) {
        case "concert-this":
            concertThis(userArgument || "The Backstreet Boys");
            break;
        case "spotify-this-song":
            spotifyThisSong(userArgument || "The Sign");
            break;
        case "movie-this":
            movieThis(userArgument || "Mr. Nobody");
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log("Please enter a valid command.");
    }
}

function concertThis(artist) {
    const queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(queryURL).then(function (response) {
        const events = response.data;

        events.forEach(function (event) {
            if (event.venue.region) {
                return console.log(`
    Venue Name: ${event.venue.name}
    Venue Location: ${event.venue.city}, ${event.venue.region}, ${event.venue.country}
    Venue Date: ${moment(event.venue.date)}

    -----------------------------------------------------------`);
            } else {
                return console.log(`
    Venue Name: ${event.venue.name}
    Venue Location: ${event.venue.city}, ${event.venue.country}
    Venue Date: ${moment(event.venue.date)}

    -----------------------------------------------------------`);
            }
        })
    }).catch(function (error) {
        return console.log(error);
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
    -----------------------------------------------------------
    Preview Song: ${song.preview_url}
    `);
    }).catch(function (err) {
        return console.log(err.message);
    })
}

function movieThis(movie) {
    const queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    axios.get(queryURL).then(function (response) {
        const movie = response.data;

        return console.log(`
    TItle: ${movie.Title}
    Year Released: ${movie.Year}
    IMDB Rating: ${movie.imdbRating}
    Rotten Tomatoes Rating: ${movie.Metascore}
    Country Produced: ${movie.Country}
    Language: ${movie.Language}
    Actors: ${movie.Actors}
    -----------------------------------------------------------
    Plot: ${movie.Plot}
    `);
    }).catch(function (error) {
        return console.log(error);
    })
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err.message);
        } else {
            const dataArray = data.split(",");

            startLiri(dataArray[0], dataArray[1]);
        }
    })
}
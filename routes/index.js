
/*
 * GET home page.
 */

/* Tratamiento lexico */

/* Filtrar 2 tipos de palabras
 * 
 * 1. Diccionario de palabras vacias
 *      Ejemplo: a ante con desde...
 * 2. Palabras menos utilizadas
 *      Ejemplo: <5% aparicion
 */

var Twitter, util; 

Twitter = require('twitter');
util = require('util');


function listaParada(arrayTweets) {

}

/* Ejemplo: 
 * periodistico => 
 * periodista =>
 */
function stemmer(arrayTweets) {

}

/* Ejemplo:
 * hizo => hacer
 * hecho => hacer
 */
function lematizacion(arrayTweets) {

}

    /***/


exports.showTweets = function(req, res){

    console.log("showTweets");
    
    var oauth, twitter, self = this, statuses;
                
    this.statuses = "prueba";
    twitter = new Twitter({
        consumer_key: 'acxVDBo5pbNEHjZOPaWa8w',
        consumer_secret: 'MwC2uh45dprfWqmQd1lPXdWB3QiWC4QW5Fkxcw',
        access_token_key: '116344110-vAwha7HaNSfXJjD9cGzCAMBzlAC4ZVRIyYb6CbbU',
        access_token_secret: 'FCrvZBLwmSqzvvIg8kgSvDSS6jPaoP4TmbxU8qMRak'
    });

    // this method was used to process the lexicon, in order to get a separated terms list.
    var tweets, negTerms = [], posTerms = "", negDoubleTerms = "", posDoubleTerms = "", ambiguousTerms = "";

    require('fs')
    .readFileSync('./public/static/lexicon.txt')
    .toString()
    .split('\n')
    .forEach(function (line) {
        var parts;

        parts = line.split(/[\s]+/);

        if (parts.length === 3) {
            if (parts[2] === 'pos') {
                posTerms += "\"" + parts[0] + "\", ";
            } else if (parts[2] === 'neg'){
                negTerms += "\"" + parts[0] + "\", ";
            }

        } else if (parts.length === 4) {

            if (parts[2] === 'pos' && parts[3] === 'pos') {
                posDoubleTerms += "\"" + parts[0] + "\", ";
            } else if (parts[2] === 'neg' && parts[3] === 'neg') {
                negDoubleTerms += "\"" + parts[0] + "\", ";
            } else { //pos-neg or neg-pos
                ambiguousTerms += "\"" + parts[0] + "\", ";
            }
        }
    })


    // DEBUG: variable temporal solo para trastear con la vista 
    tweets = [
        {
            "favorited": false,
            "created_at": "Mon Jun 27 19:32:19 +0000 2011",
            "text": "Misleading error message - If you try to follow a user who was recently suspended, you may see an error... http://t.co/cCIWIwg",
        }
        ,{
            "favorited": false,
            "created_at": "Mon Jun 27 01:21:23 +0000 2011",
            "text": "Tweet delivery delays for streaming clients - We experienced temporary delays but the issue has now been... http://t.co/IcQut5R",
        }
        ,{
            "favorited": false,
            "created_at": "Mon Jun 27 01:21:23 +0000 2011",
            "text": "This is just a test",
        }
    ]
    // ---

    res.render('index', { tweets: tweets, title: "Twitter General Feeling Analizer", percentage: 55 });
};


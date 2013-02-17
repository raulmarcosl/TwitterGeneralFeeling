
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

    twitter.get('https://api.twitter.com/1.1/search/tweets.json',
        {
            q:'Complutense',
            include_entities: 'false',
            count: "2"
        }, 
        function(data) {
            // console.log(data.statuses);
            self.statuses = data.statuses;
            // console.log(util.inspect(data.statuses[0].text));
        });

    console.log(this.statuses);
  res.render('index', { statuses: JSON.stringify(statuses) });
};


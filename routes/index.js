
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



    var tweets;

    res.render('index', { tweets: tweets, title: "Best page ever" });
};


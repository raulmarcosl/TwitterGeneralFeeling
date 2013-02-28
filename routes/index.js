
/*
 * GET home page.
 */

exports.showTweets = function(req, res){

    // DEBUG: variable temporal solo para trastear con la vista 
    var tweets = [
        {
            "favorited": false,
            "username": "@test",
            "positive": 0,
            "negative": 0,
            "created_at": "Mon Jun 27 19:32:19 +0000 2011",
            "text": "Misleading error message - If you try to follow a user who was recently suspended, you may see an error... http://t.co/cCIWIwg",
        }
        ,{
            "favorited": true,
            "username": "@test",
            "positive": 0,
            "negative": 0,
            "created_at": "Mon Jun 27 01:21:23 +0000 2011",
            "text": "Tweet delivery delays for streaming clients - We experienced temporary delays but the issue has now been... http://t.co/IcQut5R",
        }
        ,{
            "favorited": false,
            "username": "@test",
            "positive": 0,
            "negative": 0,
            "created_at": "Mon Jun 27 01:21:23 +0000 2011",
            "text": "This is just a test",
        }
    ];
    var searchTerm = req.session.search;
    var contPositive = 0, contNegative = 0;
    var percentage = 50;

    if (req.session.tweets !== undefined) {
        tweets = analyzeTweets(req.session.tweets);
        
        var len = tweets.length;
        for (var i = 0; i < len; i += 1) {
            contPositive += tweets[i].positive;
            contNegative += tweets[i].negative;
        }
        percentage = Math.round(100 * contNegative / (contPositive + contNegative));    
    }    

    res.render('index', {
                            tweets: tweets,
                            title: "Twitter General Feeling Analizer",
                            searchTerm: searchTerm,
                            contPositive: contPositive,
                            contNegative: contNegative,
                            percentage: percentage
                        });
};

function analyzeTweets (tweets) {

        var Snowball = require("../public/js/snowball.js").Snowball;        
        var stemmer = new Snowball("Spanish");

        var i, len, words, posMatches, negMatches, doublePosMatches, doubleNegMatches, ambiguousMatches;

        // We delete the Twitter mentions, to avoid including usernames in the word list
        len = tweets.length;
        for (i = 0 ; i < len; i += 1) {
            tweets[i].text = deleteMentions(tweets[i].text);
        }

        // We split the text into words, using the most common separators
        for (i = 0 ; i < len; i += 1) {
            tweets[i].words = splitWords(tweets[i].text);
        }

        // We use the stop word list. 
        // Source: http://snowball.tartarus.org/algorithms/spanish/stop.txt
        for (i = 0 ; i < len; i += 1) {
            tweets[i].words = stopWords(tweets[i].words);            
        }

        // we get the words of the tweet but after the stemming, so we can compare later with the
        // lexicon's words after stemming also.
        for (i = 0; i < len; i += 1) {
            var wordsLen = tweets[i].words.length;
            for (var j = 0; j < wordsLen; j++){
                stemmer.setCurrent(tweets[i].words[j]);
                stemmer.stem();
                tweets[i].words[j] = stemmer.getCurrent();
            }
        tweets[i].words = tweets[i].words.sort();
        }

        // we get the stemming words of the lexicon.
        var posTerms = getPosTerms();
        var posTermsWithStemming = [];
        var posTermsLength = posTerms.length;
        for (i = 0; i < posTermsLength; i += 1) {
                stemmer.setCurrent(posTerms[i]);
                stemmer.stem();
                posTermsWithStemming.push(stemmer.getCurrent());
        }

        var negTerms = getNegTerms();
        var negTermsWithStemming = [];
        var negTermsLength = negTerms.length;
        for (i = 0; i < negTermsLength; i++) {
            stemmer.setCurrent(negTerms[i]);
            stemmer.stem();
            negTermsWithStemming.push(stemmer.getCurrent());
        }

        // we analyze the coincidences between words and lexicon (in stemming form).
        var contPositive = 0, contNegative = 0;
        for (i = 0 ; i < len; i += 1) {
            tweets[i].positive = sorted_intersection(tweets[i].words, posTermsWithStemming).length;
            tweets[i].negative = sorted_intersection(tweets[i].words, negTermsWithStemming).length;
        }

    return tweets;  
    };

function deleteMentions (text) {
    return text.replace(/(@+)(\w+)/g, '');
}

function splitWords (text) {
    var regex = /[\s,.;:¡!()¿?@"']+/;
    return text.split(regex);       
}

function stopWords (words) {
    var stopList, i, len, aux = [], sortedWords, posTerms, negTerms, posDoubleTerms, negDoubleTerms, ambiguousTerms;

    stopList = [
        "algo", "algunas", "algunos", "ante", "antes", "como", "con", "contra", "cual", "cuando", "del", 
        "desde", "donde", "durante", "ella", "ellas", "ellos", "entre", "era", "erais", "eran", "eras", 
        "eres", "esa", "esas", "ese", "eso", "esos", "esta", "estaba", "estabais", "estaban", "estabas", 
        "estad", "estada", "estadas", "estado", "estados", "estamos", "estando", "estar", "estaremos", 
        "estará", "estarán", "estarás", "estaré", "estaréis", "estaría", "estaríais", "estaríamos", "estarían", 
        "estarías", "estas", "este", "estemos", "esto", "estos", "estoy", "estuve", "estuviera", "estuvierais", 
        "estuvieran", "estuvieras", "estuvieron", "estuviese", "estuvieseis", "estuviesen", "estuvieses", 
        "estuvimos", "estuviste", "estuvisteis", "estuviéramos", "estuviésemos", "estuvo", "está", "estábamos", 
        "estáis", "están", "estás", "esté", "estéis", "estén", "estés", "fue", "fuera", "fuerais", "fueran", 
        "fueras", "fueron", "fuese", "fueseis", "fuesen", "fueses", "fui", "fuimos", "fuiste", "fuisteis", 
        "fuéramos", "fuésemos", "haber", "habida", "habidas", "habido", "habidos", "habiendo", "habremos", 
        "habrá", "habrán", "habrás", "habré", "habréis", "habría", "habríais", "habríamos", "habrían", "habrías", 
        "habéis", "había", "habíais", "habíamos", "habían", "habías", "han", "has", "hasta", "hay", "haya", 
        "hayamos", "hayan", "hayas", "hayáis", "hemos", "hube", "hubiera", "hubierais", "hubieran", "hubieras", 
        "hubieron", "hubiese", "hubieseis", "hubiesen", "hubieses", "hubimos", "hubiste", "hubisteis", 
        "hubiéramos", "hubiésemos", "hubo", "las", "les", "los", "mis", "mucho", "muchos", "muy", "más", "mía", 
        "mías", "mío", "míos", "nos", "nosotras", "nosotros", "nuestra", "nuestras", "nuestro", "nuestros", 
        "otra", "otras", "otro", "otros", "para", "pero", "poco", "por", "porque", "que", "quien", "quienes", 
        "qué", "sea", "seamos", "sean", "seas", "ser", "seremos", "será", "serán", "serás", "seré", "seréis", 
        "sería", "seríais", "seríamos", "serían", "serías", "seáis", "sido", "siendo", "sin", "sobre", "sois", 
        "somos", "son", "soy", "sus", "suya", "suyas", "suyo", "suyos", "también", "tanto", "tendremos", "tendrá", 
        "tendrán", "tendrás", "tendré", "tendréis", "tendría", "tendríais", "tendríamos", "tendrían", "tendrías", 
        "tened", "tenemos", "tenga", "tengamos", "tengan", "tengas", "tengo", "tengáis", "tenida", "tenidas", 
        "tenido", "tenidos", "teniendo", "tenéis", "tenía", "teníais", "teníamos", "tenían", "tenías", "tiene", 
        "tienen", "tienes", "todo", "todos", "tus", "tuve", "tuviera", "tuvierais", "tuvieran", "tuvieras", 
        "tuvieron", "tuviese", "tuvieseis", "tuviesen", "tuvieses", "tuvimos", "tuviste", "tuvisteis", "tuviéramos", 
        "tuviésemos", "tuvo", "tuya", "tuyas", "tuyo", "tuyos", "una", "uno", "unos", "vosotras", "vosotros", 
        "vuestra", "vuestras", "vuestros", "éramos" 
    ];

    // we delete the words of 1 or 2 characters
    len = words.length;
    for (i = 0; i < len; i+=1) {
        if (words[i].length > 2) {
            aux.push(words[i]);
        }
    }

    // we use the stopList, with the word list sorted
    words = diff(aux.sort(), stopList);        

    return words;
}

function sorted_intersection (array, excess) {
    var ai = 0, bi = 0, intersection = new Array();

    while (ai < array.length && bi < excess.length) {
        if (array[ai] < excess[bi]) {
            ai++;
        } else if (array[ai] > excess[bi] ) {
            bi++;
        } else { //equal
            intersection.push(array[ai]);
            ai++;
            bi++;
        }
    }

    return intersection;
}

function diff (array1, array2) {
    return array1.filter(function(i) {
        return !(array2.indexOf(i) > -1);
    });
};

function getPosTerms () {
    return [
        "abierto", "abundante", "abundoso", "acaudalado", "acertado", "aclamacion", "acogedor", "adecuado",
        "adinerado", "admirable", "admiracion", "adorable", "adorar", "afable", "afecto", "afectuoso", "affaire",
        "aficion", "afirmar", "afirmativo", "afortunado", "agradable", "ajustar", "alborozar", "alborozo", "alegre",
        "alegria", "alentar", "algazara", "aliado", "alimenticio", "alivio", "altruista", "amable", "amado", "ambicion",
        "ameno", "amigable", "amistoso", "angelical", "angelico", "animado", "animar", "ansioso", "apacible", "apasionado",
        "apasionante", "aplauso", "apreciado", "apropiado", "apto", "apuesto", "ardiente", "ardor", "arranque",
        "arrebatamiento", "arrebatar", "arrebato", "arrepentirse", "arrobamiento", "arrobar", "arrojado", "arte",
        "ascendente", "asegurar", "asombroso", "aspiracion", "astuto", "asunto", "atencion", "atento", "atractivo",
        "atrayente", "atrevido", "audaz", "autentico", "autorizacion", "aventajar", "aventura", "belleza", "bello",
        "bendecir", "beneficio", "beneficioso", "benefico", "benevolencia", "benevolente", "benevolo", "bienaventuranza",
        "bienestar", "bizarro", "bombon", "bonito", "brillante", "brillantez", "buen", "bueno", "caballeria",
        "caballerosidad", "calido", "calmado", "calmo", "candido", "capaz", "capital", "carecer", "carinoso", "casual",
        "cautivador", "cautivar", "celebracion", "celebrar", "celebre", "certero", "cese", "chic", "circunspeccion",
        "civilizado", "clamoroso", "coherente", "coincidencia", "coligado", "colmado", "comodidad", "compasion",
        "competente", "complaciente", "comprensible", "concepcion", "conciencia", "confiabilidad", "confianza",
        "confidente", "conocido", "consagrar", "consagrarse", "consciencia", "conseguir", "consideracion", "considerado",
        "constante", "consumado", "contento", "contundente", "conveniente", "copioso", "coraje", "cordial", "correccion",
        "cortes", "crack", "creativo", "crecer", "creciente", "credibilidad", "creible", "criterio", "cultivado", "culto",
        "dadivoso", "dechado", "decidido", "dedicar", "deferencia", "deleitoso", "delicadeza", "delicioso", "derroche",
        "desahogo", "descanso", "descargar", "deseo", "desocupado", "despedida", "despido", "desprendido", "destacable",
        "destacado", "destacar", "destreza", "dicha", "dichoso", "diestro", "digno", "dinamico", "discernimiento",
        "discrecion", "diserto", "disfrutar", "distincion", "distinguido", "distinguir", "divertido", "divertir",
        "divino", "docto", "dotar", "ducho", "dulce", "edicion", "educado", "efectivo", "eficaz", "ejemplar",
        "ejemplo", "elegante", "elevado", "elocuente", "embelesamiento", "embelesar", "embeleso", "embriagar",
        "embrujar", "embullo", "eminencia", "emocionante", "encantador", "encantar", "encomendar", "energizar",
        "entranable", "entusiasmo", "equivalencia", "erudito", "esencial", "esforzado", "especial", "esplendido",
        "esplendor", "esplendoroso", "estima", "estimulante", "estimular", "estrella", "estupendo", "euforia",
        "euforico", "exacto", "exaltar", "exceder", "excelente", "excepcional", "exclusivo", "exculpar", "exencion",
        "exitoso", "experto", "expresivo", "exquisito", "extraordinario", "exuberante", "exultacion", "exultant",
        "facilidad", "factible", "facultades", "famoso", "fantastico", "fascinar", "fasto", "fastuosidad", "fastuoso",
        "favorito", "fecundo", "fehaciente", "feliz", "fertil", "ferviente", "fervor", "fervoroso", "festejo",
        "fiabilidad", "fiable", "fidedigno", "fineza", "fino", "firme", "flamante", "formal", "formalidad", "formidable",
        "forrado", "fortuna", "fructifero", "fuerte", "funcional", "galanteria", "galardon", "gallardo", "ganancia",
        "garboso", "generosidad", "generoso", "gentil", "genuino", "gloria", "glorioso", "gozo", "gozoso", "gran",
        "grande", "grandeza", "grandiosidad", "gratificacion", "gratificante", "grato", "gusto", "habil", "habilidad",
        "hacha", "hermoso", "heroicidad", "hilaridad", "homenaje", "hondo", "honor", "honorable", "honorado", "humor",
        "humorismo", "idea", "identidad", "idoneo", "ilusion", "ilustrado", "imaginativo", "impaciente", "impecable",
        "impresionante", "inagotable", "incitar", "incontestable", "increible", "incuestionable", "individualidad",
        "individualismo", "indubitable", "indudable", "infalible", "infatigable", "ingenio", "ingeniosidad",
        "innegable", "innovador", "inocente", "inquebrantable", "instructivo", "instruido", "integridad", "inteligente",
        "intoxicar", "intrepido", "inventiva", "jovial", "jubilo", "juicioso", "justo", "laborioso", "leal", "levantar",
        "liberar", "libertar", "limpio", "longanimidad", "lucimiento", "lucrativo", "lujo", "lujoso", "luminoso",
        "lustre", "madurez", "maestria", "magnanime", "magnificencia", "magnifico", "mantener", "maravilla",
        "maravilloso", "maximo", "mayor", "medrar", "merecedor", "merito", "miramiento", "mordacidad", "naturalidad",
        "necesitar", "nombroso", "obediencia", "obstinado", "ocasion", "optimista", "opulencia", "opulento", "osado",
        "ovacion", "paciencia", "pacifico", "paz", "perfeccion", "perseverante", "persistente", "perspicacia",
        "perspicaz", "placidez", "placido", "plenitud", "poder", "poetico", "porfiado", "positivo", "potente",
        "practicable", "precaucion", "preciosidad", "precioso", "predilecto", "predominante", "preservacion",
        "prestigio", "presto", "prevencion", "prevision", "prodigo", "productivo", "profusion", "prolifero",
        "propicio", "provechoso", "prudente", "pudiente", "purpura", "querubico", "quimerico", "radiante", "raudo",
        "razonable", "real", "realizable", "recaudo", "redencion", "renovacion", "resistente", "respetable", "respiro",
        "resuelto", "risueno", "sabio", "sabor", "sabroso", "salvacion", "sensacional", "sensato", "serenidad",
        "sereno", "simpatico", "simplicidad", "sobrepasar", "sobrepujar", "sonrisa", "sosiego", "sumo", "totalidad",
        "transporte", "valeroso", "valiente", "valioso", "ventaja", "veracidad", "viable", "vigorizar", "vital"
    ];
}

function getNegTerms () {
    // I've deleted: chachi, humilde, ido
    return [
        "abandonar", "abandono", "abarrotado", "abatir", "abominable", "abominacion", "abominar", "aborrecer", "aborrecible",
        "aborrecimiento", "aborto", "abrasador", "abrumar", "absolutismo", "absurdo", "aburrido", "acabado", "achaque",
        "achispado", "acibarar", "acido", "acobardar", "acosar", "acre", "acusacion", "acusar", "admonitorio", "adusto",
        "adversidad", "advertencia", "afan", "afeccion", "afeminado", "afliccion", "afligido", "afrenta", "afrontar",
        "agitacion", "agitado", "agitar", "agobiante", "agotamiento", "agravamiento", "agravar", "agrio", "agudeza",
        "ahuecamiento", "alboroto", "alcoholico", "alcornoque", "alfilerazo", "alifafe", "alocado", "altaneria",
        "altanero", "altivez", "altiveza", "altivo", "amargar", "amargo", "amargura", "amenaza", "amenazador", "amonestar",
        "angustia", "angustiado", "angustioso", "animal", "animosidad", "aniquilacion", "aniquilamiento", "ansia", "ansiedad",
        "antagonico", "antediluviano", "anticuado", "antiguo", "antipatico", "antitetico", "anular", "apenado", "apesadumbrado",
        "apocar", "apoderarse", "aprension", "apretura", "aprieto", "apuro", "aranazo", "arisco", "arpia", "arrancar",
        "arriesgado", "arriesgar", "arrogancia", "arrogante", "arruinar", "artero", "artificial", "asco", "asesino", "asimetria",
        "asombrar", "asqueado", "asquear", "asqueroso", "asustar", "atolladero", "atormentar", "atrevimiento", "atribulacion",
        "atrocidad", "atroz", "aturdir", "aturrullar", "austero", "autoritarismo", "aversion", "bacanal", "bajo", "bajon",
        "baladron", "barbaridad", "barbarie", "barbaro", "barrila", "basto", "basura", "befa", "belico", "belicoso", "bellaco",
        "berenjenal", "bestia", "bestial", "bobo", "bocon", "borracho", "botarate", "braveza", "bravucon", "bravura", "brega",
        "bronca", "brote", "bruja", "brutal", "bullanguero", "bullicio", "bunuelo", "burla", "burlar", "burro", "cabezota",
        "cabreado", "caca", "cacao", "cagada", "cagarria", "caida", "calamidad", "calamitoso", "calavera", "calvario",
        "calvatrueno", "camorra", "camorrista", "cansancio", "cantada", "cante", "caos", "caradura", "cardenal", "carga",
        "cargante", "carniceria", "caro", "cascarrabias", "castigo", "cataclismo", "catastrofe", "catastrofico", "caucion",
        "caustico", "ceder", "censura", "censurar", "ceporro", "cernicalo", "chalado", "charro", "chasco", "chiflado", "chillon",
        "chismorreo", "chocar", "choque", "chufleta", "cinismo", "cipote", "codicioso", "coger", "colerico", "combativo",
        "complicacion", "comprometer", "comun", "conceder", "condescendencia", "conflicto", "confrontacion", "confusion",
        "congoja", "conmiseracion", "conmocion", "consternado", "consternar", "contradiccion", "contraerse", "contrariedad",
        "contrario", "contratiempo", "conturbar", "contusion", "copete", "corrupcion", "corrupto", "cortante", "corto", "craso",
        "criatura", "criminal", "cruel", "crueldad", "cuento", "cuestionable", "cuita", "cuitado", "culpabilidad", "danar",
        "danino", "dano", "danoso", "debacle", "debil", "decaido", "decepcion", "defecto", "deficiencia", "deficiente",
        "degeneracion", "delatar", "deletereo", "delicado", "delincuente", "delirio", "demente", "demoler", "demonio",
        "denegacion", "deplorable", "deplorar", "depre", "depresivo", "deprimente", "deprimido", "deprimir", "derribar",
        "derrocar", "desabrido", "desabrigo", "desafecto", "desafilado", "desafio", "desafortunado", "desagradable", "desagradar",
        "desagradecido", "desagrado", "desalentado", "desalentador", "desalentar", "desalmado", "desamparo", "desanimar",
        "desapacible", "desarreglo", "desasosegado", "desasosiego", "desastre", "desastroso", "desatento", "desazon",
        "desbarajuste", "descarado", "descaro", "descomunal", "desconcertar", "desconocido", "desconsolado", "descortes",
        "descuello", "descuido", "desden", "desdenar", "desdicha", "desdichado", "desecho", "desencadenamiento", "desencanto",
        "desengano", "desesperacion", "desesperanza", "desesperanzar", "desestimacion", "desfachatez", "desfallecimiento",
        "desfasado", "desfavorable", "desgarbado", "desgarrador", "desgracia", "deshonra", "desigual", "desigualdad",
        "desilusion", "desistir", "deslumbrante", "desmanado", "desmentir", "desmesurado", "desmoralizar", "desnudar",
        "desolado", "desorbitado", "desorden", "despiadado", "desposeer", "despotismo", "despreciable", "despreciar", "desprecio",
        "desquiciar", "desquite", "destrozar", "desvanecimiento", "desventajoso", "desventura", "desventurado", "desvergonzado",
        "desverguenza", "detestable", "detestar", "detonador", "detrimento", "diablillo", "diablo", "dictadura", "dificil",
        "dificultad", "dificultoso", "discusion", "diseminado", "disgustado", "disgustar", "disgusto", "disparatado", "distante",
        "distraer", "disturbios", "diverso", "doler", "doloroso", "dudoso", "duro", "ebrio", "echador", "efimero", "elacion",
        "embotado", "embravecido", "embrollo", "embuste", "empobrecido", "empobrecimiento", "encogerse", "enconar", "encono",
        "encontronazo", "endeblez", "endiosamiento", "enervar", "enfadoso", "enfermedad", "enfermo", "enfurecido", "engano",
        "enganoso", "engendro", "engorroso", "engreimiento", "enojar", "enojoso", "enredo", "entono", "entremetido",
        "entrometido", "envalentonamiento", "envanecimiento", "enzarzar", "equivocacion", "equivocar", "equivocarse", "errar",
        "erroneo", "error", "erupcion", "escalofriante", "escandalizar", "escandaloso", "escaramuza", "escasez", "escaso",
        "escoria", "escoriar", "espanto", "espantoso", "espina", "espinoso", "estafa", "esteril", "estirado", "estrafalario",
        "estrambotico", "estremecedor", "estricto", "estridente", "estruendo", "estupido", "evasivo", "exagerado", "exagerar",
        "exasperante", "excentrico", "execracion", "exiguidad", "exiguo", "exorbitante", "exterminacion", "exterminio", "extrano",
        "extravagante", "extremo", "facistol", "fallo", "falsificado", "falta", "fanfarron", "fantasma", "fantoche", "farolero",
        "fastidiado", "fastidiar", "fastidioso", "fatal", "fatiga", "fatuo", "fenomenal", "ferocidad", "feroz", "fetidez",
        "fiasco", "fiera", "fiereza", "fijacion", "fisgon", "flaqueza", "flojo", "forzar", "fraude", "frenesi", "fresco", "frio",
        "frustrar", "fuero", "fugaz", "funesto", "furia", "furioso", "furor", "futilidad", "gallito", "gamberro", "gasto", "gazapaton",
        "gazapo", "gemir", "genial", "glacial", "golpe", "gorila", "gratuito", "grave", "gravedad", "grima", "gris", "groseria",
        "grosero", "grunon", "guay", "hampon", "harpia", "harto", "hastiado", "hastio", "hecatombe", "hediondez", "hedor", "hematoma",
        "herida", "herir", "hinchazon", "histeria", "histerismo", "historia", "horrendo", "horrido", "horripilante", "horror", "horrorizar",
        "horroroso", "hortera", "hosco", "hostigar", "huir", "humillacion", "humillar", "ignominia", "ilegal", "imbecil", "impedimento",
        "imperfeccion", "impersonal", "impertinencia", "imponente", "imposible", "impreciso", "improductivo", "improperio", "imprudente",
        "impudico", "inaceptable", "inadecuado", "inadmisible", "inaguantable", "inapropiado", "incapacidad", "incapaz", "incivilizado",
        "incomodidad", "incomodo", "incompetencia", "incompleto", "inconcebible", "incongruente", "increpacion", "indigente", "indiscreto",
        "indistinguible", "indomado", "ineficacia", "ineficaz", "inepto", "inestable", "inexperto", "infame", "infamia", "infantil", "infecundo", 
        "inferior", "inflexible", "infortunado", "infortunio", "infructuoso", "iniquidad", "inmaduro", "inmodestia", "inmundo", "inopia", 
        "inoportuno", "inquietante", "inquietar", "inquieto", "inquietud", "inquina", "insania", "insignificancia", "insignificante", "insolencia", 
        "insoportable", "insuficiente", "insufrible", "insultante", "insultos", "interrumpir", "intolerable", "intranquilidad", "intranquilizar", 
        "intranquilo", "intrusion", "inutil", "invalido", "invasion", "irritacion", "irritante", "irritar", "jactancia", "jactancioso", "jaque", 
        "jaqueton", "ladino", "lamentable", "lamentoso", "lapsus", "lascivo", "lastimar", "lastimoso", "latoso", "lento", "lesion", "letal", 
        "libidinoso", "lio", "llamativo", "lobrego", "locatis", "loco", "lozania", "lugubre", "luxurioso", "macabro", "magulladura", "magullar", 
        "majara", "majareta", "majestuoso", "mal", "maldicion", "malhechor", "malhumorado", "malo", "manazas", "mancha", "manejo", "mania", "marana", 
        "masacre", "matamoros", "matanza", "maton", "melancolia", "melancolico", "melon", "mendrugo", "menosprecio", "mentira", "miedo", "mierda", 
        "miscelaneo", "miserable", "miseria", "misero", "misterioso", "mixto", "modesto", "mohoso", "molesto", "monotono", "monstruo", "morado", 
        "morbido", "morbositat", "morboso", "mordaz", "mortal", "mortandad", "mortifero", "mortificacion", "movida", "nauseabundo", "nauseoso", 
        "negro", "noble", "nocivo", "obsceno", "obsesionante", "obsoleto", "obstaculo", "obstinacion", "obtuso", "ofensa", "ofensivo", "ofrecerse", 
        "oposicion", "opresion", "oprimir", "ordinario", "orgullo", "orgulloso", "oscuro", "padecimiento", "palangana", "palurdo", "parasito", 
        "parodia", "pasado", "pasmado", "patan", "patinazo", "patoso", "pavoroso", "pebete", "pelea", "peligro", "peligroso", "pena", "penacho", 
        "pendenciero", "penoso", "peor", "pequeno", "perdicion", "perdonavidas", "perfido", "perjudicial", "pernicioso", "pertinaz", "perturbador", 
        "perturbar", "perverso", "pesado", "pescuezo", "peso", "pestazo", "peste", "picado", "picaro", "pinchar", "plaga", "plantista", "pleito", 
        "pobre", "pobreteria", "preocupacion", "preocupado", "preocupante", "prepotencia", "prepotente", "presumido", "pretension", "privacion", 
        "profundo", "punico", "puteria", "quebradero", "quebrantar", "querella", "rajon", "rasguno", "raspadura", "rebosante", "rechazar", 
        "recular", "reganar", "reganina", "regano", "regio", "rehilete", "rencor", "renuncia", "repeler", "reprender", "represalia", "reprimenda", 
        "reproche", "repugnancia", "repugnante", "repulsio", "resistir", "retrasado", "retraso", "revancha", "reyerta", "rigido", "riguroso", 
        "rina", "rocin", "romper", "rufian", "ruido", "ruin", "sagaz", "salvaje", "sambenito", "sarao", "saturnino", "serio", "severo", "siniestro",
        "soberbia", "soberbio", "sobrecogedor", "socarron", "solemne", "solitario", "sombrio", "sorprender", "subalterno", "suficiencia", 
        "sufrimiento", "sulfurado", "superficial", "surtido", "tacha", "tarado", "tarambana", "tarasca", "tarugo", "temerario", "temible", 
        "tempestuoso", "terco", "terquedad", "testarudez", "timo", "tirania", "tocado", "toldo", "tomate", "tonto", "tormentoso", "toxico", 
        "traicionero", "transgresor", "trapisonda", "trastornar", "trauma", "triste", "ufania", "vacio", "vanidad", "vareta", "vehemencia", 
        "venganza", "vengar", "ventolera", "verde", "virulento", "vitriolico", "voceador", "vociferador", "zamarro", "zurullo"
    ];
}
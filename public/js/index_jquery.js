$(document).ready(function(){
    $('button.stemmer').click(function(){
        var text, words, wordsFreq, posMatches, negMatches, doublePosMatches, doubleNegMatches, ambiguousMatches;
        text = $('.text').val();

        // we delete the Twitter mentions, to avoid including usernames in the word list
        text = deleteMentions(text);

        // we split the text into words, using the most common separators
        words = splitWords(text);

        // cuenta palabras
        wordsFreq = countFrequency(words);

        // stopWords
        words = stopWords(words);

        // we analyze the sentiment in the words
        posMatches = sorted_intersection(words, getPosTerms());
        negMatches = sorted_intersection(words, getNegTerms());
        doublePosMatches = sorted_intersection(words, getDoublePosTerms());
        doubleNegMatches = sorted_intersection(words, getDoubleNegTerms());
        ambiguousMatches = sorted_intersection(words, getAmbiguousTerms());

        // DEBUG
        console.log(posMatches, "pos: ");
        console.log(negMatches, "neg: ");
        console.log(doublePosMatches, "doublePos: ");
        console.log(doubleNegMatches, "doubleNeg: ");
    });

    function deleteMentions (text) {
        return text.replace(/(@+)(\w+)/g, '');
    }

    function splitWords (text) {
        var regex = /[\s,.;:¡!()¿?@"']+/;
        return text.split(regex);       
    }

    function countFrequency (words) {
        var freq = {}, freqArray = [], i, len;
        
        len = words.length;
        for (i=0; i<len; i++) {
            if (typeof freq[words[i]] === 'number') {
                freq[words[i]] += 1;
            } else if (words[i].length >= 3) {
                freq[words[i]] = 1;
                freqArray.push(words[i]);
            }   
        }
        
        return freqArray.sort();
    }

    // TODO
    function sortFrequency (freq) {
        freq.sort(function compFrequency (a, b) {
        });
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
            "abierto", "abundoso", "acaudalado", "acertado", "aclamacion", "acogedor", "adinerado", "admiracion",
            "adorable", "afable", "afecto", "afectuoso", "affaire", "aficion", "afirmar", "afirmativo", "afortunado",
            "ajustar", "alborozar", "alborozo", "alegre", "alegria", "alentar", "algazara", "aliado", "alimenticio",
            "alivio", "altruista", "amable", "amado", "ambicion", "ameno", "amigable", "amistoso", "angelical", "angelico",
            "animado", "animar", "ansioso", "apacible", "apasionado", "apasionante", "aplauso", "apto", "apuesto", "ardiente",
            "ardor", "arranque", "arrebatamiento", "arrebatar", "arrebato", "arrepentirse", "arrobamiento", "arrobar",
            "arrojado", "arte", "ascendente", "asegurar", "asombroso", "aspiracion", "astuto", "asunto", "atencion", "atento",
            "atractivo", "atrayente", "atrevido", "audaz", "autentico", "autorizacion", "aventajar", "aventura", "bello",
            "bendecir", "beneficio", "beneficioso", "benefico", "benevolencia", "benevolente", "benevolo", "bienaventuranza",
            "bienestar", "bizarro", "bombon", "bonito", "brillante", "brillantez", "buen", "caballeria", "caballerosidad",
            "calido", "calmado", "calmo", "candido", "capaz", "capital", "carecer", "carinoso", "casual", "cautivador",
            "cautivar", "celebracion", "celebrar", "celebre", "certero", "cese", "chic", "circunspeccion", "civilizado",
            "clamoroso", "coherente", "coincidencia", "coligado", "colmado", "comodidad", "compasion", "competente",
            "complaciente", "comprensible", "concepcion", "conciencia", "confiabilidad", "confidente", "conocido", "consagrar",
            "consagrarse", "consciencia", "conseguir", "consideracion", "considerado", "constante", "consumado", "contundente",
            "copioso", "coraje", "cordial", "crack", "creativo", "crecer", "creciente", "credibilidad", "creible", "cultivado",
            "culto", "dadivoso", "dechado", "decidido", "dedicar", "deferencia", "deleitoso", "delicadeza", "delicioso", "derroche",
            "desahogo", "descanso", "descargar", "deseo", "desocupado", "despedida", "despido", "desprendido", "destacado",
            "destacar", "destreza", "dicha", "dichoso", "dinamico", "discernimiento", "discrecion", "diserto", "disfrutar",
            "distincion", "distinguido", "distinguir", "divertido", "divertir", "divino", "docto", "dotar", "ducho", "dulce",
            "edicion", "efectivo", "eficaz", "ejemplar", "ejemplo", "elegante", "elevado", "elocuente", "embelesamiento",
            "embelesar", "embeleso", "embriagar", "embrujar", "embullo", "eminencia", "emocionante", "encantador", "encantar",
            "encomendar", "energizar", "entranable", "equivalencia", "erudito", "esencial", "esforzado", "especial", "esplendido",
            "esplendor", "esplendoroso", "estimular", "estrella", "estupendo", "euforia", "euforico", "exacto", "exaltar", "exceder",
            "excelente", "excepcional", "exclusivo", "exculpar", "exencion", "exitoso", "experto", "expresivo", "exquisito",
            "extraordinario", "exuberante", "exultacion", "exultant", "facilidad", "factible", "famoso", "fantastico", "fascinar",
            "fasto", "fastuosidad", "fastuoso", "favorito", "fecundo", "fehaciente", "feliz", "fertil", "ferviente", "fervor",
            "fervoroso", "festejo", "fiabilidad", "fiable", "fidedigno", "fineza", "fino", "firme", "flamante", "formal",
            "formalidad", "formidable", "forrado", "fortuna", "fructifero", "fuerte", "galanteria", "galardon", "gallardo",
            "ganancia", "garboso", "generosidad", "generoso", "gentil", "genuino", "gloria", "glorioso", "gozoso", "gran",
            "grande", "grandeza", "grandiosidad", "gratificacion", "gratificante", "grato", "gusto", "habil", "habilidad",
            "hacha", "hermoso", "heroicidad", "hilaridad", "homenaje", "hondo", "honor", "honorable", "honorado", "humor",
            "humorismo", "idea", "identidad", "idoneo", "ilusion", "ilustrado", "imaginativo", "impaciente", "impecable",
            "impresionante", "inagotable", "incitar", "incontestable", "increible", "incuestionable", "individualidad",
            "individualismo", "indubitable", "indudable", "infalible", "infatigable", "ingenio", "ingeniosidad", "innegable",
            "innovador", "inocente", "inquebrantable", "instructivo", "instruido", "integridad", "inteligente", "intoxicar",
            "intrepido", "inventiva", "jovial", "jubilo", "juicioso", "justo", "laborioso", "leal", "levantar", "liberar",
            "libertar", "limpio", "longanimidad", "lucimiento", "lucrativo", "lujo", "lujoso", "luminoso", "lustre", "madurez",
            "maestria", "magnanime", "magnificencia", "mantener", "maravilla", "maravilloso", "maximo", "mayor", "medrar", "merecedor",
            "merito", "miramiento", "mordacidad", "naturalidad", "necesitar", "nombroso", "obstinado", "ocasion", "opulencia",
            "opulento", "osado", "ovacion", "paciencia", "paz", "perseverante", "persistente", "perspicacia", "perspicaz", "placidez",
            "plenitud", "poder", "porfiado", "positivo", "practicable", "precaucion", "preciosidad", "precioso", "predilecto", "prevencion",
            "prevision", "prodigo", "productivo", "profusion", "prolifero", "provechoso", "prudente", "pudiente", "purpura", "querubico",
            "quimerico", "radiante", "raudo", "razonable", "real", "realizable", "recaudo", "redencion", "respetable", "respiro",
            "resuelto", "risueno", "sabroso", "sensacional", "sensato", "serenidad", "sereno", "simpatico", "simplicidad", "sobrepasar",
            "sobrepujar", "sosiego", "sumo", "totalidad", "transporte", "valeroso", "valiente", "ventaja", "veracidad", "vigorizar", "vital"
        ];
    }

    function getNegTerms () {
        // I've deleted: chachi, humilde, ido
        return [
            "abandonar", "abandono", "abarrotado", "abatir", "abominable", "abominacion", "abominar", "aborrecer", "aborrecible",
            "aborrecimiento", "aborto", "abrasador", "abrumar", "absolutismo", "absurdo", "aburrido", "acabado", "achaque",
            "achispado", "acibarar", "acido", "acobardar", "acosar", "acre", "acusacion", "acusar", "admonitorio", "adusto",
            "adversidad", "advertencia", "afan", "afeccion", "afeminado", "afliccion", "afligido", "afrenta", "afrontar",
            "agitado", "agitar", "agobiante", "agravamiento", "agravar", "agrio", "agudeza", "ahuecamiento", "alboroto",
            "alcoholico", "alcornoque", "alfilerazo", "alifafe", "alocado", "altaneria", "altanero", "altivez", "altiveza",
            "altivo", "amargar", "amargo", "amargura", "amenazador", "amonestar", "angustia", "angustiado", "angustioso",
            "animal", "animosidad", "aniquilacion", "aniquilamiento", "ansia", "ansiedad", "antagonico", "antediluviano",
            "anticuado", "antiguo", "antipatico", "antitetico", "anular", "apenado", "apesadumbrado", "apocar", "apoderarse",
            "aprension", "apretura", "aprieto", "apuro", "aranazo", "arisco", "arpia", "arrancar", "arriesgado", "arriesgar",
            "arrogancia", "arrogante", "arruinar", "artero", "artificial", "asco", "asesino", "asimetria", "asombrar", "asqueado",
            "asquear", "asqueroso", "asustar", "atolladero", "atormentar", "atrevimiento", "atribulacion", "atrocidad", "atroz",
            "aturdir", "aturrullar", "austero", "autoritarismo", "aversion", "bacanal", "bajo", "bajon", "baladron", "barbaridad",
            "barbarie", "barbaro", "barrila", "basto", "basura", "befa", "belico", "belicoso", "bellaco", "berenjenal", "bestia",
            "bestial", "bobo", "bocon", "borracho", "botarate", "braveza", "bravucon", "bravura", "brega", "bronca", "brote",
            "bruja", "brutal", "bullanguero", "bullicio", "bunuelo", "burlar", "burro", "cabezota", "cabreado", "caca", "cacao",
            "cagada", "cagarria", "caida", "calamidad", "calamitoso", "calavera", "calvatrueno", "camorra", "camorrista", "cantada",
            "cante", "caos", "caradura", "cardenal", "carga", "cargante", "carniceria", "caro", "cascarrabias", "castigo",
            "cataclismo", "catastrofe", "catastrofico", "caucion", "caustico", "ceder", "censurar", "ceporro", "cernicalo", 
            "chalado", "charro", "chasco", "chiflado", "chillon", "chismorreo", "chocar", "choque", "chufleta", "cinismo", "cipote",
            "codicioso", "coger", "colerico", "combativo", "complicacion", "comprometer", "comun", "conceder", "condescendencia",
            "conflicto", "confrontacion", "congoja", "conmiseracion", "conmocion", "consternado", "consternar", "contradiccion",
            "contraerse", "contrariedad", "contrario", "contratiempo", "conturbar", "contusion", "copete", "corrupto", "cortante",
            "corto", "craso", "criatura", "criminal", "cruel", "cuento", "cuestionable", "cuita", "cuitado", "culpabilidad", "danar",
            "danino", "dano", "danoso", "debacle", "debil", "decaido", "decepcion", "defecto", "deficiencia", "deficiente",
            "degeneracion", "delatar", "deletereo", "delicado", "delincuente", "delirio", "demente", "demoler", "demonio",
            "denegacion", "deplorable", "deplorar", "depre", "depresivo", "deprimente", "deprimido", "deprimir", "derribar",
            "derrocar", "desabrido", "desabrigo", "desafecto", "desafilado", "desafio", "desafortunado", "desagradable",
            "desagradar", "desagradecido", "desagrado", "desalentado", "desalentador", "desalentar", "desalmado", "desamparo",
            "desanimar", "desapacible", "desarreglo", "desasosegado", "desasosiego", "desastre", "desastroso", "desatento",
            "desazon", "desbarajuste", "descarado", "descaro", "descomunal", "desconcertar", "desconsolado", "descortes",
            "descuello", "descuido", "desden", "desdenar", "desdicha", "desdichado", "desecho", "desencadenamiento", "desencanto",
            "desengano", "desesperacion", "desesperanza", "desesperanzar", "desestimacion", "desfachatez", "desfallecimiento",
            "desfasado", "desfavorable", "desgarbado", "desgarrador", "desgracia", "deshonra", "desigual", "desigualdad",
            "desilusion", "desistir", "deslumbrante", "desmanado", "desmentir", "desmesurado", "desmoralizar", "desnudar", "desolado",
            "desorbitado", "desorden", "despiadado", "desposeer", "despotismo", "despreciable", "despreciar", "desprecio", "desquiciar",
            "desquite", "destrozar", "desvanecimiento", "desventajoso", "desventura", "desventurado", "desvergonzado", "desverguenza",
            "detestable", "detestar", "detonador", "detrimento", "diablillo", "diablo", "dificultoso", "discusion", "diseminado",
            "disgustado", "disgustar", "disgusto", "disparatado", "distante", "distraer", "disturbios", "diverso", "doler", "doloroso",
            "dudoso", "duro", "ebrio", "echador", "efimero", "elacion", "embotado", "embravecido", "embrollo", "embuste", "empobrecido",
            "empobrecimiento", "encogerse", "enconar", "encono", "encontronazo", "endeblez", "endiosamiento", "enervar", "enfadoso",
            "enfermedad", "enfermo", "enfurecido", "engano", "enganoso", "engendro", "engorroso", "engreimiento", "enojar", "enojoso",
            "enredo", "entono", "entremetido", "entrometido", "envalentonamiento", "envanecimiento", "enzarzar", "equivocacion", "equivocar",
            "equivocarse", "errar", "erroneo", "error", "escalofriante", "escandalizar", "escandaloso", "escaramuza", "escasez", "escaso",
            "escoria", "escoriar", "espanto", "espantoso", "espina", "espinoso", "estafa", "esteril", "estirado", "estrafalario",
            "estrambotico", "estremecedor", "estridente", "estruendo", "estupido", "evasivo", "exagerado", "exagerar", "exasperante",
            "excentrico", "execracion", "exiguidad", "exiguo", "exorbitante", "exterminacion", "exterminio", "extrano", "extravagante",
            "extremo", "facistol", "fallo", "falsificado", "falta", "fanfarron", "fantasma", "fantoche", "farolero", "fastidiado",
            "fastidiar", "fastidioso", "fatal", "fatiga", "fatuo", "fenomenal", "ferocidad", "fetidez", "fiasco", "fiera", "fiereza",
            "fisgon", "flaqueza", "flojo", "forzar", "fraude", "frenesi", "fresco", "frio", "frustrar", "fuero", "fugaz", "funesto",
            "furia", "furioso", "furor", "futilidad", "gallito", "gamberro", "gazapaton", "gazapo", "gemir", "genial", "glacial", "golpe",
            "gorila", "gratuito", "grave", "grima", "gris", "groseria", "grosero", "grunon", "guay", "hampon", "harpia", "harto", "hastiado",
            "hastio", "hecatombe", "hediondez", "hedor", "hematoma", "herida", "herir", "hinchazon", "histeria", "histerismo", "historia",
            "horrendo", "horrido", "horripilante", "horror", "horrorizar", "horroroso", "hortera", "hosco", "hostigar", "huir", "humillacion",
            "humillar", "ignominia", "imbecil", "impedimento", "imperfeccion", "impersonal", "impertinencia", "imponente", "imposible",
            "impreciso", "improductivo", "improperio", "imprudente", "impudico", "inaceptable", "inadecuado", "inadmisible", "inaguantable",
            "inapropiado", "incapacidad", "incapaz", "incivilizado", "incomodidad", "incomodo", "incompetencia", "incompleto", "inconcebible",
            "incongruente", "increpacion", "indigente", "indiscreto", "indistinguible", "indomado", "ineficacia", "ineficaz", "inepto", "inexperto",
            "infame", "infamia", "infantil", "infecundo", "inferior", "inflexible", "infortunado", "infortunio", "infructuoso", "iniquidad", "inmaduro",
            "inmodestia", "inmundo", "inopia", "inoportuno", "inquietante", "inquietar", "inquieto", "inquietud", "inquina", "insania", "insignificancia",
            "insignificante", "insolencia", "insoportable", "insuficiente", "insufrible", "insultante", "insultos", "interrumpir", "intolerable",
            "intranquilidad", "intranquilizar", "intranquilo", "intrusion", "inutil", "invalido", "invasion", "irritacion", "irritante", "irritar",
            "jactancia", "jactancioso", "jaque", "jaqueton", "ladino", "lamentable", "lamentoso", "lapsus", "lascivo", "lastimar", "lastimoso",
            "latoso", "lento", "lesion", "libidinoso", "lio", "llamativo", "lobrego", "locatis", "loco", "lozania", "lugubre", "luxurioso",
            "macabro", "magulladura", "magullar", "majara", "majareta", "majestuoso", "mal", "malhechor", "malhumorado", "malo", "manazas",
            "manejo", "mania", "marana", "masacre", "matamoros", "matanza", "maton", "melancolia", "melancolico", "melon", "mendrugo",
            "menosprecio", "mentira", "miedo", "mierda", "miscelaneo", "miserable", "misero", "mixto", "modesto", "mohoso", "molesto",
            "monotono", "monstruo", "morado", "morbido", "morbositat", "morboso", "mordaz", "mortal", "mortandad", "mortifero", "mortificacion",
            "movida", "nauseabundo", "nauseoso", "negro", "noble", "nocivo", "obsceno", "obsesionante", "obsoleto", "obstaculo", "obstinacion", "obtuso",
            "ofensa", "ofensivo", "ofrecerse", "oposicion", "oprimir", "ordinario", "orgullo", "orgulloso", "padecimiento", "palangana", "palurdo",
            "pasmado", "patan", "patinazo", "patoso", "pavoroso", "pebete", "pelea", "peligro", "peligroso", "pena", "penacho",
            "pendenciero", "penoso", "pequeno", "perdicion", "perdonavidas", "perfido", "perjudicial", "pernicioso", "pertinaz",
            "perturbador", "perturbar", "perverso", "pescuezo", "peso", "pestazo", "peste", "picado", "picaro", "pinchar",
            "plantista", "pobreteria", "preocupacion", "preocupante", "prepotencia", "prepotente", "presumido", "pretension",
            "privacion", "profundo", "punico", "puteria", "quebradero", "quebrantar", "querella", "rajon", "rasguno", "raspadura",
            "rebosante", "rechazar", "recular", "reganar", "reganina", "regano", "regio", "rehilete", "rencor", "repeler",
            "reprender", "represalia", "reprimenda", "reproche", "repugnancia", "repugnante", "repulsio", "resistir", "retrasado",
            "retraso", "revancha", "reyerta", "rigido", "rina", "rocin", "romper", "rufian", "ruido", "ruin", "sagaz", "sambenito",
            "sarao", "saturnino", "serio", "severo", "siniestro", "soberbia", "soberbio", "sobrecogedor", "socarron", "solemne",
            "solitario", "sombrio", "sorprender", "subalterno", "suficiencia", "sufrimiento", "sulfurado", "surtido", "tacha",
            "tarado", "tarambana", "tarasca", "tarugo", "temerario", "temible", "tempestuoso", "terco", "terquedad", "testarudez",
            "timo", "tocado", "toldo", "tomate", "tonto", "tormentoso", "traicionero", "transgresor", "trapisonda", "trastornar",
            "trauma", "triste", "ufania", "vanidad", "vareta", "vehemencia", "venganza", "vengar", "ventolera", "verde",
            "virulento", "vitriolico", "voceador", "vociferador", "zamarro", "zurullo"
        ];
    }

    function getDoublePosTerms () {
        return [
            "abundante", "adecuado", "admirable", "adorar", "agradable", "apreciado", "apropiado", "belleza",
            "bueno", "confianza", "contento", "conveniente", "correccion", "cortes", "criterio", "destacable",
            "diestro", "digno", "educado", "entusiasmo", "estima", "estimulante", "facultades", "funcional",
            "gozo", "magnifico", "obediencia", "optimista", "pacifico", "perfeccion", "placido", "poetico",
            "potente", "predominante", "preservacion", "prestigio", "presto", "propicio", "renovacion",
            "resistente","sabio", "sabor", "salvacion", "sonrisa", "valioso", "viable"
        ];
    }

    function getDoubleNegTerms () {
        return [
            "agitacion", "agotamiento", "amenaza", "burla", "calvario", "cansancio", "censura", "confusion",
            "corrupcion", "crueldad", "desconocido", "dictadura", "dificil", "dificultad", "erupcion", "estricto",
            "feroz", "fijacion", "gasto", "gravedad", "ilegal", "inestable", "letal", "maldicion", "mancha", "miseria",
            "misterioso", "opresion", "oscuro", "parasito", "parodia", "pasado", "peor", "pesado", "plaga", "pleito",
            "pobre", "preocupado", "renuncia", "riguroso", "salvaje", "superficial", "tirania", "toxico", "vacio"
        ];
    }
});
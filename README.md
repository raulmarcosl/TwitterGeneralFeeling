Ingeniería de Sistemas Basados en Conocimiento
==============================================

Práctica 4: Razonamiento textual
--------------------------------


### Integrantes del grupo 11
* _Manuel Artero Anguita_ 
* _Carlos Gabriel Giraldo García_
* _Raúl Marcos Lorenzo_


### Fuentes de información web utilizadas

Hemos elegido _Twitter_ como fuente de información debido a dos motivos:  

1. Ofrece una API sencilla y amigable para el desarrollo web.  
2. Acceso a una gran base de datos de opniones personales: actualmente el número de usuarios que comparten información a través de _Twitter_ supera los 500 millones, lo que supone una generación constante de un gran volumen de datos; y en concreto de valoraciones y opiniones subjetivas. 


### Tratamiento de texto 

1. Lista de parada: para eliminar las palabras sin significado hemos usado una lista de parada de español publicada en ___Snowball___.  
La lista contiene las palabras vacías más comunes como por ejemplo ```la, que, el, en, y, a, los, del...``` y algunas formas verbales como ```tengo, tienes...```.

2. Algoritmo de Stemmer: hemos utilizado una librería de código abierto para la lematización de palabras. Está basada en el algoritmo de _Porter_ (y en concreto para el español).  
Es una librería gratuita liberada bajo la licencia LGLP por ___Sourceforge___.  


### Implementación

#####Tecnológias web utilizadas.  

1. Node: es un entorno de programación basado en _JavaScript_ que funciona del lado del servidor. 
2. Express es un framework web para _Node_.

#####Detalles de la implemantación:  

En el archivo ```app.js``` se lanza el servidor. 

```
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
```

Hemos usado el framework _express_, por lo tanto las rutas están definidas en la carpeta ```routes``` y las vistas en ```views```.  

***

La conexión con _Twitter_ se hace mediante la siguiente llamada
```
twit.get('https://api.twitter.com/1.1/search/tweets.json',
    {
        q: req.session.search,
        include_entities: 'false',
        count: '200',
        lang: 'es'
    }, 

    function(data) {
        var tweets = [], len = data.statuses.length, oneTweet;

        for (var i  = 0; i < len; i += 1) {
            oneTweet = {};
            oneTweet["favorited"] = false;
            oneTweet["username"] = "@" + data.statuses[i].user.screen_name;
            oneTweet["created_at"] = data.statuses[i].created_at;
            oneTweet["text"] = data.statuses[i].text;                            
            tweets.push(oneTweet);
        }

        req.session.tweets = tweets;                        
        res.redirect('/');
    }
);
```

***

El tratamiento del texto (stemmer) se hace mediante la llamada a la libería de _Snowball_.  
```
function stemmer(word){
    var stemmer = new Snowball("Spanish");
    stemmer.setCurrent(word);
    stemmer.stem();
    alert(stemmer.getCurrent());
};
```

***

##### Otras consideraciones

1. No se consideran aquellos tweets que se obtienen por emparejamiento del término buscado con el nombre del autor y no con una palabra del texto.
2. Los retweets tienen una valoración extra a la hora de hacer el cómputo global del término.
3. Encontramos un fallo en el API de _twitter_ al hacer una llamada vacía. Esta situación la controlamos y no da error.


### Requisitos de ejecución 


#####Ejecución en internet

La página está subida a la url ___http://desolate-sierra-9681.herokuapp.com/___.
El deploy se ha hecho gracias a _Heroku_: 

*Nota:* El estilo de la página se ha diseñado para el navegador _Google Chrome_, por lo tanto es posible que no se visualice correctamente en otros navegadores (IE).   

#####Ejecución en local

1. Necesitaremos tener instalado _Node_ en nuestro ordenador; para ello seguimos los pasos de http://http://nodejs.org  
2. Abrimos una ventana del terminal y nos movemos a la carpeta del proyecto; una vez ahí ejecutamos el siguiente comando  
```$> npm install```  
Esto nos instalará todas las librerías que el proyecto necesita.  
3. Por último lanzamos el servidor en local:  
```$> node app```  
Nos aparecerá ```Express server listening on port 8080``` por lo que ya podremos abrir el navegador y lanzar una petición a ```localhost:8080```

*Nota:* La ejecución en local está deshabilitada en la versión entregada de la práctica; sería necesario avisarnos para habilitarla


### Explicación de la interfaz

Hemos diseñado una interfaz muy simple que consta de 3 elemetos: 

1. Un cuadro de texto de entrada donde podremos escribir el concepto a buscar.
2. Una lista de tweets encontrados que contienen el concepto buscado. Los tweets están remarcados dependiendo de si cuentan como "tweet positivo" o "tweet negativo".
3. Un gráfico que muestra el grado de positividad asociado a la palabra por la comunidad de _twitter_.


### Comentarios generales sobre la práctica

1. ¿Te parece positivo haber utilizado tecnologías web?

> El desarrollo con tecnologías web es la gran carencia en la formación en la _UCM_; siempre resulta interesante aprender a utilizar e investigar nuevas tecnologías 

2. Valorar el tema de la práctica y sus posibles aplicaciones prácticas

> Esta práctica encuentra varias aplicaciones prácticas, por ejemplo, podría usarse por marcas comerciales para sondear la opinión de la comunidad sobre un concepto o tema concretos. Además podría hacerse un seguimiento en el tiempo sobre la opinión social y estudiar su evolución.  
También podría aplicarse en el ámbito de la sociología y la economía.

3. Extensiones posibles

> Sería posible refinar el algoritmo de Stemmer para conseguir una mayor precisión.  
También se podría ampliar la capacidad semántica del analizador teniendo en cuenta la negación de terminos; por ejmplo, detectando si un término está precedido por un _no_. 


#### Grupo de trabajo

|                       | Diseño del sistema | Investigación en tecnologías | Implementación | Diseño web | Memoria |
|:----------------------|:------------------:|:----------------------------:|:--------------:|:----------:|:-------:|
| Manuel Artero Aguita  |    45%             |         40%                  |    40%         |   50%      |  70%    |     
| Carlos Giraldo García |    5%              |         10%                  |    5%          |   5%       |  10%    |
| Raúl Marcos Lorenzo   |    45%             |         50%                  |    55%         |   45%      |  20%    |


#### Valoración de la práctica

|                       |      Valoración      |       Comentario      |
|:----------------------|:--------------------:|:----------------------|
| nivel de dificultad   |        2/5           | La mayor dificultad ha estado en desarrollar en tecnologías nuevas, no en el diseño de la práctica en sí |
| interés               |        5/5           | Se trata de un tema que nos parece muy interesante a los miembros del grupo      |

***

### Bibliografía y links de interés

___API de Twitter___ 
> https://dev.twitter.com/
> https://dev.twitter.com/docs/api/1.1

___Snowball___
> http://snowball.tartarus.org/

___Recurso: lista de parada en español___
> http://snowball.tartarus.org/algorithms/spanish/stop.txt

___Sourceforge___
> http://sourceforge.net

___Recurso: algoritmo de Stemmer para español___
> https://code.google.com/p/urim/source/browse/jsSnowball/?r=254#jsSnowball

___Node___
> http://nodejs.org/

___Express___
> http://expressjs.com/

___Heroku___
> http://www.heroku.com/

___Recurso: librería de código abierto para mostrar el gráfico___
> https://github.com/rendro/easy-pie-chart
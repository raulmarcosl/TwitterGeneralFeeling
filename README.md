Ingeniería de Sistemas Basados en Conocimiento
==============================================

Práctica 4: Razonamiento textual
--------------------------------


#### Integrantes del grupo 11
* _Manuel Artero Anguita_ 
* _Carlos Gabriel Giraldo García_
* _Raúl Marcos Lorenzo_


#### Fuentes de información web utilizadas

Hemos elegido _Twitter_ como fuente de información debido a dos motivos:  

1. Ofrece una **API sencilla y amigable** para el desarrollo web. Ver ___https://dev.twitter.com/___ y en concreto ___https://dev.twitter.com/docs/api/1.1___  
2. Acceso a una **gran base de datos de opniones personales**: actualmente el número de usuarios que comparten información a través de _Twitter_ supera los 500 millones, lo que supone una generación constante de un gran volumen de datos; y en concreto de valoraciones y opiniones subjetivas. 


#### Tratamiento de texto 

1. **Lista de parada:** para eliminar las palabras sin significado hemos usado una lista de parada de español publicada en ___http://snowball.tartarus.org/___.
La lista contiene las palabras vacías más comunes como por ejemplo ```la, que, el, en, y, a, los, del...``` y algunas formas verbales como ```tengo, tienes, etc.```.
El recurso se encuentra en ___http://snowball.tartarus.org/algorithms/spanish/stop.txt___

2. **Algoritmo de Stemmer:** hemos utilizado una librería de código abierto para la lematización de palabras. Está basada en el algoritmo de _Porter_ (y en concreto para el español).  
Es una librería gratuita liberada bajo la licencia LGLP por ___http://sourceforge.net___.  
El recurso se encuentra en ___https://code.google.com/p/urim/source/browse/jsSnowball/?r=254#jsSnowball___


#### Implementación

Tecnológias web utilziadas.  
**Node:** es un entorno de programación basado en _JavaScript_ que funciona del lado del servidor. Más información en ___http://nodejs.org/___  
**Express** es un framework web para _Node_. Más información en ___http://expressjs.com/___

***

Detalles de la implemantación:  
En el archivo ```app.js``` se lanza el servidor. 

```
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
```

Hemos usado el framework _exoress_, por lo tanto las rutas están definidas en la carpeta ```routes``` y las vistas en ```views```.  

La conexión con Twitter se hace mediante la siguiente llamada
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
que devuelve un array de tweets que contienen la palabra buscada.


El tratamiento del texto (stemmer) se hace mediante la llamada a la libería de snowball:
```
function stemmer(word){
    var stemmer = new Snowball("Spanish");
    stemmer.setCurrent(word);
    stemmer.stem();
    alert(stemmer.getCurrent());
};
```


#### Requisitos de ejecución 

#####Ejecución en local

1. Necesitaremos tener instalado _Node_ en nuestro ordenador; para ello seguimos los pasos de ___http://http://nodejs.org___  
2. Abrimos una ventana del terminal y nos movemos a la carpeta del proyecto; una vez ahí ejecutamos el siguiente comando  
```$> npm install```  
Esto nos instalará todas las librerías que el proyecto necesita.  
3. Por último lanzamos el servidor en local:  
```$> node app```  
Nos aparecerá ```Express server listening on port 8080``` por lo que ya podremos abrir el navegador y lanzar una petición a ```localhost:8080```

#####Ejecución en internet

La página está subida a la url ___http://desolate-sierra-9681.herokuapp.com/___.
El deploy se ha hecho gracias a _heroku_: ___http://www.heroku.com/___

**Nota:** El estilo de la página se ha diseñado para el navegador _Google Chrome_, por lo tanto es posible que no se visualice correctamente en otros navegadores (IE).   


#### Explicación de la interfaz

Hemos diseñado una interfaz muy simple que consta de 3 elemetos: 

1. Un cuadro de texto de entrada donde podremos escribir el concepto a buscar.
2. Una lista de tweets encontrados que contienen el concepto buscado.
3. Un gráfico que muestra el grado de positividad asociado a la palabra por la comunidad de _twitter_.

**Nota:** El gráfico utiliza la librería de código abierto ___https://github.com/rendro/easy-pie-chart___

#### Bugs conocidos

1. Si se pide una búsqueda vacía, el sistema se rompe. 


#### Comentarios generales sobre la práctica

1. ¿Te parece positivo haber utilizado tecnologías web?

> El desarrollo con tecnologías web es la gran carencia en la formación en la _UCM_; siempre resulta interesante aprender a utilizar e investigar nuevas tecnologías 

2. Valorar el tema de la práctica y sus posibles aplicaciones prácticas

> La realización de la práctica es altamente favorable de cara al futuro ya que existen empresas cuyo mecanismo de negocio se basa en el uso de tecnoogías similares para el estudio de la web.
Una aplicación de el estilo de la implementada permitiría a una empresa de publicidad estudiar el impacto de un producto específico en el mercado (suponiendo que twitter sea un reflejo de la realidad).
En caso de ampliar la funcionalidad de la práctica, podríamos añadir las estadísticas de género, localización, retweets, popularidad de los usuarios, etc. Estas ampliaciones añadirían valor al
software como producto útil para una empresa, ya que mejorarían la localización y la difusión de la publicidad. 
También podemos tener en cuenta el alcance que tiene twitter, y dependiendo del estudio que se quisiera realizar podríamos emplear diferentes APIs de otros servicios para acercarnos a los usuarios específicos.


3. Extensiones posibles

> Sería posible refinar el algoritmo de Stemmer para conseguir una mayor precisión.  
También se podría ampliar a la práctica sería tener en cuenta la negación de terminos, es decir, 


#### Grupo de trabajo

|                       | Diseño del sistema | Investigación en tecnologías | Implementación | Diseño web | Memoria |
|:----------------------|:------------------:|:----------------------------:|:--------------:|:----------:|:-------:|
| Manuel Artero Aguita  |    45%             |         35%                  |    40%         |   50%      |  40%    |     
| Carlos Giraldo García |    10%             |         5%                   |    10%         |   10%      |  30%    |
| Raúl Marcos Lorenzo   |    45%             |         60%                  |    50%         |   40%      |  30%    |


#### Valoración de la práctica

|                       |      Valoración      |       Comentario      |
|:----------------------|:--------------------:|:---------------------:|
| nivel de dificultad   |                      |                       |
| interés               |                      |                       |
| motivación            |                      |                       |

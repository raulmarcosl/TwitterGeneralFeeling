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

Descripcion de las tecnologías web utilizadas: Node  
Exlpicar la implementación:

1. Explicar la conexión con la fuente de datos
2. Explicar el tratamiento del texto (stemmer)


#### Requisitos de ejecución 

#####Ejecución en local

1. Necesitaremos tener instalado _Node_ en nuestro ordenador; para ello seguimos los pasos de ___http://http://nodejs.org___  
2. Abrimos una ventana del terminal y nos movemos a la carpeta del proyecto; una vez ahí ejecutamos el siguiente comando  
```$> npm install```  
Esto nos instalará todas las librerías que el proyecto necesita.  
3. Por último lanzamos el servidor en local:  
```$> node app```  
Nos aparecerá ```Express server listening on port 8080``` por lo que ya podremos abrir el navegador y lanzar una petición a ```localhost:8080```

**Nota:**  


#### Explicación de la interfaz

Hemos diseñado una interfaz muy simple que consta de 3 elemetos: 

1. Un cuadro de texto de entrada donde podremos escribir el concepto a buscar.
2. Una lista de tweets encontrados que contienen el concepto buscado.
3. Un gráfico que muestra el grado de positividad asociado a la palabra por la comunidad de ___twitter___


#### Comentarios generales sobre la práctica

1. ¿Te parece positivo haber utilizado tecnologías web?
> El desarrollo con tecnologías web es la gran carencia en la formación en la ___UCM___; siempre resulta interesante aprender a utilizar e investigar nuevas tecnologías 

2. Valorar el tema de la práctica y sus posibles aplicaciones prácticas
> CONTAR QUE NOS INTERESA MUCHO 

3. Extensiones posibles
> 


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

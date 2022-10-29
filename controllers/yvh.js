'use strict'

//Función para procesar la petición de los módulos YVH
function radar(req, res){
    let peticion = req.body;

    /*-------Primero analizamos la estructura de la petición----------*/
    if(peticion.length < 1){
        //si la petición viene vacía devolvemos un error
        res.status(200).send({message: "La petición debe contener datos"});

    }else if(peticion.protocols==null || peticion.protocols.length < 1){
        //si la petición no contiene protocolos devolvemos un error
        res.status(200).send({message: "La petición debe contener al menos un protocolo"});

    }else if(peticion.scan==null || peticion.scan.length < 1){
        //si la petición no contiene puntos escaneados devolvemos un error
        res.status(200).send({message: "La petición debe contener al menos un punto escaneado"});

    }else{
        //si la petición contiene datos los procesamos     
        
        let protocols = peticion.protocols;

        //detectamos si vienen protocolos incompatibles
        if( (protocols.includes("closest-enemies") && protocols.includes("furthest-enemies")) ||
            (protocols.includes("assist-allies") &&    (protocols.includes("closest-enemies") || protocols.includes("furthest-enemies"))     ) ||
            (protocols.includes("prioritize-mech") && protocols.includes("avoid-mech"))
        )
        {
            res.status(200).send({message: "Se han detectado protocolos incompatibles"});
        }else{
            //Si los protocolos son compatibles buscamos el siguiente ataque

            let puntos = [];
            let siguiente_ataque = {};
            puntos = peticion.scan;

            /*-------Limpiamos el array de puntos en base a los protocolos más restrictivos----------*/

            //Quitamos los puntos que se encuentren a mas de 100m de distancia
            puntos = puntos.filter(punto => punto.coordinates.x<=100);
            puntos = puntos.filter(punto => punto.coordinates.y<=100);

            //Quitamos los enemigos tipo mech del array de puntos si el protocolo es avoid-mech
            if(protocols.includes("avoid-mech")){
                puntos = puntos.filter(punto => punto.enemies.type!="mech");
            }

            //Quitamos los puntos en los que haya aliados si el protocolo es avoid-crossfire
            if(protocols.includes("avoid-crossfire")){
                puntos = puntos.filter(punto => punto.allies<1 || punto.allies==null);
            }

            //Si priorizamos un mech filtramos solo los mech en caso de que los haya
            if(protocols.includes("prioritize-mech")){
                //buscamos si existen enemigos tipo mech
                let mechs = puntos.filter(punto => punto.enemies.type=="mech");

                //si existen dejamos solo los mechs para el siguiente filtro
                if(mechs.length>0){
                    puntos = mechs;
                }
            }


            /*-------Una vez pasado el primer filtro, calculamos la distancia real de cada punto----------*/

            //creamos una variable en el array para calcular la hipotenusa en caso de que el enemigo no esté en línea recta
            puntos.forEach(punto => {
                if(punto.coordinates.x>0 && punto.coordinates.y>0){
                    punto.coordinates["h"]=Math.hypot(punto.coordinates.y, punto.coordinates.x);
                }else{
                    punto.coordinates["h"]=punto.coordinates.x+punto.coordinates.y;
                }
            });
            //filtramos los que esten a más de 100m
            puntos = puntos.filter(punto => punto.coordinates.h<=100);


            /*-------Ahora los ordenamos por distancia en caso que venga algun protocolo que lo indique----------*/
            
            if(protocols.includes("closest-enemies")){
                //si debemos priorizar los enemigos más cercanos los ordenamos por distancia
                puntos.sort(function(a, b){
                    //Ahora comparamos las distancias y en caso de estar a la misma distancia comparamos el número de enemigos en ese punto
                    if(a.coordinates.h > b.coordinates.h) {
                        return 1; 
                    }else if(a.coordinates.h < b.coordinates.h) {
                        return -1; 
                    }else if(a.enemies.number > b.enemies.number){
                        return -1;
                    }else if(a.enemies.number < b.enemies.number){
                        return 1;
                    }
                    return 0;
                });
                
            }else if(protocols.includes("furthest-enemies")){
                puntos.sort(function(a, b){
                    //Ahora comparamos las distancias y en caso de estar a la misma distancia comparamos el número de enemigos en ese punto
                    if(a.coordinates.h > b.coordinates.h) {
                        return -1; 
                    }else if(a.coordinates.h < b.coordinates.h) {
                        return 1; 
                    }else if(a.enemies.number > b.enemies.number){
                        return -1;
                    }else if(a.enemies.number < b.enemies.number){
                        return 1;
                    }
                    return 0;
                });
            }

            //El siguiente ataque será el primer punto del array ya filtrado y ordenado
            siguiente_ataque ={x:puntos[0].coordinates.x, y:puntos[0].coordinates.y};

            //devolvemos el siguiente ataque
            res.status(200).send(siguiente_ataque);
        }

        
    }   
}

module.exports = {
    radar,
}
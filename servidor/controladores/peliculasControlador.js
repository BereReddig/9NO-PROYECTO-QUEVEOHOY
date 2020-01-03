var conexion = require('../lib/conexionbd');

function obtenerPeliculas(req, res){
    var sql = "SELECT * FROM pelicula ";
    var anio = req.query.anio;
    var titulo = req.query.titulo;
    var genero = req.query.genero;
    var columna_orden = req.query.columna_orden;
    var tipo_orden = req.query.tipo_orden;
    var pagina = req.query.pagina;
    var cantidad = req.query.cantidad;
    var filtros = obtenerFiltros(genero, titulo, anio);
    
    
    sql += filtros;
    sql += " ORDER BY " + columna_orden + " " + tipo_orden;
    sql += " LIMIT " + ((pagina-1)*cantidad) + ", " + cantidad;
    
    conexion.query(sql, function(error, result){
        var data = {};
        if(error){
            console.error(error);
            return res.status(500).send("Ha ocurrido un error");
        };
        
        data.peliculas = result;
            
        var sqlTotal = "SELECT COUNT(*) AS total FROM pelicula " + filtros;

        conexion.query(sqlTotal, function(error, result){
            if(error){
                return res.status(500).send("Ha ocurrido un error");
            } 
            data.total = result[0].total;
            data.paginaActual = pagina;

            res.json(data);
        });
    })
};

function obtenerFiltros(genero, titulo, anio){
    var filtros = "";
    if(genero || titulo || anio){
        if (genero) {
            filtros = "genero_id = " + genero;
        }
        if(titulo){
            if (filtros) {
                filtros += " AND titulo LIKE '%" + titulo + "%'";
            } else {
                filtros = "titulo LIKE '%" + titulo + "%'";
            }
        }
        if(anio){
            if (filtros){
                filtros += " AND anio = " + anio;
            } else {
                filtros += "anio = " + anio;
            }
        }

        filtros = " where " + filtros;
    }
    return filtros;
};

function obtenerPelicula(req, res){
    var idPelicula = req.params.id;
    var data = {};
    var sqlPelicula = "SELECT p.poster, p.titulo, p.anio, p.trama, p.director, p.fecha_lanzamiento, " +
              "p.puntuacion, p.duracion, g.nombre FROM pelicula p JOIN genero g " +
              "ON p.genero_id = g.id WHERE p.id = " + idPelicula;

    conexion.query(sqlPelicula, function(error, result){
        if(error){
            return res.status(500).send("Ha ocurrido un error");
        } 
       
        data.pelicula = result[0];
        data.genero = result[0].nombre;
        sqlActores = "SELECT a.nombre FROM actor a JOIN actor_pelicula ap ON ap.actor_id = a.id " +
              "WHERE ap.pelicula_id = " + idPelicula;
        conexion.query(sqlActores, function(error, result){
            if(error){
                return res.status(500).send("Ha ocurrido un error");
            } 
            data.actores = result;
            
            res.send(data);
        })
    })
};



function recomendarPelicula (req, res) { 
    var genero = req.query.genero;  
    var anio_inicio = req.query.anio_inicio;
    var anio_fin = req.query.anio_fin;
    var puntuacion = req.query.puntuacion;
    var sql = "SELECT * FROM pelicula";
    var sqlConGenero = "SELECT pelicula.id, pelicula.poster, pelicula.trama FROM pelicula";
    
    var parametros = [
      {
          nombre: "genero", 
          valor: genero, 
          query: " JOIN genero ON pelicula.genero_id = genero.id WHERE genero.nombre = " + genero
      },
      {
          nombre: "anio_inicio", 
          valor: anio_inicio, 
          query: " AND pelicula.anio BETWEEN " + anio_inicio,
          querySinGenero: " WHERE anio BETWEEN " + anio_inicio
      }, 
      {
          nombre: "anio_fin", 
          valor: anio_fin, 
          query: " AND " + anio_fin, 
          querySinGenero: " AND " + anio_fin, 
      },
      {
          nombre: "puntuacion", 
          valor: puntuacion, 
          query: " AND pelicula.puntuacion = " + puntuacion, 
          querySinGenero: " AND puntuacion = " + puntuacion
      }
    ];
    
    parametros.forEach(e => {
      if (genero) {
        if (e.valor !== "" && e.valor !== undefined) {
          sqlConGenero += e.query;
          sql = sqlConGenero;
        }
      }else if (puntuacion && !anio_inicio && !anio_fin) {
        sql = "SELECT * FROM pelicula WHERE puntuacion = " + puntuacion;
      }else{
        if (e.valor !== "" && e.valor !== undefined) {
          sql += e.querySinGenero;
        }
      }
    });
  
    connection.query(sql, function(error, resultado) {
      if (error) {
          console.log("Hubo un error en la consulta", error.message);
          return res.status(404).send("Hubo un error en la consulta");
      } 
      var response = {
        peliculas: resultado
      };
  
      res.send(response);
    });
  };
  



module.exports = {
    obtenerPeliculas: obtenerPeliculas,
    obtenerPelicula: obtenerPelicula,
    recomendarPelicula: recomendarPelicula
};


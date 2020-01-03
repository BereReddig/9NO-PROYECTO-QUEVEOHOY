var conexion = require('../lib/conexionbd');

function obtenerGeneros(req, res){
    var sql = "SELECT nombre, id FROM genero";
    conexion.query(sql, function(error, result){
        if(error){
            console.error(error);
            return res.status(500).send("Ha ocurrido un error");
        };
        var data = {
            generos: result
        };
        res.json(data);
    })
};

module.exports = {obtenerGeneros: obtenerGeneros};
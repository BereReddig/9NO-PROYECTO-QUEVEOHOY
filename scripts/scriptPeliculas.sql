CREATE DATABASE peliculas;

USE peliculas;

CREATE TABLE pelicula(
    id INT NOT NULL AUTO_INCREMENT,
    titulo VARCHAR(100),
    duracion INT(5),
    director VARCHAR(400),
    anio INT(5),
    fecha_lanzamiento DATE,
    puntuacion INT(2),
    poster VARCHAR(300),
    trama VARCHAR(700),
    PRIMARY KEY (id)
);

CREATE TABLE genero(
    id INT AUTO_INCREMENT,
    nombre VARCHAR(30),
    PRIMARY KEY(id)
);

ALTER TABLE pelicula
ADD COLUMN genero_id INT,
ADD FOREIGN KEY(genero_id) REFERENCES genero(id);


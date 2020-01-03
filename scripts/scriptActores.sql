CREATE TABLE actor(
    id INT(11) NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(70),
    PRIMARY KEY(id)
);

CREATE TABLE actor_pelicula(
    id INT(11) NOT NULL AUTO_INCREMENT,
    actor_id INT NOT NULL,
    pelicula_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(actor_id) REFERENCES actor(id),
    FOREIGN KEY(pelicula_id) REFERENCES pelicula(id)
);
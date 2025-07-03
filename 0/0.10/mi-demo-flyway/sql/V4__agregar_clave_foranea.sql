ALTER TABLE usuarios ADD COLUMN rol_id INT;

ALTER TABLE usuarios
ADD CONSTRAINT fk_usuario_rol
FOREIGN KEY (rol_id)
REFERENCES roles(id);

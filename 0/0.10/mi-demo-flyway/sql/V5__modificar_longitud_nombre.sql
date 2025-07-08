-- Supongamos que ahora queremos permitir nombres más largos
ALTER TABLE usuarios
ALTER COLUMN nombre TYPE VARCHAR(200);

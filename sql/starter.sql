-- Create a new database
-- CREATE DATABASE my_database;

-- Connect to the newly created database
\c my_database

-- Create a new table in the database
CREATE TABLE users (
    ID SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users(username, password, email) VALUES('admin','admin','admin@gmail.com');

-- table for roles
CREATE TABLE roles (
    ID SERIAL PRIMARY KEY,
    roleName VARCHAR(100) NOT NULL UNIQUE,
    roleDetail VARCHAR(300)
);

-- table for many to many relation what users have which roles
CREATE TABLE userRoles (
    ID SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT fk_role FOREIGN KEY(role_id) REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- roles entry
INSERT INTO roles(roleName, roleDetail) VALUES ('ADMIN', 'Can perform every role') ('DEC_REF_YER', ''), ('SAD_GENERAL_SEGMENT', ''), ('SAD_ITEM', ''), ('SAD_TAX', ''), ('UNTAXTAB' , '');

-- SELECT conname
-- FROM pg_constraint
-- JOIN pg_class ON conrelid = pg_class.oid
-- JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid
-- WHERE pg_class.relname = 'users'
--   AND pg_namespace.nspname = 'public'
--   AND contype = 'u';

--   ALTER TABLE users
-- DROP CONSTRAINT users_email_key;


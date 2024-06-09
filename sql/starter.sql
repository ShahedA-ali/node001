-- Create a new database
CREATE DATABASE my_database;

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
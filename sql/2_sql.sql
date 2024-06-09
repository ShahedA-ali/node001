-- Connect to the database
\c my_database

-- specific roles for users
CREATE TYPE role AS ENUM ('admin', 'user', 'end-user');

-- new column for adding roles to users
ALTER TABLE users ADD COLUMN roles role;

-- value to users table
INSERT INTO users(username, password, email, roles) VALUES('admin','admin','admin@gmail.com', 'admin');



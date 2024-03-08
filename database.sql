CREATE DATABASE IF NOT EXISTS auctions_aspid;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    balance BIGINT NOT NULL default 150000,
    work_place VARCHAR(255) NOT NULL,
    charge VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    quiz_try BOOLEAN default true,
    updated_at TIMESTAMP,
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS login (
    id SERIAL PRIMARY KEY,
    email text UNIQUE NOT NULL,
    hash VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS registrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    fathers_name VARCHAR(255) NOT NULL,
    mothers_name VARCHAR(255) NOT NULL,
    charge VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    company_field VARCHAR(255) NOT NULL,
    street VARCHAR(60) NOT NULL,
    suburb VARCHAR(50) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    postal_code VARCHAR(8) NOT NULL,
    country VARCHAR(100) NOT NULL,
    website VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telephone VARCHAR(15) NOT NULL,
    fax VARCHAR(20) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    other_topics VARCHAR(255) NOT NULL,
    direct_email BOOLEAN DEFAULT false,
    magazine BOOLEAN DEFAULT false,
    web BOOLEAN DEFAULT false,
    mailing BOOLEAN DEFAULT false,
    press BOOLEAN DEFAULT false,
    other BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL
);
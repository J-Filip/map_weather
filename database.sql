
-- CREATE DATABASE mapWeather_database;

--\c into mapWeather_database
-- SERIAL is notnull and increment id | PRIMARY KEY unique constraint
CREATE TABLE checkin(
    checkin_id SERIAL PRIMARY KEY, 
    nickname VARCHAR (50),
    timestamp VARCHAR (30),
    lat VARCHAR (30),
    lon VARCHAR (30),
    country VARCHAR (5),
    area  VARCHAR (50)
);


INSERT INTO checkin (nickname, timestamp, lat, lon, country, area) 
VALUES ('ja', 2000, 15.00, 30.00, 'HR', 'Jarun');
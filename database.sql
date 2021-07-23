











CREATE DATABASE mapWeather_database;

--\c into mapWeather_database
-- SERIAL is notnull and increment id | PRIMARY KEY unique constraint
CREATE TABLE checkIn(
    checkIn_id SERIAL PRIMARY KEY, 
    Nickname VARCHAR (20),
    Geolocation TEXT,
    Weather TEXT,
    AirQuality TEXT
);

ALTER TABLE checkIn
DROP COLUMN weather;
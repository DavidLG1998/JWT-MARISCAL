// db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('mariscal_castilla.db');

db.serialize(() => {
    // Crear tabla de usuarios
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    `);

    // Crear tabla de estudiantes
    db.run(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            grade TEXT,
            section TEXT
        )
    `);
});

module.exports = db;

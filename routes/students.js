// routes/students.js
const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const SECRET_KEY = 'mi_clave_secreta';

// Middleware para verificar token
function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send('Token no proporcionado.');

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(500).send('Token inválido.');
        req.userId = decoded.id;
        next();
    });
}

// Registrar estudiante
router.post('/register', verifyToken, (req, res) => {
    const { name, grade, section } = req.body;

    db.run(
        'INSERT INTO students (name, grade, section) VALUES (?, ?, ?)',
        [name, grade, section],
        function (err) {
            if (err) {
                return res.status(500).send('Error al registrar estudiante.');
            }
            res.send('Estudiante registrado correctamente.');
        }
    );
});

// Listar estudiantes
router.get('/', verifyToken, (req, res) => {
    db.all('SELECT * FROM students', [], (err, rows) => {
        if (err) {
            return res.status(500).send('Error al obtener estudiantes.');
        }
        res.send(rows);
    });
});

module.exports = router;

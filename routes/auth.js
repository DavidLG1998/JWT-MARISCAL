const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');

const SECRET_KEY = 'tu_clave_secreta';

router.post('/register', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.run(query, [username, hashedPassword], (err) => {
        if (err) {
            return res.status(500).send('Error al registrar el usuario.');
        }
        res.send('Usuario registrado correctamente.');
    });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) return res.status(500).send('Error en la base de datos.');

        if (!user) {
            // Usuario no encontrado
            return res.status(401).json({ auth: false, message: 'Credenciales incorrectas.' });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);

        if (!passwordIsValid) {
            // Contraseña incorrecta
            return res.status(401).json({ auth: false, message: 'Credenciales incorrectas.' });
        }

        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: 86400 }); // 24 horas

        res.status(200).json({ auth: true, token });
    });
});

module.exports = router;

    const express = require('express');
    const cors = require('cors');
    const app = express();
    const port = 3000;

    app.use(cors());
    app.use(express.json());

    let usuarios = [
    { id: 1, nome: "Alice" },
    { id: 2, nome: "Bob" }
    ];

    app.get('/usuarios', (req, res) => {
    res.json(usuarios);
    });

    app.post('/usuarios', (req, res) => {
    const { nome } = req.body;
    if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório' });

    const novoUsuario = {
        id: usuarios.length + 1,
        nome
    };
    usuarios.push(novoUsuario);
    res.status(201).json(novoUsuario);
    });

    app.listen(port, () => {
    console.log(`✅ API rodando em http://localhost:${port}`);
    });

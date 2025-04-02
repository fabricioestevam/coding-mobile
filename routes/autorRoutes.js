const express = require('express');
const router = express.Router();

// Defina suas rotas aqui
router.get('/', (req, res) => {
    res.send('Rota de autores');
});

router.post('/', (req, res) => {
    // lógica para criar um novo autor
    res.send('Autor criado');
});

router.put('/:id', (req, res) => {
    // lógica para atualizar um autor
    res.send(`Autor ${req.params.id} atualizado`);
});

router.delete('/:id', (req, res) => {
    // lógica para deletar um autor
    res.send(`Autor ${req.params.id} deletado`);
});

module.exports = router;
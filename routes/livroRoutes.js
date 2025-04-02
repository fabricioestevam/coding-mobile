const express = require('express');
const router = express.Router();

// Defina suas rotas aqui
router.get('/', (req, res) => {
    res.send('Rota de livros');
});

router.post('/', (req, res) => {
    // lógica para criar um novo livro
    res.send('Livro criado');
});

router.put('/:id', (req, res) => {
    // lógica para atualizar um livro
    res.send(`Livro ${req.params.id} atualizado`);
});

router.delete('/:id', (req, res) => {
    // lógica para deletar um livro
    res.send(`Livro ${req.params.id} deletado`);
});

module.exports = router;
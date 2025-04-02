const mongoose = require('mongoose');

const LivroSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: 'Autor', required: true },
    anoPublicacao: { type: Number, required: true }
});

module.exports = mongoose.model('Livro', LivroSchema);
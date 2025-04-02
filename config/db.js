// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // A partir da versão 4.0.0 do MongoDB Driver, não é necessário usar essas opções
        await mongoose.connect('mongodb://localhost:27017/seuBancoDeDados');
        console.log('MongoDB conectado com sucesso');
    } catch (error) {
        console.error('Erro ao conectar com o MongoDB:', error);
        process.exit(1); // Encerra o processo caso a conexão falhe
    }
};

module.exports = connectDB;

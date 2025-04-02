const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db'); // Importando a conexão com o banco de dados
const livroRoutes = require('./routes/livroRoutes'); // Importando as rotas de livros
const autorRoutes = require('./routes/autorRoutes'); // Importando as rotas de autores

const app = express();
app.use(bodyParser.json());

connectDB(); // Conectando ao MongoDB

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Usar as rotas com diferentes prefixos
app.use('/api/livros', livroRoutes);
app.use('/api/autores', autorRoutes);
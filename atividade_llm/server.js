// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Contexto específico - Assistente de Culinária
const COOKING_CONTEXT = `
Você é um assistente especializado em culinária brasileira e internacional. 
Suas respostas devem ser sempre relacionadas a:
- Receitas e ingredientes
- Técnicas de cozinha
- Dicas culinárias
- Substituições de ingredientes
- Tempo de preparo e cozimento
- Nutrição básica dos alimentos

Responda sempre de forma amigável, prática e educativa. 
Se a pergunta não for relacionada à culinária, redirecione gentilmente para temas gastronômicos.
`;

// Função para consultar a API do Groq (LLM gratuito)
async function queryLLM(userMessage) {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY não configurada');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192', // Modelo gratuito da Groq
      messages: [
        {
          role: 'system',
          content: COOKING_CONTEXT
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Rota principal para consultas
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ 
        error: 'Mensagem é obrigatória' 
      });
    }

    const response = await queryLLM(message);
    
    res.json({
      success: true,
      question: message,
      answer: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro:', error.message);
    res.status(500).json({
      success: false,
      error: 'Erro interno do servidor',
      details: error.message
    });
  }
});

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Assistente de Culinária',
    timestamp: new Date().toISOString()
  });
});

// Rota para obter receitas aleatórias
app.get('/receita-aleatoria', async (req, res) => {
  try {
    const prompts = [
      'Me dê uma receita brasileira simples e rápida',
      'Sugira uma sobremesa fácil de fazer',
      'Como fazer um prato vegetariano nutritivo?',
      'Receita de lanche saudável para a tarde'
    ];
    
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    const response = await queryLLM(randomPrompt);
    
    res.json({
      success: true,
      recipe: response,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao gerar receita aleatória'
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🍳 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 Chat endpoint: POST http://localhost:${PORT}/chat`);
  console.log(`🎲 Receita aleatória: GET http://localhost:${PORT}/receita-aleatoria`);
});

module.exports = app;
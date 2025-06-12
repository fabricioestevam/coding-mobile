🍳 Assistente de Culinária - Backend Node.js com LLM
Um projeto backend simples em Node.js que utiliza a API gratuita da Groq (Llama 3) para criar um assistente especializado em culinária.
✨ Funcionalidades

Chat Contextualizado: Respostas focadas em culinária brasileira e internacional
API RESTful: Endpoints simples e bem documentados
Receitas Aleatórias: Geração automática de receitas variadas
LLM Gratuito: Usa a API gratuita da Groq com Llama 3
Fácil Configuração: Setup rápido e direto

🚀 Instalação Rápida
1. Clone e instale dependências
bash# Clone o projeto
git clone <seu-repo>
cd assistente-culinaria-backend

# Instale as dependências
npm install
2. Configure a API Key
bash# Copie o arquivo de configuração
cp .env.example .env

# Edite o arquivo .env e adicione sua API key da Groq
Para obter a API Key gratuita da Groq:

Acesse console.groq.com
Crie uma conta gratuita
Gere uma API Key
Cole no arquivo .env

3. Execute o servidor
bash# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
📡 Endpoints da API
Health Check
httpGET /health
Chat com o Assistente
httpPOST /chat
Content-Type: application/json

{
  "message": "Como fazer um brigadeiro?"
}
Receita Aleatória
httpGET /receita-aleatoria
🧪 Testando a API
Execute o cliente de teste interativo:
bashnpm test
Ou teste manualmente com curl:
bash# Teste básico
curl http://localhost:3000/health

# Enviar pergunta
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Como fazer um bolo de chocolate?"}'

# Receita aleatória
curl http://localhost:3000/receita-aleatoria
💡 Exemplos de Perguntas

"Como fazer brigadeiro tradicional?"
"Qual o tempo de cozimento para um frango de 2kg?"
"Posso substituir leite condensado por que?"
"Receita vegetariana rápida para o almoço"
"Como temperar carne para churrasco?"

🏗️ Estrutura do Projeto
projeto/
├── server.js          # Servidor principal
├── package.json       # Dependências
├── .env.example       # Configurações de exemplo
├── test.js           # Cliente de teste
└── README.md         # Documentação
⚙️ Configurações
Variáveis de Ambiente (.env)
envPORT=3000                    # Porta do servidor
GROQ_API_KEY=your_key_here   # API Key da Groq
Contexto Personalizado
O assistente é pré-configurado com contexto de culinária, mas você pode modificar a variável COOKING_CONTEXT no server.js para outros domínios como:

Assistente de fitness
Consultor financeiro
Tutor educacional
Suporte técnico

🔧 Personalização
Mudando o Contexto
Edite a variável COOKING_CONTEXT em server.js:
javascriptconst COOKING_CONTEXT = `
Você é um especialista em [SEU DOMÍNIO].
Suas respostas devem focar em...
`;
Adicionando Novos Endpoints
javascriptapp.post('/novo-endpoint', async (req, res) => {
  // Sua lógica aqui
});
📦 Dependências

express: Framework web
cors: Habilita CORS
dotenv: Gerencia variáveis de ambiente
nodemon: Auto-reload para desenvolvimento

🌟 Próximos Passos

 Adicionar autenticação
 Implementar rate limiting
 Salvar histórico de conversas
 Adicionar mais contextos especializados
 Interface web frontend

🤝 Contribuição

Fork o projeto
Crie uma branch para sua feature
Faça commit das mudanças
Push para a branch
Abra um Pull Request

📄 Licença
MIT - Use como quiser!
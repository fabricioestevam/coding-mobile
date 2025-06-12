require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const nodemailer = require('nodemailer');

// Configuração do transporter do email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Função para fazer scraping do Hacker News
async function scrapHackerNews() {
  try {
    console.log('Iniciando scraping do Hacker News...');
    
    const response = await axios.get(process.env.SCRAPE_URL || 'https://news.ycombinator.com', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const stories = [];

    // Extrair os primeiros 10 títulos das notícias
    $('.athing').slice(0, 10).each((index, element) => {
      const title = $(element).find('.titleline > a').text().trim();
      const url = $(element).find('.titleline > a').attr('href');
      const score = $(element).next().find('.score').text() || '0 points';
      const comments = $(element).next().find('a[href*="item?id="]').last().text() || '0 comments';

      if (title) {
        stories.push({
          position: index + 1,
          title,
          url: url.startsWith('http') ? url : `https://news.ycombinator.com/${url}`,
          score,
          comments
        });
      }
    });

    console.log(`Scraped ${stories.length} histórias do Hacker News`);
    return stories;

  } catch (error) {
    console.error('Erro no scraping:', error.message);
    throw error;
  }
}

// Função para gerar HTML do email
function generateEmailHTML(stories) {
  const date = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  let html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .header { background-color: #ff6600; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .story { margin-bottom: 20px; padding: 15px; border-left: 3px solid #ff6600; background-color: #f9f9f9; }
          .story-title { font-size: 16px; font-weight: bold; margin-bottom: 5px; }
          .story-meta { font-size: 12px; color: #666; margin-bottom: 8px; }
          .story-link { color: #ff6600; text-decoration: none; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📰 Top 10 Hacker News</h1>
          <p>Relatório de ${date}</p>
        </div>
        <div class="content">
          <h2>🔥 Histórias em Destaque</h2>
  `;

  stories.forEach(story => {
    html += `
      <div class="story">
        <div class="story-title">${story.position}. ${story.title}</div>
        <div class="story-meta">👍 ${story.score} | 💬 ${story.comments}</div>
        <a href="${story.url}" class="story-link" target="_blank">Ler mais →</a>
      </div>
    `;
  });

  html += `
        </div>
        <div class="footer">
          <p>Este relatório foi gerado automaticamente pelo Web Scraper</p>
          <p>Data: ${date}</p>
        </div>
      </body>
    </html>
  `;

  return html;
}

// Função para enviar email
async function sendEmail(stories) {
  try {
    console.log('Preparando email...');

    const htmlContent = generateEmailHTML(stories);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `📰 Top 10 Hacker News - ${new Date().toLocaleDateString('pt-BR')}`,
      html: htmlContent,
      text: `Top 10 Hacker News:\n\n${stories.map(s => `${s.position}. ${s.title}\n${s.url}\n${s.score} | ${s.comments}\n`).join('\n')}`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado com sucesso:', info.messageId);
    return info;

  } catch (error) {
    console.error('Erro ao enviar email:', error.message);
    throw error;
  }
}

// Função principal
async function main() {
  try {
    console.log('🚀 Iniciando Web Scraper...');
    
    // Validar variáveis de ambiente
    const requiredEnvVars = ['EMAIL_HOST', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_FROM', 'EMAIL_TO'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(`Variáveis de ambiente obrigatórias não encontradas: ${missingVars.join(', ')}`);
    }

    // Fazer scraping
    const stories = await scrapHackerNews();
    
    if (stories.length === 0) {
      throw new Error('Nenhuma história foi encontrada no scraping');
    }

    // Enviar email
    await sendEmail(stories);
    
    console.log('✅ Processo concluído com sucesso!');
    console.log(`📊 ${stories.length} histórias processadas e enviadas por email`);

  } catch (error) {
    console.error('❌ Erro no processo:', error.message);
    process.exit(1);
  }
}

// Executar se for chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { scrapHackerNews, sendEmail, main };
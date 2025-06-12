require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('🧪 Testando configuração de email...\n');
  
  // Mostrar configurações (sem mostrar a senha)
  console.log('Configurações:');
  console.log(`Host: ${process.env.EMAIL_HOST}`);
  console.log(`Port: ${process.env.EMAIL_PORT}`);
  console.log(`User: ${process.env.EMAIL_USER}`);
  console.log(`From: ${process.env.EMAIL_FROM}`);
  console.log(`To: ${process.env.EMAIL_TO}`);
  console.log(`Pass: ${'*'.repeat(process.env.EMAIL_PASS?.length || 0)}\n`);

  // Criar transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false, // true para 465, false para outros ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    // Testar conexão
    console.log('🔗 Testando conexão SMTP...');
    await transporter.verify();
    console.log('✅ Conexão SMTP OK!\n');

    // Enviar email de teste
    console.log('📤 Enviando email de teste...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: '🧪 Teste de Configuração - Web Scraper',
      html: `
        <h2>✅ Configuração funcionando!</h2>
        <p>Se você recebeu este email, sua configuração está correta.</p>
        <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        <p><strong>Host:</strong> ${process.env.EMAIL_HOST}</p>
        <hr>
        <small>Este é um email de teste do seu Web Scraper</small>
      `,
      text: `
        ✅ Configuração funcionando!
        
        Se você recebeu este email, sua configuração está correta.
        Data: ${new Date().toLocaleString('pt-BR')}
        Host: ${process.env.EMAIL_HOST}
      `
    });

    console.log('✅ Email enviado com sucesso!');
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log('\n🎉 Sua configuração está funcionando perfeitamente!');

  } catch (error) {
    console.error('❌ Erro na configuração:');
    console.error(`Tipo: ${error.code || 'UNKNOWN'}`);
    console.error(`Mensagem: ${error.message}`);
    
    // Dicas baseadas no erro
    if (error.code === 'EAUTH') {
      console.log('\n💡 Dicas para resolver:');
      console.log('• Verifique se está usando senha de app (não a senha normal)');
      console.log('• Confirme se a autenticação 2FA está ativa no Gmail');
      console.log('• Teste com uma nova senha de app');
    } else if (error.code === 'ECONNECTION') {
      console.log('\n💡 Dicas para resolver:');
      console.log('• Verifique sua conexão com internet');
      console.log('• Confirme o host e porta SMTP');
      console.log('• Teste com outro provedor de email');
    }
  }
}

// Verificar se as variáveis estão configuradas
const requiredVars = ['EMAIL_HOST', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_FROM', 'EMAIL_TO'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Variáveis de ambiente não configuradas:');
  missingVars.forEach(varName => console.error(`• ${varName}`));
  console.log('\n📝 Configure essas variáveis no arquivo .env');
  process.exit(1);
}

testEmail();
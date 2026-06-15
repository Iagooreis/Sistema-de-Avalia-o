const crypto = require('crypto');

/**
 * Serviço de Email simplificado para desenvolvimento
 * Em produção, integrar com SendGrid, Mailgun, etc.
 */

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const sendVerificationEmail = (email, verificationToken, baseUrl) => {
  const verificationUrl = `${baseUrl}/api/auth/verify/${verificationToken}`;
  
  // Em desenvolvimento, apenas logar o link no console
  console.log('\n' + '='.repeat(60));
  console.log('📧 EMAIL DE VERIFICAÇÃO');
  console.log('='.repeat(60));
  console.log(`Para: ${email}`);
  console.log(`\nClique no link para ativar sua conta:\n`);
  console.log(verificationUrl);
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Você pode copiar e colar o link acima no navegador
  // Ou use em testes automatizados
  return verificationUrl;
};

module.exports = {
  generateVerificationToken,
  sendVerificationEmail,
};

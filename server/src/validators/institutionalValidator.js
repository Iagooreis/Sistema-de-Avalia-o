const validateEmailDomain = (email) => {
  const domain = process.env.INSTITUTION_EMAIL_DOMAIN || 'ufba.br';
  const emailRegex = new RegExp(`@${domain}$`);
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  return password && password.length >= 8;
};

module.exports = {
  validateEmailDomain,
  isValidPassword,
};

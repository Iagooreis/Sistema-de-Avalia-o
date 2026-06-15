const { registerSchema, loginSchema } = require('../validators/authValidator');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(d => d.message),
      });
    }
    
    req.validatedData = value;
    next();
  };
};

const validateRegister = validateRequest(registerSchema);
const validateLogin = validateRequest(loginSchema);

module.exports = {
  validateRegister,
  validateLogin,
};

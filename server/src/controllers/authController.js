const db = require('../db/connection');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');
const { validateEmailDomain, isValidPassword } = require('../validators/institutionalValidator');

const register = async (req, res) => {
  try {
    const { nome, email, password } = req.validatedData;
    
    // Validar domínio de e-mail institucional
    if (!validateEmailDomain(email)) {
      return res.status(400).json({
        error: 'Acesso restrito: utilize seu e-mail vinculado à universidade.',
      });
    }
    
    // Validar força da senha
    if (!isValidPassword(password)) {
      return res.status(400).json({
        error: 'A senha deve ter pelo menos 8 caracteres.',
      });
    }
    
    // Verificar se e-mail já existe
    db.get('SELECT id FROM usuarios WHERE email = ?', [email], async (err, row) => {
      if (err) {
        console.error('Register error:', err);
        return res.status(500).json({ error: 'Erro ao registrar usuário.' });
      }
      
      if (row) {
        return res.status(400).json({
          error: 'E-mail já cadastrado.',
        });
      }
      
      try {
        // Hash da senha
        const senhaHash = await hashPassword(password);
        
        // Inserir novo usuário
        db.run(
          'INSERT INTO usuarios (nome, email, senha, is_active) VALUES (?, ?, ?, ?)',
          [nome, email, senhaHash, 0],
          function(insertErr) {
            if (insertErr) {
              console.error('Insert error:', insertErr);
              return res.status(500).json({ error: 'Erro ao registrar usuário.' });
            }
            
            res.status(201).json({
              message: 'Usuário criado com sucesso. Verifique seu e-mail para ativar a conta.',
              usuario: {
                id: this.lastID,
                nome: nome,
                email: email,
              },
            });
          }
        );
      } catch (hashErr) {
        console.error('Hash error:', hashErr);
        res.status(500).json({ error: 'Erro ao registrar usuário.' });
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.validatedData;
    
    // Buscar usuário
    db.get('SELECT id, nome, email, senha, is_active FROM usuarios WHERE email = ?', [email], async (err, usuario) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Erro ao fazer login.' });
      }
      
      if (!usuario) {
        return res.status(401).json({
          error: 'E-mail ou senha inválidos.',
        });
      }
      
      // Verificar se conta está ativa
      if (!usuario.is_active) {
        return res.status(403).json({
          error: 'Conta não ativada. Verifique seu e-mail.',
        });
      }
      
      try {
        // Comparar senha
        const senhaValida = await comparePassword(password, usuario.senha);
        
        if (!senhaValida) {
          return res.status(401).json({
            error: 'E-mail ou senha inválidos.',
          });
        }
        
        // Gerar token
        const token = generateToken(usuario.id, usuario.email);
        
        res.json({
          message: 'Login realizado com sucesso.',
          token,
          usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
          },
        });
      } catch (compareErr) {
        console.error('Comparison error:', compareErr);
        res.status(500).json({ error: 'Erro ao fazer login.' });
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Erro ao fazer login.' });
  }
};

module.exports = {
  register,
  login,
};

const db = require('../db/connection');

exports.getContextos = (req, res) => {
  const sql = `
    SELECT pd.id, p.nome as professor_nome, d.codigo as disciplina_codigo, pd.semestre
    FROM professor_disciplina pd
    JOIN professores p ON pd.professor_id = p.id
    JOIN disciplinas d ON pd.disciplina_id = d.id
  `;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar contextos.' });
    }
    res.json(rows);
  });
};

exports.getMinhasAvaliacoes = (req, res) => {
  const usuario_id = req.userId || (req.user && (req.user.id || req.user.userId));

  const sql = `
    SELECT a.*, p.nome as professor_nome, d.codigo as disciplina_codigo, pd.semestre
    FROM avaliacoes a
    JOIN professor_disciplina pd ON a.professor_disciplina_id = pd.id
    JOIN professores p ON pd.professor_id = p.id
    JOIN disciplinas d ON pd.disciplina_id = d.id
    WHERE a.usuario_id = ?
    ORDER BY a.created_at DESC
  `;

  db.all(sql, [usuario_id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar avaliações do usuário.' });
    res.json(rows);
  });
};

exports.createAvaliacao = (req, res) => {
  const { professor_disciplina_id, didatica, dificuldade, carisma, flexibilidade, comentario, anonimo } = req.body;
  // O middleware de autenticação deve injetar o usuário na requisição (req.user)
  const usuario_id = req.userId || (req.user && (req.user.id || req.user.userId));

  const sql = `
    INSERT INTO avaliacoes (usuario_id, professor_disciplina_id, didatica, dificuldade, carisma, flexibilidade, comentario, anonimo) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [usuario_id, professor_disciplina_id, didatica, dificuldade, carisma, flexibilidade, comentario, anonimo ? 1 : 0], function(err) {
    if (err) return res.status(500).json({ error: 'Erro ao salvar avaliação.' });
    res.status(201).json({ message: 'Avaliação salva com sucesso!', id: this.lastID });
  });
};
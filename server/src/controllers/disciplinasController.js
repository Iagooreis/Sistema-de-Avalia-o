const db = require('../db/connection');

exports.getProfessoresPorDisciplina = (req, res) => {
  const { disciplinaId } = req.params;

  const sql = `
    SELECT pd.id,
           p.id as professor_id,
           p.nome,
           d.codigo as disciplina_codigo,
           d.nome as disciplina_nome,
           pd.semestre,
           COALESCE(ROUND(AVG(a.didatica), 1), 0) as didatica,
           COALESCE(ROUND(AVG(a.dificuldade), 1), 0) as dificuldade,
           COALESCE(ROUND(AVG(a.carisma), 1), 0) as carisma,
           COALESCE(ROUND(AVG(a.flexibilidade), 1), 0) as flexibilidade,
           ROUND((COALESCE(AVG(a.didatica), 0) + COALESCE(AVG(a.dificuldade), 0) + COALESCE(AVG(a.carisma), 0) + COALESCE(AVG(a.flexibilidade), 0)) / 4, 1) as media
    FROM professor_disciplina pd
    JOIN professores p ON pd.professor_id = p.id
    JOIN disciplinas d ON pd.disciplina_id = d.id
    LEFT JOIN avaliacoes a ON a.professor_disciplina_id = pd.id
    WHERE d.id = ?
    GROUP BY pd.id
    ORDER BY p.nome ASC
  `;

  db.all(sql, [disciplinaId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar professores da disciplina.' });
    }
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Nenhum professor encontrado para esta disciplina.' });
    }
    res.json(rows);
  });
};

exports.getProfessoresPorCodigoDisciplina = (req, res) => {
  const { codigo } = req.params;

  const sql = `
    SELECT pd.id,
           p.id as professor_id,
           p.nome,
           d.codigo as disciplina_codigo,
           d.nome as disciplina_nome,
           pd.semestre,
           COALESCE(ROUND(AVG(a.didatica), 1), 0) as didatica,
           COALESCE(ROUND(AVG(a.dificuldade), 1), 0) as dificuldade,
           COALESCE(ROUND(AVG(a.carisma), 1), 0) as carisma,
           COALESCE(ROUND(AVG(a.flexibilidade), 1), 0) as flexibilidade,
           ROUND((COALESCE(AVG(a.didatica), 0) + COALESCE(AVG(a.dificuldade), 0) + COALESCE(AVG(a.carisma), 0) + COALESCE(AVG(a.flexibilidade), 0)) / 4, 1) as media
    FROM professor_disciplina pd
    JOIN professores p ON pd.professor_id = p.id
    JOIN disciplinas d ON pd.disciplina_id = d.id
    LEFT JOIN avaliacoes a ON a.professor_disciplina_id = pd.id
    WHERE d.codigo = ?
    GROUP BY pd.id
    ORDER BY p.nome ASC
  `;

  db.all(sql, [codigo.toUpperCase()], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar professores da disciplina.' });
    }
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Nenhum professor encontrado para este código de disciplina.' });
    }
    res.json(rows);
  });
};

exports.getProfessorDisciplinaDetalhes = (req, res) => {
  const { id, codigo } = req.params;

  const detailsSql = `
    SELECT p.id as professor_id,
           p.nome as professor_nome,
           d.id as disciplina_id,
           d.codigo as disciplina_codigo,
           d.nome as disciplina_nome,
           COALESCE(ROUND(AVG(a.didatica), 1), 0) as didatica,
           COALESCE(ROUND(AVG(a.dificuldade), 1), 0) as dificuldade,
           COALESCE(ROUND(AVG(a.carisma), 1), 0) as carisma,
           COALESCE(ROUND(AVG(a.flexibilidade), 1), 0) as flexibilidade,
           ROUND((COALESCE(AVG(a.didatica), 0) + COALESCE(AVG(a.dificuldade), 0) + COALESCE(AVG(a.carisma), 0) + COALESCE(AVG(a.flexibilidade), 0)) / 4, 1) as media
    FROM professor_disciplina pd
    JOIN professores p ON pd.professor_id = p.id
    JOIN disciplinas d ON pd.disciplina_id = d.id
    LEFT JOIN avaliacoes a ON a.professor_disciplina_id = pd.id
    WHERE p.id = ? AND d.codigo = ?
    GROUP BY p.id, p.nome, d.id, d.codigo, d.nome
  `;

  const commentsSql = `
    SELECT a.comentario as texto, a.created_at as data
    FROM avaliacoes a
    JOIN professor_disciplina pd ON a.professor_disciplina_id = pd.id
    JOIN disciplinas d ON pd.disciplina_id = d.id
    JOIN professores p ON pd.professor_id = p.id
    WHERE p.id = ?
      AND d.codigo = ?
      AND a.comentario IS NOT NULL
      AND TRIM(a.comentario) <> ''
    ORDER BY a.created_at DESC
  `;

  db.get(detailsSql, [id, codigo.toUpperCase()], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar detalhes do professor.' });
    }
    if (!row) {
      return res.status(404).json({ message: 'Detalhes do professor não encontrados para esta disciplina.' });
    }

    db.all(commentsSql, [id, codigo.toUpperCase()], (commentErr, comments) => {
      if (commentErr) {
        return res.status(500).json({ error: 'Erro ao buscar comentários do professor.' });
      }

      res.json({
        ...row,
        comentarios: comments || [],
      });
    });
  });
};

exports.getDisciplinas = (req, res) => {
  const sql = `
    SELECT DISTINCT d.id, d.codigo, d.nome
    FROM disciplinas d
    JOIN professor_disciplina pd ON d.id = pd.disciplina_id
    ORDER BY d.codigo ASC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar disciplinas.' });
    }
    res.json(rows);
  });
};

exports.getDisciplinaById = (req, res) => {
  const { disciplinaId } = req.params;

  const sql = `
    SELECT id, codigo, nome
    FROM disciplinas
    WHERE id = ?
  `;

  db.get(sql, [disciplinaId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar disciplina.' });
    }
    if (!row) {
      return res.status(404).json({ message: 'Disciplina não encontrada.' });
    }
    res.json(row);
  });
};

exports.getDisciplinaByCodigo = (req, res) => {
  const { codigo } = req.params;

  const sql = `
    SELECT id, codigo, nome
    FROM disciplinas
    WHERE codigo = ?
  `;

  db.get(sql, [codigo.toUpperCase()], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar disciplina.' });
    }
    if (!row) {
      return res.status(404).json({ message: 'Disciplina não encontrada.' });
    }
    res.json(row);
  });
};

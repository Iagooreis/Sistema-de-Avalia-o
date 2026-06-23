const db = require('../db/connection');

exports.searchProfessoresPorNome = (req, res) => {
  const { nome } = req.query;

  if (!nome || !nome.trim()) {
    const sql = `
      SELECT id, nome
      FROM professores
      ORDER BY nome ASC
    `;

    db.all(sql, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar professores.' });
      }
      return res.json(rows || []);
    });
    return;
  }

  const sql = `
    SELECT id, nome, email, siape, departamento
    FROM professores
    WHERE LOWER(nome) LIKE LOWER(?)
    ORDER BY nome ASC
  `;

  const searchTerm = `%${nome.trim()}%`;
  db.all(sql, [searchTerm], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar professores.' });
    }
    res.json(rows || []);
  });
};

exports.getPerfilProfessor = (req, res) => {
  const { id } = req.params;

  const professorSql = `
    SELECT id, nome, email, siape, departamento
    FROM professores
    WHERE id = ?
  `;

  const disciplinasSql = `
    SELECT
      pd.id as professor_disciplina_id,
      d.id as disciplina_id,
      d.codigo as disciplina_codigo,
      d.nome as disciplina_nome,
      pd.semestre,
      ROUND((
        COALESCE(AVG(a.didatica), 0) +
        COALESCE(AVG(a.dificuldade), 0) +
        COALESCE(AVG(a.carisma), 0) +
        COALESCE(AVG(a.flexibilidade), 0)
      ) / 4, 1) as media
    FROM professor_disciplina pd
    JOIN disciplinas d ON pd.disciplina_id = d.id
    LEFT JOIN avaliacoes a ON a.professor_disciplina_id = pd.id
    WHERE pd.professor_id = ?
    GROUP BY pd.id, d.id, d.codigo, d.nome, pd.semestre
    ORDER BY d.nome ASC
  `;

  const comentariosSql = `
    SELECT
      pd.id as professor_disciplina_id,
      a.comentario as texto,
      a.created_at as data
    FROM avaliacoes a
    JOIN professor_disciplina pd ON a.professor_disciplina_id = pd.id
    WHERE pd.professor_id = ?
      AND a.comentario IS NOT NULL
      AND TRIM(a.comentario) <> ''
    ORDER BY a.created_at DESC
  `;

  db.get(professorSql, [id], (err, professor) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar dados do professor.' });
    }
    if (!professor) {
      return res.status(404).json({ message: 'Professor não encontrado.' });
    }

    db.all(disciplinasSql, [id], (disciplinasErr, disciplinas) => {
      if (disciplinasErr) {
        return res.status(500).json({ error: 'Erro ao buscar disciplinas do professor.' });
      }

      db.all(comentariosSql, [id], (commentsErr, comentarios) => {
        if (commentsErr) {
          return res.status(500).json({ error: 'Erro ao buscar comentários do professor.' });
        }

        const commentMap = {};
        (comentarios || []).forEach((comment) => {
          if (!commentMap[comment.professor_disciplina_id]) {
            commentMap[comment.professor_disciplina_id] = [];
          }
          commentMap[comment.professor_disciplina_id].push({
            texto: comment.texto,
            data: comment.data,
          });
        });

        const disciplinasComComentarios = (disciplinas || []).map((disc) => ({
          ...disc,
          comentarios: commentMap[disc.professor_disciplina_id] || [],
        }));

        res.json({
          ...professor,
          disciplinas: disciplinasComComentarios,
        });
      });
    });
  });
};

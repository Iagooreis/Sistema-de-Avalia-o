const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'navaqueebarril.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao abrir banco de dados:', err);
    process.exit(1);
  }
  console.log('✓ Conectado ao banco de dados');
});

db.run('PRAGMA foreign_keys = ON');

const seed = async () => {
  try {
    // 0. LIMPAR DADOS ANTIGOS
    console.log('\n🗑️  Limpando dados antigos...');
    await clearOldData();

    // 1. INSERIR PROFESSORES
    console.log('📚 Inserindo professores...');
    await insertProfessores();

    // 2. INSERIR DISCIPLINAS
    console.log('📖 Inserindo disciplinas...');
    await insertDisciplinas();

    // 3. CRIAR VÍNCULOS PROFESSOR-DISCIPLINA
    console.log('🔗 Criando vínculos professor-disciplina...');
    await insertProfessorDisciplina();

    // 4. INSERIR USUÁRIO DE TESTE
    console.log('👤 Inserindo usuário de teste...');
    await insertUsuario();

    // 5. INSERIR AVALIAÇÕES COM NOTAS DIFERENTES
    console.log('⭐ Inserindo avaliações...');
    await insertAvaliacoes();

    console.log('\n✅ Seed concluído com sucesso!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro durante seed:', err);
    process.exit(1);
  }
};

const clearOldData = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('DELETE FROM avaliacoes', (err) => {
        if (err) return reject(err);
      });
      db.run('DELETE FROM professor_disciplina', (err) => {
        if (err) return reject(err);
      });
      db.run('DELETE FROM disciplinas', (err) => {
        if (err) return reject(err);
      });
      db.run('DELETE FROM professores', (err) => {
        if (err) return reject(err);
      });
      db.run('DELETE FROM usuarios', (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  });
};

const insertProfessores = () => {
  return new Promise((resolve, reject) => {
    const professores = [
      { nome: 'Prof. Carlos', email: 'carlos@ufba.br', siape: '2001', departamento: 'Computação' },
      { nome: 'Profa. Ana', email: 'ana@ufba.br', siape: '2002', departamento: 'Computação' },
      { nome: 'Prof. Roberto', email: 'roberto@ufba.br', siape: '2003', departamento: 'Computação' },
    ];

    let completed = 0;
    professores.forEach((prof) => {
      const sql = `INSERT INTO professores (nome, email, siape, departamento) VALUES (?, ?, ?, ?)`;
      db.run(sql, [prof.nome, prof.email, prof.siape, prof.departamento], (err) => {
        if (err) reject(err);
        completed++;
        if (completed === professores.length) resolve();
      });
    });
  });
};

const insertDisciplinas = () => {
  return new Promise((resolve, reject) => {
    const disciplinas = [
      { codigo: 'MATA37', nome: 'Lógica de Programação', descricao: 'Fundamentos de Programação' },
      { codigo: 'MATA56', nome: 'Cálculo A', descricao: 'Cálculo Diferencial e Integral I' },
      { codigo: 'MATA65', nome: 'Banco de Dados', descricao: 'Sistemas de Gerenciamento de Banco de Dados' },
    ];

    let completed = 0;
    disciplinas.forEach((disc) => {
      const sql = `INSERT INTO disciplinas (codigo, nome, descricao) VALUES (?, ?, ?)`;
      db.run(sql, [disc.codigo, disc.nome, disc.descricao], (err) => {
        if (err) reject(err);
        completed++;
        if (completed === disciplinas.length) resolve();
      });
    });
  });
};

const insertProfessorDisciplina = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT p.id as prof_id, d.id as disc_id, p.nome, d.nome as disc_nome, d.codigo
      FROM professores p, disciplinas d
    `;

    db.all(sql, [], (err, rows) => {
      if (err) return reject(err);

      // Mapear professores e disciplinas pelo código
      const professores = {};
      const disciplinas = {};

      rows.forEach((row) => {
        if (!professores[row.nome]) professores[row.nome] = row.prof_id;
        if (!disciplinas[row.codigo]) disciplinas[row.codigo] = row.disc_id;
      });

      const vinculos = [
        // Cálculo A (MATA56): Prof. Carlos e Profa. Ana
        { prof: 'Prof. Carlos', disc: 'MATA56' },
        { prof: 'Profa. Ana', disc: 'MATA56' },
        // Lógica de Programação (MATA37): Profa. Ana e Prof. Roberto
        { prof: 'Profa. Ana', disc: 'MATA37' },
        { prof: 'Prof. Roberto', disc: 'MATA37' },
        // Banco de Dados (MATA65): Prof. Roberto e Prof. Carlos
        { prof: 'Prof. Roberto', disc: 'MATA65' },
        { prof: 'Prof. Carlos', disc: 'MATA65' },
      ];

      let completed = 0;
      vinculos.forEach((v) => {
        // Buscar professor_id e disciplina_id pelo código
        const profId = professores[v.prof];
        const discId = disciplinas[v.disc];
        
        if (!profId || !discId) {
          console.warn(`⚠️  Professor ou disciplina não encontrado: ${v.prof} - ${v.disc}`);
          completed++;
          if (completed === vinculos.length) resolve();
          return;
        }
        
        const sql = `INSERT INTO professor_disciplina (professor_id, disciplina_id, semestre, ano) 
                     VALUES (?, ?, ?, ?)`;
        db.run(sql, [profId, discId, '2024.1', 2024], (err) => {
          if (err) reject(err);
          completed++;
          if (completed === vinculos.length) resolve();
        });
      });
    });
  });
};

const insertUsuario = () => {
  return new Promise((resolve, reject) => {
    const bcryptjs = require('bcryptjs');
    const senha = bcryptjs.hashSync('senha123', 10);

    const sql = `INSERT INTO usuarios (nome, email, senha, is_active) VALUES (?, ?, ?, ?)`;
    db.run(sql, ['Usuário Teste', 'teste@ufba.br', senha, 1], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

const insertAvaliacoes = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT u.id as usuario_id, pd.id as pd_id, p.nome as prof_nome, d.codigo as disc_codigo
      FROM usuarios u, professor_disciplina pd
      JOIN professores p ON pd.professor_id = p.id
      JOIN disciplinas d ON pd.disciplina_id = d.id
    `;

    db.all(sql, [], (err, rows) => {
      if (err) return reject(err);

      const usuario_id = rows[0]?.usuario_id;
      if (!usuario_id) return reject(new Error('Usuário não encontrado'));

      // Dados de avaliações: diferentes valores por critério
      const avaliacoes = [
        {
          prof: 'Prof. Carlos',
          disc: 'MATA56',
          registros: [
            { didatica: 9.0, dificuldade: 6.5, carisma: 8.0, flexibilidade: 7.5, comentario: 'Explicações claras, bom ritmo e exemplos completos.' },
            { didatica: 8.5, dificuldade: 7.0, carisma: 7.5, flexibilidade: 8.0, comentario: 'A aula foi dinâmica, porém poderia revisar alguns conceitos com mais calma.' },
          ],
        },
        {
          prof: 'Profa. Ana',
          disc: 'MATA56',
          registros: [
            { didatica: 6.5, dificuldade: 5.5, carisma: 7.0, flexibilidade: 6.0, comentario: 'Gostei do apoio, mas o conteúdo ficou um pouco acelerado.' },
            { didatica: 6.0, dificuldade: 6.0, carisma: 6.5, flexibilidade: 6.0, comentario: 'Interpretou bem as dúvidas, faltou mais exemplos práticos.' },
          ],
        },
        {
          prof: 'Profa. Ana',
          disc: 'MATA37',
          registros: [
            { didatica: 6.5, dificuldade: 7.0, carisma: 6.0, flexibilidade: 7.5, comentario: 'O ritmo da disciplina é bom, os exercícios ajudam a fixar.' },
            { didatica: 7.0, dificuldade: 6.5, carisma: 7.0, flexibilidade: 6.5, comentario: 'Boa disponibilidade para tirar dúvidas fora da aula.' },
          ],
        },
        {
          prof: 'Prof. Roberto',
          disc: 'MATA37',
          registros: [
            { didatica: 8.5, dificuldade: 9.0, carisma: 8.0, flexibilidade: 9.5, comentario: 'Aulas muito didáticas e exemplos excelentes.' },
            { didatica: 9.0, dificuldade: 8.5, carisma: 9.0, flexibilidade: 8.5, comentario: 'Professor muito claro e sempre disposto a ajudar.' },
          ],
        },
        {
          prof: 'Prof. Roberto',
          disc: 'MATA65',
          registros: [
            { didatica: 9.0, dificuldade: 9.0, carisma: 8.0, flexibilidade: 9.0, comentario: 'Excelente domínio do conteúdo e pontos práticos relevantes.' },
            { didatica: 8.0, dificuldade: 8.5, carisma: 9.0, flexibilidade: 9.0, comentario: 'Muito bom para quem quer aprender banco de dados na prática.' },
          ],
        },
        {
          prof: 'Prof. Carlos',
          disc: 'MATA65',
          registros: [
            { didatica: 8.0, dificuldade: 7.5, carisma: 7.0, flexibilidade: 8.0, comentario: 'A dinâmica da turma é leve e a explicação é segura.' },
            { didatica: 7.5, dificuldade: 8.0, carisma: 8.0, flexibilidade: 7.5, comentario: 'Ótimo acompanhamento, mas precisa de mais exercícios de revisão.' },
          ],
        },
      ];

      let totalCompleted = 0;
      const totalInserts = avaliacoes.reduce((sum, a) => sum + a.registros.length, 0);

      avaliacoes.forEach((avaliacao) => {
        // Encontrar o pd_id comparando por código da disciplina
        const pdRow = rows.find(
          (r) => r.prof_nome === avaliacao.prof && r.disc_codigo === avaliacao.disc
        );

        if (!pdRow) {
          console.warn(`⚠️  Vínculo não encontrado: ${avaliacao.prof} - ${avaliacao.disc}`);
          totalCompleted += avaliacao.registros.length;
          if (totalCompleted === totalInserts) resolve();
          return;
        }

        avaliacao.registros.forEach((registro) => {
          const sql = `INSERT INTO avaliacoes (usuario_id, professor_disciplina_id, didatica, dificuldade, carisma, flexibilidade, comentario, anonimo)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

          db.run(
            sql,
            [usuario_id, pdRow.pd_id, registro.didatica, registro.dificuldade, registro.carisma, registro.flexibilidade, registro.comentario, 1],
            (err) => {
              if (err) return reject(err);
              totalCompleted++;
              if (totalCompleted === totalInserts) resolve();
            }
          );
        });
      });
    });
  });
};

seed();

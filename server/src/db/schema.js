const db = require('./connection');

const schema = [
  // Tabela de Usuários (Estudantes)
  `CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    is_active INTEGER DEFAULT 0,
    verification_token TEXT,
    verification_token_expires DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // Tabela de Professores
  `CREATE TABLE IF NOT EXISTS professores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE,
    siape TEXT UNIQUE,
    departamento TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // Tabela de Disciplinas
  `CREATE TABLE IF NOT EXISTS disciplinas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    descricao TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // Tabela Intermediária Professor-Disciplina (Many-to-Many)
  `CREATE TABLE IF NOT EXISTS professor_disciplina (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    professor_id INTEGER NOT NULL,
    disciplina_id INTEGER NOT NULL,
    semestre TEXT,
    ano INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (professor_id) REFERENCES professores(id) ON DELETE CASCADE,
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id) ON DELETE CASCADE,
    UNIQUE(professor_id, disciplina_id, semestre, ano)
  )`,

  // Tabela de Avaliações
  `CREATE TABLE IF NOT EXISTS avaliacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    professor_disciplina_id INTEGER NOT NULL,
    didatica REAL,
    dificuldade REAL,
    carisma REAL,
    flexibilidade REAL,
    comentario TEXT,
    anonimo INTEGER DEFAULT 1,
    is_active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (professor_disciplina_id) REFERENCES professor_disciplina(id) ON DELETE CASCADE
  )`,

  // Índices para melhorar performance
  `CREATE INDEX IF NOT EXISTS idx_avaliacoes_usuario ON avaliacoes(usuario_id)`,
  `CREATE INDEX IF NOT EXISTS idx_avaliacoes_prof_disc ON avaliacoes(professor_disciplina_id)`,
  `CREATE INDEX IF NOT EXISTS idx_professor_disciplina_prof ON professor_disciplina(professor_id)`,
  `CREATE INDEX IF NOT EXISTS idx_professor_disciplina_disc ON professor_disciplina(disciplina_id)`,
  `CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)`,
  `CREATE INDEX IF NOT EXISTS idx_professores_email ON professores(email)`,

  // --- DADOS MOCADOS PARA TESTES DE AVALIAÇÃO ---
  `INSERT OR IGNORE INTO professores (id, nome, email, siape, departamento) VALUES 
    (1, 'Alan Turing', 'alan.turing@ufba.br', '1000001', 'Ciência da Computação'),
    (2, 'Ada Lovelace', 'ada.lovelace@ufba.br', '1000002', 'Matemática')`,

  `INSERT OR IGNORE INTO disciplinas (id, codigo, nome, descricao) VALUES 
    (1, 'MATA56', 'Paradigmas de Linguagens de Programação', 'Estudo dos paradigmas de programação.'),
    (2, 'MATA37', 'Introdução à Lógica de Programação', 'Conceitos básicos de algoritmos e lógica.')`,

  `INSERT OR IGNORE INTO professor_disciplina (id, professor_id, disciplina_id, semestre, ano) VALUES 
    (1, 1, 1, '2024.1', 2024),
    (2, 2, 2, '2024.1', 2024)`
];

async function migrate() {
  console.log('Starting database migration...');
  
  for (const sql of schema) {
    await new Promise((resolve, reject) => {
      db.run(sql, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
  console.log('Database migration completed successfully!');
}

if (require.main === module) {
  migrate()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}

module.exports = migrate;
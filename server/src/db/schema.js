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
];

function migrate() {
  return new Promise((resolve, reject) => {
    console.log('Starting database migration...');
    
    let completed = 0;
    schema.forEach((sql) => {
      db.run(sql, (err) => {
        if (err) {
          console.error('Migration error:', err);
          reject(err);
        } else {
          completed++;
          if (completed === schema.length) {
            console.log('Database migration completed successfully!');
            resolve();
          }
        }
      });
    });
  });
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

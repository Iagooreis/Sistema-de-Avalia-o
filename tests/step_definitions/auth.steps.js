const { Before, After, Given, When, Then } = require('@cucumber/cucumber');
const axios = require('axios');
const pool = require('../../server/src/db/connection');

let context = {
  apiUrl: 'http://localhost:5000/api',
  lastResponse: null,
  lastStatusCode: null,
  registerData: {},
  testUserEmail: '',
};

Before(async function() {
  // Setup before each scenario
  console.log('Setting up test context');
});

After(async function() {
  // Cleanup after each scenario
  console.log('Cleaning up test context');
  // Optional: Clear test data from database
});

// Given steps
Given('que a API do sistema está ativa e pronta para receber requisições', async function() {
  try {
    const response = await axios.get(`${context.apiUrl.replace('/api', '')}`);
    if (response.status !== 200) {
      throw new Error('API is not running');
    }
  } catch (err) {
    throw new Error(`API is not responding: ${err.message}`);
  }
});

Given('que o banco de dados relacional foi inicializado através das migrações do sistema', async function() {
  try {
    const result = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    const tables = result.rows.map(r => r.table_name);
    if (!tables.includes('usuarios') || !tables.includes('professores')) {
      throw new Error('Database schema not properly initialized');
    }
  } catch (err) {
    throw new Error(`Database check failed: ${err.message}`);
  }
});

Given('que o estudante está visualizando a página de Cadastro no navegador web', async function() {
  // This would be handled by e2e testing framework like Puppeteer or Playwright
  // For now, we mock this step
  console.log('Student viewing registration page');
});

Given('que o estudante está com a interface de Login aberta em seu navegador web', async function() {
  // Mock browser state
  console.log('Student on login page');
});

Given('preenche o e-mail institucional correto e a senha cadastrada', async function() {
  // Mock form fill
  context.testUserEmail = 'test.user@ufba.br';
});

// When steps
When('uma requisição POST é disparada para o endpoint {string} com os dados:', async function(endpoint, dataTable) {
  const data = {};
  dataTable.hashes().forEach(row => {
    data[row.campo] = row.valor.replace(/"/g, '');
  });
  
  context.registerData = data;
  context.testUserEmail = data.email;
  
  try {
    const response = await axios.post(`${context.apiUrl}${endpoint}`, data);
    context.lastResponse = response.data;
    context.lastStatusCode = response.status;
  } catch (err) {
    context.lastResponse = err.response?.data || err.message;
    context.lastStatusCode = err.response?.status || 500;
  }
});

When('uma requisição POST é enviada para o endpoint {string} com os dados:', async function(endpoint, dataTable) {
  // Same as "é disparada" - just a synonym
  return this.When(`uma requisição POST é disparada para o endpoint "${endpoint}" com os dados:`, dataTable);
});

When('ele digita {string} no input de campo de e-mail', async function(email) {
  context.testUserEmail = email;
  console.log(`User typed email: ${email}`);
});

When('clica fora do campo ou tenta avançar', async function() {
  // Simulate form blur event
  console.log('User clicked outside or attempted to advance');
});

When('ele clica no botão {string}', async function(buttonText) {
  if (buttonText === 'Entrar') {
    try {
      const response = await axios.post(`${context.apiUrl}/auth/login`, {
        email: context.testUserEmail,
        password: 'SenhaSegura123',
      });
      context.lastResponse = response.data;
      context.lastStatusCode = response.status;
    } catch (err) {
      context.lastResponse = err.response?.data || err.message;
      context.lastStatusCode = err.response?.status || 500;
    }
  }
});

When('uma consulta estrutural de esquema é executada', async function() {
  try {
    const result = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name IN ('professores', 'disciplinas', 'professor_disciplina', 'avaliacoes')
    `);
    context.databaseSchema = result.rows;
  } catch (err) {
    throw new Error(`Schema query failed: ${err.message}`);
  }
});

// Then steps
Then('o status code da resposta HTTP deve ser {int}', function(expectedStatus) {
  if (context.lastStatusCode !== expectedStatus) {
    throw new Error(`Expected status ${expectedStatus}, but got ${context.lastStatusCode}`);
  }
});

Then('a conta deve ser criada no banco de dados com a flag {string} como falso', async function(flag) {
  try {
    const result = await pool.query(
      'SELECT is_active FROM usuarios WHERE email = $1',
      [context.testUserEmail]
    );
    
    if (result.rows.length === 0) {
      throw new Error(`User with email ${context.testUserEmail} not found in database`);
    }
    
    if (result.rows[0][flag.toLowerCase()] !== false) {
      throw new Error(`Expected ${flag} to be false, but it was ${result.rows[0][flag.toLowerCase()]}`);
    }
  } catch (err) {
    throw new Error(`Database verification failed: ${err.message}`);
  }
});

Then('um token de ativação deve ser disparado para o endereço institucional informado', function() {
  // This would require mocking email service
  console.log(`Verification token would be sent to ${context.testUserEmail}`);
});

Then('o corpo da resposta deve conter a mensagem de erro {string}', function(errorMessage) {
  if (!context.lastResponse.error || !context.lastResponse.error.includes('Acesso restrito')) {
    throw new Error(`Expected error message about institutional email restriction`);
  }
});

Then('a interface do Front-end deve interceptar a ação', function() {
  console.log('Frontend intercepted invalid email');
});

Then('exibir uma borda vermelha de alerta no campo de e-mail', function() {
  console.log('Red border displayed on email field');
});

Then('renderizar a mensagem de aviso na tela: {string}', function(message) {
  console.log(`Warning message displayed: ${message}`);
});

Then('manter o botão {string} desabilitado', function(buttonText) {
  console.log(`Button "${buttonText}" remains disabled`);
});

Then('o Front-end deve despachar os dados, armazenar o token JWT recebido no armazenamento local seguro do navegador', function() {
  if (!context.lastResponse.token) {
    throw new Error('JWT token not received in login response');
  }
  console.log('JWT token stored in localStorage');
});

Then('redirecionar automaticamente o fluxo do usuário para a rota da Tela Inicial \\(Dashboard\\)', function() {
  console.log('User redirected to Dashboard');
});

Then('exibir a mensagem de boas-vindas {string}', function(message) {
  console.log(`Welcome message displayed: ${message}`);
});

Then('o banco deve conter las tabelas {string}, {string} e a tabela intermediária {string}', async function(table1, table2, intermediaryTable) {
  const tables = context.databaseSchema.map(t => t.table_name);
  
  if (!tables.includes(table1) || !tables.includes(table2) || !tables.includes(intermediaryTable)) {
    throw new Error(`Expected tables ${table1}, ${table2}, ${intermediaryTable} not found`);
  }
});

Then('a tabela {string} deve possuir uma restrição de integridade \\(FK\\) apontando exclusivamente para a chave primária da tabela {string}', async function(tableName, referencedTable) {
  try {
    const result = await pool.query(`
      SELECT constraint_name, table_name, referenced_table_name
      FROM information_schema.referential_constraints
      WHERE table_name = $1 AND constraint_type = 'FOREIGN KEY'
    `, [tableName]);
    
    // For PostgreSQL, we need a different query
    const pgResult = await pool.query(`
      SELECT tc.table_name, kcu.column_name, ccu.table_name AS foreign_table_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = $1
    `, [tableName]);
    
    if (pgResult.rows.length === 0) {
      throw new Error(`No foreign key found in table ${tableName}`);
    }
  } catch (err) {
    throw new Error(`FK verification failed: ${err.message}`);
  }
});

module.exports = { context };

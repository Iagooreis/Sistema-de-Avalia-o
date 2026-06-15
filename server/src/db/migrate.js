const migrate = require('./schema');

migrate()
  .then(() => {
    console.log('✓ Database ready!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('✗ Migration failed:', err);
    process.exit(1);
  });

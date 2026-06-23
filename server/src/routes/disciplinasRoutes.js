const express = require('express');
const router = express.Router();
const disciplinasController = require('../controllers/disciplinasController');
const authMiddleware = require('../middleware/authMiddleware');

// Protege as rotas exigindo o token JWT
router.use(authMiddleware);

router.get('/', disciplinasController.getDisciplinas);
router.get('/:disciplinaId', disciplinasController.getDisciplinaById);
router.get('/:disciplinaId/professores', disciplinasController.getProfessoresPorDisciplina);

// Rotas específicas por código
router.get('/codigo/:codigo', disciplinasController.getDisciplinaByCodigo);
router.get('/codigo/:codigo/professores', disciplinasController.getProfessoresPorCodigoDisciplina);

module.exports = router;

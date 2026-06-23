const express = require('express');
const router = express.Router();
const professoresController = require('../controllers/professoresController');
const disciplinasController = require('../controllers/disciplinasController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', professoresController.searchProfessoresPorNome);
router.get('/:id/perfil', professoresController.getPerfilProfessor);
router.get('/:id/disciplinas/:codigo', disciplinasController.getProfessorDisciplinaDetalhes);

module.exports = router;

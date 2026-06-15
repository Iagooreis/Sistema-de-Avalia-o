const express = require('express');
const router = express.Router();
const avaliacoesController = require('../controllers/avaliacoesController');
const authMiddleware = require('../middleware/authMiddleware');

// Protege as rotas exigindo o token JWT
router.use(authMiddleware);

router.get('/contextos', avaliacoesController.getContextos);
router.get('/minhas', avaliacoesController.getMinhasAvaliacoes);
router.post('/', avaliacoesController.createAvaliacao);

module.exports = router;